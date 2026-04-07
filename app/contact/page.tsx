/**
 * CONTACT PAGE (app/contact/page.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Route: /contact
 *
 * Key Concepts Demonstrated:
 *  - Server Actions  : The form submits to a function that runs on the server
 *  - useFormState    : React hook to track the Server Action's return value
 *  - useFormStatus   : React hook to know when the form is submitting
 *  - Progressive     : The form works even with JavaScript disabled!
 *
 * This pattern replaces the need to:
 *  - Build a POST /api/contact route
 *  - Write fetch() in the component
 *  - Manage loading/error state manually
 *
 * Instead you just point <form action={serverAction}> and everything works.
 */

import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Next.js Demo",
  description: "Contact form demonstrating Next.js Server Actions",
};

export default function ContactPage() {
  return (
    <div>
      <h1>📬 Contact</h1>
      <p style={{ color: "#555", marginBottom: "32px" }}>
        This page demonstrates <strong>Server Actions</strong> — the modern way to
        handle forms in Next.js. No <code>/api</code> route needed. No <code>fetch()</code> call needed.
        Just a function that runs on the server.
      </p>

      {/* ── Concept explainer ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            step: "1",
            title: "User fills form",
            desc: "Standard HTML form — no special code needed",
            color: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            step: "2",
            title: "Server Action runs",
            desc: "Next.js sends FormData to your async server function",
            color: "#f0fdf4",
            border: "#bbf7d0",
          },
          {
            step: "3",
            title: "Result returned",
            desc: "Function returns success or error — UI updates automatically",
            color: "#fff7ed",
            border: "#fed7aa",
          },
        ].map(({ step, title, desc, color, border }) => (
          <div
            key={step}
            style={{
              background: color,
              border: `1px solid ${border}`,
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "4px" }}>
              Step {step}
            </div>
            <div style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "0.9rem" }}>
              {title}
            </div>
            <div style={{ color: "#555", fontSize: "0.8rem", lineHeight: "1.5" }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* ── The actual form (Client Component for hooks) ───────────────────── */}
      <ContactForm />
    </div>
  );
}
