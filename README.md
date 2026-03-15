# Portfolio — Full Stack Next.js + Supabase

A full-stack personal portfolio with a content management admin dashboard, built with Next.js 16, Supabase, Tailwind CSS, and Framer Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.4 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP, Lenis (smooth scroll) |
| Forms | React Hook Form + Zod validation |
| Toasts | Sonner |
| Icons | Lucide React |
| Theme | next-themes (dark/light) |
| Blog Rendering | react-markdown |
| Deployment | Vercel (recommended) |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_jwt_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_jwt_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Get these from: **Supabase Dashboard → Settings → API**

> `NEXT_PUBLIC_SITE_URL` is used by `sitemap.ts` and `robots.ts` to generate correct absolute URLs.

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/               # Public-facing pages
│   │   ├── page.tsx              # Home (hero, about preview, projects, skills, testimonials, CTA)
│   │   ├── about/                # About page (profile, experience, education, skills)
│   │   ├── projects/             # Projects list + [slug] detail page
│   │   ├── services/             # Services/offerings page
│   │   ├── blog/                 # Blog list + [slug] detail page (markdown rendered)
│   │   └── contact/              # Contact form page
│   ├── admin/                    # Protected admin dashboard
│   │   ├── login/                # Auth login page
│   │   ├── dashboard.tsx         # Dashboard overview component
│   │   ├── projects/             # Project CRUD (list, new, [id] edit)
│   │   ├── profile/              # Profile management
│   │   ├── skills/               # Skills management
│   │   ├── experience/           # Work experience management
│   │   ├── education/            # Education / qualifications management
│   │   ├── services/             # Services / offerings management
│   │   ├── testimonials/         # Testimonials CRUD
│   │   ├── blog/                 # Blog CRUD (list, new, [id] edit)
│   │   ├── social/               # Social links management
│   │   └── contact/              # Contact info + submission inbox
│   ├── sitemap.ts                # Auto-generated sitemap.xml (static + projects + blog)
│   ├── robots.ts                 # robots.txt (blocks /admin and /api)
│   └── api/
│       └── contact/route.ts      # Contact form POST endpoint
├── components/
│   ├── admin/
│   │   ├── header.tsx            # Admin header (real user email, logout)
│   │   ├── sidebar.tsx           # Admin nav sidebar (collapsible)
│   │   ├── image-upload.tsx      # Reusable Supabase Storage image uploader
│   │   ├── stats-cards.tsx       # Dashboard stat cards
│   │   └── data-table.tsx        # Generic data table
│   ├── sections/                 # Homepage sections
│   │   ├── hero.tsx
│   │   ├── about-preview.tsx
│   │   ├── featured-projects.tsx
│   │   ├── skills-section.tsx
│   │   ├── testimonials-section.tsx  # Client testimonials grid
│   │   └── contact-cta.tsx
│   ├── shared/                   # Navbar, Footer, ThemeToggle, Providers
│   └── ui/                       # Reusable UI primitives
├── hooks/
│   └── useGSAP.ts                # GSAP animation hooks
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (anon key)
│   │   └── server.ts             # Server Supabase client + service role client
│   └── utils.ts                  # cn(), formatDate(), slugify(), formatDateRange()
└── types/
    └── database.ts               # All Supabase table types + convenience exports
```

---

## Database Setup

Run each SQL block in **Supabase Dashboard → SQL Editor** in order.

---

### SQL 1 — Core Tables

```sql
-- Profiles: portfolio owner info (single row)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills: technical skills by category
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  proficiency INTEGER DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work experience
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  long_description TEXT,
  thumbnail_url TEXT,
  images TEXT[],
  tech_stack TEXT[],
  live_url TEXT,
  github_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media links
CREATE TABLE social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact display info (single row)
CREATE TABLE contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  location TEXT,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions from visitors
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed required single-row tables
INSERT INTO profiles (name, title, bio)
VALUES ('Your Name', 'Your Title', 'Your bio here');

INSERT INTO contact_info (email, location, availability)
VALUES ('your@email.com', 'Your City', 'Open to work');
```

---

### SQL 2 — Education Table

```sql
CREATE TABLE education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  grade TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### SQL 3 — Services Table

```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price TEXT,
  features TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### SQL 4 — Testimonials Table

```sql
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### SQL 5 — Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  read_time INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### SQL 6 — Row Level Security — Public Read Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills               ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences          ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE education            ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts           ENABLE ROW LEVEL SECURITY;

