# Portfolio — Full Stack Next.js + Supabase

A full-stack personal portfolio with a content management admin dashboard, a public-facing CV Generator & Cover Letter Generator SaaS tool, blog with rich markdown editing, testimonials submission, and Supabase-based user auth — built with Next.js 16, Supabase, Tailwind CSS, and Framer Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| PDF Generation | @react-pdf/renderer |
| Markdown Editor | @uiw/react-md-editor |
| Forms | React Hook Form + Zod validation |
| Toasts | Sonner |
| Icons | Lucide React |
| Theme | next-themes (dark/light/system) |
| Deployment | Vercel (recommended) |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_jwt_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_jwt_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
GITHUB_TOKEN=your_github_personal_access_token
```

Get Supabase keys from: **Supabase Dashboard → Settings → API**

> `NEXT_PUBLIC_SITE_URL` is used by the blog share buttons, `sitemap.ts`, and `robots.ts` to generate correct absolute URLs.
> `GITHUB_TOKEN` is used to fetch public repo data for the GitHub Repos section on the homepage.

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/                    # Public-facing pages
│   │   ├── layout.tsx                 # Navbar, Footer, SplashScreen, CVPromoBanner, Toaster
│   │   ├── page.tsx                   # Home (hero, about, projects, skills, testimonials, CTA)
│   │   ├── about/                     # About page — skills, experience, education
│   │   ├── projects/                  # Projects listing + detail pages
│   │   ├── blog/                      # Blog listing + [slug] detail page
│   │   │   └── [slug]/
│   │   │       ├── page.tsx           # Blog post page (SSR, reading progress, share buttons)
│   │   │       └── blog-content.tsx   # @uiw/react-md-editor Markdown renderer
│   │   ├── services/                  # Services page (DB services + built-in tool cards)
│   │   ├── achievements/              # Achievements listing page (certifications, awards)
│   │   │   └── [id]/                  # Achievement detail page with image lightbox
│   │   ├── github/                    # GitHub repos page (fetched via GitHub API)
│   │   ├── contact/                   # Contact form → contact_submissions table
│   │   ├── testimonials/              # Public testimonials submission form
│   │   ├── cv-generator/              # CV Generator SaaS tool (auth-gated PDF export)
│   │   └── cover-letter/              # Cover Letter Generator (free PDF export)
│   │
│   ├── admin/                         # Protected admin dashboard
│   │   ├── layout.tsx                 # Sidebar nav, auth guard
│   │   ├── page.tsx                   # Dashboard overview with stats cards
│   │   ├── profile/                   # Edit name, title, bio, avatar, resume URL
│   │   │                              # "Open to Work" toggle (is_available)
│   │   ├── projects/                  # CRUD for projects (new / [id])
│   │   ├── blog/                      # Blog post management
│   │   │   ├── page.tsx               # List posts — publish/unpublish, delete
│   │   │   ├── new/page.tsx           # Create post with @uiw/react-md-editor
│   │   │   └── [id]/page.tsx          # Edit post (auto-detect tags, estimate read time)
│   │   ├── skills/                    # Manage skills with proficiency levels
│   │   ├── experience/                # Work experience timeline entries
│   │   ├── education/                 # Education entries
│   │   ├── services/                  # Custom service card entries
│   │   ├── testimonials/              # View & approve/feature testimonials
│   │   ├── achievements/              # Certifications, awards, badges
│   │   ├── team/                      # Team member profiles
│   │   ├── contact/                   # View & reply to contact form submissions
│   │   └── users/                     # CV Generator user management
│   │
│   ├── api/
│   │   ├── cv/generate/               # POST — auth-gated CV PDF generator
│   │   └── cover-letter/generate/     # POST — cover letter PDF generator (free)
│   │
│   └── auth/                          # Supabase auth callbacks
│
├── components/
│   ├── sections/                      # Page sections (Hero, AboutPreview, etc.)
│   │   ├── hero.tsx                   # Hero with "Available for work" badge (DB-driven)
│   │   ├── testimonials-section.tsx   # Testimonials grid + "Leave a Review" button
│   │   └── cv-generator-promo.tsx     # Homepage promo for CV Generator
│   ├── admin/
│   │   ├── markdown-editor.tsx        # @uiw/react-md-editor wrapper (live preview)
│   │   └── image-upload.tsx           # Supabase Storage image upload component
│   ├── blog/
│   │   ├── reading-progress.tsx       # Fixed top progress bar tracking scroll %
│   │   └── share-buttons.tsx          # X/Twitter, LinkedIn, WhatsApp, Copy Link
│   ├── shared/
│   │   ├── navbar.tsx                 # Responsive navbar with mega menu (Services dropdown)
│   │   └── custom-cursor.tsx          # Custom cursor (all pages including tools)
│   └── ui/                            # shadcn/ui components (Button, Card, Input, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client
│   │   ├── server.ts                  # Server-side Supabase client (SSR)
│   │   └── middleware.ts              # Auth session refresh
│   ├── cv-user-pdf.tsx                # @react-pdf/renderer — CV document component
│   ├── cover-letter-pdf.tsx           # @react-pdf/renderer — Cover Letter component
│   ├── blog-utils.ts                  # extractTagsFromContent, estimateReadTime
│   └── github.ts                      # GitHub API fetcher
│
└── types/
    └── database.ts                    # Supabase table types + CVFormData interfaces
```

