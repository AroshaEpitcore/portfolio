# Portfolio — Full Stack Next.js + Supabase

A full-stack personal portfolio with a content management admin dashboard, a public-facing CV Generator SaaS tool, and Supabase-based user auth — built with Next.js 16, Supabase, Tailwind CSS, and Framer Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.4 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP |
| PDF Generation | @react-pdf/renderer |
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
│   ├── (frontend)/                    # Public-facing pages
│   │   ├── layout.tsx                 # Navbar, Footer, SplashScreen, CVPromoBanner, Toaster
│   │   ├── page.tsx                   # Home (hero, about preview, projects, skills, testimonials, CTA)
│   │   ├── about/                     # About page (profile, experience, education, skills)
│   │   ├── projects/                  # Projects list + [slug] detail page
│   │   ├── services/                  # Services/offerings page
│   │   ├── blog/                      # Blog list + [slug] detail page (markdown rendered)
│   │   ├── contact/                   # Contact form page
│   │   ├── github/                    # GitHub activity page
│   │   └── cv-generator/              # CV Generator tool (auth-protected)
│   │       ├── page.tsx               # Server component — fetches auth user + cv_users record
│   │       └── cv-generator-client.tsx # Full form UI with two-column layout + style panel
│   ├── auth/                          # Public user auth pages
│   │   ├── layout.tsx                 # Adds CustomCursor to auth pages
│   │   ├── login/page.tsx             # Email/password login (redirects to ?from= param)
│   │   ├── signup/page.tsx            # Sign up with full name + email verification
│   │   └── callback/route.ts          # Supabase auth code exchange + redirect
│   ├── admin/                         # Protected admin dashboard
│   │   ├── login/                     # Admin auth login page
│   │   ├── dashboard.tsx              # Dashboard overview component
│   │   ├── projects/                  # Project CRUD (list, new, [id] edit)
│   │   ├── profile/                   # Profile management
│   │   ├── skills/                    # Skills management
│   │   ├── experience/                # Work experience management
│   │   ├── education/                 # Education / qualifications management
│   │   ├── achievements/              # Achievements & certifications CRUD (multi-image upload)
│   │   ├── services/                  # Services / offerings management
│   │   ├── testimonials/              # Testimonials CRUD
│   │   ├── blog/                      # Blog CRUD (list, new, [id] edit)
│   │   ├── social/                    # Social links management
│   │   ├── contact/                   # Contact info + submission inbox
│   │   └── cv-users/                  # CV Generator user management (mark paid / revoke)
│   ├── sitemap.ts                     # Auto-generated sitemap.xml (static + projects + blog)
│   ├── robots.ts                      # robots.txt (blocks /admin and /api)
│   └── api/
│       ├── contact/route.ts           # Contact form POST endpoint
│       ├── cv/route.ts                # GET — portfolio owner's CV PDF download
│       └── cv/generate/route.ts       # POST — user CV PDF generation (auth + generation limit)
├── components/
│   ├── admin/
│   │   ├── header.tsx                 # Admin header (real user email, logout)
│   │   ├── sidebar.tsx                # Admin nav sidebar (collapsible), includes CV Users link
│   │   ├── image-upload.tsx           # Reusable Supabase Storage image uploader
│   │   ├── stats-cards.tsx            # Dashboard stat cards
│   │   └── data-table.tsx             # Generic data table
│   ├── sections/                      # Homepage sections
│   │   ├── hero.tsx
│   │   ├── about-preview.tsx          # Includes Download CV button (portfolio owner's PDF)
│   │   ├── featured-projects.tsx
│   │   ├── skills-section.tsx
│   │   ├── achievements-section.tsx   # Certifications, awards & achievements with lightbox
│   │   ├── testimonials-section.tsx   # Client testimonials grid
│   │   └── contact-cta.tsx
│   ├── shared/
│   │   ├── navbar.tsx                 # Navbar with auth user dropdown + Login button
│   │   ├── footer.tsx
│   │   ├── splash-screen.tsx          # Animated letter-by-letter splash screen
│   │   ├── custom-cursor.tsx          # Custom cursor (disabled on /cv-generator)
│   │   ├── cv-promo-banner.tsx        # Sticky promotional banner for CV Generator
│   │   ├── theme-toggle.tsx
│   │   ├── scroll-progress.tsx
│   │   └── command-palette.tsx
│   └── ui/                            # Reusable UI primitives (Button, Input, etc.)
├── hooks/
│   └── useGSAP.ts                     # GSAP animation hooks
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client (anon key)
│   │   └── server.ts                  # Server Supabase client + service role client
│   ├── cv-pdf.tsx                     # Portfolio owner's CV — react-pdf Document component
│   ├── cv-user-pdf.tsx                # User CV Generator — ATS-optimized PDF template
│   ├── payment-config.ts              # Bank transfer details + FREE_GENERATIONS constant
│   └── utils.ts                       # cn(), formatDate(), slugify(), formatDateRange()
└── types/
    └── database.ts                    # All Supabase table types + CV generator interfaces
