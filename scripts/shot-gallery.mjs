// Curated gallery capture: desktop + mobile shots of the live dev server (:3000)
// in dark mode, at 2x scale. Output -> screenshots/. Not part of the app.
//   node scripts/shot-gallery.mjs
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const BASE = process.env.HERO_URL || 'http://localhost:3000';
const THEME = process.env.THEME || 'dark';
const OUTDIR = 'screenshots';
fs.mkdirSync(OUTDIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXE,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shot({ route, name, viewport, isMobile = false, hero = false }) {
  const ctx = await browser.newContext({
    viewport,
    colorScheme: THEME,
    deviceScaleFactor: 2,
    isMobile,
    hasTouch: isMobile,
  });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem('theme', t); } catch {}
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, THEME);

  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), THEME);

  if (hero) {
    try { await page.waitForSelector('canvas', { timeout: 15000 }); } catch {}
    await page.waitForTimeout(3000);
    if (!isMobile) {
      const cv = await page.locator('canvas').first().boundingBox().catch(() => null);
      if (cv) {
        const cx = cv.x + cv.width / 2;
        const cy = cv.y + cv.height * 0.42;
        for (let i = 0; i < 8; i++) {
          await page.mouse.move(cx + Math.sin(i) * 30, cy + Math.cos(i) * 20, { steps: 4 });
          await page.waitForTimeout(120);
        }
        await page.mouse.move(cx, cy, { steps: 6 });
        await page.waitForTimeout(1500);
      }
    } else {
      await page.waitForTimeout(2000);
    }
  } else {
    // Nudge scroll to fire in-view reveal animations, then return to top.
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
  }

  const out = path.join(OUTDIR, name);
  await page.screenshot({ path: out });
  console.log('saved', out);
  await ctx.close();
}

const jobs = [
  { route: '/', name: '01-hero-desktop.png', viewport: DESKTOP, hero: true },
  { route: '/', name: '02-hero-mobile.png', viewport: MOBILE, isMobile: true, hero: true },
  { route: '/projects', name: '03-projects-desktop.png', viewport: DESKTOP },
  { route: '/tools', name: '04-tools-desktop.png', viewport: DESKTOP },
  { route: '/tools/background-remover', name: '05-tool-bg-remover-desktop.png', viewport: DESKTOP },
  { route: '/tools/json-formatter', name: '06-tool-json-desktop.png', viewport: DESKTOP },
  { route: '/about', name: '07-about-desktop.png', viewport: DESKTOP },
  { route: '/skills', name: '08-skills-desktop.png', viewport: DESKTOP },
  { route: '/projects/portfolio', name: '09-project-detail-desktop.png', viewport: DESKTOP },
  { route: '/blog', name: '10-blog-desktop.png', viewport: DESKTOP },
  { route: '/tools', name: '11-tools-mobile.png', viewport: MOBILE, isMobile: true },
  { route: '/projects', name: '12-projects-mobile.png', viewport: MOBILE, isMobile: true },
];

for (const j of jobs) {
  try { await shot(j); } catch (e) { console.log('FAIL', j.name, e.message); }
}
await browser.close();
console.log('done');
