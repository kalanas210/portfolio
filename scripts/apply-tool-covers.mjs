// Set each tool's cover_url to its generated local cover (/images/tools/<slug>.svg).
// Files live in public/, so the path is served statically by Next in dev + prod.
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const tools = JSON.parse(fs.readFileSync('scripts/_tools.json', 'utf8'));
let ok = 0, fail = 0;
for (const t of tools) {
  const coverUrl = `/images/tools/${t.slug}.svg`;
  if (!fs.existsSync(`public${coverUrl}`)) { console.error('MISSING FILE', coverUrl); fail++; continue; }
  const { error } = await supa.from('tools').update({ cover_url: coverUrl }).eq('id', t.id);
  if (error) { console.error('FAIL', t.slug, error.message); fail++; }
  else { ok++; }
}
console.log(`Applied cover_url to ${ok} tools, ${fail} failed.`);

// Verify
const { data } = await supa.from('tools').select('slug, cover_url').order('sort_order');
const missing = data.filter((d) => !d.cover_url || !d.cover_url.startsWith('/images/tools/'));
console.log('Rows now pointing at a local tool cover:', data.length - missing.length, '/', data.length);
if (missing.length) console.log('Not local:', missing.map((m) => `${m.slug}=${m.cover_url}`).join(', '));
