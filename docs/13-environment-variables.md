# Environment Variables

Environment variables let you configure your app differently for development, staging, and production — without changing your code.

---

## Where to define them

Create a `.env.local` file at the project root:

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Never commit this file to Git.** It is in `.gitignore` by default. Use `.env.local.example` to document which variables your app needs (committed to Git, with placeholder values).

---

## Two types of variables

Next.js has a strict rule about which variables are visible where.

### NEXT_PUBLIC_ prefix — visible in the browser

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=UA-12345678
```

- Included in the JavaScript bundle sent to the browser
- Safe for: base URLs, public API keys, feature flags
- Anyone can see these by viewing page source

```tsx
// Works in BOTH Server Components and Client Components
const url = process.env.NEXT_PUBLIC_BASE_URL;
```

### No prefix — server only

```bash
DATABASE_URL=postgresql://...
EMAIL_API_KEY=re_secret_key
AUTH_SECRET=supersecretrandomstring
```

- Never included in the browser bundle
- Only accessible in: Server Components, Route Handlers, Server Actions, `middleware.ts`
- Return `undefined` if accessed in a Client Component

```tsx
// Server Component — works
const dbUrl = process.env.DATABASE_URL;

// Client Component — returns undefined (never exposed)
const dbUrl = process.env.DATABASE_URL; // ← undefined in browser
```

---

## Accessing variables in code

```tsx
// app/blog/page.tsx — Server Component
export default async function BlogPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const apiKey = process.env.EMAIL_API_KEY; // only works server-side

  const res = await fetch(`${base}/api/blog`);
  // ...
}
```

```tsx
// components/TrackingScript.tsx — Client Component
"use client";

export default function TrackingScript() {
  // NEXT_PUBLIC_ variables work in Client Components
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  // ...
}
```

---

## Multiple .env files

Next.js loads environment files in this priority order (later files override earlier ones):

| File | When loaded | Should be committed? |
|------|------------|----------------------|
| `.env` | Always | Yes (no secrets) |
| `.env.local` | Always (local override) | No |
| `.env.development` | `npm run dev` only | Yes |
| `.env.production` | `npm run build` only | Yes |
| `.env.development.local` | `npm run dev`, local override | No |
| `.env.production.local` | `npm run build`, local override | No |

For most projects, you only need:
- `.env.local` for local development secrets
- Set production values directly in your hosting provider (Vercel, Render, etc.)

---

## Setting variables in Vercel (or any host)

Do NOT put production secrets in `.env.production` and commit them. Instead:

1. Go to your project settings in Vercel
2. Find "Environment Variables"
3. Add each variable with its production value
4. Redeploy — the variables are injected at build time

Every major hosting platform has an equivalent settings page.

---

## Checking for required variables

At startup, validate that required variables exist:

```ts
// lib/env.ts — run this early in your app
if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_URL");
}

if (!process.env.AUTH_SECRET) {
  throw new Error("Missing environment variable: AUTH_SECRET");
}
```

This catches configuration errors early with a clear message instead of a cryptic failure later.

---

## The .env.local.example pattern

Keep `.env.local.example` committed to Git. It documents what variables are needed without exposing real values:

```bash
# .env.local.example — copy to .env.local and fill in real values

NEXT_PUBLIC_BASE_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@localhost:5432/mydb

EMAIL_API_KEY=your_api_key_here

AUTH_SECRET=generate_a_random_string_here
```

Onboarding a new developer:

```bash
cp .env.local.example .env.local
# then fill in the real values
```

---

## Common mistakes

**Mistake 1: Using server-only variables in Client Components**

```tsx
"use client";

// ❌ This will be undefined in the browser
const dbUrl = process.env.DATABASE_URL;
```

Pass the data as props from a Server Component instead.

**Mistake 2: Committing .env.local**

Check that `.gitignore` includes `.env.local`. Run `git status` before committing to verify it is not tracked.

**Mistake 3: Forgetting NEXT_PUBLIC_ for browser-accessible config**

```bash
# ❌ Client components cannot read this
BASE_URL=http://localhost:3000

# ✅ Client components can read this
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Mistake 4: Not restarting the dev server**

Changes to `.env.local` require restarting `npm run dev`. The terminal must be stopped and restarted — hot reload does not pick up env changes.

---

## Where to see this in the demo

- `.env.local.example` — template with every variable this project uses, with explanations
- `app/blog/page.tsx` — uses `process.env.NEXT_PUBLIC_BASE_URL` to build the API URL
- `app/blog/[slug]/page.tsx` — same pattern for the single post fetch
