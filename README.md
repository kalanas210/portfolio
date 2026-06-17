<div align="center">

# Kalana Sandakelum - Portfolio & Developer Tools Platform

A fast, animated personal site that doubles as a self-serve CMS and a suite of 34 free, client-side developer tools.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)

**[Live site -> kalanalk.com](https://www.kalanalk.com)**

</div>

---

## Overview

This is not just a static portfolio. It is a full Next.js 16 application with:

- A WebGL hero powered by a real-time GPU fluid simulation (a hand-ported "hover mask reveal").
- A long-form, SEO-optimized blog.
- 34 privacy-first developer tools that run entirely in the browser - nothing is uploaded.
- A Supabase-backed admin where projects, posts, tools, testimonials, and site settings are all editable, with drag-to-reorder lists.

It is designed around one principle: every interactive flourish has to earn its keep, and marketing pages stay static and server-rendered for speed and SEO while heavy interactivity is isolated, lazy, and guarded.

## Features

### Front end
- **WebGL fluid-sim hero** - a Three.js velocity/density field that erodes a liquid mask to reveal a second image on hover, disabled under `prefers-reduced-motion`.
- **Motion system** - Framer Motion for scroll reveals, staggered lists, and tilt/spotlight cards; Lenis for inertial smooth scrolling.
- **Responsive and theme-aware** - dark/light via `next-themes`, fluid type, and mobile-first layouts.

### Developer tools (`/tools`)
- 34 tools across Image, AI, Developer, Converters, Generators, Network, Design, and Text.
- 100% client-side: JSON/SQL/XML formatters, regex tester, JWT decoder, diff checker, hash/HMAC/UUID/password generators, Base64, OCR (Tesseract.js), in-browser background removal, image compress/convert/resize, and more.
- Each tool has its own SEO landing page (structured data, FAQs, related tools).

### Blog (`/blog`)
- Long-form Markdown posts rendered server-side (GitHub-flavored Markdown + syntax highlighting).
- Per-post generated cover art, reading time, tags, and JSON-LD `BlogPosting` data.

### Admin CMS (private route)
- Supabase-Auth-protected dashboard to create, edit, publish, and reorder Projects, Blog posts, and Tools.
- Served from an obscure, unlisted path (kept out of `sitemap.xml`/`robots.txt`) and gated by auth in middleware.
- Drag-and-drop (and up/down) ordering, media uploads to Supabase Storage, and editable home/about content.

### SEO & sharing
- Dynamic Open Graph / Twitter images, JSON-LD structured data, `sitemap.xml`, and `robots.txt`.
- JPG social-preview images so link unfurls render correctly on WhatsApp, X, LinkedIn, and Facebook.

### Contact (`/contact`)
- Layered spam protection: honeypot, per-IP rate limiting, server-side validation, and Cloudflare Turnstile, delivered by Resend.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS + Typography plugin |
| Animation | Framer Motion, Lenis, Three.js (WebGL) |
| Backend / data | Supabase (Postgres, Auth, Storage) with Row Level Security |
| Email | Resend |
| Anti-spam | Cloudflare Turnstile |
| Fonts | Geist (sans/mono) + Outfit (display) via `next/font` |
| Hosting | Vercel |

## Project structure

```
src/
  app/                 # App Router routes
    about/  blog/  projects/  tools/  skills/  contact/   # public pages
    <private>/                                            # auth-protected CMS (route in middleware.ts)
    api/contact/                                          # contact form endpoint
    opengraph-image.tsx  sitemap.ts  robots.ts            # SEO
  components/          # hero (WebGL), sections, ui, admin, tools, blog
  lib/                 # supabase clients, queries, types, utils, tools registry
supabase/
  migrations/          # SQL schema + RLS policies (0001 - 0004)
  seed.sql, seed_blog.sql   # demo content
public/images/         # static assets + generated cover art (svg + jpg)
```

## Getting started

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine)

### 1. Install

```bash
git clone https://github.com/kalanas210/portfolio.git
cd portfolio
npm install
```

### 2. Configure environment

Create a `.env.local` in the project root:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=media              # storage bucket name (optional)

# Contact form (optional - the form degrades gracefully without these)
RESEND_API_KEY=your-resend-key
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio <noreply@yourdomain.com>

# Cloudflare Turnstile (optional). If the site key is set in production, the
# secret must also be set or submissions are rejected (fail closed).
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

> A ready-to-copy template lives at `.env.local.example` (`cp .env.local.example .env.local`). The app authenticates admin writes with the signed-in user's session under Row Level Security and uses **only** the anon key - no service-role key is required.

### 3. Set up the database

Run the SQL files in `supabase/migrations/` (in order) against your Supabase project - either through the Supabase SQL editor or the Supabase CLI. Optionally load `supabase/seed.sql` and `supabase/seed_blog.sql` for demo content. The migrations create the `projects`, `posts`, `tools`, `testimonials`, and `site_settings` tables with Row Level Security (public reads see only published rows; writes require an authenticated admin).

> If Supabase is not configured, public pages fall back to built-in seed data so the site still renders.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin lives at a private, unlisted route defined in `src/lib/supabase/middleware.ts` (create an admin user in Supabase Auth to log in).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key; client reads + authenticated admin writes (under RLS) |
| `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` | No | Storage bucket for uploads (default `media`) |
| `RESEND_API_KEY` | For contact | Sends contact emails |
| `CONTACT_TO_EMAIL` | For contact | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | No | Verified sender address |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile widget |
| `TURNSTILE_SECRET_KEY` | No | Turnstile server verification |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed on [Vercel](https://vercel.com). Push to the default branch, set the same environment variables in the Vercel project settings, and it builds automatically. The custom domain is served through Cloudflare DNS.

## License & use

This is a personal project. You are welcome to read the code and use the patterns as a learning reference, but please do not republish the personal content, copy, or branding as your own.

## Author

**Kalana Sandakelum** - Full-Stack & Java (Spring Boot) developer, undergraduate at the University of Moratuwa, Sri Lanka.

[Website](https://www.kalanalk.com) · [GitHub](https://github.com/kalanas210) · [LinkedIn](https://www.linkedin.com/in/kalanasandakelum)
