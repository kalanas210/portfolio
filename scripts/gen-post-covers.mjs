// Distinct, per-post cover art for the blog. Unlike the tool covers (one shared
// template), every post gets its own visual concept + composition + palette.
// Output: public/images/blog/<slug>.svg  (1280x720, 16:9)
import fs from 'node:fs';
import path from 'node:path';

const W = 1280, H = 720;
const FONT = "'Outfit','Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO = "'JetBrains Mono','Fira Code',ui-monospace,'Cascadia Code',Consolas,monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const posts = JSON.parse(fs.readFileSync('scripts/_posts-slim.json', 'utf8'));
const titleOf = Object.fromEntries(posts.map((p) => [p.slug, p.title]));
const OUT = 'public/images/blog';
fs.mkdirSync(OUT, { recursive: true });

function wrap(text, max) {
  const out = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + ' ' + w).length <= max) cur += ' ' + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}
function title(text, { x, y, font, fill = '#fff', weight = 700, max = 22, lh, anchor = 'start', ls = -1 }) {
  const lines = wrap(text, max);
  const step = lh || Math.round(font * 1.1);
  return lines
    .map((l, i) => `<text x="${x}" y="${y + i * step}" font-family="${FONT}" font-size="${font}" font-weight="${weight}" fill="${fill}" letter-spacing="${ls}" text-anchor="${anchor}">${esc(l)}</text>`)
    .join('');
}
const svg = (defs, inner) =>
  `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${inner}</svg>\n`;

const dotgrid = (id, color = '#ffffff', op = 0.05, gap = 30) =>
  `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="${color}" opacity="${op}"/></pattern>`;
const linegrid = (id, color = '#ffffff', op = 0.05, gap = 40) =>
  `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><path d="M ${gap} 0 L 0 0 0 ${gap}" fill="none" stroke="${color}" stroke-width="1" opacity="${op}"/></pattern>`;
const blob = (id, c, o1 = 0.5) =>
  `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${c}" stop-opacity="${o1}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const darkBg = (id, a, b) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

// eyebrow chip (small uppercase label)
function eyebrow(x, y, text, color) {
  return `<circle cx="${x + 5}" cy="${y - 6}" r="5" fill="${color}"/><text x="${x + 20}" y="${y}" font-family="${FONT}" font-size="20" font-weight="600" letter-spacing="4" fill="${color}">${esc(text)}</text>`;
}
function chip(x, y, w, h, fill, text, textColor, fs = 18, mono = false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/><text x="${x + w / 2}" y="${y + h / 2 + fs * 0.35}" font-family="${mono ? MONO : FONT}" font-size="${fs}" font-weight="700" fill="${textColor}" text-anchor="middle">${esc(text)}</text>`;
}

