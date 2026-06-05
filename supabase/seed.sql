-- ============================================================================
--  Dummy seed data — run AFTER 0001_init.sql.
--  These projects are published so the live site has content immediately.
--  Unpublish / delete them from the admin panel once you add real posts.
--  Images use picsum.photos; one gallery has a sample video.
-- ============================================================================

-- Ensure the singleton settings row exists (columns already carry sensible
-- defaults from the migration).
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
--  PROJECTS
-- ─────────────────────────────────────────────
insert into public.projects
  (slug, title, description, long_description, categories, tech, year, featured, published, thumbnail_url, gallery, live_url, github_url, linkedin_url, gradient, sort_order)
values
  (
    'smart-campus',
    'Smart Campus App',
    'Cross-platform mobile app for University of Moratuwa students — timetables, dining, transit, and event feeds in one place.',
    'Built with React Native and Firebase, the Smart Campus App unifies fragmented university services. Push notifications, offline-first caching, and role-based access for students, lecturers, and admins.',
    array['Mobile'],
    array['React Native','Expo','Firebase','TypeScript'],
    2025, true, true,
    'https://picsum.photos/seed/smart-campus/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/smart-campus-a/1600/1000","caption":"Home dashboard"},
      {"type":"image","url":"https://picsum.photos/seed/smart-campus-b/1600/1000","caption":"Timetable"},
      {"type":"video","url":"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4","caption":"Walkthrough"}]'::jsonb,
    null, 'https://github.com/kalanas210/smart-campus', 'https://www.linkedin.com/in/kalanasandakelum',
    'from-brand-violet via-brand-fuchsia to-brand-rose', 1
  ),
  (
    'algo-viz',
    'Algorithm Visualizer',
    'Interactive teaching tool for sorting, pathfinding and graph algorithms with frame-perfect step playback.',
    'An education-first visualizer built with Next.js, D3, and Framer Motion. Drop a custom dataset, scrub through every step, and inspect call stacks in real time.',
    array['Web','Open Source'],
    array['Next.js','D3.js','Framer Motion','TypeScript'],
    2025, true, true,
    'https://picsum.photos/seed/algo-viz/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/algo-viz-a/1600/1000","caption":"Sorting view"},
      {"type":"image","url":"https://picsum.photos/seed/algo-viz-b/1600/1000","caption":"Pathfinding grid"}]'::jsonb,
    'https://algoviz.kalanalk.com', 'https://github.com/kalanas210/algo-viz', null,
    'from-brand-cyan via-brand-violet to-brand-fuchsia', 2
  ),
  (
    'ecomm',
    'E-Commerce Platform',
    'Production-grade storefront with Stripe payments, multi-vendor admin, and a Next.js + PostgreSQL stack.',
    'Full-fledged e-commerce engine — products, variants, inventory, multi-vendor admin, Stripe Connect, and a server-rendered storefront optimized for Core Web Vitals.',
    array['Web'],
    array['Next.js','PostgreSQL','Prisma','Stripe','Tailwind'],
    2024, false, true,
    'https://picsum.photos/seed/ecomm/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/ecomm-a/1600/1000","caption":"Storefront"},
      {"type":"image","url":"https://picsum.photos/seed/ecomm-b/1600/1000","caption":"Vendor admin"}]'::jsonb,
    'https://shop.kalanalk.com', 'https://github.com/kalanas210/ecomm', null,
    'from-brand-emerald via-brand-cyan to-brand-violet', 3
  ),
  (
    'ai-chatbot',
    'AI Documentation Chatbot',
    'RAG-powered assistant that answers technical questions over private docs using FastAPI and embeddings.',
    'FastAPI service that ingests Markdown/PDF docs, chunks and embeds them with OpenAI, and serves cited answers via a streaming chat UI. Postgres + pgvector for retrieval.',
    array['AI'],
    array['Python','FastAPI','OpenAI','pgvector','Docker'],
    2025, true, true,
    'https://picsum.photos/seed/ai-chatbot/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/ai-chatbot-a/1600/1000","caption":"Chat UI"}]'::jsonb,
    null, 'https://github.com/kalanas210/docs-bot', null,
    'from-brand-amber via-brand-rose to-brand-fuchsia', 4
  ),
  (
    'portfolio',
    'Portfolio Website',
    'The site you''re on — Next.js 16, Framer Motion, and a WebGL fluid simulation hero.',
    'A handcrafted portfolio that doubles as a playground for shader work, motion design, and accessibility-first interaction. Built in the open.',
    array['Web','Open Source'],
    array['Next.js','Framer Motion','Three.js','Tailwind'],
    2026, false, true,
    'https://picsum.photos/seed/portfolio/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/portfolio-a/1600/1000","caption":"Hero"}]'::jsonb,
    'https://kalanalk.com', 'https://github.com/kalanas210/portfolio', null,
    'from-brand-fuchsia via-brand-violet to-brand-cyan', 5
  ),
  (
    'ems',
    'University Event Management',
    'Spring Boot + React platform for managing campus events, registrations, ticketing, and analytics.',
    'End-to-end event platform with role-based dashboards for organizers, an attendee app, QR check-in, and Grafana-style analytics.',
    array['Web'],
    array['React','Spring Boot','PostgreSQL','Docker'],
    2024, false, true,
    'https://picsum.photos/seed/ems/1200/800',
    '[{"type":"image","url":"https://picsum.photos/seed/ems-a/1600/1000","caption":"Organizer dashboard"}]'::jsonb,
    null, 'https://github.com/kalanas210/uom-events', null,
    'from-brand-rose via-brand-amber to-brand-emerald', 6
  )
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────
--  TESTIMONIALS
-- ─────────────────────────────────────────────
insert into public.testimonials (quote, name, role, published, sort_order) values
  ('Kalana''s work has this rare quality — every detail looks intentional. The product feels handmade, but ships like a machine.',
   'Dilshan Perera', 'Lead Engineer, Bloomroom', true, 1),
  ('One of the most thoughtful junior engineers I''ve collaborated with. He treats the user, the codebase, and his teammates with the same care.',
   'Anjali Fernando', 'Senior Designer, Surge', true, 2),
  ('Picked up Spring Boot in a weekend and shipped a clean microservice the following week. Curious, kind, and quick.',
   'Prof. R. Wickramasinghe', 'University of Moratuwa', true, 3)
on conflict do nothing;
