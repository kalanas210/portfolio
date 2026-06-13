// One-off visual check: screenshot the running dev server at a phone viewport.
// Usage: node scripts/shot-mobile.mjs [outName] [theme]
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const URL = process.env.HERO_URL || 'http://localhost:3000';
const OUT = process.argv[2] || 'scripts/_mobile.png';
const THEME = process.argv[3] || process.env.THEME || 'dark';

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

const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: THEME,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

await ctx.addInitScript((theme) => {
  try { localStorage.setItem('theme', theme); } catch {}
  document.documentElement.classList.toggle('dark', theme === 'dark');
}, THEME);

const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate((theme) =>
  document.documentElement.classList.toggle('dark', theme === 'dark'), THEME);
await page.waitForTimeout(2500);

await page.screenshot({ path: OUT });
console.log('saved', OUT);

await browser.close();
