// Read-only: dump the tools table so we know exactly what to generate covers for.
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const supa = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await supa
  .from('tools')
  .select('id, slug, name, tagline, category, icon, gradient, cover_url, kind, sort_order, published')
  .order('sort_order', { ascending: true });

if (error) { console.error('ERR', error); process.exit(1); }
console.log('COUNT', data.length);
fs.writeFileSync('scripts/_tools.json', JSON.stringify(data, null, 2));
console.log(JSON.stringify(data.map((t) => ({ slug: t.slug, name: t.name, category: t.category, icon: t.icon, cover: t.cover_url ? 'yes' : 'no', pub: t.published })), null, 0));
