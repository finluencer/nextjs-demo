# Server Actions

Server Actions are async functions that run on the server but are called directly from a form or a Client Component. They are the modern replacement for building a separate API route just to handle a form.

---

## The problem they solve

The old way to submit a form:
1. Write a POST `/api/contact` route handler
2. Write a `fetch()` call in the component
3. Manage `isLoading`, `error`, `success` state manually
4. Handle the response and update the UI

The Server Action way:
1. Write an async function with `"use server"`
2. Point `<form action={yourFunction}>` at it

That is it.

---

## Creating a Server Action

Add `"use server"` at the top of a file (or at the top of an individual function) to make it a Server Action:

```tsx
// app/contact/actions.ts
"use server";

export async function submitForm(formData: FormData) {
  const name  = formData.get("name")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";

  // This code runs on the SERVER — can access DB, send emails, etc.
  await sendEmail({ to: "team@example.com", name, email });

  return { success: true };
}
```

---

## Using it in a form

The simplest usage — a Server Component with a plain HTML form:

```tsx
// app/contact/page.tsx — Server Component
import { submitForm } from "./actions";

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" placeholder="Your name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Send</button>
    </form>
  );
}
```

When the user submits this form, `submitForm` runs on the server. No JavaScript needed on the client — this works even with JavaScript disabled in the browser.

---

## Tracking form state with useFormState

To show success/error messages, use the `useFormState` hook in a Client Component:

```tsx
// app/contact/ContactForm.tsx
"use client";

import { useFormState } from "react-dom";
import { submitForm } from "./actions";

// The action must accept (previousState, formData) when used with useFormState
export default function ContactForm() {
  const [state, action] = useFormState(submitForm, null);

  return (
    <form action={action}>
      {state?.success && <p>Message sent!</p>}
      {state?.error  && <p style={{ color: "red" }}>{state.error}</p>}

      <input name="name"  required />
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

`state` holds whatever the Server Action returned. When the action succeeds or fails, `state` updates and React re-renders the form.

---

## Showing a loading state with useFormStatus

`useFormStatus` tells you when the form is being submitted:

```tsx
// Must be a separate component INSIDE the <form>
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}
```

```tsx
// Use it inside your form
<form action={action}>
  <input name="email" />
  <SubmitButton />  {/* ← useFormStatus works because it's inside the form */}
</form>
```

`pending` is `true` from the moment the user clicks Submit until the Server Action returns.

---

## Validation

Always validate on the server — never rely on client-side validation alone:

```tsx
"use server";

export async function submitForm(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";

  // Server-side validation
  if (!email) {
    return { success: false, error: "Email is required" };
  }
  if (!email.includes("@")) {
    return { success: false, error: "Enter a valid email" };
  }

  // Safe to proceed
  await sendEmail(email);
  return { success: true };
}
```

Return errors as data (not thrown exceptions) so the form component can display them.

---

## Inline Server Actions

You can define a Server Action inline in a Server Component (without a separate file):

```tsx
// app/subscribe/page.tsx — Server Component
export default function SubscribePage() {
  async function subscribe(formData: FormData) {
    "use server"; // can be inside the function body too

    const email = formData.get("email") as string;
    await addToMailingList(email);
  }

  return (
    <form action={subscribe}>
      <input name="email" type="email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

Use inline actions for simple cases. Use a separate `actions.ts` file when you want to reuse the action across multiple pages.

---

## Revalidating cached data after mutation

After a Server Action modifies data, you often need to refresh the page's cached content:

```tsx
"use server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  await db.posts.create({ title: formData.get("title") });

  // Tell Next.js to re-fetch data for the /blog page
  revalidatePath("/blog");

  return { success: true };
}
```

Without `revalidatePath`, the blog list would show stale data after the new post is created.

---

## Server Actions vs API Routes

| | Server Action | API Route |
|-|--------------|-----------|
| Called from | Form or Client Component | `fetch()` from anywhere |
| Returns | Any value | HTTP Response (JSON) |
| Accessible by external apps? | No | Yes |
| Simpler code? | Yes (no fetch needed) | More boilerplate |
| Best for | Internal forms and mutations | Public APIs, mobile apps |

---

## Where to see this in the demo

- `app/contact/actions.ts` — Server Action with validation, returns typed result
- `app/contact/ContactForm.tsx` — Client Component using `useFormState` and `useFormStatus`
- `app/contact/page.tsx` — Server Component page that renders the form