---

## Features

### Public Frontend

#### Homepage
- Animated hero section with starfield canvas, gradient orbs, orbiting bubbles
- **"Available for work" badge** — conditionally shown based on `profiles.is_available` (admin-controlled)
- Dynamic name, title, bio, and avatar from Supabase `profiles` table
- Download Resume button (when resume URL is set)
- About preview, featured projects, skills, GitHub repos, achievements, team, testimonials
- CV Generator promo section with feature highlights

#### Blog
- Blog listing page with search, featured/standard split, tag chips, share buttons
- Blog detail page with:
  - Reading progress bar (fixed top gradient bar)
  - Share buttons (X/Twitter, LinkedIn, WhatsApp, copy link) — top and bottom
  - Rich markdown rendering via `@uiw/react-md-editor` Markdown component
  - Consistent rendering between admin preview and public display

#### Services
- DB-driven service cards from the `services` table (featured + standard)
- **Built-in tool cards** always shown at the top:
  - CV / Resume Generator — links to `/cv-generator`
  - Cover Letter Generator — links to `/cover-letter`

#### Testimonials Submission
- Public form at `/testimonials` for clients to submit reviews
- Star rating selector, name, role, company, and review text
- Submissions inserted with `is_featured: false` — pending admin approval
- Admin approves by marking as "Featured" in the admin panel
- Only `is_featured: true` testimonials appear on the homepage

#### Contact
- Contact form that saves to `contact_submissions` table
- Admin can view, mark as read, and reply via email

#### CV Generator (`/cv-generator`)
- Auth-gated (Supabase magic link sign-in)
- 2 free PDF generations, unlimited with paid account
- Sections: Personal Info, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Volunteer, References, Custom Sections
- Style panel: font family, custom accent colour (HEX picker + swatches), header alignment (Left/Center), spacing (Compact/Normal/Spacious)
- Live PDF preview with left-slide drawer
- Sample data toggle for quick testing
- Auto-save CV data to `cv_users.saved_cv_data`

#### Cover Letter Generator (`/cover-letter`)
- Free, no generation limits
- Form sections: Personal Info, Recipient, Job Details, Letter Content
- Professional A4 letterhead with accent colour theming
- Same UI pattern and live preview as CV Generator

---

### Admin Dashboard

All admin routes are protected — requires Supabase authentication.

| Section | Features |
|---|---|
| **Dashboard** | Stats cards for all content types, quick-action links |
| **Profile** | Edit name, title, bio, avatar (via Storage), resume URL; **Open to Work toggle** |
| **Blog** | Create/edit posts with live markdown editor, auto-detect tags, estimate read time, publish/unpublish |
| **Projects** | Full CRUD, thumbnail upload, tech stack, featured/published flags |
| **Skills** | Add/edit skills with categories and proficiency levels |
| **Experience** | Work history with dates, company, position, description |
| **Education** | Academic entries with grades and dates |
| **Services** | Custom service cards with features list, pricing, featured flag |
| **Testimonials** | View all (including public submissions), set `is_featured` to approve for homepage display |
| **Achievements** | Certifications, awards, credentials with images |
| **Team** | Team member profiles with social links |
| **Contact** | View contact form submissions, mark as read/unread, delete |
| **CV Users** | Manage CV Generator users — view usage, toggle paid status |

---

### Open to Work Toggle

The `profiles` table includes an `is_available` boolean column. In the admin Profile page:
- A prominent toggle card shows current availability status
- Toggling immediately updates the DB and saves without needing to submit the full form
- When `true`: the animated "Available for work" badge shows in the hero section (top badge + floating badge)
- When `false`: both badges are hidden

**Required DB migration:**
```sql
ALTER TABLE profiles ADD COLUMN is_available boolean NOT NULL DEFAULT true;
```

---

## Supabase Database Tables

| Table | Purpose |
|---|---|
| `profiles` | Name, title, bio, avatar, resume URL, **is_available** |
| `projects` | Portfolio projects with images, tech stack, links |
| `skills` | Skills with category, proficiency, order |
| `experiences` | Work history |
| `education` | Academic background |
| `services` | Custom service offerings |
| `testimonials` | Client reviews — `is_featured` controls homepage display & approval |
| `blog_posts` | Blog articles with markdown content, tags, read time |
| `achievements` | Certifications, awards, credentials |
| `team_members` | Team/collaborator profiles |
| `social_links` | Social media links |
| `contact_info` | Email, phone, location, availability text |
| `contact_submissions` | Contact form messages with `is_read` flag |
| `cv_users` | CV Generator user records, generation count, payment status |
| `cv_generations` | Log of CV generation events |

---

## Storage Buckets

Create these buckets in **Supabase Dashboard → Storage**:

| Bucket | Usage |
|---|---|
| `avatars` | Profile/team member photos |
| `projects` | Project thumbnail images |
| `blog` | Blog post thumbnail images |

Set each bucket's policy to allow **public reads** and **authenticated writes**.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin dashboard.

---

## Admin Access

The admin dashboard uses Supabase Auth. To create your admin account:

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add user** and enter your email + password
3. Navigate to `/admin` and sign in

For the CV Generator, users sign in via **magic link** (passwordless email).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy — Vercel handles Next.js SSR and API routes automatically

> The `middleware.ts` guards all `/admin` routes and refreshes Supabase Auth sessions automatically.
