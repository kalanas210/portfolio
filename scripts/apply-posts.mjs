// Push the rewritten article bodies + new cover art to the posts table.
// content  <- scripts/posts/<slug>.md
// cover_url <- /images/blog/<slug>.svg  (served statically from public/)
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

const rows = JSON.parse(fs.readFileSync('scripts/_posts.json', 'utf8'));

// Excerpt fixes where the rewrite changed a number/claim in the title or body.
const EXCERPT_OVERRIDE = {
  'spring-boot-rest-api-best-practices':
    'Nine practical Spring Boot REST API best practices for clean, secure, and maintainable back-end services.',
};

let ok = 0, fail = 0;
for (const row of rows) {
  const mdPath = `scripts/posts/${row.slug}.md`;
  const coverFile = `public/images/blog/${row.slug}.svg`;
  if (!fs.existsSync(mdPath)) { console.error('NO MD', row.slug); fail++; continue; }
  if (!fs.existsSync(coverFile)) { console.error('NO COVER', row.slug); fail++; continue; }

  const content = fs.readFileSync(mdPath, 'utf8').trim();
  const update = {
    content,
    cover_url: `/images/blog/${row.slug}.svg`,
  };
  if (EXCERPT_OVERRIDE[row.slug]) update.excerpt = EXCERPT_OVERRIDE[row.slug];

  const { error } = await supa.from('posts').update(update).eq('id', row.id);
  if (error) { console.error('FAIL', row.slug, error.message); fail++; }
  else { ok += 1; console.log('ok', row.slug, `(${content.length} chars)`); }
}
console.log(`\nUpdated ${ok} posts, ${fail} failed.`);

// Verify
const { data } = await supa.from('posts').select('slug, cover_url, content').order('sort_order');
const bad = data.filter((d) => !d.cover_url?.startsWith('/images/blog/') || (d.content || '').length < 2000);
console.log('Posts with new cover + long content:', data.length - bad.length, '/', data.length);
if (bad.length) console.log('Check:', bad.map((b) => b.slug).join(', '));
