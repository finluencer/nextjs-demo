/**
 * ABOUT PAGE (app/about/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /about
 * Type:  Server Component (static)
 *
 * Key Concepts Demonstrated:
 *  - Per-page Metadata  : Override the root layout's <title> for this page only
 *  - Static Rendering   : No data fetching — Next.js pre-renders at build time
 *  - Nested Routing     : This file is inside `app/about/` folder
 */

import type { Metadata } from "next";

// ─── Per-Page Metadata ───────────────────────────────────────────────────────
// Each page.tsx can export its own metadata — this OVERRIDES the root layout's
// metadata for this route only. The browser tab will show "About | Next.js Demo".
export const metadata: Metadata = {
  title: "About | Next.js Demo",
  description: "Learn about how this Next.js demo is structured",
};

// ─── About Page (Static Server Component) ────────────────────────────────────
// No async, no data fetching → Next.js statically generates this at build time.
// Result: ultra-fast serving directly from CDN edge.
export default function AboutPage() {
  // Architecture overview data — defined in the component, not fetched
  const layers = [
    {
      name: "app/layout.tsx",
      role: "Root Layout",
      note: "Wraps all pages. Contains <html>, <body>, nav, footer.",
    },
    {
      name: "app/page.tsx",
      role: "Home Page",
      note: "Server Component. Fetches stats async on the server.",
    },
    {
      name: "app/blog/[slug]/page.tsx",
      role: "Dynamic Route",
      note: "The [slug] segment captures any value from the URL.",
    },
    {
      name: "components/Counter.tsx",
      role: "Client Component",
      note: "'use client' directive enables interactive React state.",
    },
    {
      name: "lib/data.ts",
      role: "Data Layer",
      note: "Shared async functions; import into any Server Component.",
    },
  ];

  return (
    <div>
      <h1>📖 About This Demo</h1>
      <p style={{ color: "#555", marginBottom: "32px" }}>
        This project is a minimal Next.js 14 App Router demo designed to show
        teammates how routing, components, and data fetching work together.
      </p>

      <h2>Project Architecture</h2>

      {/* ── Architecture Table ─────────────────────────────────────────────
          Shows which file handles which concern — great for onboarding.   */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>File</th>
            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Role</th>
            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((layer) => (
            <tr key={layer.name}>
              <td style={{ border: "1px solid #ddd", padding: "10px", fontFamily: "monospace", color: "#0070f3" }}>
                {layer.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px", fontWeight: "bold" }}>
                {layer.role}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px", color: "#555" }}>
                {layer.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "32px" }}>Key Rules to Remember</h2>
      <ul style={{ lineHeight: "2", color: "#444" }}>
        <li><strong>Every folder</strong> inside <code>app/</code> with a <code>page.tsx</code> becomes a route</li>
        <li><strong>Layouts</strong> wrap child routes and <em>persist</em> across navigation</li>
        <li><strong>Server Components</strong> are the default — opt-in to client with <code>"use client"</code></li>
        <li><strong>Dynamic segments</strong> use square brackets: <code>[slug]</code>, <code>[id]</code></li>
      </ul>
    </div>
  );
}
