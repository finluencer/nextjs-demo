/**
 * COUNTER CLIENT COMPONENT (components/Counter.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Type: Client Component
 *
 * Key Concepts Demonstrated:
 *  - "use client"   : The directive that marks this as a Client Component
 *  - useState       : React hook — only available in Client Components
 *  - Event Handlers : onClick — only works in Client Components
 *  - Props          : Accepts `initialCount` from the parent Server Component
 *
 * ⚠️  Rules of Client Components:
 *    - MUST have "use client" as the FIRST LINE (before imports)
 *    - Can use all React hooks (useState, useEffect, useRef, etc.)
 *    - Can attach event listeners (onClick, onChange, etc.)
 *    - CANNOT directly access server-only APIs (fs, database, env secrets)
 *    - CANNOT import Server Components (but can receive them as `children`)
 */

"use client"; // ← THIS IS THE KEY. Tells Next.js: render this in the browser.

import { useState } from "react"; // useState is a client-only hook

// ─── Props Interface ──────────────────────────────────────────────────────────
// The parent Server Component passes `initialCount` as a prop.
// Props crossing the server→client boundary must be serializable (no functions,
// no class instances — just plain data: strings, numbers, objects, arrays).
interface CounterProps {
  initialCount: number;
}

// ─── Counter Component ────────────────────────────────────────────────────────
export default function Counter({ initialCount }: CounterProps) {
  // useState is the React hook for local interactive state.
  // `count` = current value, `setCount` = function to update it.
  // Changing `count` triggers a re-render of this component only.
  const [count, setCount] = useState(initialCount);

  // ── Step history — track each change ──────────────────────────────────────
  const [history, setHistory] = useState<string[]>([`Started at ${initialCount}`]);

  // ── Handler: increment ───────────────────────────────────────────────────
  const increment = () => {
    setCount((prev) => prev + 1);
    setHistory((h) => [...h, `+1 → ${count + 1}`]);
  };

  // ── Handler: decrement ───────────────────────────────────────────────────
  const decrement = () => {
    setCount((prev) => prev - 1);
    setHistory((h) => [...h, `-1 → ${count - 1}`]);
  };

  // ── Handler: reset ───────────────────────────────────────────────────────
  const reset = () => {
    setCount(initialCount);
    setHistory((h) => [...h, `Reset → ${initialCount}`]);
  };

  return (
    <div style={{
      border: "2px solid #0070f3", borderRadius: "12px", padding: "24px",
      background: "#fff", maxWidth: "400px",
    }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{
          background: "#0070f3", color: "#fff", fontSize: "0.7rem",
          padding: "2px 8px", borderRadius: "4px", fontWeight: "bold",
        }}>
          CLIENT COMPONENT
        </span>
        <span style={{ color: "#888", fontSize: "0.85rem" }}>uses useState</span>
      </div>

      {/* ── Count Display ───────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <span style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#0070f3" }}>
          {count}
        </span>
      </div>

      {/* ── Buttons ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button
          onClick={decrement} // onClick only works in Client Components
          style={{ padding: "8px 20px", fontSize: "1.2rem", cursor: "pointer",
            border: "1px solid #ddd", borderRadius: "6px", background: "#fff" }}
        >
          −
        </button>
        <button
          onClick={reset}
          style={{ padding: "8px 20px", fontSize: "0.85rem", cursor: "pointer",
            border: "1px solid #ddd", borderRadius: "6px", background: "#f5f5f5" }}
        >
          Reset
        </button>
        <button
          onClick={increment}
          style={{ padding: "8px 20px", fontSize: "1.2rem", cursor: "pointer",
            border: "none", borderRadius: "6px", background: "#0070f3", color: "#fff" }}
        >
          +
        </button>
      </div>

      {/* ── History Log ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: "20px", background: "#f9f9f9", borderRadius: "6px", padding: "12px" }}>
        <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "#888", fontWeight: "bold" }}>
          STATE HISTORY
        </p>
        {history.slice(-4).map((entry, i) => (
          <div key={i} style={{ fontSize: "0.8rem", color: "#555", padding: "2px 0" }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
