// Read-only: dump the posts table so we know the current topics + content.
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

const { data, error } = await supa
  .from('posts')
  .select('*')
  .order('sort_order', { ascending: true });
if (error) { console.error('ERR', error); process.exit(1); }

fs.writeFileSync('scripts/_posts.json', JSON.stringify(data, null, 2));
console.log('COUNT', data.length);
for (const p of data) {
  console.log('\n=====================================================');
  console.log('SLUG:', p.slug, '| pub:', p.published, '| featured:', p.featured, '| tags:', JSON.stringify(p.tags));
  console.log('TITLE:', p.title);
  console.log('EXCERPT:', p.excerpt);
  console.log('COVER:', p.cover_url);
  console.log('CONTENT LEN:', (p.content || '').length);
  console.log('--- content ---');
  console.log(p.content);
}
