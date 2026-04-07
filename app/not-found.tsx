/**
 * CUSTOM 404 PAGE (app/not-found.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is automatically shown when:
 *   1. A route does not exist (e.g., user visits /xyz-that-doesnt-exist)
 *   2. A page calls notFound() from "next/navigation"
 *
 * Key Concepts Demonstrated:
 *  - not-found.tsx  : Special Next.js file for 404 errors
 *  - notFound()     : Call this in any page/layout to trigger this UI
 *  - Link           : Client-side navigation back to home
 *
 * Example usage in a page:
 *   import { notFound } from "next/navigation";
 *   if (!post) notFound(); // shows this component automatically
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      {/* ── 404 visual ───────────────────────────────────────────────────── */}
      <div style={{ fontSize: "6rem", marginBottom: "16px" }}>🔍</div>

      <h1 style={{ fontSize: "3rem", color: "#0070f3", margin: "0 0 8px" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", color: "#333", margin: "0 0 16px" }}>
        Page Not Found
      </h2>

      <p style={{ color: "#666", fontSize: "1rem", maxWidth: "400px", margin: "0 auto 32px", lineHeight: "1.6" }}>
        The page you are looking for does not exist, was moved, or the URL is incorrect.
      </p>

      {/* ── Navigation options ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            background: "#0070f3",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🏠 Go Home
        </Link>
        <Link
          href="/blog"
          style={{
            background: "#fff",
            color: "#0070f3",
            padding: "10px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            border: "2px solid #0070f3",
            fontWeight: "bold",
          }}
        >
          📝 View Blog
        </Link>
      </div>

      {/* ── Explanation box ───────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "60px",
          background: "#f0f7ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "500px",
          margin: "60px auto 0",
          textAlign: "left",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#1e40af" }}>
          📄 You are seeing app/not-found.tsx
        </h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#444", lineHeight: "1.6" }}>
          Create <code>not-found.tsx</code> anywhere in your <code>app/</code> folder.
          Call <code>notFound()</code> from <code>&quot;next/navigation&quot;</code> inside any
          page or layout to render this component. Nest it inside a route folder (e.g.,{" "}
          <code>app/blog/not-found.tsx</code>) to scope it to that section only.
        </p>
      </div>
    </div>
  );
}
