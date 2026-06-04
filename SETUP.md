# Admin Panel & Supabase Setup

This portfolio has an authenticated admin panel at **`/admin`** backed by
[Supabase](https://supabase.com) (Postgres + Auth + Storage).

Until you complete the steps below, the public site keeps working on built-in
**seed data** (`src/lib/data.ts`) and `/admin` shows a "not configured" notice.
Once configured, the site reads live content from your database.

---

## What you can manage

| Section | Where | What it controls |
| --- | --- | --- |
| **Projects** | `/admin/projects` | Blog-style project posts: thumbnail, photo & video gallery, GitHub / LinkedIn / live links, tech, categories, featured & published flags |
| **Testimonials** | `/admin/testimonials` | The "what people say" section |
| **Settings** | `/admin/settings` | Profile, social links, hero images, and CV upload |

Public pages affected: home, `/projects`, `/projects/[slug]` (new detail pages),
`/about`, `/contact`, and the footer.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name, a strong database password, and a region close to you.
3. Wait for it to finish provisioning (~2 min).

## 2. Create the schema + seed data

In the Supabase dashboard → **SQL Editor** → **New query**:

1. Paste the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and **Run**.
   This creates the tables, RLS policies, and the public `media` storage bucket.
2. Paste the contents of [`supabase/seed.sql`](supabase/seed.sql) and **Run**.
   This inserts the dummy projects (with images) + testimonials + the settings row.

> The dummy projects are **published** so your site has content immediately.
> Unpublish or delete them from the admin panel once you add real posts.

## 3. Create your admin user

Supabase Auth is the login. Create exactly one user (you):

1. Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Use your email (e.g. `kalanasandakelum210@gmail.com`) and a password.
3. Toggle **Auto Confirm User** so you can log in right away.

**Turn off public sign-ups** so no one else can create an account:

- Dashboard → **Authentication** → **Sign In / Providers** → **Email** →
  disable **Allow new users to sign up**.

(Any signed-in user is treated as the admin, so this is important.)

## 4. Set environment variables

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

From Supabase → **Project Settings** → **API**:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (e.g. `https://abcd.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(optional — not required by the admin panel)* |
| `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` | `media` (default) |

## 5. Run it

```bash
pnpm dev      # http://localhost:3000  → site
              # http://localhost:3000/admin → sign in
```

Sign in with the user from step 3. You're in.

---

## Using the admin

- **Add a project post** → `/admin/projects` → **New project**. Upload a
  thumbnail, add gallery **photos and videos** (upload files or paste URLs),
  set GitHub / LinkedIn / live links, choose categories & tech, then toggle
  **Published**. Drafts stay hidden from the public site.
- **Change images** → `/admin/settings` → *Images*. Replace the mobile hero
  portrait and the two desktop WebGL hero layers.
- **Upload / update your CV** → `/admin/settings` → *CV*. Every "Download CV"
  button across the site uses it automatically.
- **Edit testimonials** → `/admin/testimonials`. Add, edit inline, reorder
  (sort number), hide, or delete.

Uploaded files go to the public **`media`** Storage bucket. Saving content
revalidates the affected public pages immediately.

---

## Deploying (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. Add the same env vars (step 4) in **Vercel → Project → Settings →
   Environment Variables**.
3. Deploy. Middleware + ISR work out of the box on Vercel.

---

## How it works (quick reference)

- **Auth & guard:** `middleware.ts` refreshes the session and redirects
  unauthenticated visitors away from `/admin` to `/admin/login`.
- **Security:** Row Level Security lets anonymous visitors read only
  *published* rows; only authenticated (you) can read drafts and write.
- **Fallback:** if the env vars are missing, every data fetch falls back to
  `src/lib/data.ts`, so the site never breaks.
- **Storage:** the `media` bucket is public-read; only authenticated users can
  upload/delete.
