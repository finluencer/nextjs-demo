/**
 * SERVER ACTIONS (app/contact/actions.ts)
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Actions are async functions that run on the SERVER but are called
 * directly from a form or a Client Component.
 *
 * Key Concepts Demonstrated:
 *  - "use server"     : Marks this file's functions as Server Actions
 *  - FormData         : The standard way to read HTML form fields server-side
 *  - Validation       : Check inputs before processing (always validate!)
 *  - Return values    : Return structured results back to the calling component
 *
 * How Server Actions work:
 *  1. User fills a form and clicks Submit
 *  2. Browser sends a POST request (automatically by Next.js)
 *  3. This function runs on the server — has access to DB, secrets, file system
 *  4. Returns a result object back to the component
 *  5. Works WITHOUT JavaScript enabled in the browser (progressive enhancement)
 *
 * Alternative to building an API route just to handle a form!
 */

"use server"; // Every function in this file runs on the server

// ── Result type ───────────────────────────────────────────────────────────────
export type ContactResult =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

// ── submitContact Server Action ───────────────────────────────────────────────
// The first parameter is the previous state from useFormState (ignored here).
// useFormState always passes (prevState, formData) — both params are required.
export async function submitContact(
  _prevState: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  // Read form fields from FormData (this is the standard Web API for form data)
  const name    = formData.get("name")?.toString().trim() ?? "";
  const email   = formData.get("email")?.toString().trim() ?? "";
  const subject = formData.get("subject")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  // ── Validation ────────────────────────────────────────────────────────────
  // Always validate on the server — never trust client-side validation alone.
  const fieldErrors: Record<string, string> = {};

  if (!name)                         fieldErrors.name    = "Name is required";
  if (!email)                        fieldErrors.email   = "Email is required";
  if (email && !email.includes("@")) fieldErrors.email   = "Enter a valid email address";
  if (!subject)                      fieldErrors.subject = "Subject is required";
  if (!message)                      fieldErrors.message = "Message is required";
  if (message.length < 10)          fieldErrors.message = "Message must be at least 10 characters";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please fix the errors below", fieldErrors };
  }

  // ── Simulate sending an email ─────────────────────────────────────────────
  // In a real app you would use a service like Resend, SendGrid, or Nodemailer:
  //   await resend.emails.send({ from, to, subject, html })
  //
  // For this demo, we just simulate a network delay.
  await new Promise((r) => setTimeout(r, 800));

  // ── Log the submission (server-side only — never reaches the browser) ─────
  console.log("[Server Action] Contact form submission:", { name, email, subject });

  // ── Return success ────────────────────────────────────────────────────────
  return {
    success: true,
    message: `Thanks ${name}! Your message has been received. We will reply to ${email} soon.`,
  };
}
