/**
 * DYNAMIC BLOG POST PAGE (app/blog/[slug]/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /blog/:slug  (e.g. /blog/1-sunt-aut-facere-repellat-provident)
 * Type:  Async Server Component with Dynamic Segment
 *
 * Key Concepts Demonstrated:
 *  - Dynamic Segments    : [slug] captures any URL value as params.slug
 *  - API Route Fetch     : Calls our /api/blog?id= route handler
 *  - Dynamic Metadata    : generateMetadata receives params to build <title>
 *  - notFound()          : Returns 404 when the API says post doesn't exist
 *
 * The slug format is: "{id}-{title-words}"  e.g. "5-nesciunt-quas-odio"
 * We extract the numeric ID from the start of the slug to query the API.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";

type BlogPost = {
  id: number; title: string; content: string;
  author: string; slug: string; readTimeMinutes: number;
};

// ─── Fetch helper ─────────────────────────────────────────────────────────────
async function fetchPost(slug: string): Promise<BlogPost | null> {
  // Extract the numeric ID from the slug prefix (e.g. "5-nesciunt..." → 5)
  const id = parseInt(slug.split("-")[0], 10);
  if (isNaN(id)) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog?id=${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── generateStaticParams ────────────────────────────────────────────────────
// Pre-generate a fixed list of slugs at BUILD TIME so these pages are served
// as static HTML (faster, no server compute per request).
//
// How it works:
//   1. At build time, Next.js calls this function
//   2. It returns an array of { slug } objects
//   3. Next.js renders each slug as a static HTML file
//   4. Requests for these slugs are served instantly from CDN
//   5. Any slug NOT in this list is rendered on demand (dynamic fallback)
//
// Without generateStaticParams: every /blog/[slug] request hits the server.
// With generateStaticParams:    known slugs are pre-built static files.
export async function generateStaticParams() {
  try {
    // Fetch the first page of posts to pre-generate those slugs
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
    if (!res.ok) return [];

    const posts: Array<{ id: number; title: string }> = await res.json();

    // Build slugs in the same format our app uses: "{id}-{title-words}"
    return posts.map((post) => ({
      slug: `${post.id}-${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
    }));
  } catch {
    // If the fetch fails at build time, return an empty array.
    // All slugs will be rendered on demand instead.
    return [];
  }
}

// ─── Dynamic Metadata ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return { title: `${post.title} | Blog`, description: post.content.slice(0, 120) };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  if (!post) notFound();

  return (
    <article style={{ maxWidth:"700px" }}>
      <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:"24px" }}>
        <a href="/blog" style={{ color:"#0070f3" }}>← Back to Blog</a>
      </p>

      <div style={{ display:"inline-flex", gap:"8px", marginBottom:"16px", alignItems:"center" }}>
        <span style={{ background:"#eff6ff", color:"#2563eb", fontSize:"0.75rem", padding:"2px 10px", borderRadius:"4px", fontWeight:"bold" }}>
          POST #{post.id}
        </span>
        <span style={{ color:"#888", fontSize:"0.8rem" }}>⏱️ {post.readTimeMinutes} min read · ✍️ {post.author}</span>
      </div>

      <h1 style={{ fontSize:"2rem", marginBottom:"24px" }}>{post.title}</h1>

      <div style={{ lineHeight:"1.9", color:"#333" }}>
        {post.content.split(". ").map((sentence, i) => (
          <p key={i} style={{ marginBottom:"12px" }}>{sentence}.</p>
        ))}
      </div>

      {/* Debug box — shows exactly what the API returned */}
      <div style={{ background:"#1e1e2e", borderRadius:"8px", padding:"16px", marginTop:"40px", fontFamily:"monospace", fontSize:"0.8rem" }}>
        <p style={{ color:"#cba6f7", margin:"0 0 8px", fontWeight:"bold" }}>🔌 API call that powered this page:</p>
        <span style={{ color:"#a6e3a1" }}>GET /api/blog?id={post.id}</span>
        <p style={{ color:"#6c7086", margin:"8px 0 0", fontSize:"0.75rem" }}>
          params.slug = "{params.slug}" → extracted id = {post.id}
        </p>
      </div>
    </article>
  );
}
