# Next.js Demo App

A hands-on learning project covering the most important Next.js concepts — built for developers who are new to Next.js but have some React experience.

Every file in this project is heavily commented so you can read the code and understand what is happening and why.

---

## What you will learn

| Concept | Where to find it |
|---|---|
| File-system routing | `app/about/page.tsx`, `app/blog/page.tsx` |
| Server Components | Every `page.tsx` (they are Server Components by default) |
| Client Components | `components/Counter.tsx` |
| Dynamic routes | `app/blog/[slug]/page.tsx` |
| Nested layouts | `app/blog/layout.tsx` |
| Loading UI | `app/loading.tsx`, `app/blog/loading.tsx` |
| Error handling | `app/error.tsx`, `app/not-found.tsx` |
| API route handlers | `app/api/blog/route.ts` |
| Server Actions | `app/contact/actions.ts`, `app/contact/ContactForm.tsx` |
| Middleware | `middleware.ts` |
| Font optimization | `app/layout.tsx` (Inter via `next/font`) |
| Metadata & SEO | `app/layout.tsx`, `app/about/page.tsx`, `app/blog/[slug]/page.tsx` |
| Static generation | `generateStaticParams` in `app/blog/[slug]/page.tsx` |
| Environment variables | `.env.local.example` |

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project structure

```
nextjs-demo/
├── app/                      # All routes live here (App Router)
│   ├── layout.tsx            # Root layout — wraps every page
│   ├── page.tsx              # Home page  →  /
│   ├── loading.tsx           # Global loading skeleton
│   ├── error.tsx             # Global error boundary
│   ├── not-found.tsx         # Custom 404 page
│   ├── about/
│   │   └── page.tsx          # About page  →  /about
│   ├── blog/
│   │   ├── layout.tsx        # Blog section layout
│   │   ├── loading.tsx       # Blog-specific loading skeleton
│   │   ├── page.tsx          # Blog list  →  /blog
│   │   └── [slug]/
│   │       └── page.tsx      # Blog post  →  /blog/:slug
│   ├── contact/
│   │   ├── page.tsx          # Contact page  →  /contact
│   │   ├── ContactForm.tsx   # Client form component
│   │   └── actions.ts        # Server Actions
│   └── api/
│       └── blog/
│           └── route.ts      # API endpoint  →  /api/blog
├── components/
│   └── Counter.tsx           # Client Component with useState
├── lib/
│   └── data.ts               # Shared data utilities
├── middleware.ts             # Request middleware
├── .env.local.example        # Environment variable template
└── docs/                     # Guides for every concept
```

---

## Documentation

All guides are in the `docs/` folder, written in plain English:

1. [Getting Started](docs/01-getting-started.md)
2. [Project Structure](docs/02-project-structure.md)
3. [Routing](docs/03-routing.md)
4. [Server vs Client Components](docs/04-server-vs-client-components.md)
5. [Data Fetching](docs/05-data-fetching.md)
6. [API Routes](docs/06-api-routes.md)
7. [Metadata & SEO](docs/07-metadata-and-seo.md)
8. [Error Handling](docs/08-error-handling.md)
9. [Loading & Streaming](docs/09-loading-and-streaming.md)
10. [Server Actions](docs/10-server-actions.md)
11. [Middleware](docs/11-middleware.md)
12. [Images & Fonts](docs/12-images-and-fonts.md)
13. [Environment Variables](docs/13-environment-variables.md)

---

## Scripts

```bash
npm run dev     # Start development server with hot reload
npm run build   # Build for production
npm run start   # Run the production build locally
npm run lint    # Check code for issues
```

---

## Tech stack

- **Next.js 14** — React framework with App Router
- **React 18** — UI library
- **TypeScript** — Type safety
- **next/font** — Google Fonts optimization (Inter)
- **JSONPlaceholder** — Free fake REST API for demo data

---

## Key concepts at a glance

**Server Component** — Runs on the server. No JavaScript sent to the browser. Can read databases and secrets. Default for all `page.tsx` files.

**Client Component** — Runs in the browser. Starts with `"use client"`. Can use `useState`, `useEffect`, and event handlers.

**Server Action** — A server function called directly from a form. No API route needed.

**Middleware** — Code that runs before every request. Used for auth, redirects, and logging.