```

---

## Features

### Portfolio (Public)
- **Home page** — Hero, about preview, featured projects, skills, achievements, testimonials, contact CTA
- **Projects** — Searchable/filterable grid with individual detail pages
- **Blog** — Markdown-rendered articles with featured/draft system
- **About** — Experience timeline, education, skills with progress bars
- **Contact** — Form with Supabase submission storage
- **CV Download** — Portfolio owner's CV auto-generated from Supabase data as PDF (`/api/cv`)

### CV Generator (User Tool)
- Public users create an account or log in via `/auth/login` or `/auth/signup`
- Fill in a multi-section form: Personal Info, Summary, Experience, Education, Skills, Projects, Certifications
- **2 free PDF generations** per account
- After 2 uses, payment of **Rs. 250** is required (HNB bank transfer)
- Admin manually marks users as paid from `/admin/cv-users`
- **PDF is ATS-optimized** — real selectable text, standard PDF fonts (Helvetica / Times-Roman / Courier), skills as plain text with `·` separators for ATS parsing
- **Style customization** — font family selector (Modern/Classic/Technical) + 7 accent color swatches with live mini-preview, in a sticky right panel
- **Sample CV** — toggle sample data to see how the output looks before filling in your own
- Normal browser cursor on CV generator page for better form usability
- Error/success messages shown as top-right Sonner toasts (matches admin style)

### Admin Dashboard
- Protected by middleware — only authenticated Supabase users can access `/admin/*`
- Full CRUD for all content types
- **CV Users page** — view all registered CV generator users, generations used, paid status; one-click Mark Paid / Revoke buttons
- Image uploads to Supabase Storage
- Contact submission inbox with read/unread tracking

### UI/UX
- Dark/light theme toggle
- Custom animated cursor (dot + trailing ring) — disabled on CV generator page
- Staggered letter splash screen on first load
- Scroll progress indicator
- Command palette
- Promotional banner for CV Generator on all pages (dismissible, hidden on `/cv-generator` itself)
- Sonner toasts on both frontend and admin

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

### SQL 6 — Achievements Table

```sql
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT,
  description TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  credential_url TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'certification',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> `category` accepts: `certification` | `award` | `achievement`
> `images` is a `TEXT[]` array — multiple certificate/badge images per entry, displayed in a lightbox on the frontend.

---

### SQL 7 — Team Members Table

```sql
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  whatsapp_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### SQL 8 — CV Generator Tables

These two tables power the public CV Generator feature.

```sql
-- Tracks each public user who uses the CV Generator
CREATE TABLE cv_users (
  id UUID PRIMARY KEY,                        -- matches auth.users.id
  email TEXT NOT NULL,
  full_name TEXT,
  generations_used INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores each CV generation (audit log)
CREATE TABLE cv_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES cv_users(id) ON DELETE CASCADE,
  cv_data JSONB NOT NULL,                     -- full CVFormData payload
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

> `cv_users.id` must match `auth.users.id` — the row is auto-created on first generation via `upsert`.
> `cv_data` stores the complete form payload as JSONB so past CVs can be retrieved or audited.

---

### SQL 9 — Row Level Security — Public Read Policies

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
ALTER TABLE achievements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_generations       ENABLE ROW LEVEL SECURITY;

-- Public read access for frontend visitors (anon key)
CREATE POLICY "Public read profiles"      ON profiles      FOR SELECT USING (true);
CREATE POLICY "Public read skills"        ON skills        FOR SELECT USING (true);
CREATE POLICY "Public read experiences"   ON experiences   FOR SELECT USING (true);
CREATE POLICY "Public read social_links"  ON social_links  FOR SELECT USING (true);
CREATE POLICY "Public read contact_info"  ON contact_info  FOR SELECT USING (true);
CREATE POLICY "Public read education"     ON education     FOR SELECT USING (true);
CREATE POLICY "Public read services"      ON services      FOR SELECT USING (true);
CREATE POLICY "Public read testimonials"  ON testimonials  FOR SELECT USING (true);
CREATE POLICY "Public read achievements"  ON achievements  FOR SELECT USING (true);
CREATE POLICY "Public read team_members"  ON team_members  FOR SELECT USING (true);

-- Only published projects visible to public (RLS enforced)
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT USING (is_published = true);

-- Only published blog posts visible to public (RLS enforced)
CREATE POLICY "Public read published blog_posts"
  ON blog_posts FOR SELECT USING (is_published = true);

-- Anyone can submit a contact form
CREATE POLICY "Public insert contact_submissions"
  ON contact_submissions FOR INSERT WITH CHECK (true);

-- CV users can only read/write their own record
CREATE POLICY "CV user read own record"
  ON cv_users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "CV user insert own record"
  ON cv_users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "CV user update own record"
  ON cv_users FOR UPDATE USING (auth.uid() = id);

-- CV generations: user can read/insert their own
CREATE POLICY "CV user read own generations"
  ON cv_generations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "CV user insert own generation"
  ON cv_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

### SQL 10 — RLS Admin Policies (Full CRUD for Authenticated Users)

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

CREATE POLICY "Auth full access achievements"
  ON achievements FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access team_members"
  ON team_members FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admin can read/update all cv_users (to mark paid)
CREATE POLICY "Auth full access cv_users"
  ON cv_users FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access cv_generations"
  ON cv_generations FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

---

### SQL 11 — Supabase Storage Bucket (Image Uploads)

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
| category | TEXT | e.g. `Frameworks` \| `Languages` \| `Styling` \| `Tools` |
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
| price | TEXT | Free-text e.g. "Starting from Rs. 5000" or "Rs. 500/hr" |
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

### `achievements`
Certifications, awards, and achievements shown as a filterable card grid on the homepage with an image lightbox.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| title | TEXT | Achievement / certificate name |
| issuer | TEXT | Issuing organisation e.g. "Amazon Web Services" |
| description | TEXT | Brief description |
| issue_date | TEXT | `YYYY-MM-DD` format |
| expiry_date | TEXT | `YYYY-MM-DD` — null if no expiry |
| credential_url | TEXT | Link to verify the credential online |
| images | TEXT[] | Array of image URLs — multiple images per entry, displayed in lightbox |
| category | TEXT | `certification` \| `award` \| `achievement` |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

> The section auto-hides on the frontend if no achievements exist yet.

---

### `team_members`
Team member profiles (optional section).

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| name | TEXT | Full name |
| role | TEXT | Job title / role |
| bio | TEXT | Short biography |
| avatar_url | TEXT | Profile photo URL |
| linkedin_url | TEXT | LinkedIn profile URL |
| github_url | TEXT | GitHub profile URL |
| whatsapp_url | TEXT | WhatsApp link |
| is_active | BOOLEAN | Only active members are displayed |
| order_index | INTEGER | Sort order |
| created_at | TIMESTAMPTZ | Auto |

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

### `cv_users`
Tracks each public user who has used the CV Generator. One row per Supabase auth user.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK — **must match `auth.users.id`** |
| email | TEXT | User's email address |
| full_name | TEXT | From `user_metadata.full_name` at sign-up |
| generations_used | INTEGER | Incremented on each successful PDF generation |
| is_paid | BOOLEAN | Set to `true` by admin after confirming bank transfer |
| payment_reference | TEXT | Optional note added by admin when marking paid |
| paid_at | TIMESTAMPTZ | Timestamp of when admin marked as paid |
| created_at | TIMESTAMPTZ | Auto |
| updated_at | TIMESTAMPTZ | Updated on each generation |

> Row is auto-created via `upsert` when the user first generates a CV.
> Users with `generations_used >= 2` and `is_paid = false` receive an HTTP 402 response and see the payment modal.

---

### `cv_generations`
Audit log of every CV generated — stores the full form payload.

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| user_id | UUID | FK → `cv_users.id` (CASCADE delete) |
| cv_data | JSONB | Full `CVFormData` payload (personal, experience, education, skills, projects, certifications, styles) |
| generated_at | TIMESTAMPTZ | Auto |

---

## CV Generator — How It Works

```
User visits /cv-generator
       │
       ├─ Not logged in? → middleware redirects to /auth/login?from=/cv-generator
       │                    After login, redirected back to /cv-generator
       │
       └─ Logged in?
              │
              ├─ page.tsx (server) fetches cv_users record for this user
              │
              └─ cv-generator-client.tsx renders:
                     │
                     ├─ LEFT column: form sections (Personal, Summary, Experience,
                     │                              Education, Skills, Projects, Certifications)
                     │
                     └─ RIGHT column (sticky): Style panel
                                                ├─ Font family (Modern/Classic/Technical)
                                                ├─ Accent color (7 swatches)
                                                ├─ Live mini-preview
                                                └─ Download PDF button

POST /api/cv/generate
  ├─ Verify auth.getUser() → 401 "Please create an account or log in"
  ├─ Upsert cv_users record
  ├─ Check generations_used >= 2 && !is_paid → 402 (shows payment modal)
  ├─ renderToBuffer(UserCVDocument) via @react-pdf/renderer
  ├─ Increment generations_used
  ├─ Insert cv_generations record
  └─ Return PDF with Content-Disposition attachment
```

**Payment flow:**
1. User hits 2-generation limit → payment modal appears
2. Modal shows HNB bank transfer details (account, branch, amount Rs. 250)
3. User sends bank slip via WhatsApp (`0762946381`) or email (`mgaravishan@gmail.com`)
4. Admin visits `/admin/cv-users`, finds the user, clicks "Mark Paid"
5. `is_paid` set to `true` → user has unlimited generations

**ATS optimization in the PDF:**
- Real selectable text (not images) — ATS parsers can extract all content
- Built-in PDF fonts only (Helvetica / Times-Roman / Courier) — no external font loading
- Skills rendered as `Category: skill · skill · skill` plain text — ATS keyword extraction works correctly
- Standard section headings (Work Experience, Education, Technical Skills, Projects, Certifications)
- No tables or complex layouts that confuse ATS parsers

---

## Payment Configuration

Edit `src/lib/payment-config.ts` to update bank details:

```ts
export const PAYMENT_CONFIG = {
  bankName: "HNB (Hatton National Bank)",
  accountName: "M.G.Arosha Ravishan",
  accountNumber: "237020072483",
  branch: "Koggala",
  amount: 250,
  currency: "LKR",
  whatsappNumber: "94762946381",
  email: "mgaravishan@gmail.com",
};

export const FREE_GENERATIONS = 2; // Change to adjust free tier
```

---

## Supabase Storage

**Bucket name:** `portfolio` (public read)

| Upload folder | Used for | Admin page |
|---|---|---|
| `avatars/` | Profile avatar photo | `/admin/profile` |
| `projects/` | Project thumbnail images | `/admin/projects/new` and `/admin/projects/[id]` |
| `blog/` | Blog post thumbnail images | `/admin/blog/new` and `/admin/blog/[id]` |
| `achievements/` | Certificate & achievement images (multi-upload) | `/admin/achievements` |

- Component: `src/components/admin/image-upload.tsx`
- Max file size: **5MB**
- Accepted types: PNG, JPG, WebP
- Public URL format: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/portfolio/[folder]/[filename]`

---

## Auth Setup

### Admin Auth (Portfolio Owner)
1. Go to **Supabase Dashboard → Authentication → Users → Add user**
2. Enter your email and password
3. Log in at `/admin/login`
4. All `/admin/*` routes are protected by middleware

### Public User Auth (CV Generator)
- Users sign up at `/auth/signup` with full name + email
- Email verification is sent by Supabase — configure redirect URL in **Supabase Dashboard → Auth → URL Configuration**
- Add `http://localhost:3001/auth/callback` (dev) and `https://yourdomain.com/auth/callback` (prod) to the **Redirect URLs** list
- After email confirmation, users are redirected back to `/cv-generator`
- Sessions are cookie-based via `@supabase/ssr`

---

## Middleware

`middleware.ts` protects two route groups:

| Path | Protection |
|---|---|
| `/admin/*` | Redirects to `/admin/login` if no active Supabase session |
| `/cv-generator` | Redirects to `/auth/login?from=/cv-generator` if not logged in |

The middleware also refreshes Supabase auth tokens on every request (required for SSR cookie sessions).

---

## Frontend Pages

| Route | Data fetched | Description |
|---|---|---|
| `/` | profiles, projects (featured), skills, testimonials, achievements, contact_info | Homepage with all sections |
| `/about` | profiles, experiences, education, skills | Full about page |
| `/projects` | projects (`is_published=true`) | Searchable/filterable grid |
| `/projects/[slug]` | projects (`is_published=true`, by slug) | Project detail page |
| `/services` | services | Services pricing page |
| `/blog` | blog_posts (`is_published=true`) | Blog list with search, featured/standard split |
| `/blog/[slug]` | blog_posts (`is_published=true`, by slug) | Full article with markdown rendering |
| `/contact` | contact_info | Contact form |
| `/cv-generator` | cv_users (for current auth user) | CV Generator tool — auth required |
| `/auth/login` | — | Login page (redirects to `?from=` param after success) |
| `/auth/signup` | — | Sign up page with full name field |
| `/auth/callback` | — | Supabase auth code exchange route |
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
| `/admin/achievements` | `achievements` |
| `/admin/services` | `services` |
| `/admin/testimonials` | `testimonials` |
| `/admin/blog` | `blog_posts` |
| `/admin/blog/new` | `blog_posts` (INSERT) |
| `/admin/blog/[id]` | `blog_posts` (UPDATE) |
| `/admin/social` | `social_links` |
| `/admin/contact` | `contact_info` + `contact_submissions` |
| `/admin/cv-users` | `cv_users` — view all users, mark paid, revoke access |

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cv` | None | Downloads portfolio owner's CV as PDF (built from Supabase data) |
| `POST` | `/api/cv/generate` | Supabase session cookie | Generates user CV PDF — enforces generation limits, returns PDF |
| `POST` | `/api/contact` | None | Saves contact form submission to `contact_submissions` |

### `POST /api/cv/generate` — Response Codes

| Status | Meaning |
|---|---|
| `200` | PDF returned — `Content-Disposition: attachment; filename="name-cv.pdf"`, `X-Generations-Used` header |
| `401` | Not logged in — "Please create an account or log in to generate your CV." |
| `402` | Free limit reached and not paid — show payment modal |
| `500` | Server/rendering error |

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/lib/supabase/client.ts` | Browser client — uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `src/lib/supabase/server.ts` | Server client (cookie-based) + service role client |
| `src/lib/cv-pdf.tsx` | Portfolio owner's CV — react-pdf Document component (auto-built from DB) |
| `src/lib/cv-user-pdf.tsx` | User CV Generator — ATS-optimized PDF template with dynamic styles |
| `src/lib/payment-config.ts` | Bank transfer details + `FREE_GENERATIONS` constant |
| `src/types/database.ts` | All table TypeScript types + `CVFormData`, `CVStyles`, `CVUser`, `CVGeneration` |
| `src/components/admin/image-upload.tsx` | Reusable image uploader to Supabase Storage |
| `src/components/admin/sidebar.tsx` | Admin nav — add new pages here |
| `src/components/shared/navbar.tsx` | Navbar with auth user dropdown, Login button |
| `src/components/shared/cv-promo-banner.tsx` | Dismissible promo banner for CV Generator (sticky, hidden on /cv-generator) |
| `src/components/shared/custom-cursor.tsx` | Custom cursor — disabled on /cv-generator for better form UX |
| `src/components/shared/splash-screen.tsx` | Animated letter-by-letter "RAVISHAN" splash screen |
| `src/components/sections/achievements-section.tsx` | Achievements grid with category filter tabs and image lightbox (auto-hides if empty) |
| `src/components/sections/testimonials-section.tsx` | Homepage testimonials grid (auto-hides if empty) |
| `src/app/(frontend)/blog/[slug]/blog-content.tsx` | Client component that renders markdown with react-markdown |
| `src/app/sitemap.ts` | Generates `/sitemap.xml` — includes static pages + projects + blog |
| `src/app/robots.ts` | Generates `/robots.txt` — disallows /admin and /api |
| `middleware.ts` | Protects `/admin/*` and `/cv-generator`, refreshes Supabase auth session |
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
8. **Server fetch** — Add `.from("[table]").select("*")` query to the relevant frontend `page.tsx`
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
- `cv_users.id` must equal `auth.users.id` — the upsert in `/api/cv/generate` handles creation automatically on first use
- The `achievements-section.tsx` component returns `null` if the achievements array is empty — safe to leave the table empty until you add entries
- The `testimonials-section.tsx` component returns `null` if the testimonials array is empty — safe to leave the table empty
- All admin write operations use the browser Supabase client with the anon key — access is granted via RLS `auth.role() = 'authenticated'` policies, NOT the service role key
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS entirely — only used server-side in `createServiceClient()` when needed
- `NEXT_PUBLIC_SITE_URL` must be set to your production domain for `sitemap.xml` and `robots.txt` to generate correct URLs
- The custom cursor is globally set to `cursor: none` via CSS — the CV generator page restores normal cursors using the `.cv-generator-page` CSS class
- Sonner `<Toaster position="top-right" richColors closeButton />` is mounted in both the frontend layout and admin layout

---

## Seed Data — Arosha Ravishan

Run these in Supabase SQL Editor to populate education and experience.

### Education

```sql
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, is_current, grade, order_index) VALUES
  ('National Institute of Business Management (NIBM - Sri Lanka)', 'Bachelor''s Degree', 'Computer Software Engineering', '2023-03-01', NULL, true, NULL, 1),
  ('National Institute of Business Management (NIBM - Sri Lanka)', 'Higher Diploma in Software Engineering', 'Computer Science', '2021-04-01', NULL, false, NULL, 2),
  ('National Institute of Business Management (NIBM - Sri Lanka)', 'Diploma in Software Engineering', 'Computer Science', '2020-03-01', '2021-03-01', false, '3.69', 3),
  ('National Institute of Business Management (NIBM - Sri Lanka)', 'Certificate of Software Engineering', 'Computer Science', '2019-12-01', '2020-02-01', false, NULL, 4),
  ('Vidyaloka College - Galle', 'Advanced Level', 'Information Technology', '2016-08-01', '2018-05-01', false, NULL, 5);
```

### Experience

```sql
INSERT INTO experiences (company, position, description, start_date, end_date, is_current, order_index) VALUES
  ('Epitcore', 'Associate Frontend Developer', 'Full-time, on-site associate frontend developer role building and maintaining frontend applications.', '2024-08-01', NULL, true, 1),
  ('Imperial Edutech - iMET', 'Junior Frontend Developer', 'Full-time, on-site junior frontend developer. Skills: Git, Bootstrap.', '2023-07-01', '2024-08-01', false, 2),
  ('Imperial Edutech - iMET', 'Frontend Developer Intern', 'Frontend development internship. Skills: Tailwind CSS, Git, React.js.', '2023-01-01', '2023-09-01', false, 3);
```

### Social Links

```sql
INSERT INTO social_links (platform, url, order_index) VALUES
  ('GitHub', 'https://github.com/AroshaRavishan', 1),
  ('LinkedIn', 'https://www.linkedin.com/in/arosha-ravishan-89b459247/', 2),
  ('WhatsApp', 'https://wa.me/94762946381', 3);
```
