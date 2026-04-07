/**
 * DASHBOARD PAGE (app/dashboard/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /dashboard
 * Type:  Server Component that COMPOSES a Client Component
 *
 * Key Concepts Demonstrated:
 *  - Composition Pattern : Server Component renders, then passes data to Client
 *  - Boundary           : Only the <Counter> needs interactivity → only it is
 *                         a Client Component; everything else stays on server
 *  - Best Practice      : "Push client components to the leaves" of the tree
 */

// Import our interactive counter — it is a Client Component ("use client")
import Counter from "../../components/Counter";

export default function DashboardPage() {
  return (
    <div>
      <h1>📊 Dashboard</h1>
      <p style={{ color: "#555", marginBottom: "32px" }}>
        This page shows how a <strong>Server Component</strong> can include a{" "}
        <strong>Client Component</strong>. Only the interactive part (<code>Counter</code>)
        needs to run in the browser.
      </p>

      {/* ── Static content rendered on the server ─────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 8px", color: "#c2410c" }}>Server Rendered</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#7c2d12" }}>
            This card is rendered on the server. It has no JavaScript in the browser.
            Fast, SEO-friendly, zero hydration cost.
          </p>
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 8px", color: "#15803d" }}>Also Server Rendered</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#14532d" }}>
            Even complex UI can stay on the server as long as it does not need{" "}
            <code>useState</code>, <code>useEffect</code>, or event listeners.
          </p>
        </div>
      </div>

      {/* ── Client Component boundary ─────────────────────────────────────────
          <Counter> is the ONLY part of this page that ships JavaScript to the
          browser. Everything above is pure server-rendered HTML.            */}
      <Counter initialCount={0} />

      {/* ── Explanation Box ──────────────────────────────────────────────── */}
      <div style={{
        marginTop: "32px", background: "#f0f7ff", border: "1px solid #bfdbfe",
        borderRadius: "8px", padding: "20px",
      }}>
        <h3 style={{ margin: "0 0 12px" }}>🧩 How the Composition Works</h3>
        <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8", color: "#444", fontSize: "0.9rem" }}>
          <li>This <code>page.tsx</code> is a <strong>Server Component</strong> — no JS sent to browser</li>
          <li>It imports <code>Counter.tsx</code> which starts with <code>"use client"</code></li>
          <li>Next.js creates a <strong>client boundary</strong> at the <code>{"<Counter>"}</code> tag</li>
          <li>Only the Counter component is hydrated in the browser</li>
          <li>Result: minimal JS bundle, maximum interactivity where needed</li>
        </ol>
      </div>
    </div>
  );
}
