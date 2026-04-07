# Loading UI & Streaming

Next.js can show a loading skeleton the instant a user navigates to a page, before the data has been fetched. This makes your app feel instant even when the underlying data takes time.

---

## The loading.tsx file

Create a file named `loading.tsx` in any route folder:

```tsx
// app/loading.tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

That is it. Next.js automatically shows this component while the page is loading, then swaps it out with the real content when the data is ready.

You do not need to write any special code in your page. Next.js handles everything.

---

## How it works under the hood

Next.js uses React's `<Suspense>` component under the hood. When you create `loading.tsx`, Next.js generates this automatically:

```tsx
<Suspense fallback={<Loading />}>
  <Page />    {/* Your page.tsx */}
</Suspense>
```

Your page component is the "async part" that takes time. The Loading component is the "fallback" shown while waiting.

This pattern is called **streaming** — the page shell (layout, navigation) is sent to the browser immediately, and the page content streams in when it is ready.

---

## Skeleton UI

A plain "Loading..." text works but a skeleton (grey placeholder boxes that match the shape of the real content) feels much better:

```tsx
// app/blog/loading.tsx
export default function BlogLoading() {
  return (
    <div>
      {/* Skeleton that matches the real blog list layout */}
      <div style={{ height: "32px", width: "200px", background: "#e5e7eb", borderRadius: "4px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: "120px", background: "#e5e7eb", borderRadius: "8px" }} />
        ))}
      </div>
    </div>
  );
}
```

The key is to match the shape of the real content so the page does not "jump" when the data loads.

---

## Route-scoped loading

Place `loading.tsx` in the folder where you want it:

```
app/
├── loading.tsx         ← shown for all routes (fallback)
└── blog/
    ├── loading.tsx     ← shown for /blog and /blog/[slug] only
    └── [slug]/
        └── loading.tsx ← shown for /blog/[slug] only
```

The most specific one wins. You can have different loading UI for different sections.

---

## Manual Suspense boundaries

For more control, add `<Suspense>` yourself inside a page to show loading UI for just part of the page while the rest loads immediately:

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import SlowWidget from "@/components/SlowWidget";
import FastWidget from "@/components/FastWidget";

export default function DashboardPage() {
  return (
    <div>
      {/* This renders immediately — no waiting */}
      <FastWidget />

      {/* This shows a spinner while SlowWidget fetches its data */}
      <Suspense fallback={<p>Loading analytics...</p>}>
        <SlowWidget />
      </Suspense>
    </div>
  );
}
```

Without `<Suspense>`, the entire page waits for the slowest data fetch. With `<Suspense>`, fast parts appear first and slow parts load in progressively.

---

## Loading priority order

When navigating, Next.js shows content in this order:

1. **Instant**: The layout (`layout.tsx`) — navigation bar, footer
2. **Instant**: The loading skeleton (`loading.tsx`)
3. **When ready**: The actual page content with data

The user sees something useful within milliseconds, even if the data takes 2 seconds to arrive.

---

## Animation

Add a CSS animation to make skeletons feel more alive:

```tsx
// Pulsing animation (standard skeleton pattern)
<div
  style={{
    height: "20px",
    background: "#e5e7eb",
    borderRadius: "4px",
    animation: "pulse 1.5s ease-in-out infinite",
  }}
/>

<style>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
`}</style>
```

---

## Common mistake — putting a loading spinner in the page

You might be tempted to track loading state in the page itself:

```tsx
// ❌ Old pattern — unnecessary in Next.js App Router
"use client";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <PostList posts={posts} />;
}
```

The App Router way is much simpler:

```tsx
// ✅ New pattern — async Server Component + loading.tsx
export default async function BlogPage() {
  const posts = await fetchPosts(); // just await — Next.js handles the loading state
  return <PostList posts={posts} />;
}
```

Create `loading.tsx` once and all your pages get loading UI automatically.

---

## Where to see this in the demo

- `app/loading.tsx` — global loading skeleton with animated spinner
- `app/blog/loading.tsx` — blog-specific skeleton that matches the post grid layout
