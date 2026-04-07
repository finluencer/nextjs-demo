/**
 * BLOG-SPECIFIC LOADING UI (app/blog/loading.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This loading skeleton is shown ONLY while /blog or /blog/[slug] is loading.
 * It overrides the global app/loading.tsx for this section.
 *
 * Key Concepts Demonstrated:
 *  - Route-scoped loading : Place loading.tsx in any folder to scope it there
 *  - Skeleton UI          : Custom loading state that matches the real UI shape
 *
 * Next.js loading file priority:
 *   app/blog/loading.tsx  ← used for /blog routes  (more specific wins)
 *   app/loading.tsx       ← used for all other routes
 */

export default function BlogLoading() {
  return (
    <div>
      {/* ── Page title skeleton ───────────────────────────────────────────── */}
      <div
        style={{
          height: "36px",
          width: "120px",
          background: "#e5e7eb",
          borderRadius: "6px",
          marginBottom: "16px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />

      {/* ── API badge skeleton ────────────────────────────────────────────── */}
      <div
        style={{
          height: "24px",
          width: "200px",
          background: "#dcfce7",
          borderRadius: "20px",
          marginBottom: "24px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />

      {/* ── Post cards skeleton grid ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {/* Post number badge */}
            <div style={{ height: "18px", width: "70px", background: "#dbeafe", borderRadius: "4px", marginBottom: "10px" }} />
            {/* Title */}
            <div style={{ height: "16px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "8px" }} />
            <div style={{ height: "16px", width: "80%", background: "#e5e7eb", borderRadius: "4px", marginBottom: "8px" }} />
            {/* Excerpt */}
            <div style={{ height: "12px", background: "#f3f4f6", borderRadius: "4px", marginBottom: "6px" }} />
            <div style={{ height: "12px", width: "90%", background: "#f3f4f6", borderRadius: "4px", marginBottom: "16px" }} />
            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ height: "12px", width: "120px", background: "#f3f4f6", borderRadius: "4px" }} />
              <div style={{ height: "28px", width: "70px", background: "#dbeafe", borderRadius: "6px" }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Pagination skeleton ───────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <div style={{ height: "36px", width: "80px", background: "#e5e7eb", borderRadius: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: "20px", width: "150px", background: "#e5e7eb", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite", alignSelf: "center" }} />
        <div style={{ height: "36px", width: "80px", background: "#e5e7eb", borderRadius: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
