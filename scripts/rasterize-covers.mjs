// Rasterize the generated SVG covers to JPG twins (same path, .jpg) so social
// crawlers (WhatsApp, X, LinkedIn, Facebook) - which do NOT render SVG og:images
// - get a real preview image. JPG keeps the file small (~100-180KB) so WhatsApp
// reliably fetches it. On-site display keeps using the crisp SVG.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const DIRS = ['public/images/blog', 'public/images/tools'];
const W = 1280, H = 720;

const browser = await chromium.launch({ executablePath: EXE, headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

let n = 0, max = 0;
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    await page.goto('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
    await page.waitForTimeout(120);
    const out = path.join(dir, f.replace(/\.svg$/, '.jpg'));
    await page.screenshot({ path: out, type: 'jpeg', quality: 86 });
    max = Math.max(max, fs.statSync(out).size);
    n++;
  }
}
console.log(`Rasterized ${n} covers to JPG (largest ${(max / 1024).toFixed(0)} KB)`);
await browser.close();
