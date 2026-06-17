// Generate a branded 16:9 cover SVG for every tool in scripts/_tools.json.
// Output: public/images/tools/<slug>.svg
//
// Style: dark mesh background, category-accent glow blobs + dot grid, the tool's
// real lucide icon glowing in a glass tile on the right, category eyebrow + tool
// name on the left. One accent palette per category so the tools grid reads as
// colour-coded sections.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Lucide from 'lucide-react';
import fs from 'node:fs';
import path from 'node:path';

const tools = JSON.parse(fs.readFileSync('scripts/_tools.json', 'utf8'));
const OUT_DIR = 'public/images/tools';
fs.mkdirSync(OUT_DIR, { recursive: true });

// category -> [accent1 (bright/primary), accent2 (secondary), baseDark]
const PALETTE = {
  Image:      ['#22d3ee', '#38bdf8', '#081320'],
  AI:         ['#d946ef', '#a78bfa', '#140a1c'],
  Developer:  ['#818cf8', '#8b5cf6', '#0c0b1a'],
  Converters: ['#34d399', '#22d3ee', '#06140f'],
  Generators: ['#8b5cf6', '#d946ef', '#0f0a1a'],
  Network:    ['#fbbf24', '#fb923c', '#16100a'],
  Design:     ['#fb7185', '#d946ef', '#170913'],
  Text:       ['#34d399', '#a3e635', '#0a1207'],
};
const DEFAULT = ['#a78bfa', '#22d3ee', '#0b0a14'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function iconInner(name) {
  const Comp = Lucide[name] || Lucide.Wrench;
  const svg = renderToStaticMarkup(React.createElement(Comp, { size: 24, strokeWidth: 1.5 }));
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}

// Place a lucide icon (24-unit inner markup) at a screen size/position.
function placeIcon(inner, { x, y, size, color, strokePx, opacity = 1 }) {
  const scale = size / 24;
  const sw = (strokePx * 24) / size; // keep visual stroke ≈ strokePx after scaling
  return `<g transform="translate(${x} ${y}) scale(${scale.toFixed(4)})" fill="none" stroke="${color}" stroke-width="${sw.toFixed(3)}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">${inner}</g>`;
}

function greedy(words, max) {
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function wrapName(name) {
  for (const t of [{ font: 70, max: 14 }, { font: 58, max: 18 }, { font: 48, max: 23 }]) {
    const lines = greedy(name.split(/\s+/), t.max);
    if (lines.length <= 2) return { ...t, lines };
  }
  return { font: 44, max: 27, lines: greedy(name.split(/\s+/), 27).slice(0, 2) };
}

function buildSvg(tool) {
  const [a1, a2, base] = PALETTE[tool.category] || DEFAULT;
  const inner = iconInner(tool.icon);
  const { font, lines } = wrapName(tool.name);

  // Left text block, vertically centred around y≈360.
  const lh = Math.round(font * 1.12);
  const blockH = 40 /*eyebrow*/ + lines.length * lh;
  const top = 360 - blockH / 2;
  const eyebrowY = top + 22;
  const nameTop = top + 56;
  const nameTspans = lines
    .map((l, i) => `<text x="96" y="${nameTop + font * 0.82 + i * lh}" font-family="'Outfit','Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="${font}" font-weight="700" fill="#ffffff" letter-spacing="-1">${esc(l)}</text>`)
    .join('');
  const underlineY = nameTop + font * 0.82 + (lines.length - 1) * lh + 28;

  // Glass icon tile (right).
  const tcx = 1012, tcy = 360, tile = 300;
  const tx = tcx - tile / 2, ty = tcy - tile / 2;
  const iconSize = 150;

  return `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(tool.name)} - ${esc(tool.category)} tool">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${base}"/>
    <stop offset="1" stop-color="#060510"/>
  </linearGradient>
  <radialGradient id="b1" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${a1}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${a1}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="b2" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${a2}" stop-opacity="0.42"/>
    <stop offset="1" stop-color="${a2}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${a1}" stop-opacity="0.50"/>
    <stop offset="1" stop-color="${a1}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.02"/>
  </linearGradient>
  <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.3" fill="#ffffff" opacity="0.05"/>
  </pattern>
</defs>

<rect width="1280" height="720" fill="url(#bg)"/>
<circle cx="1050" cy="230" r="440" fill="url(#b1)"/>
<circle cx="170" cy="610" r="380" fill="url(#b2)"/>
<rect width="1280" height="720" fill="url(#dots)"/>

<!-- decorative oversized watermark of the same icon -->
${placeIcon(inner, { x: 250, y: 470, size: 360, color: a2, strokePx: 5, opacity: 0.06 })}

<!-- glass icon tile -->
<circle cx="${tcx}" cy="${tcy}" r="250" fill="url(#glow)"/>
<rect x="${tx}" y="${ty}" width="${tile}" height="${tile}" rx="60" fill="url(#tile)" stroke="${a1}" stroke-opacity="0.45" stroke-width="1.5"/>
${placeIcon(inner, { x: tcx - iconSize / 2, y: tcy - iconSize / 2, size: iconSize, color: a1, strokePx: 3.4 })}

<!-- left text -->
<circle cx="102" cy="${eyebrowY - 6}" r="5" fill="${a1}"/>
<text x="120" y="${eyebrowY}" font-family="'Outfit','Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="22" font-weight="600" letter-spacing="5" fill="${a1}">${esc(tool.category.toUpperCase())}</text>
${nameTspans}
<rect x="98" y="${underlineY}" width="116" height="6" rx="3" fill="${a1}"/>

<text x="96" y="672" font-family="'Outfit','Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" font-size="20" font-weight="500" letter-spacing="2" fill="#ffffff" opacity="0.32">kalanalk.com</text>
</svg>
`;
}

let n = 0;
for (const tool of tools) {
  const svg = buildSvg(tool);
  fs.writeFileSync(path.join(OUT_DIR, `${tool.slug}.svg`), svg);
  n++;
}
console.log(`Generated ${n} covers into ${OUT_DIR}`);
