// Verify the editorial redesign: full-page shots of project + blog detail and
// the blog index, desktop + mobile, dark + light. Output -> screenshots/.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const EXE = path.join(
  os.homedir(),
  'AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
);
const BASE = process.env.HERO_URL || 'http://localhost:3000';
const OUTDIR = 'screenshots';
fs.mkdirSync(OUTDIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXE,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function shot({ route, name, theme = 'dark', viewport = DESKTOP, isMobile = false }) {
  const ctx = await browser.newContext({
    viewport,
    colorScheme: theme,
    deviceScaleFactor: 2,
    isMobile,
    hasTouch: isMobile,
  });
  await ctx.addInitScript((t) => {
    try { localStorage.setItem('theme', t); } catch {}
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, theme);

  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate((t) => document.documentElement.classList.toggle('dark', t === 'dark'), theme);
  // Fire in-view reveals, then settle at top.
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(OUTDIR, name), fullPage: true });
  console.log('saved', name);
  await ctx.close();
}

const BLOG = '/blog/what-is-agentic-ai';
const BLOG_CODE = '/blog/spring-boot-rest-api-best-practices';

const jobs = [
  { route: '/projects/portfolio', name: 'ed-project-desktop-dark.png', theme: 'dark' },
  { route: '/projects/portfolio', name: 'ed-project-desktop-light.png', theme: 'light' },
  { route: BLOG, name: 'ed-blog-desktop-dark.png', theme: 'dark' },
  { route: BLOG, name: 'ed-blog-desktop-light.png', theme: 'light' },
  { route: BLOG_CODE, name: 'ed-blogcode-desktop-dark.png', theme: 'dark' },
  { route: '/blog', name: 'ed-bloglist-desktop-dark.png', theme: 'dark' },
  { route: '/projects/portfolio', name: 'ed-project-mobile-dark.png', theme: 'dark', viewport: MOBILE, isMobile: true },
  { route: BLOG, name: 'ed-blog-mobile-dark.png', theme: 'dark', viewport: MOBILE, isMobile: true },
];

for (const j of jobs) {
  try { await shot(j); } catch (e) { console.log('FAIL', j.name, e.message); }
}
await browser.close();
console.log('done');
