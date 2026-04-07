/**
 * HOME PAGE (app/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * The file `app/page.tsx` maps to the "/" route automatically.
 * Next.js uses FILE-SYSTEM ROUTING — the folder/file path = the URL.
 *
 * Key Concepts Demonstrated:
 *  - Server Component   : Runs on the server; no JS shipped to the browser
 *  - async/await        : Fetch data directly inside a Server Component
 *  - No useEffect       : Data fetching is top-level, not in a hook
 */

// ─── NO "use client" directive ───────────────────────────────────────────────
// This is a SERVER COMPONENT. It runs on the server during the request.
// Benefits:
//   Can access databases, environment variables, file system directly
//   No React hydration overhead for this component
//   Automatic code-splitting; none of this code runs in the browser

// Simulate fetching stats from an API or database
async function getStats() {
  // In a real app, this could be: const data = await db.query(...)
  // For the demo we return hardcoded values after a fake delay
  await new Promise((r) => setTimeout(r, 0)); // simulates async I/O
  return { users: 1_240, posts: 87, countries: 34 };
}

// ─── Page Component ───────────────────────────────────────────────────────────
// `async` Server Components can `await` data before rendering — no loading
// spinners needed for the initial HTML response.
export default async function HomePage() {
  const stats = await getStats(); //  Direct async call — no useEffect needed

  return (
    <div>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
        👋 Welcome to the Next.js Demo
      </h1>

      <p style={{ color: "#555", fontSize: "1.1rem", marginBottom: "32px" }}>
        This project demonstrates <strong>App Router</strong> concepts: routing,
        server components, client components, data fetching, and dynamic routes.
      </p>

      {/* ── Stats Section (data fetched server-side) ──────────────────────── */}
      <section style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "Total Users", value: stats.users },
          { label: "Blog Posts", value: stats.posts },
          { label: "Countries", value: stats.countries },
        ].map(({ label, value }) => (
          <div key={label} style={{ flex: 1, background: "#f0f7ff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#0070f3" }}>{value.toLocaleString()}</div>
            <div style={{ color: "#555", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── Concept Cards ─────────────────────────────────────────────────── */}
      <h2>Concepts in This Demo</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { emoji: "📁", title: "File-System Routing", desc: "app/about/page.tsx → /about. No config needed." },
          { emoji: "⚡", title: "Server Components", desc: "Zero JS to browser. Fetch data directly on the server." },
          { emoji: "🖱️", title: "Client Components", desc: "'use client' enables useState, useEffect, and events." },
          { emoji: "🔗", title: "Dynamic Routes", desc: "app/blog/[slug]/page.tsx → /blog/my-post." },
        ].map(({ emoji, title, desc }) => (
          <div key={title} style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "20px" }}>
            <div style={{ fontSize: "1.8rem" }}>{emoji}</div>
            <h3 style={{ margin: "8px 0 4px" }}>{title}</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "0.9rem" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
