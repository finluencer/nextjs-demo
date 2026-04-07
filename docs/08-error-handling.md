# Error Handling

Next.js has a built-in system for handling errors gracefully. Instead of showing a blank page or a generic browser error, you can show a friendly message and let users recover.

---

## The three error files

| File | When it appears |
|------|----------------|
| `app/error.tsx` | Any page throws an unhandled error |
| `app/not-found.tsx` | A page calls `notFound()`, or the URL does not exist |
| `app/[route]/error.tsx` | Error scoped to a specific section only |

---

## error.tsx — catching runtime errors

Create `app/error.tsx` to catch errors from any page:

```tsx
// app/error.tsx
"use client"; // Required — error boundaries must be Client Components

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service like Sentry
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Props your component receives:**
- `error` — the Error object with `.message` and `.stack`
- `error.digest` — a server-generated ID useful for finding the error in logs
- `reset` — call this function to retry rendering the page that failed

**Why must it be a Client Component?**

React's error boundary mechanism uses `componentDidCatch` under the hood, which only works in Client Components. Next.js enforces this with a build-time error if you forget `"use client"`.

---

## not-found.tsx — custom 404 pages

Create `app/not-found.tsx` for a custom 404 page:

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>We could not find what you were looking for.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

This file does **not** need `"use client"` — it is a regular Server Component.

---

## Triggering notFound() manually

Call `notFound()` inside any page when the requested resource does not exist:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  // Post not found — show the 404 page instead of crashing
  if (!post) notFound();

  return <article>{post.title}</article>;
}
```

`notFound()` stops execution (like `throw`) and renders `not-found.tsx`.

---

## Scoping errors to a route section

You can place `error.tsx` and `not-found.tsx` inside specific route folders to scope them:

```
app/
├── error.tsx             ← catches errors everywhere
├── not-found.tsx         ← 404 for all routes
└── blog/
    ├── error.tsx         ← catches errors only in /blog routes
    └── not-found.tsx     ← 404 only for /blog routes
```

The most specific one wins. A blog post error shows `app/blog/error.tsx`. A home page error shows `app/error.tsx`.

---

## Error boundaries do NOT catch layout errors

`error.tsx` catches errors in the `page.tsx` and any components it renders. It does NOT catch errors inside `layout.tsx`.

To catch layout errors, place an `error.tsx` in the parent folder:

```
app/
├── error.tsx       ← catches errors in app/layout.tsx
└── blog/
    ├── layout.tsx  ← if this throws, app/error.tsx catches it
    └── error.tsx   ← catches errors in blog pages (NOT blog/layout.tsx)
```

---

## Handling errors in data fetching

**Option 1 — catch and show inline error:**

```tsx
export default async function BlogPage() {
  try {
    const posts = await fetchPosts();
    return <PostList posts={posts} />;
  } catch {
    // Show an inline error message — the rest of the page still works
    return <p>Could not load posts. Please try again.</p>;
  }
}
```

**Option 2 — let it bubble to error.tsx:**

```tsx
export default async function BlogPage() {
  // If this throws, error.tsx is shown for the whole page
  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}
```

Use Option 1 when only part of the page is broken and the rest should still show. Use Option 2 when the entire page depends on the data.

---

## Development vs production errors

In development (`npm run dev`):
- Next.js shows a detailed error overlay with the stack trace
- `error.tsx` is still used but the overlay appears on top

In production (`npm run build && npm run start`):
- Only your `error.tsx` is shown — no stack trace exposed to users
- Error details stay in server logs only

---

## Summary

| Situation | Solution |
|-----------|----------|
| Page throws an error | `app/error.tsx` shows, receives `error` and `reset` |
| Resource not found | Call `notFound()`, `app/not-found.tsx` shows |
| URL does not match any route | `app/not-found.tsx` shows automatically |
| Error only in a section | Place `error.tsx` in that route folder |
| Partial page error | Catch with try/catch and render inline error UI |

---

## Where to see this in the demo

- `app/error.tsx` — global error boundary with retry button
- `app/not-found.tsx` — custom 404 page with navigation options
- `app/blog/[slug]/page.tsx` — calls `notFound()` when a post ID is invalid