const builders = {
  // 1 - portfolio build log: a browser window mockup with a shader-hero + nav
  'hello-world': (t) => svg(
    darkBg('bg', '#0d0b1a', '#070512') + blob('v', '#8b5cf6', 0.5) + blob('c', '#22d3ee', 0.45) +
    dotgrid('dg') +
    `<radialGradient id="orb" cx="0.35" cy="0.35" r="0.75"><stop offset="0" stop-color="#a78bfa"/><stop offset="0.5" stop-color="#7c3aed"/><stop offset="1" stop-color="#22d3ee"/></radialGradient>`,
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>
     <circle cx="1080" cy="170" r="430" fill="url(#v)"/><circle cx="220" cy="620" r="360" fill="url(#c)"/>
     <rect width="${W}" height="${H}" fill="url(#dg)"/>
     <!-- window -->
     <rect x="150" y="150" width="980" height="470" rx="22" fill="#0c0a18" stroke="#ffffff" stroke-opacity="0.10"/>
     <rect x="150" y="150" width="980" height="56" rx="22" fill="#15122480"/>
     <circle cx="186" cy="178" r="7" fill="#ff5f57"/><circle cx="210" cy="178" r="7" fill="#febc2e"/><circle cx="234" cy="178" r="7" fill="#28c840"/>
     <rect x="420" y="164" width="440" height="28" rx="14" fill="#ffffff" fill-opacity="0.06"/>
     <text x="640" y="184" font-family="${MONO}" font-size="16" fill="#a5b4fc" text-anchor="middle">kalanalk.com</text>
     <!-- content: nav pills + heading + shader orb -->
     <g>
       <rect x="196" y="248" width="92" height="30" rx="15" fill="#ffffff" fill-opacity="0.08"/><text x="242" y="268" font-family="${FONT}" font-size="15" fill="#cbd5e1" text-anchor="middle">Home</text>
       <rect x="300" y="248" width="92" height="30" rx="15" fill="#ffffff" fill-opacity="0.05"/><text x="346" y="268" font-family="${FONT}" font-size="15" fill="#94a3b8" text-anchor="middle">Work</text>
       <rect x="404" y="248" width="92" height="30" rx="15" fill="#ffffff" fill-opacity="0.05"/><text x="450" y="268" font-family="${FONT}" font-size="15" fill="#94a3b8" text-anchor="middle">About</text>
       <circle cx="980" cy="410" r="135" fill="url(#orb)"/>
       <circle cx="980" cy="410" r="160" fill="none" stroke="#a78bfa" stroke-opacity="0.25"/>
       <circle cx="980" cy="410" r="190" fill="none" stroke="#22d3ee" stroke-opacity="0.15"/>
     </g>
     ${eyebrow(196, 340, 'BUILD LOG', '#a78bfa')}
     ${title(t, { x: 196, y: 392, font: 52, max: 18, fill: '#ffffff' })}
     <rect x="198" y="560" width="120" height="6" rx="3" fill="#22d3ee"/>`,
  ),

  // 2 - command palette of 5 tools
  '5-free-browser-tools-every-developer-needs': (t) => svg(
    darkBg('bg', '#0a0f1c', '#060509') + blob('a', '#38bdf8', 0.4) + blob('b', '#22d3ee', 0.35) + dotgrid('dg'),
    (() => {
      const rows = [
        ['JSON Formatter', '#22d3ee', '{ }'],
        ['Regex Tester', '#a78bfa', '.*'],
        ['JWT Decoder', '#34d399', '•—'],
        ['Base64 Encode / Decode', '#fbbf24', '⌗'],
        ['Hash Generator', '#fb7185', '#'],
      ];
      const cardX = 300, cardY = 150, cardW = 680, cardH = 440;
      let r = '';
      rows.forEach((row, i) => {
        const ry = cardY + 120 + i * 60;
        const active = i === 0;
        r += `<rect x="${cardX + 24}" y="${ry}" width="${cardW - 48}" height="50" rx="12" fill="${active ? row[1] + '22' : '#ffffff08'}" ${active ? `stroke="${row[1]}" stroke-opacity="0.5"` : ''}/>
        <rect x="${cardX + 36}" y="${ry + 9}" width="32" height="32" rx="9" fill="${row[1]}22"/>
        <text x="${cardX + 52}" y="${ry + 31}" font-family="${MONO}" font-size="15" fill="${row[1]}" text-anchor="middle">${esc(row[2])}</text>
        <text x="${cardX + 84}" y="${ry + 31}" font-family="${FONT}" font-size="19" font-weight="600" fill="#e5e7eb">${esc(row[0])}</text>`;
        if (active) r += `<rect x="${cardX + cardW - 86}" y="${ry + 13}" width="50" height="24" rx="6" fill="#ffffff10"/><text x="${cardX + cardW - 61}" y="${ry + 30}" font-family="${MONO}" font-size="13" fill="#94a3b8" text-anchor="middle">enter</text>`;
      });
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="1050" cy="180" r="380" fill="url(#a)"/><circle cx="200" cy="600" r="340" fill="url(#b)"/>
       <rect width="${W}" height="${H}" fill="url(#dg)"/>
       ${eyebrow(300, 110, 'FREE BROWSER TOOLS', '#38bdf8')}
       <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24" fill="#0c1322" stroke="#ffffff" stroke-opacity="0.08"/>
       <rect x="${cardX + 24}" y="${cardY + 28}" width="${cardW - 48}" height="56" rx="14" fill="#ffffff08"/>
       <circle cx="${cardX + 56}" cy="${cardY + 56}" r="9" fill="none" stroke="#64748b" stroke-width="2.5"/><line x1="${cardX + 63}" y1="${cardY + 63}" x2="${cardX + 72}" y2="${cardY + 72}" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
       <text x="${cardX + 86}" y="${cardY + 62}" font-family="${FONT}" font-size="19" fill="#94a3b8">Search developer tools...</text>
       ${r}
       <text x="980" y="650" font-family="${FONT}" font-size="120" font-weight="800" fill="#ffffff" fill-opacity="0.06" text-anchor="end">5</text>`;
    })(),
  ),

  // 3 - agentic AI: think -> act -> observe node graph
  'what-is-agentic-ai': (t) => svg(
    darkBg('bg', '#160a1e', '#080410') + blob('f', '#d946ef', 0.5) + blob('v', '#a78bfa', 0.4) + dotgrid('dg', '#ffffff', 0.05) +
    blob('node', '#d946ef', 0.55),
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>
     <circle cx="980" cy="240" r="420" fill="url(#f)"/><circle cx="260" cy="560" r="320" fill="url(#v)"/>
     <rect width="${W}" height="${H}" fill="url(#dg)"/>
     ${eyebrow(96, 96, 'AI ENGINEERING', '#e879f9')}
     <g transform="translate(168,18)">
     <!-- cycle arrows -->
     <g fill="none" stroke="#d946ef" stroke-opacity="0.55" stroke-width="2.5">
       <path d="M 760 250 A 200 200 0 0 1 760 590" marker-end="url(#ah)"/>
       <path d="M 700 600 A 200 200 0 0 1 560 360" marker-end="url(#ah)"/>
       <path d="M 600 320 A 200 200 0 0 1 740 250" marker-end="url(#ah)"/>
     </g>
     <marker id="ah" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#e879f9"/></marker>
     <!-- center agent -->
     <circle cx="670" cy="430" r="150" fill="url(#node)"/>
     <circle cx="670" cy="430" r="92" fill="#1a0f24" stroke="#e879f9" stroke-opacity="0.6" stroke-width="1.5"/>
     <text x="670" y="424" font-family="${FONT}" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">Agent</text>
     <text x="670" y="452" font-family="${MONO}" font-size="14" fill="#e879f9" text-anchor="middle">loop</text>
     <!-- 3 satellite nodes -->
     ${[['Model', 760, 250, '#a78bfa'], ['Tools', 470, 360, '#22d3ee'], ['Memory', 720, 600, '#34d399']].map(([lab, cx, cy, col]) =>
       `<circle cx="${cx}" cy="${cy}" r="50" fill="#140a1c" stroke="${col}" stroke-width="2"/><text x="${cx}" y="${cy + 6}" font-family="${FONT}" font-size="17" font-weight="600" fill="${col}" text-anchor="middle">${lab}</text>`).join('')}
     </g>
     ${title(t, { x: 96, y: 430, font: 46, max: 17, fill: '#ffffff' })}
     <rect x="98" y="600" width="120" height="6" rx="3" fill="#e879f9"/>`,
  ),

  // 4 - Sri Lanka Java roadmap (LIGHT, paper-ish, warm)
  'java-spring-boot-developer-sri-lanka': (t) => svg(
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf7ef"/><stop offset="1" stop-color="#f1ece0"/></linearGradient>` +
    blob('g', '#34d399', 0.35) + blob('a', '#fbbf24', 0.4) + linegrid('lg', '#1f2937', 0.05, 44),
    (() => {
      const stops = [['Core Java', 200, 470, '#16a34a'], ['Spring Boot', 470, 360, '#15803d'], ['Projects', 760, 470, '#ca8a04'], ['Hired', 1040, 360, '#b45309']];
      let pins = `<path d="M 200 470 Q 335 360 470 360 T 760 470 Q 900 540 1040 360" fill="none" stroke="#16a34a" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" opacity="0.7"/>`;
      stops.forEach(([lab, x, y, col], i) => {
        pins += `<circle cx="${x}" cy="${y}" r="30" fill="#ffffff" stroke="${col}" stroke-width="3"/><text x="${x}" y="${y + 7}" font-family="${FONT}" font-size="20" font-weight="800" fill="${col}" text-anchor="middle">${i + 1}</text>
        <text x="${x}" y="${y + 58}" font-family="${FONT}" font-size="18" font-weight="600" fill="#374151" text-anchor="middle">${esc(lab)}</text>`;
      });
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="1080" cy="600" r="320" fill="url(#g)"/><circle cx="180" cy="160" r="300" fill="url(#a)"/>
       <rect width="${W}" height="${H}" fill="url(#lg)"/>
       <!-- stylised Sri Lanka island -->
       <path d="M 1120 150 q 50 40 40 110 q -8 70 -55 120 q -40 42 -30 -30 q 8 -60 5 -120 q -3 -70 40 -80 z" fill="#16a34a" opacity="0.12"/>
       ${eyebrow(96, 110, 'CAREER ROADMAP - SRI LANKA', '#15803d')}
       ${title(t, { x: 96, y: 200, font: 50, max: 20, fill: '#111827' })}
       ${pins}
       <text x="96" y="650" font-family="${FONT}" font-size="19" font-weight="600" fill="#6b7280">Core Java &gt; Spring Boot &gt; real projects &gt; offer</text>`;
    })(),
  ),

  // 5 - interview Q&A chat bubbles + company chips
  'java-interviews-ifs-wso2-sysco-labs': (t) => svg(
    darkBg('bg', '#0a1020', '#05070f') + blob('b', '#60a5fa', 0.42) + blob('i', '#818cf8', 0.4) + dotgrid('dg'),
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>
     <circle cx="1060" cy="200" r="380" fill="url(#b)"/><circle cx="220" cy="600" r="320" fill="url(#i)"/>
     <rect width="${W}" height="${H}" fill="url(#dg)"/>
     ${eyebrow(96, 100, 'INTERVIEW PREP', '#60a5fa')}
     ${title(t, { x: 96, y: 168, font: 46, max: 24, fill: '#ffffff' })}
     <!-- chat bubbles -->
     <g>
       <rect x="96" y="300" width="430" height="74" rx="20" fill="#1e293b" stroke="#334155"/>
       <rect x="96" y="300" width="430" height="74" rx="20" fill="none"/>
       <text x="124" y="332" font-family="${MONO}" font-size="14" fill="#60a5fa">interviewer</text>
       <text x="124" y="358" font-family="${FONT}" font-size="19" fill="#e2e8f0">Explain HashMap vs ConcurrentHashMap.</text>
       <rect x="540" y="404" width="510" height="92" rx="20" fill="#2563eb"/>
       <text x="566" y="436" font-family="${MONO}" font-size="14" fill="#bfdbfe">you</text>
       <text x="566" y="462" font-family="${FONT}" font-size="19" fill="#ffffff">Segment locking, no null keys, fail-safe</text>
       <text x="566" y="486" font-family="${FONT}" font-size="19" fill="#ffffff">iteration - here is when each fits...</text>
     </g>
     <!-- company chips -->
     <g>
       ${chip(96, 560, 130, 48, '#ffffff10', 'IFS', '#93c5fd', 20)}
       ${chip(246, 560, 150, 48, '#ffffff10', 'WSO2', '#93c5fd', 20)}
       ${chip(416, 560, 220, 48, '#ffffff10', 'Sysco LABS', '#93c5fd', 20)}
     </g>`,
  ),

  // 6 - full-stack architecture diagram
  'full-stack-java-project-spring-boot-react': (t) => svg(
    darkBg('bg', '#06140f', '#04080a') + blob('e', '#34d399', 0.45) + blob('c', '#22d3ee', 0.4) + dotgrid('dg'),
    (() => {
      const boxes = [['React', 'client', 150, '#22d3ee'], ['Spring Boot', 'REST API', 545, '#34d399'], ['PostgreSQL', 'database', 940, '#a78bfa']];
      const by = 330, bw = 280, bh = 150;
      let b = '';
      boxes.forEach(([name, sub, x, col], i) => {
        b += `<rect x="${x}" y="${by}" width="${bw}" height="${bh}" rx="20" fill="#0b1a16" stroke="${col}" stroke-opacity="0.7" stroke-width="2"/>
        <rect x="${x + 24}" y="${by + 28}" width="40" height="40" rx="11" fill="${col}22"/>
        <circle cx="${x + 44}" cy="${by + 48}" r="11" fill="none" stroke="${col}" stroke-width="2.5"/>
        <text x="${x + 80}" y="${by + 46}" font-family="${FONT}" font-size="26" font-weight="700" fill="#fff">${esc(name)}</text>
        <text x="${x + 80}" y="${by + 74}" font-family="${MONO}" font-size="15" fill="${col}">${esc(sub)}</text>
        <text x="${x + 24}" y="${by + 122}" font-family="${MONO}" font-size="13" fill="#64748b">${i === 0 ? 'fetch / axios' : i === 1 ? 'JPA / Hibernate' : 'SQL'}</text>`;
        if (i < boxes.length - 1) {
          const ax = x + bw, axe = boxes[i + 1][2];
          b += `<line x1="${ax}" y1="${by + bh / 2}" x2="${axe}" y2="${by + bh / 2}" stroke="#64748b" stroke-width="2.5" marker-end="url(#ah6)"/>`;
        }
      });
      // JWT lock on first arrow
      b += `<g transform="translate(450,${by + bh / 2})"><rect x="-26" y="-18" width="52" height="36" rx="8" fill="#0b1a16" stroke="#34d399"/><rect x="-9" y="-4" width="18" height="14" rx="3" fill="#34d399"/><path d="M -5 -4 v -6 a 5 5 0 0 1 10 0 v 6" fill="none" stroke="#34d399" stroke-width="2"/><text x="0" y="34" font-family="${MONO}" font-size="13" fill="#34d399" text-anchor="middle">JWT</text></g>`;
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <marker id="ah6" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#94a3b8"/></marker>
       <circle cx="1050" cy="180" r="360" fill="url(#e)"/><circle cx="220" cy="600" r="320" fill="url(#c)"/>
       <rect width="${W}" height="${H}" fill="url(#dg)"/>
       ${eyebrow(150, 150, 'FULL-STACK BUILD', '#34d399')}
       ${title(t, { x: 150, y: 230, font: 44, max: 40, fill: '#ffffff' })}
       ${b}
       <text x="150" y="560" font-family="${MONO}" font-size="16" fill="#5eead4">React  +  Spring Boot  +  JWT  +  PostgreSQL</text>`;
    })(),
  ),

  // 7 - University of Moratuwa: notebook paper (LIGHT)
  'university-of-moratuwa-it-guide': (t) => svg(
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#fbf7ee"/></linearGradient>`,
    (() => {
      let rules = '';
      for (let y = 150; y < 690; y += 46) rules += `<line x1="120" y1="${y}" x2="${W - 80}" y2="${y}" stroke="#cdd9ec" stroke-width="1.5"/>`;
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       ${rules}
       <line x1="150" y1="80" x2="150" y2="${H - 60}" stroke="#f4a8a8" stroke-width="2.5"/>
       <circle cx="100" cy="180" r="6" fill="none" stroke="#9aa7bd" stroke-width="2"/>
       <circle cx="100" cy="360" r="6" fill="none" stroke="#9aa7bd" stroke-width="2"/>
       <circle cx="100" cy="540" r="6" fill="none" stroke="#9aa7bd" stroke-width="2"/>
       <!-- highlighter behind eyebrow -->
       <rect x="186" y="158" width="360" height="26" fill="#fde68a" opacity="0.8"/>
       <text x="190" y="180" font-family="${FONT}" font-size="20" font-weight="700" letter-spacing="3" fill="#92400e">UNIVERSITY OF MORATUWA</text>
       ${title(t, { x: 188, y: 270, font: 50, max: 22, fill: '#1f2937', weight: 800 })}
       <!-- graduation cap doodle -->
       <g transform="translate(980,470)" stroke="#7c3aed" stroke-width="3" fill="none" stroke-linejoin="round">
         <path d="M -90 0 L 0 -45 L 90 0 L 0 45 Z" fill="#7c3aed" fill-opacity="0.12"/>
         <path d="M 90 0 v 55 M -40 18 v 45 a 40 22 0 0 0 80 0 v -45" />
         <circle cx="90" cy="63" r="7" fill="#7c3aed"/>
       </g>
       <text x="188" y="470" font-family="${FONT}" font-size="22" fill="#475569">Curriculum, culture, internships -</text>
       <text x="188" y="512" font-family="${FONT}" font-size="22" fill="#475569">an honest student guide.</text>
       <text x="188" y="636" font-family="${MONO}" font-size="16" fill="#94a3b8">~ kalanalk.com</text>`;
    })(),
  ),

  // 8 - Spring Boot REST API: endpoint method list (terminal-ish)
  'spring-boot-rest-api-best-practices': (t) => svg(
    darkBg('bg', '#07140d', '#05080a') + blob('g', '#34d399', 0.4) + dotgrid('dg', '#ffffff', 0.04),
    (() => {
      const eps = [['GET', '/api/v1/users', '#22c55e'], ['POST', '/api/v1/users', '#3b82f6'], ['PUT', '/api/v1/users/{id}', '#f59e0b'], ['DELETE', '/api/v1/users/{id}', '#ef4444']];
      const cardX = 520, cardY = 160, cardW = 660;
      let rows = '';
      eps.forEach(([m, p, c], i) => {
        const y = cardY + 90 + i * 78;
        rows += `<rect x="${cardX + 26}" y="${y}" width="${cardW - 52}" height="58" rx="12" fill="#ffffff06"/>
        ${chip(cardX + 40, y + 13, 92, 32, c, m, '#fff', 15, true)}
        <text x="${cardX + 150}" y="${y + 37}" font-family="${MONO}" font-size="20" fill="#d1fae5">${esc(p)}</text>`;
      });
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="980" cy="200" r="380" fill="url(#g)"/>
       <rect width="${W}" height="${H}" fill="url(#dg)"/>
       ${eyebrow(96, 250, 'SPRING BOOT', '#34d399')}
       ${title(t, { x: 96, y: 320, font: 56, max: 13, fill: '#ffffff' })}
       <rect x="96" y="470" width="120" height="6" rx="3" fill="#34d399"/>
       <text x="96" y="540" font-family="${MONO}" font-size="17" fill="#5eead4">9 best practices for clean APIs</text>
       <!-- endpoints card -->
       <rect x="${cardX}" y="${cardY}" width="${cardW}" height="430" rx="22" fill="#08130d" stroke="#ffffff" stroke-opacity="0.08"/>
       <circle cx="${cardX + 28}" cy="${cardY + 30}" r="6" fill="#ff5f57"/><circle cx="${cardX + 48}" cy="${cardY + 30}" r="6" fill="#febc2e"/><circle cx="${cardX + 68}" cy="${cardY + 30}" r="6" fill="#28c840"/>
       <text x="${cardX + cardW - 26}" y="${cardY + 36}" font-family="${MONO}" font-size="14" fill="#64748b" text-anchor="end">UserController.java</text>
       ${rows}`;
    })(),
  ),

  // 9 - Java interview Q&A: angled flashcard stack
  'java-interview-questions-answers': (t) => svg(
    darkBg('bg', '#0e0a1e', '#070510') + blob('v', '#818cf8', 0.45) + blob('f', '#a78bfa', 0.4) + dotgrid('dg'),
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>
     <circle cx="1040" cy="220" r="400" fill="url(#v)"/><circle cx="240" cy="600" r="320" fill="url(#f)"/>
     <rect width="${W}" height="${H}" fill="url(#dg)"/>
     ${eyebrow(96, 110, 'JAVA + SPRING', '#a5b4fc')}
     ${title(t, { x: 96, y: 180, font: 46, max: 22, fill: '#ffffff' })}
     <!-- card stack -->
     <g transform="translate(760,400)">
       <rect x="-210" y="-150" width="420" height="300" rx="24" fill="#1a1633" transform="rotate(-9)" opacity="0.5"/>
       <rect x="-210" y="-150" width="420" height="300" rx="24" fill="#221c40" transform="rotate(-4)" opacity="0.8"/>
       <rect x="-210" y="-150" width="420" height="300" rx="24" fill="#2a2350" stroke="#a5b4fc" stroke-opacity="0.5"/>
       <text x="-176" y="-92" font-family="${MONO}" font-size="22" font-weight="700" fill="#a5b4fc">Q.</text>
       <text x="-176" y="-44" font-family="${FONT}" font-size="22" fill="#e5e7eb">What is the difference</text>
       <text x="-176" y="-14" font-family="${FONT}" font-size="22" fill="#e5e7eb">between == and .equals()?</text>
       <line x1="-176" y1="22" x2="176" y2="22" stroke="#ffffff" stroke-opacity="0.12"/>
       <text x="-176" y="70" font-family="${MONO}" font-size="22" font-weight="700" fill="#34d399">A.</text>
       <text x="-130" y="70" font-family="${FONT}" font-size="20" fill="#cbd5e1">reference vs value equality</text>
     </g>
     <rect x="98" y="250" width="120" height="6" rx="3" fill="#a5b4fc"/>
     <text x="96" y="330" font-family="${FONT}" font-size="20" fill="#94a3b8">Core Java, collections, streams</text>
     <text x="96" y="362" font-family="${FONT}" font-size="20" fill="#94a3b8">and Spring - answered clearly.</text>`,
  ),

  // 10 - bento grid of tool tiles
  'free-online-tools-for-developers': (t) => svg(
    darkBg('bg', '#0a0c18', '#060509') + blob('a', '#8b5cf6', 0.4) + blob('b', '#22d3ee', 0.35) + dotgrid('dg'),
    (() => {
      const tiles = [
        ['{ }', '#22d3ee'], ['.*', '#a78bfa'], ['#', '#fb7185'], ['⌗', '#fbbf24'],
        ['</>', '#34d399'], ['ID', '#60a5fa'], ['10', '#ffffff'], ['SQL', '#f472b6'],
        ['<>', '#38bdf8'], ['Aa', '#facc15'],
      ];
      const gx = 470, gy = 120, cell = 132, gap = 18, cols = 4;
      let g = '';
      tiles.forEach((ti, i) => {
        const cx = gx + (i % cols) * (cell + gap);
        const cy = gy + Math.floor(i / cols) * (cell + gap);
        const big = ti[0] === '10';
        g += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" rx="22" fill="${big ? ti[1] : ti[1] + '1c'}" stroke="${ti[1]}" stroke-opacity="${big ? 0.0 : 0.45}"/>
        <text x="${cx + cell / 2}" y="${cy + cell / 2 + (big ? 22 : 12)}" font-family="${big ? FONT : MONO}" font-size="${big ? 64 : 34}" font-weight="800" fill="${big ? '#0a0c18' : ti[1]}" text-anchor="middle">${esc(ti[0])}</text>`;
        if (big) g += `<text x="${cx + cell / 2}" y="${cy + cell - 18}" font-family="${FONT}" font-size="15" font-weight="700" fill="#0a0c18" text-anchor="middle">TOOLS</text>`;
      });
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="240" cy="220" r="360" fill="url(#a)"/><circle cx="1060" cy="600" r="320" fill="url(#b)"/>
       <rect width="${W}" height="${H}" fill="url(#dg)"/>
       ${eyebrow(96, 250, 'PRODUCTIVITY', '#a78bfa')}
       ${title(t, { x: 96, y: 320, font: 44, max: 15, fill: '#ffffff' })}
       <rect x="98" y="470" width="120" height="6" rx="3" fill="#22d3ee"/>
       <text x="96" y="540" font-family="${FONT}" font-size="18" fill="#94a3b8">Private, in-browser, free.</text>
       ${g}`;
    })(),
  ),

  // 11 - layered tech stack (3D slabs)
  'how-i-built-free-browser-tools-nextjs': (t) => svg(
    darkBg('bg', '#06121a', '#04070c') + blob('c', '#22d3ee', 0.45) + blob('e', '#34d399', 0.38) + dotgrid('dg'),
    (() => {
      const layers = [['Browser (client-side)', '#38bdf8', 0], ['Next.js 16 - App Router', '#a78bfa', 70], ['Supabase - data + storage', '#34d399', 140]];
      const cx = 850, topY = 250, rx = 230, ry = 70;
      let g = '';
      layers.slice().reverse().forEach(([lab, col, off]) => {
        const oy = topY + (140 - off) + 60;
        g += `<g transform="translate(${cx},${oy})">
          <polygon points="0,${-ry} ${rx},0 0,${ry} ${-rx},0" fill="${col}" fill-opacity="0.16" stroke="${col}" stroke-opacity="0.6"/>
          <polygon points="${-rx},0 0,${ry} 0,${ry + 26} ${-rx},26" fill="${col}" fill-opacity="0.10"/>
          <polygon points="${rx},0 0,${ry} 0,${ry + 26} ${rx},26" fill="${col}" fill-opacity="0.18"/>
          <text x="0" y="4" font-family="${FONT}" font-size="17" font-weight="600" fill="${col}" text-anchor="middle">${esc(lab)}</text>
        </g>`;
      });
      return `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="900" cy="200" r="380" fill="url(#c)"/><circle cx="200" cy="600" r="300" fill="url(#e)"/>
       <rect width="${W}" height="${H}" fill="url(#dg)"/>
       ${eyebrow(96, 250, 'BEHIND THE BUILD', '#38bdf8')}
       ${title(t, { x: 96, y: 320, font: 46, max: 15, fill: '#ffffff' })}
       <rect x="98" y="470" width="120" height="6" rx="3" fill="#22d3ee"/>
       <text x="96" y="540" font-family="${FONT}" font-size="18" fill="#94a3b8">Architecture, performance, privacy.</text>
       <circle cx="850" cy="170" r="46" fill="#0b1620" stroke="#34d399"/><text x="850" y="178" font-family="${FONT}" font-size="22" font-weight="800" fill="#34d399" text-anchor="middle">30+</text>
       ${g}`;
    })(),
  ),
};

let n = 0;
for (const [slug, build] of Object.entries(builders)) {
  if (!titleOf[slug]) { console.warn('No title for', slug); continue; }
  fs.writeFileSync(path.join(OUT, `${slug}.svg`), build(titleOf[slug]));
  n++;
}
console.log(`Generated ${n} blog covers into ${OUT}`);
