import { NextResponse } from "next/server";
import { sendTelegram, tgEscape } from "@/lib/telegram";

/**
 * Visitor + CV-download notifier.
 *
 * The site's <Telemetry> client component beacons this route once per visitor
 * session ("visit") and whenever the CV button is clicked ("cv"). We enrich the
 * event with the request IP, a parsed device string, and an approximate
 * geo-location, then push a formatted message to Telegram.
 *
 * Defences (this is an unauthenticated, side-effect-producing endpoint):
 *   1. Bot filter — crawler / empty user-agents are dropped silently.
 *   2. Rate limit — best-effort per-IP in-memory burst guard.
 *   3. Validation — type + field lengths checked; everything escaped for HTML.
 * All failures degrade quietly: a notification is nice-to-have, never blocks the
 * user, and we never leak internal errors to the client.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 30; // generous: a real person rarely trips this
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, times] of hits) {
    if (times.length === 0 || now - times[times.length - 1] >= WINDOW_MS) {
      hits.delete(key);
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegrambot|preview|monitor|lighthouse|headless|python-requests|curl|wget|axios|node-fetch/i;

/** Tiny, dependency-free user-agent → "OS / Browser" summary. */
function parseDevice(ua: string): string {
  if (!ua) return "Unknown device";
  let os = "Unknown OS";
  if (/windows nt 10/i.test(ua)) os = "Windows";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone/i.test(ua)) os = "iPhone";
  else if (/ipad/i.test(ua)) os = "iPad";
  else if (/android/i.test(ua)) os = "Android";
  else if (/mac os x|macintosh/i.test(ua)) os = "macOS";
  else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Unknown browser";
  if (/edg(?:a|ios)?\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";

  return `${os} / ${browser}`;
}

const PRIVATE_IP =
  /^(?:unknown|127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1|fc|fd|fe80)/i;

interface GeoInfo {
  text: string; // human-readable "City, Region, Country 🇱🇰"
  isp?: string;
}

/** Best-effort IP geo-lookup via ipwho.is (free, https, no key). */
async function geoLookup(ip: string): Promise<GeoInfo | null> {
  if (!ip || PRIVATE_IP.test(ip)) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const d = (await res.json()) as {
      success?: boolean;
      city?: string;
      region?: string;
      country?: string;
      flag?: { emoji?: string };
      connection?: { isp?: string; org?: string };
    };
    if (!d.success) return null;
    const parts = [d.city, d.region, d.country].filter(Boolean) as string[];
    const text = `${parts.join(", ")}${d.flag?.emoji ? ` ${d.flag.emoji}` : ""}`.trim();
    return { text: text || "Unknown location", isp: d.connection?.isp || d.connection?.org };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Trim + cap an untrusted client string before it ever reaches the message. */
function clean(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    // sendBeacon may deliver an empty/odd body; treat as a bare visit.
    payload = {};
  }

  const ua = req.headers.get("user-agent") ?? "";
  // 1) Drop crawlers / non-browser clients silently.
  if (!ua || BOT_UA.test(ua)) return NextResponse.json({ ok: true });

  // 2) Rate limit.
  const ip = clientIp(req);
  if (rateLimited(ip)) return NextResponse.json({ ok: true });

  // 3) Validate + sanitise.
  const type = clean(payload.type, 10) === "cv" ? "cv" : "visit";
  const path = clean(payload.path, 300) || "/";
  // Never notify on the admin area (that's you).
  if (path.startsWith("/eta887")) return NextResponse.json({ ok: true });

  const referrer = clean(payload.referrer, 300);
  const screen = clean(payload.screen, 20);
  const language = clean(payload.language, 30);
  const timezone = clean(payload.timezone, 60);

  const device = parseDevice(ua);
  const geo = await geoLookup(ip);

  const when = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const ref = referrer ? tgEscape(referrer) : "Direct / none";
  const heading = type === "cv" ? "📄 <b>CV downloaded</b>" : "👀 <b>New visitor</b>";

  const lines = [
    heading,
    "",
    `📍 <b>Page:</b> ${tgEscape(path)}`,
    `↩️ <b>From:</b> ${ref}`,
    geo ? `🌍 <b>Location:</b> ${tgEscape(geo.text)}` : null,
    geo?.isp ? `🏢 <b>Network:</b> ${tgEscape(geo.isp)}` : null,
    `💻 <b>Device:</b> ${tgEscape(device)}`,
    screen ? `🖥️ <b>Screen:</b> ${tgEscape(screen)}` : null,
    language ? `🗣️ <b>Language:</b> ${tgEscape(language)}` : null,
    timezone ? `🕒 <b>Timezone:</b> ${tgEscape(timezone)}` : null,
    `🌐 <b>IP:</b> <code>${tgEscape(ip)}</code>`,
    `⏰ <b>Time:</b> ${tgEscape(when)} (Colombo)`,
  ].filter(Boolean);

  await sendTelegram(lines.join("\n"));

  return NextResponse.json({ ok: true });
}
