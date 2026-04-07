/**
 * BLOG API ROUTE (app/api/blog/route.ts)
 * ─────────────────────────────────────────────────────────────────────────────
 * URL:  GET /api/blog          → returns all posts (paginated)
 * URL:  GET /api/blog?id=1     → returns a single post by ID
 *
 * Key Concepts Demonstrated:
 *  - Route Handlers     : `route.ts` inside any app/ folder = REST endpoint
 *  - NextResponse       : Next.js helper to return JSON responses
 *  - Request object     : Read URL params, headers, body from the request
 *  - External API Proxy : Fetch from JSONPlaceholder and relay to the client
 *  - Error Handling     : Return proper HTTP status codes on failure
 *
 * 🌐 Free API Used: JSONPlaceholder (https://jsonplaceholder.typicode.com)
 *    - Completely free, no API key needed
 *    - Returns realistic fake blog post data (100 posts)
 *    - Perfect for demos and prototyping
 *
 * 📂 File Name Rule:
 *    The file MUST be named `route.ts` (not page.tsx).
 *    A folder cannot have both a page.tsx and a route.ts — one or the other.
 */

import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────
// Shape of a post returned by JSONPlaceholder
type ExternalPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Shape we return to our frontend (we reshape/enrich the external data)
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;         // first 100 chars of body
  content: string;         // full body
  author: string;          // derived from userId
  slug: string;            // URL-safe slug built from id + title
  readTimeMinutes: number; // estimated read time
};

// ─── Helper: Transform external post → our BlogPost shape ─────────────────────
function transformPost(post: ExternalPost): BlogPost {
  const words = post.body.split(" ").length;
  return {
    id: post.id,
    title: capitalise(post.title),
    excerpt: post.body.slice(0, 100) + "…",
    content: post.body,
    author: `Author ${post.userId}`,           // JSONPlaceholder has userId 1-10
    slug: `${post.id}-${post.title.replace(/\s+/g, "-").slice(0, 30)}`,
    readTimeMinutes: Math.max(1, Math.round(words / 200)), // ~200 wpm
  };
}

function capitalise(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── GET Handler ──────────────────────────────────────────────────────────────
// Next.js calls this when a GET request hits /api/blog
// Export named functions for each HTTP method: GET, POST, PUT, DELETE, PATCH
export async function GET(request: NextRequest) {
  try {
    // ── Read query params from the URL ───────────────────────────────────────
    // e.g. /api/blog?id=5  or  /api/blog?limit=10&page=2
    const { searchParams } = new URL(request.url);
    const id      = searchParams.get("id");       // single post lookup
    const limit   = Number(searchParams.get("limit")  ?? "10"); // default 10
    const page    = Number(searchParams.get("page")   ?? "1");  // default page 1
    const userId  = searchParams.get("userId");   // filter by author

    // ── Single Post Mode ─────────────────────────────────────────────────────
    // GET /api/blog?id=5 → return one post
    if (id) {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        { next: { revalidate: 3600 } } // cache for 1 hour (Next.js fetch cache)
      );

      if (!res.ok) {
        // Forward the upstream error status
        return NextResponse.json(
          { error: `Post with id ${id} not found` },
          { status: res.status }
        );
      }

      const post: ExternalPost = await res.json();
      return NextResponse.json({
        success: true,
        data: transformPost(post),
        source: "https://jsonplaceholder.typicode.com",
      });
    }

    // ── List Mode ────────────────────────────────────────────────────────────
    // GET /api/blog → return paginated list
    // Build the upstream URL with optional userId filter
    const upstreamUrl = new URL("https://jsonplaceholder.typicode.com/posts");
    if (userId) upstreamUrl.searchParams.set("userId", userId);

    const res = await fetch(upstreamUrl.toString(), {
      next: { revalidate: 3600 }, // cache the upstream response for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts from upstream API" },
        { status: 502 }
      );
    }

    const allPosts: ExternalPost[] = await res.json();

    // ── Manual pagination ────────────────────────────────────────────────────
    const total      = allPosts.length;
    const totalPages = Math.ceil(total / limit);
    const start      = (page - 1) * limit;
    const paginated  = allPosts.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      data: paginated.map(transformPost),
      source: "https://jsonplaceholder.typicode.com",
    });

  } catch (error) {
    // ── Catch-all error handler ───────────────────────────────────────────────
    // Always return a structured error — never let unhandled errors crash the route
    console.error("[/api/blog] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
// GET /api/blog         → list    (handled above)
// POST /api/blog        → create a new post (demo — JSONPlaceholder accepts but doesn't persist)
export async function POST(request: NextRequest) {
  try {
    // ── Parse the request body ───────────────────────────────────────────────
    const body = await request.json();
    const { title, content, userId = 1 } = body;

    // ── Basic validation ─────────────────────────────────────────────────────
    if (!title || !content) {
      return NextResponse.json(
        { error: "Both `title` and `content` are required" },
        { status: 400 }
      );
    }

    // ── Forward to JSONPlaceholder ───────────────────────────────────────────
    // JSONPlaceholder simulates creation but does NOT actually store the data.
    // It returns a fake ID (101) — great for demoing POST without a real DB.
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: content, userId }),
    });

    const created = await res.json();

    return NextResponse.json(
      {
        success: true,
        message: "Post created (simulated — JSONPlaceholder does not persist data)",
        data: {
          id: created.id,
          title,
          content,
          userId,
          slug: `${created.id}-${title.replace(/\s+/g, "-").slice(0, 30).toLowerCase()}`,
        },
      },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body — expected JSON" },
      { status: 400 }
    );
  }
}
