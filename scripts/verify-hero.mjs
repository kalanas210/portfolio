// One-off visual check: screenshot the running dev server's hero in dark mode,
// idle and hovered, using the Playwright-cached Chromium. Not part of the app.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

// The full chrome.exe in chromium-1223 is a broken stub (sxs config error);
// the headless-shell build is self-contained and renders WebGL via swiftshader.
const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const URL = process.env.HERO_URL || 'http://localhost:3000';

const browser = await chromium.launch({
  executablePath: EXE,
  headless: true,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
});

const THEME = process.env.THEME || 'dark';
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: THEME,
  deviceScaleFactor: 1,
});

// Force the app's class-based theme before any app JS runs.
await ctx.addInitScript((theme) => {
  try { localStorage.setItem('theme', theme); } catch {}
  document.documentElement.classList.toggle('dark', theme === 'dark');
}, THEME);

const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate((theme) =>
  document.documentElement.classList.toggle('dark', theme === 'dark'), THEME);

// Let the WebGL textures load and the first frames draw.
await page.waitForSelector('canvas.mask-canvas', { timeout: 20000 });
await page.waitForTimeout(3000);

const isDark = await page.evaluate(() =>
  document.documentElement.classList.contains('dark'));
const bg = await page.evaluate(() => {
  const el = document.querySelector('.hero-container');
  return el ? getComputedStyle(el).backgroundImage.slice(0, 60) : 'no-hero';
});
console.log('dark class:', isDark, '| hero bg:', bg);

await page.screenshot({ path: 'scripts/_hero_idle.png' });
console.log('saved scripts/_hero_idle.png');

// Hover to grow the reveal blob; nudge the cursor so the fluid sim builds up.
const box = await page.locator('canvas.mask-canvas').boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height * 0.42;
for (let i = 0; i < 8; i++) {
  await page.mouse.move(cx + Math.sin(i) * 30, cy + Math.cos(i) * 20, { steps: 4 });
  await page.waitForTimeout(120);
}
await page.mouse.move(cx, cy, { steps: 6 });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'scripts/_hero_reveal.png' });
console.log('saved scripts/_hero_reveal.png');

await browser.close();
