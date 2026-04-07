# Data Fetching

Next.js gives you multiple ways to fetch data. Which one you use depends on when you need the data and how often it changes.

---

## The simplest way — async Server Components

The most common pattern in App Router. Just make your component `async` and `await` your data:

```tsx
// app/page.tsx — Server Component
export default async function HomePage() {
  // fetch() works natively in Node.js (Next.js polyfills it)
  const res  = await fetch("https://api.example.com/stats");
  const data = await res.json();

  return <h1>Total users: {data.users}</h1>;
}
```

This runs **on the server** when someone visits the page. The user sees the final HTML with the data already filled in — no loading spinner, no `useEffect`, no client-side JavaScript for this part.

---

## When the data runs

Next.js has three options for when data is fetched:

### 1. Static (at build time)

Fetch once when you run `npm run build`. The result is cached forever (until the next build).

```tsx
const res = await fetch("https://api.example.com/config");
// No cache option needed — static is the default for fetch in Next.js
```

Use this for: marketing pages, blog posts that rarely change, product listings.

### 2. Dynamic (on every request)

Fetch fresh data every single time someone visits the page.

```tsx
const res = await fetch("https://api.example.com/orders", {
  cache: "no-store", // Always fetch fresh, never cache
});
```

Use this for: dashboards, real-time data, user-specific content.

### 3. Revalidated (time-based)

Fetch fresh data every N seconds. Serves cached data until it expires.

```tsx
const res = await fetch("https://api.example.com/posts", {
  next: { revalidate: 60 }, // Re-fetch at most once every 60 seconds
});
```

Use this for: news feeds, product prices, anything that changes occasionally.

---

## Multiple fetches in one page

You can fetch multiple data sources in the same Server Component:

```tsx
export default async function DashboardPage() {
  // These two fetches run IN PARALLEL (Promise.all)
  const [users, orders] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/orders").then(r => r.json()),
  ]);

  return (
    <div>
      <p>Users: {users.total}</p>
      <p>Orders: {orders.total}</p>
    </div>
  );
}
```

Use `Promise.all()` when the fetches do not depend on each other — they run at the same time and the total wait is only as long as the slowest one.

---

## Fetching in Client Components

Client Components cannot use `async/await` directly. Use `useEffect` with `useState`:

```tsx
"use client";

import { useState, useEffect } from "react";

export default function LiveScore() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      const res  = await fetch("/api/score");
      const data = await res.json();
      setScore(data.score);
    };

    fetchScore();
    const interval = setInterval(fetchScore, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  if (score === null) return <p>Loading...</p>;
  return <p>Score: {score}</p>;
}
```

This is more complex and slower (the user sees a loading state) — prefer Server Components whenever possible.

---

## Fetching from your own API route

Your Next.js app can have its own API routes (see [06 — API Routes](06-api-routes.md)). When a Server Component needs to call one:

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res  = await fetch(`${base}/api/blog?page=1`);
  const data = await res.json();
  // ...
}
```

You need the full URL (not `/api/blog`) because Server Components run on the server, not in the browser, so relative URLs do not work.

---

## Data utilities in `lib/`

For complex data fetching, extract the logic into a function in `lib/`:

```tsx
// lib/data.ts
export async function getPosts(page: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
```

```tsx
// app/blog/page.tsx
import { getPosts } from "@/lib/data";

export default async function BlogPage() {
  const data = await getPosts(1);
  // ...
}
```

This keeps pages clean and makes the data fetching logic reusable and testable.

---

## Handling errors

Always handle the case where the fetch fails:

```tsx
export default async function BlogPage() {
  try {
    const res = await fetch("https://api.example.com/posts");
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const posts = await res.json();
    return <PostList posts={posts} />;
  } catch (error) {
    // Show a friendly message instead of crashing the page
    return <p>Could not load posts. Please try again later.</p>;
  }
}
```

Or let the error bubble up to `error.tsx` by not catching it — Next.js will show your error boundary automatically.

---

## Summary

| Scenario | How to fetch |
|----------|-------------|
| Data needed at render time | `async/await` in Server Component |
| Data that never changes | Default `fetch()` (cached at build) |
| Data that changes often | `fetch()` with `cache: "no-store"` |
| Data that changes occasionally | `fetch()` with `next: { revalidate: 60 }` |
| Multiple independent fetches | `Promise.all([fetch1, fetch2])` |
| Interactive / real-time | `useEffect` in Client Component |

---

## Where to see this in the demo

- `app/page.tsx` — async Server Component with a simulated async fetch
- `app/blog/page.tsx` — fetching from the internal `/api/blog` route with `cache: "no-store"`
- `app/blog/[slug]/page.tsx` — fetching a single post by ID from the API
- `lib/data.ts` — reusable data helper functions
