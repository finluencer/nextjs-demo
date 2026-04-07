/**
 * BLOG NESTED LAYOUT (app/blog/layout.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This layout wraps ALL routes under /blog:
 *   /blog         → shows this layout + blog/page.tsx
 *   /blog/[slug]  → shows this layout + blog/[slug]/page.tsx
 *
 * Key Concepts Demonstrated:
 *  - Nested Layouts : Layouts stack on top of each other (root → blog → page)
 *  - Shared UI      : Sidebar, breadcrumbs, or section headers that appear
 *                     on every page in this folder
 *  - Persistence    : This layout does NOT re-mount when navigating between
 *                     /blog and /blog/some-post — React keeps it alive
 *
 * Layout stack for /blog/my-post:
 *   app/layout.tsx          (root — nav + footer)
 *     └── app/blog/layout.tsx   (blog — section header + sidebar)
 *           └── app/blog/[slug]/page.tsx  (the actual post)
 */

import type { Metadata } from "next";

// Override the metadata title for all blog pages
export const metadata: Metadata = {
  title: {
    template: "%s | Blog — Next.js Demo", // %s is replaced by the page's title
    default: "Blog — Next.js Demo",        // fallback if page has no title
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* ── Blog section header ───────────────────────────────────────────── */}
      <div
        style={{
          background: "#f8faff",
          border: "1px solid #dbeafe",
          borderRadius: "8px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              background: "#dbeafe",
              color: "#1e40af",
              fontSize: "0.72rem",
              fontWeight: "bold",
              padding: "2px 10px",
              borderRadius: "4px",
              letterSpacing: "0.05em",
            }}
          >
            NESTED LAYOUT
          </span>
          <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#555" }}>
            <strong>app/blog/layout.tsx</strong> — wraps every page under <code>/blog</code>
          </p>
        </div>
        <a
          href="/blog"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: "bold",
          }}
        >
          ← All Posts
        </a>
      </div>

      {/* ── Page content is injected here ────────────────────────────────── */}
      {children}

      {/* ── Shared blog footer ────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "#888",
        }}
      >
        <span>📝 Next.js Demo Blog</span>
        <span>Data from JSONPlaceholder API</span>
      </div>
    </div>
  );
}
