/**
 * BLOG INDEX PAGE (app/blog/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /blog
 * Type:  Async Server Component
 *
 * Key Concepts Demonstrated:
 *  - Internal API Call  : Fetch from our own /api/blog route handler
 *  - Pagination UI      : Read searchParams to drive server-side pagination
 *  - searchParams prop  : Next.js injects current URL query params
 *  - Link Component     : Next.js <Link> for client-side navigation
 *
 * 🌐 Data Source: /api/blog  →  JSONPlaceholder (free fake REST API)
 */

import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  readTimeMinutes: number;
};

type ApiResponse = {
  success: boolean;
  data: BlogPost[];
  pagination: {
    page: number; limit: number; total: number;
    totalPages: number; hasNext: boolean; hasPrev: boolean;
  };
  source: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page  = Number(searchParams.page  ?? "1");
  const limit = Number(searchParams.limit ?? "6");

  let posts: BlogPost[] = [];
  let pagination = { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false };
  let source = "";
  let fetchError = "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog?page=${page}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API responded with status ${res.status}`);
    const json: ApiResponse = await res.json();
    posts = json.data;
    pagination = json.pagination;
    source = json.source;
  } catch (err) {
    fetchError = String(err);
  }

  return (
    <div>
      <h1>📝 Blog</h1>
      <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"20px", padding:"4px 14px", marginBottom:"24px" }}>
        <span style={{ fontSize:"0.75rem", color:"#166534", fontWeight:"bold" }}>🌐 LIVE API</span>
        <span style={{ fontSize:"0.75rem", color:"#555", fontFamily:"monospace" }}>{source || "jsonplaceholder.typicode.com"}</span>
      </div>

      {fetchError && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"8px", padding:"16px", marginBottom:"24px" }}>
          <strong style={{ color:"#dc2626" }}>⚠️ Could not load posts</strong>
          <p style={{ margin:"4px 0 0", fontSize:"0.85rem", color:"#7f1d1d", fontFamily:"monospace" }}>{fetchError}</p>
          <p style={{ margin:"8px 0 0", fontSize:"0.85rem", color:"#555" }}>Make sure dev server is running and NEXT_PUBLIC_BASE_URL is set correctly.</p>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"32px" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ border:"1px solid #e0e0e0", borderRadius:"8px", padding:"20px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <span style={{ fontSize:"0.7rem", background:"#eff6ff", color:"#2563eb", padding:"2px 8px", borderRadius:"4px", fontWeight:"bold" }}>POST #{post.id}</span>
              <h3 style={{ margin:"10px 0 8px", fontSize:"1rem" }}>{post.title}</h3>
              <p style={{ color:"#666", fontSize:"0.85rem", margin:"0 0 12px", lineHeight:"1.5" }}>{post.excerpt}</p>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"0.78rem", color:"#999" }}>✍️ {post.author} · ⏱️ {post.readTimeMinutes} min read</span>
              <div style={{ display:"flex", gap:"8px" }}>
                <a href={`/api/blog?id=${post.id}`} target="_blank" rel="noreferrer"
                  style={{ fontSize:"0.75rem", color:"#888", textDecoration:"none", border:"1px solid #ddd", padding:"4px 8px", borderRadius:"4px" }}>
                  JSON
                </a>
                <Link href={`/blog/${post.slug}`}
                  style={{ background:"#0070f3", color:"#fff", padding:"4px 12px", borderRadius:"6px", textDecoration:"none", fontSize:"0.8rem" }}>
                  Read →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.total > 0 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px", background:"#f9f9f9", borderRadius:"8px" }}>
          <Link href={`/blog?page=${page-1}&limit=${limit}`}
            style={{ padding:"8px 16px", borderRadius:"6px", textDecoration:"none", background: pagination.hasPrev?"#0070f3":"#e5e7eb", color: pagination.hasPrev?"#fff":"#9ca3af", fontSize:"0.9rem" }}>
            ← Prev
          </Link>
          <span style={{ fontSize:"0.85rem", color:"#555" }}>
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> · {pagination.total} total posts
          </span>
          <Link href={`/blog?page=${page+1}&limit=${limit}`}
            style={{ padding:"8px 16px", borderRadius:"6px", textDecoration:"none", background: pagination.hasNext?"#0070f3":"#e5e7eb", color: pagination.hasNext?"#fff":"#9ca3af", fontSize:"0.9rem" }}>
            Next →
          </Link>
        </div>
      )}

      <div style={{ marginTop:"32px", background:"#1e1e2e", borderRadius:"8px", padding:"20px", fontFamily:"monospace", fontSize:"0.82rem" }}>
        <p style={{ color:"#cba6f7", margin:"0 0 10px", fontWeight:"bold" }}>🔌 Try the API directly:</p>
        {[
          ["GET all posts (default)",   "/api/blog"],
          ["GET with pagination",       "/api/blog?page=2&limit=5"],
          ["GET single post by ID",     "/api/blog?id=1"],
          ["GET posts by author",       "/api/blog?userId=3"],
          ["POST create (open console)","POST /api/blog  { title, content }"],
        ].map(([label, url]) => (
          <div key={url} style={{ marginBottom:"8px" }}>
            <span style={{ color:"#6c7086" }}># {label}</span><br />
            <span style={{ color:"#a6e3a1" }}>{url}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
