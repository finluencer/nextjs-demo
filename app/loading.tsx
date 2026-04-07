/**
 * GLOBAL LOADING UI (app/loading.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is automatically used by Next.js as a loading skeleton for ALL
 * routes that don't have their own loading.tsx.
 *
 * Key Concepts Demonstrated:
 *  - loading.tsx    : Special Next.js file — shown while the page is fetching
 *  - Suspense       : Next.js wraps your page in <Suspense> automatically
 *  - Streaming      : The page "streams in" — shell renders first, data later
 *
 * How it works:
 *  1. User navigates to a page
 *  2. Next.js immediately shows THIS loading component
 *  3. When the async page component finishes, it swaps in the real content
 *
 * You do NOT need to add <Suspense> or check loading state yourself.
 * Just create this file and Next.js handles everything.
 */

export default function Loading() {
  return (
    <div style={{ padding: "40px 0" }}>
      {/* ── Loading indicator ─────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #0070f3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#888", marginTop: "16px", fontSize: "0.9rem" }}>
          Loading page content...
        </p>
      </div>

      {/* ── Skeleton placeholders ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "24px" }}>
        {/* Skeleton title */}
        <div
          style={{
            height: "32px",
            width: "60%",
            background: "#e5e7eb",
            borderRadius: "6px",
            marginBottom: "12px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        {/* Skeleton subtitle */}
        <div
          style={{
            height: "16px",
            width: "80%",
            background: "#e5e7eb",
            borderRadius: "4px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Skeleton cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "120px",
              background: "#e5e7eb",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* ── Explanation box ───────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "48px",
          background: "#f0f7ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#1e40af" }}>
          📡 You are seeing app/loading.tsx
        </h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#444", lineHeight: "1.6" }}>
          This component renders <strong>instantly</strong> while the actual page fetches its data.
          Next.js uses <strong>React Suspense</strong> under the hood — no extra setup needed.
          Create <code>loading.tsx</code> in any route folder to customize the skeleton for that section.
        </p>
      </div>

      {/* CSS animations via a style tag */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
