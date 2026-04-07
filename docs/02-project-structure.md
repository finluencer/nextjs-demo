# Project Structure

Understanding where files live and why is the foundation of working with Next.js.

---

## Top-level overview

```
nextjs-demo/
├── app/               ← All routes, layouts, and API handlers
├── components/        ← Reusable React components
├── lib/               ← Shared utility functions and data helpers
├── docs/              ← This documentation
├── middleware.ts      ← Runs before every request
├── .env.local         ← Your local environment variables (not in Git)
├── .env.local.example ← Template showing what variables are needed
├── next.config.js     ← Next.js configuration
├── tsconfig.json      ← TypeScript configuration
└── package.json       ← Dependencies and scripts
```

---

## The `app/` directory

This is where all your routes live. The folder structure directly maps to URL paths.

```
app/
├── layout.tsx          → Wraps EVERY page (nav + footer live here)
├── page.tsx            → The "/" route (home page)
├── loading.tsx         → Shown while any page is loading
├── error.tsx           → Shown when any page throws an error
├── not-found.tsx       → Shown for 404 errors
│
├── about/
│   └── page.tsx        → The "/about" route
│
├── blog/
│   ├── layout.tsx      → Wraps every page under /blog
│   ├── loading.tsx     → Loading skeleton for /blog routes only
│   ├── page.tsx        → The "/blog" route (list of posts)
│   └── [slug]/
│       └── page.tsx    → The "/blog/:slug" route (single post)
│
├── contact/
│   ├── page.tsx        → The "/contact" route
│   ├── ContactForm.tsx → Client component for the form
│   └── actions.ts      → Server Actions (runs on the server)
│
└── api/
    └── blog/
        └── route.ts    → The "/api/blog" REST endpoint
```

### Special file names in `app/`

These filenames have built-in meaning in Next.js:

| File | Purpose |
|------|---------|
| `page.tsx` | Makes a folder into a public URL route |
| `layout.tsx` | Shared wrapper UI for a route and all its children |
| `loading.tsx` | Shown automatically while the page is loading |
| `error.tsx` | Shown when the page throws an unhandled error |
| `not-found.tsx` | Shown when `notFound()` is called or the URL does not exist |
| `route.ts` | Creates an API endpoint (no HTML, just JSON responses) |

---

## How URL routing works

The folder path inside `app/` becomes the URL:

| File | URL |
|------|-----|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/[slug]/page.tsx` | `/blog/anything-here` |
| `app/api/blog/route.ts` | `/api/blog` |

Square brackets like `[slug]` are **dynamic segments** — they match any value in the URL and pass it to your component as a parameter.

---

## The `components/` directory

Reusable React components that are NOT routes. They are imported by pages and layouts.

```
components/
└── Counter.tsx   ← Interactive counter (Client Component)
```

**Convention:** Put components here when they are used in more than one place, or when the file would make the `app/` folder confusing.

---

## The `lib/` directory

Helper functions, data fetching utilities, and shared types. Nothing in here creates a URL route.

```
lib/
└── data.ts   ← TypeScript types and mock data helper functions
```

---

## Configuration files

**`next.config.js`** — Customizes how Next.js behaves:
- Enable/disable features
- Configure allowed image domains
- Set up redirects or rewrites
- Enable experimental features

**`tsconfig.json`** — TypeScript settings:
- Path alias `@/*` lets you write `import { foo } from "@/lib/data"` instead of `../../lib/data`
- Strict mode catches more bugs at compile time

**`package.json`** — Lists all dependencies:
- `dependencies` — packages needed to run the app
- `devDependencies` — packages only needed during development (TypeScript types, linters)

---

## What `middleware.ts` is

A special file at the project root. It runs before every request to your app. Use it for:
- Checking authentication
- Redirecting old URLs
- Adding response headers
- Logging

See [11 — Middleware](11-middleware.md) for details.

---

## What NOT to put in `app/`

- Shared components → use `components/`
- Database code, helper functions → use `lib/`
- Static files (images, PDFs) → use `public/`

The `app/` folder is only for routing: pages, layouts, and API handlers.
