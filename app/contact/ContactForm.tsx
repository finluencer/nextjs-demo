/**
 * CONTACT FORM CLIENT COMPONENT (app/contact/ContactForm.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * This is a Client Component because it uses:
 *  - useFormState   : Tracks the Server Action result (success/error message)
 *  - useFormStatus  : Detects when the form is pending (shows loading state)
 *
 * The actual data processing happens in actions.ts (Server Action).
 * This component only handles the UI state.
 */

"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContact, type ContactResult } from "./actions";

// ── Submit Button ─────────────────────────────────────────────────────────────
// Separated into its own component so it can use useFormStatus.
// useFormStatus must be used in a component INSIDE the <form>.
function SubmitButton() {
  const { pending } = useFormStatus(); // true while the Server Action is running

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: pending ? "#93c5fd" : "#0070f3",
        color: "#fff",
        border: "none",
        padding: "12px 32px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: pending ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        width: "100%",
      }}
    >
      {pending ? "⏳ Sending..." : "📨 Send Message"}
    </button>
  );
}

// ── Input helper ──────────────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  multiline = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  error?: string;
}) {
  const sharedStyle = {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${error ? "#fca5a5" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "0.95rem",
    background: error ? "#fff7f7" : "#fff",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor={name}
        style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "0.9rem" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          style={sharedStyle}
        />
      ) : (
        <input id={name} name={name} type={type} style={sharedStyle} />
      )}
      {error && (
        <p style={{ margin: "4px 0 0", color: "#dc2626", fontSize: "0.8rem" }}>{error}</p>
      )}
    </div>
  );
}

// ── Main Form Component ───────────────────────────────────────────────────────
const initialState: ContactResult | null = null;

export default function ContactForm() {
  // useFormState wraps the Server Action and gives us the return value.
  // state = whatever submitContact() returned
  // formAction = pass this to <form action={...}>
  const [state, formAction] = useFormState(submitContact, initialState);

  // If submission succeeded, show the success message instead of the form
  if (state?.success) {
    return (
      <div
        style={{
          background: "#f0fdf4",
          border: "2px solid #86efac",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</div>
        <h2 style={{ margin: "0 0 12px", color: "#166534" }}>Message Sent!</h2>
        <p style={{ color: "#15803d", margin: "0 0 24px" }}>{state.message}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const fieldErrors = (!state?.success && state?.fieldErrors) ? state.fieldErrors : {};

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
      {/* ── The form ────────────────────────────────────────────────────────── */}
      <div>
        {/* Top-level error message */}
        {state && !state.success && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#dc2626",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ {state.error}
          </div>
        )}

        {/* form action={formAction} connects this form to the Server Action */}
        <form action={formAction}>
          <Field label="Your Name *"    name="name"    error={fieldErrors.name} />
          <Field label="Email Address *" name="email"   type="email" error={fieldErrors.email} />
          <Field label="Subject *"      name="subject" error={fieldErrors.subject} />
          <Field label="Message *"      name="message" multiline error={fieldErrors.message} />
          <SubmitButton />
        </form>
      </div>

      {/* ── Code explanation panel ───────────────────────────────────────────── */}
      <div>
        <div
          style={{
            background: "#1e1e2e",
            borderRadius: "8px",
            padding: "20px",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            lineHeight: "1.8",
          }}
        >
          <p style={{ color: "#cba6f7", margin: "0 0 12px", fontWeight: "bold", fontSize: "0.85rem" }}>
            📄 How Server Actions work
          </p>

          <p style={{ color: "#6c7086", margin: "0 0 4px" }}>// actions.ts</p>
          <p style={{ color: "#cba6f7", margin: "0 0 2px" }}>{'"use server"'}</p>
          <p style={{ color: "#cdd6f4", margin: "0 0 12px" }}>
            <span style={{ color: "#89b4fa" }}>export async function</span>{" "}
            <span style={{ color: "#a6e3a1" }}>submitContact</span>
            <span style={{ color: "#cdd6f4" }}>(formData) {"{"}</span>
            <br />
            <span style={{ paddingLeft: "16px", color: "#cdd6f4" }}>
              {"// runs on SERVER only"}
            </span>
            <br />
            <span style={{ paddingLeft: "16px", color: "#cdd6f4" }}>
              {"const name = formData.get('name')"}
            </span>
            <br />
            <span style={{ color: "#cdd6f4" }}>{"}"}</span>
          </p>

          <p style={{ color: "#6c7086", margin: "0 0 4px" }}>// ContactForm.tsx</p>
          <p style={{ color: "#cba6f7", margin: "0 0 2px" }}>{'"use client"'}</p>
          <p style={{ color: "#cdd6f4", margin: "0 0 12px" }}>
            <span style={{ color: "#89b4fa" }}>const</span>{" "}
            <span style={{ color: "#cdd6f4" }}>[state, action] =</span>
            <br />
            <span style={{ paddingLeft: "16px", color: "#a6e3a1" }}>useFormState</span>
            <span style={{ color: "#cdd6f4" }}>(submitContact, null)</span>
          </p>

          <p style={{ color: "#cdd6f4", margin: 0 }}>
            <span style={{ color: "#f38ba8" }}>{"<form"}</span>{" "}
            <span style={{ color: "#fab387" }}>action</span>
            <span style={{ color: "#cdd6f4" }}>{"={action}>"}</span>
          </p>
        </div>

        <div
          style={{
            marginTop: "16px",
            background: "#f8faff",
            border: "1px solid #dbeafe",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "0.85rem",
            lineHeight: "1.7",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#1e40af" }}>
            ✨ What makes this special
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#444" }}>
            <li>No <code>fetch()</code> in your component</li>
            <li>No <code>POST /api/contact</code> route needed</li>
            <li>Works without JavaScript (progressive enhancement)</li>
            <li>Type-safe: the return type flows from server → client</li>
            <li>Server has access to DB, secrets, file system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
