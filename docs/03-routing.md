# Routing

Next.js uses the file system as the router. You create folders and files — Next.js creates the URLs automatically.

---

## Basic routing

Create a folder with a `page.tsx` file inside `app/` and you have a route.

```
app/
├── page.tsx          →  /
├── about/page.tsx    →  /about
└── blog/page.tsx     →  /blog
```

There is no router config file, no `<Route>` components, no `registerRoute()` calls. The file path **is** the route.

---

## Dynamic routes

Sometimes you need a URL where part of it changes — like `/blog/my-post-title` or `/users/42`.

Wrap the variable part in square brackets:

```
app/blog/[slug]/page.tsx   →  /blog/anything
app/users/[id]/page.tsx    →  /users/42
```

The value inside the brackets is passed to your component as `params`:

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  console.log(params.slug); // "my-post-title"
  return <h1>{params.slug}</h1>;
}
```

---

## Nested dynamic routes

You can nest dynamic segments:

```
app/shop/[category]/[product]/page.tsx  →  /shop/electronics/laptop
```

```tsx
export default function ProductPage({
  params,
}: {
  params: { category: string; product: string };
}) {
  // params.category = "electronics"
  // params.product  = "laptop"
}
```

---

## Layouts

A `layout.tsx` file wraps all pages in its folder and below. Layouts persist across navigation — they do not re-mount when the user clicks a link inside the same section.

```
app/
├── layout.tsx         ← wraps all pages (root layout)
└── blog/
    ├── layout.tsx     ← wraps /blog and /blog/[slug]
    ├── page.tsx       ← /blog
    └── [slug]/
        └── page.tsx   ← /blog/:slug
```

When you visit `/blog/my-post`, the rendering stack is:

```
app/layout.tsx         (nav + footer)
  └── app/blog/layout.tsx    (blog section header)
        └── app/blog/[slug]/page.tsx  (the actual post)
```

The root layout (`app/layout.tsx`) is required and must include `<html>` and `<body>` tags.

---

## Query parameters (searchParams)

Query parameters are the `?key=value` part of a URL.

```
/blog?page=2&limit=10
```

Access them through the `searchParams` prop on your page:

```tsx
export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page  = Number(searchParams.page  ?? "1");
  const limit = Number(searchParams.limit ?? "10");
  // ...
}
```

Unlike `params` (dynamic route segments), `searchParams` are not part of the folder structure — they come from the URL query string.

---

## Navigation between pages

Use the `<Link>` component from `next/link` for client-side navigation:

```tsx
import Link from "next/link";

// Navigates without a full page reload
<Link href="/about">About</Link>
<Link href={`/blog/${post.slug}`}>Read post</Link>
<Link href="/blog?page=2">Page 2</Link>
```

Why use `<Link>` instead of `<a>`?
- Prefetches the destination page in the background for instant navigation
- No full page reload — only the changed parts update
- Preserves scroll position and browser history

Use a plain `<a>` only for external links or links that intentionally trigger a full reload.

---

## generateStaticParams — pre-build dynamic pages

By default, dynamic routes like `/blog/[slug]` are rendered on the server when someone visits them. If you know the possible values ahead of time, you can pre-generate them at build time so they are served as fast static files.

```tsx
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

At build time, Next.js calls this function, gets the list of slugs, and generates a static HTML file for each one. Visitors get instant responses from a CDN instead of waiting for the server.

Any slug **not** in the list is still handled — it falls back to server-side rendering.

---

## Route groups

Wrap a folder name in parentheses to group routes without affecting the URL:

```
app/
├── (marketing)/
│   ├── about/page.tsx    →  /about
│   └── contact/page.tsx  →  /contact
└── (app)/
    ├── dashboard/page.tsx →  /dashboard
    └── settings/page.tsx  →  /settings
```

The `(marketing)` and `(app)` folders do not appear in the URL. Use this to organize files or apply different layouts to different groups of routes.

---

## Redirect in code

Call `redirect()` from `"next/navigation"` inside a Server Component to send the user to a different page:

```tsx
import { redirect } from "next/navigation";

export default function OldPage() {
  redirect("/new-page"); // the browser is sent to /new-page
}
```

---

## notFound — trigger 404

Call `notFound()` when a resource does not exist:

```tsx
import { notFound } from "next/navigation";

const post = await fetchPost(slug);
if (!post) notFound(); // renders app/not-found.tsx
```

---

## Summary

| Concept | Example |
|---------|---------|
| Static route | `app/about/page.tsx` → `/about` |
| Dynamic route | `app/blog/[slug]/page.tsx` → `/blog/:slug` |
| Layout | `app/blog/layout.tsx` wraps all `/blog` pages |
| Query params | `searchParams.page` from URL `?page=2` |
| Dynamic segment | `params.slug` from URL `/blog/hello` |
| Pre-build pages | `generateStaticParams()` |
| Navigate | `<Link href="/about">` |
| Redirect | `redirect("/new-url")` |
| 404 | `notFound()` |
