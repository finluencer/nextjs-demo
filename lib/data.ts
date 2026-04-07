/**
 * DATA UTILITY LAYER (lib/data.ts)
 * ─────────────────────────────────────────────────────────────────────────────
 * A shared module for data-fetching functions used across multiple pages.
 *
 * Key Concepts Demonstrated:
 *  - Server-only module  : No "use client" → safe to use secrets/DB here
 *  - Reusable fetchers   : Import into any Server Component
 *  - TypeScript types    : Strongly typed return values for safety
 *  - Simulated async     : setTimeout mimics real DB / API latency
 *
 * In a real application you would replace the mock data with:
 *   - A database query:  const posts = await db.post.findMany()
 *   - An API call:       const res = await fetch("https://api.example.com/posts")
 *   - A CMS SDK:         const posts = await contentful.getEntries(...)
 *
 * ⚠️  This file CANNOT be imported by Client Components because it would
 *     expose server secrets. Use Next.js `server-only` package to enforce this.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
// Defining types here keeps the shape consistent wherever data is used.
export type Post = {
  slug: string;       // URL-safe identifier, e.g. "getting-started"
  title: string;      // Full display title
  excerpt: string;    // Short preview (used on the blog index)
  content: string;    // Full body (used on the individual post page)
  date: string;       // Formatted display date
  author: string;     // Author name
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace this with your real data source (DB, API, CMS, file system, etc.)
const POSTS: Post[] = [
  {
    slug: "getting-started",
    title: "Getting Started with Next.js",
    excerpt: "Everything you need to know to bootstrap your first Next.js project.",
    date: "March 15, 2025",
    author: "Demo Author",
    content: `Next.js is a React framework that gives you building blocks to create web applications.

By framework, it means Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.

The App Router (introduced in Next.js 13) is the recommended way to build applications. It supports Server Components, streaming, nested layouts, and more.

To create your first project, run: npx create-next-app@latest my-app

Then navigate into the folder and run npm run dev to start the development server on localhost:3000.`,
  },
  {
    slug: "server-components",
    title: "Understanding Server Components",
    excerpt: "How Server Components eliminate unnecessary JavaScript from the browser.",
    date: "March 22, 2025",
    author: "Demo Author",
    content: `React Server Components (RSC) are a new paradigm that lets you render components on the server.

Before RSC, every React component was a client component — the browser downloaded all the component code, ran it, and built the UI. This works fine but has a cost: JavaScript bundle size grows with your app.

Server Components flip this model. They render on the server and send only HTML to the browser. No component code is downloaded, no hydration happens, and the user sees the UI faster.

The key insight: most UI does not need interactivity. A blog post, a product listing, a dashboard card — these just display data. Server Components are perfect for them.

Use Client Components only when you need: useState, useEffect, browser APIs, or event listeners.`,
  },
  {
    slug: "dynamic-routing",
    title: "Dynamic Routing Explained",
    excerpt: "How [slug] and [...catchAll] segments work in the App Router.",
    date: "March 29, 2025",
    author: "Demo Author",
    content: `Dynamic routing lets one file handle many URLs. Instead of creating a separate file for every blog post, you create one file: app/blog/[slug]/page.tsx.

The square brackets tell Next.js: "this part of the URL can be anything." When a user visits /blog/my-post, Next.js passes { slug: "my-post" } to your page as the params prop.

You can have multiple dynamic segments: app/shop/[category]/[productId]/page.tsx handles /shop/electronics/iphone-15.

Catch-all segments use three dots: app/docs/[...path]/page.tsx matches /docs/one, /docs/one/two, and /docs/one/two/three — params.path becomes an array.

Optional catch-all [[...path]] also matches the segment-less route itself.`,
  },
];

// ─── getPosts ─────────────────────────────────────────────────────────────────
// Returns all posts — used by the blog index page (/blog).
// The `async` + `await` pattern here represents what a real DB call looks like.
export async function getPosts(): Promise<Post[]> {
  // Simulate network/DB latency (remove in production)
  await new Promise((resolve) => setTimeout(resolve, 50));
  return POSTS;
}

// ─── getPostBySlug ────────────────────────────────────────────────────────────
// Returns a single post by slug — used by the dynamic post page (/blog/[slug]).
// Returns `undefined` if not found; the page then calls notFound().
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return POSTS.find((post) => post.slug === slug);
}
