// One-off visual check: full-page desktop screenshot of a route on the dev server.
// Usage: node scripts/shot-page.mjs <path> <outName> [theme]
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const ROUTE = process.argv[2] || '/';
const OUT = process.argv[3] || 'scripts/_page.png';
const THEME = process.argv[4] || 'dark';
const URL = 'http://localhost:3000' + ROUTE;

const browser = await chromium.launch({
  executablePath: EXE,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  colorScheme: THEME,
  deviceScaleFactor: 1,
});
await ctx.addInitScript((theme) => {
  try { localStorage.setItem('theme', theme); } catch {}
  document.documentElement.classList.toggle('dark', theme === 'dark');
}, THEME);

const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate((theme) =>
  document.documentElement.classList.toggle('dark', theme === 'dark'), THEME);
// Trigger in-view reveal animations by scrolling to the bottom and back.
await page.evaluate(async () => {
  for (let y = 0; y <= document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

await page.screenshot({ path: OUT, fullPage: true });
console.log('saved', OUT);
await browser.close();
