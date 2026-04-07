/**
 * GLOBAL ERROR BOUNDARY (app/error.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is automatically shown when an unhandled error occurs in any page.
 *
 * Key Concepts Demonstrated:
 *  - error.tsx      : Special Next.js file — catches runtime errors in pages
 *  - "use client"   : REQUIRED — error boundaries must be Client Components
 *                     because they use React's componentDidCatch under the hood
 *  - reset()        : Prop passed by Next.js to retry rendering the failed page
 *  - Error object   : Contains the error message and stack trace
 *
 * What counts as an error here?
 *  - An uncaught exception thrown inside a page component
 *  - A failed fetch that throws instead of returning an error response
 *  - Any JavaScript runtime error during rendering
 *
 * Note: This does NOT catch errors in layouts. For layout errors, place an
 * error.tsx in a higher-level route or in app/ itself.
 */

"use client"; // Required! Error boundaries are always Client Components.

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string }; // digest = server-side error ID for logs
  reset: () => void;                  // Call this to retry the failed render
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Log the error to an external service in a real app (e.g., Sentry)
  useEffect(() => {
    console.error("Page error caught by error.tsx:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      {/* ── Error visual ─────────────────────────────────────────────────── */}
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>⚠️</div>

      <h1 style={{ fontSize: "2rem", color: "#dc2626", margin: "0 0 8px" }}>
        Something went wrong
      </h1>

      <p style={{ color: "#666", fontSize: "1rem", maxWidth: "500px", margin: "0 auto 24px", lineHeight: "1.6" }}>
        An unexpected error occurred while loading this page.
        You can try again or go back to safety.
      </p>

      {/* ── Error details (useful during development) ─────────────────────── */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "#1e1e2e",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto 24px",
          }}
        >
          <p style={{ color: "#f38ba8", fontFamily: "monospace", fontSize: "0.85rem", margin: "0 0 8px", fontWeight: "bold" }}>
            {error.message}
          </p>
          {error.digest && (
            <p style={{ color: "#6c7086", fontFamily: "monospace", fontSize: "0.75rem", margin: 0 }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      )}

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={reset}
          style={{
            background: "#0070f3",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Try Again
        </button>
        <a
          href="/"
          style={{
            background: "#fff",
            color: "#333",
            padding: "10px 24px",
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🏠 Go Home
        </a>
      </div>

      {/* ── Explanation box ───────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "60px",
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "500px",
          margin: "60px auto 0",
          textAlign: "left",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#c2410c" }}>
          🔥 You are seeing app/error.tsx
        </h3>
        <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "#444", lineHeight: "1.6" }}>
          This component renders when any page throws an unhandled error.
          It receives two props:
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#444", lineHeight: "1.8" }}>
          <li><code>error</code> — the Error object with message and stack trace</li>
          <li><code>reset()</code> — a function to retry rendering the failed page</li>
        </ul>
        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "#444" }}>
          Must be a <strong>Client Component</strong> (<code>&quot;use client&quot;</code>).
        </p>
      </div>
    </div>
  );
}