-- Public read access for frontend visitors (anon key)
CREATE POLICY "Public read profiles"     ON profiles     FOR SELECT USING (true);
CREATE POLICY "Public read skills"       ON skills       FOR SELECT USING (true);
CREATE POLICY "Public read experiences"  ON experiences  FOR SELECT USING (true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public read contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Public read education"    ON education    FOR SELECT USING (true);
CREATE POLICY "Public read services"     ON services     FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- Only published projects visible to public (RLS enforced)
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT USING (is_published = true);

-- Only published blog posts visible to public (RLS enforced)
CREATE POLICY "Public read published blog_posts"
  ON blog_posts FOR SELECT USING (is_published = true);

-- Anyone can submit a contact form
CREATE POLICY "Public insert contact_submissions"
  ON contact_submissions FOR INSERT WITH CHECK (true);
```

---

### SQL 7 — RLS Admin Policies (Full CRUD for Authenticated Users)

```sql
CREATE POLICY "Auth full access profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access experiences"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access social_links"
  ON social_links FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access contact_info"
  ON contact_info FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access contact_submissions"
  ON contact_submissions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access education"
  ON education FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access blog_posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

### SQL 8 — Supabase Storage Bucket (Image Uploads)

```sql
-- Create public storage bucket named 'portfolio'
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

-- Public can view/download files
CREATE POLICY "Public read portfolio storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Authenticated admin can upload files
CREATE POLICY "Auth upload portfolio storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio');

-- Authenticated admin can replace/update files
CREATE POLICY "Auth update portfolio storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio');

-- Authenticated admin can delete files
CREATE POLICY "Auth delete portfolio storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio');
```

---

## Database Table Reference

### `profiles` — Single Row
Portfolio owner's personal info. Always **update**, never insert a second row.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| name | TEXT | Full name |
| title | TEXT | Job title / headline |
| bio | TEXT | About me paragraph(s) |
| avatar_url | TEXT | Profile photo URL — uploaded to `portfolio` bucket `avatars/` folder |
| resume_url | TEXT | Link to PDF resume |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Set on save |

---

### `skills`
Technical skills grouped by category, displayed as a grid on the About page.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| name | TEXT | e.g. "React" |
| category | TEXT | e.g. `Frameworks` \| `Languages` \| `Styling` \| `CMS` \| `Tools` |
| icon | TEXT | Simple Icons name e.g. `SiReact`, `SiNextdotjs` |
| proficiency | INTEGER | 0–100, renders as animated progress bar |
| order_index | INTEGER | Sort order within category group |
| created_at | TIMESTAMPTZ | Auto |

---

### `experiences`
Work history shown as an alternating timeline on the About page.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| company | TEXT | Company name |
| position | TEXT | Job title |
| description | TEXT | Role responsibilities / achievements |
| start_date | TEXT | `YYYY-MM-DD` format |
| end_date | TEXT | `YYYY-MM-DD` — null if `is_current = true` |
| is_current | BOOLEAN | Shows animated "Current" badge |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

---

### `projects`
Portfolio work shown on the Projects page with individual detail pages.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| title | TEXT | Project name |
| slug | TEXT | **Unique** — URL path: `/projects/[slug]` |
| short_description | TEXT | Card preview text |
| long_description | TEXT | Detail page body (Markdown supported) |
| thumbnail_url | TEXT | Cover image — uploaded to `portfolio` bucket `projects/` folder |
| images | TEXT[] | Gallery images array for detail page |
| tech_stack | TEXT[] | e.g. `["React","Node.js","PostgreSQL"]` |
| live_url | TEXT | Live demo link |
| github_url | TEXT | GitHub repo link |
| is_featured | BOOLEAN | Shows in homepage featured section |
| is_published | BOOLEAN | **Controls public visibility** — RLS hides unpublished from public |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Set on save |

> `is_published = false` projects are completely invisible to public visitors even if the URL is known directly.

---

### `education`
Academic qualifications shown as a timeline on the About page.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| institution | TEXT | University / school / college name |
| degree | TEXT | e.g. "Bachelor of Science", "HND" |
| field_of_study | TEXT | e.g. "Computer Science" |
| description | TEXT | Coursework, achievements, activities |
| start_date | TEXT | `YYYY-MM-DD` format |
| end_date | TEXT | Null if `is_current = true` |
| is_current | BOOLEAN | Shows animated "Studying" badge |
| grade | TEXT | e.g. "First Class Honors", "3.9 GPA" |
| logo_url | TEXT | Institution logo URL |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

---

### `services`
Freelance service offerings shown on the `/services` page.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| title | TEXT | Service name e.g. "Web Development" |
| description | TEXT | What the service covers |
| icon | TEXT | Lucide icon name (optional) |
| price | TEXT | Free-text e.g. "Starting from £500" or "£50/hr" |
| features | TEXT[] | Bullet list of what's included |
| is_featured | BOOLEAN | Highlighted prominently at top of page |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

> `features` is entered in admin as one feature per line — saved as a TEXT array.

---

### `testimonials`
Client reviews and feedback shown as a grid on the homepage.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| name | TEXT | Client's full name |
| role | TEXT | Client's job title e.g. "CEO" |
| company | TEXT | Client's company name |
| avatar_url | TEXT | Client photo URL (optional) |
| content | TEXT | The testimonial text |
| rating | INTEGER | 1–5 star rating, renders as star icons |
| is_featured | BOOLEAN | Featured testimonials shown more prominently |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

> The testimonials section on the homepage auto-hides if no testimonials exist yet.

---

### `blog_posts`
Articles written by the portfolio owner. Shown on `/blog` and `/blog/[slug]`.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| title | TEXT | Article title |
| slug | TEXT | **Unique** — URL path: `/blog/[slug]` (auto-filled from title in admin) |
| excerpt | TEXT | Short summary shown on the blog list card |
| content | TEXT | Full article body — **Markdown supported**, rendered with react-markdown |
| thumbnail_url | TEXT | Cover image — uploaded to `portfolio` bucket `blog/` folder |
| tags | TEXT[] | e.g. `["Next.js","Tutorial","React"]` — comma-separated in admin |
| is_published | BOOLEAN | **Controls public visibility** — RLS hides drafts from public |
| is_featured | BOOLEAN | Featured posts shown at top with larger card |
| read_time | INTEGER | Estimated read time in minutes (shown on card and detail page) |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Set on save |

> `is_published = false` blog posts are completely invisible to public visitors. Use drafts to work in progress.

---

### `social_links`
Social media profiles shown in the navbar/footer.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| platform | TEXT | e.g. "GitHub", "LinkedIn", "Twitter" |
| url | TEXT | Full profile URL |
| icon | TEXT | `github` \| `linkedin` \| `twitter` — auto-detected from platform if left blank |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

---

### `contact_info` — Single Row
Contact details displayed on the Contact page. Always **update**, never insert a second row.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| email | TEXT | Public contact email |
| phone | TEXT | Public phone number |
| location | TEXT | e.g. "Colombo, Sri Lanka" |
| availability | TEXT | e.g. "Available for freelance projects" |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Set on save |

---

### `contact_submissions`
Visitor messages sent through the contact form. Managed from `/admin/contact`.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| name | TEXT | Sender's name |
| email | TEXT | Sender's email |
| subject | TEXT | Message subject |
| message | TEXT | Full message body |
| is_read | BOOLEAN | Default `false` — toggled to `true` in admin |
| created_at | TIMESTAMPTZ | Sorted newest-first in admin |

---

## Supabase Storage

**Bucket name:** `portfolio` (public read)

| Upload folder | Used for | Admin page |
|---|---|---|
| `avatars/` | Profile avatar photo | `/admin/profile` |
| `projects/` | Project thumbnail images | `/admin/projects/new` and `/admin/projects/[id]` |
| `blog/` | Blog post thumbnail images | `/admin/blog/new` and `/admin/blog/[id]` |

- Component: `src/components/admin/image-upload.tsx`
- Max file size: **5MB**
- Accepted types: PNG, JPG, WebP
- Public URL format: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/portfolio/[folder]/[filename]`

---

## Admin Auth

1. Go to **Supabase Dashboard → Authentication → Users → Add user**
2. Enter your email and password
3. Log in at `/admin/login`
4. All `/admin/*` routes are protected by `middleware.ts`

---

## Frontend Pages

| Route | Data fetched | Description |
|---|---|---|
| `/` | profiles, projects (featured), skills, testimonials, contact_info | Homepage with all sections |
| `/about` | profiles, experiences, education, skills | Full about page |
| `/projects` | projects (`is_published=true`) | Searchable/filterable grid |
| `/projects/[slug]` | projects (`is_published=true`, by slug) | Project detail page |
| `/services` | services | Services pricing page |
| `/blog` | blog_posts (`is_published=true`) | Blog list with search, featured/standard split |
| `/blog/[slug]` | blog_posts (`is_published=true`, by slug) | Full article with markdown rendering |
| `/contact` | contact_info | Contact form |
| `/sitemap.xml` | projects + blog_posts (published) | Auto-generated sitemap |
| `/robots.txt` | — | Blocks /admin and /api, links to sitemap |

---

## Admin Pages

| Route | Tables managed |
|---|---|
| `/admin` | Stats from all tables |
| `/admin/profile` | `profiles` |
| `/admin/projects` | `projects` |
| `/admin/projects/new` | `projects` (INSERT) |
| `/admin/projects/[id]` | `projects` (UPDATE) |
| `/admin/skills` | `skills` |
| `/admin/experience` | `experiences` |
| `/admin/education` | `education` |
| `/admin/services` | `services` |
| `/admin/testimonials` | `testimonials` |
| `/admin/blog` | `blog_posts` |
| `/admin/blog/new` | `blog_posts` (INSERT) |
| `/admin/blog/[id]` | `blog_posts` (UPDATE) |
| `/admin/social` | `social_links` |
| `/admin/contact` | `contact_info` + `contact_submissions` |

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/lib/supabase/client.ts` | Browser client — uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `src/lib/supabase/server.ts` | Server client (cookie-based) + service role client |
| `src/types/database.ts` | All table TypeScript types, exported as named types |
| `src/components/admin/image-upload.tsx` | Reusable image uploader to Supabase Storage |
| `src/components/admin/sidebar.tsx` | Admin nav — add new pages here |
| `src/components/sections/testimonials-section.tsx` | Homepage testimonials grid (auto-hides if empty) |
| `src/app/(frontend)/blog/[slug]/blog-content.tsx` | Client component that renders markdown with react-markdown |
| `src/app/sitemap.ts` | Generates `/sitemap.xml` — includes static pages + projects + blog |
| `src/app/robots.ts` | Generates `/robots.txt` — disallows /admin and /api |
| `middleware.ts` | Protects `/admin/*`, refreshes Supabase auth session |
| `next.config.ts` | Allows `*.supabase.co` images via Next.js `<Image>` |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build
```

---

## Adding a New Content Type (Checklist)

When you need to add a new table/section in future:

1. **SQL** — Write `CREATE TABLE` in Supabase SQL Editor
2. **SQL** — `ALTER TABLE x ENABLE ROW LEVEL SECURITY`
3. **SQL** — Add public read policy + authenticated full access policy
4. **Types** — Add table definition inside `Database` interface in `src/types/database.ts`
5. **Types** — Export convenience type at bottom of `database.ts`
6. **Admin page** — Create `src/app/admin/[name]/page.tsx` (follow existing pattern: stats bar → inline form → grid cards → sonner toasts)
7. **Sidebar** — Add route + Lucide icon to `navItems` in `src/components/admin/sidebar.tsx`
8. **Server fetch** — Add `.from("[table]").select("*")` query to the relevant frontend `page.tsx` `getData()` function
9. **Frontend component** — Add/update the frontend section or page to display the data
10. **Navbar** — Add route to `navItems` in `src/components/shared/navbar.tsx` if it needs a top-level nav link
11. **README** — Update this file with the new table SQL, table reference docs, and page maps

---

## Important Notes

- `order_index` on all list tables controls display order — **lower number = displayed first**
- `profiles` and `contact_info` are **single-row tables** — always update the existing row, never insert a second one
- `is_published` on `projects` and `blog_posts` is enforced by RLS — unpublished records are completely invisible to public visitors even if the URL is known
- Dates in `experiences` and `education` are stored as `TEXT` (`YYYY-MM-DD`) and formatted client-side with `formatDateRange()` from `src/lib/utils.ts`
- `features` (services), `tech_stack` (projects), and `tags` (blog_posts) are PostgreSQL `TEXT[]` arrays — entered in admin as comma-separated text and split on save
- Blog `content` is stored as plain Markdown and rendered on the frontend with `react-markdown` inside `blog-content.tsx`
- The `testimonials-section.tsx` component returns `null` if the testimonials array is empty — safe to leave the table empty
- All admin write operations use the browser Supabase client with the anon key — access is granted via RLS `auth.role() = 'authenticated'` policies, NOT the service role key
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS entirely — only used server-side in `createServiceClient()` when needed
- `NEXT_PUBLIC_SITE_URL` must be set to your production domain for `sitemap.xml` and `robots.txt` to generate correct URLs
