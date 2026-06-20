import "server-only";

/**
 * Telegram Bot API helper.
 *
 * Sends a message to a single destination chat (your private DM with the bot)
 * using the HTTP Bot API - no SDK needed, just a fetch. Configure via env:
 *   TELEGRAM_BOT_TOKEN - from @BotFather, e.g. 8123456789:AA...
 *   TELEGRAM_CHAT_ID   - your numeric chat id (run scripts/telegram-chatid.mjs)
 *
 * If either is missing we no-op (warn once) so the site keeps working without
 * notifications configured - same graceful-degradation posture as the contact
 * form's Resend/Turnstile handling.
 */

const API = "https://api.telegram.org";

/** Escape the 5 chars that are special in Telegram's HTML parse mode. */
export function tgEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set - skipping notification.",
    );
    return false;
  }

  // Don't let a slow Telegram call hold the request open.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      console.error("[telegram] sendMessage failed:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[telegram] sendMessage threw:", e);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
