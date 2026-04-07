# Server vs Client Components

This is the most important concept to understand in the Next.js App Router. Everything else builds on top of it.

---

## The core idea

In React, all components traditionally run in the browser. In Next.js App Router, components can run in two places:

- **Server Components** — run on the server, output HTML, send zero JavaScript to the browser
- **Client Components** — run in the browser, can be interactive, use React hooks

By default, every component in `app/` is a **Server Component**.

---

## Server Components

A file with NO `"use client"` at the top is a Server Component.

```tsx
// app/about/page.tsx — this is a Server Component (no directive needed)

export default async function AboutPage() {
  // You can await data directly — no useEffect, no useState
  const data = await fetch("https://api.example.com/data").then(r => r.json());

  return <h1>Hello, {data.name}</h1>;
}
```

**What Server Components CAN do:**

- `async/await` — fetch data directly in the component body
- Access databases, file system, environment secrets
- Import server-only packages (no browser equivalent needed)
- Render HTML very fast (no JavaScript hydration cost)

**What Server Components CANNOT do:**

- Use React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Attach event handlers (`onClick`, `onChange`, etc.)
- Access browser APIs (`window`, `document`, `localStorage`)

---

## Client Components

Add `"use client"` as the very first line of the file:

```tsx
"use client"; // This MUST be the first line

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

**What Client Components CAN do:**

- Use all React hooks (`useState`, `useEffect`, `useRef`, `useCallback`, etc.)
- Attach event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
- Access browser APIs (`window`, `document`, `localStorage`)
- Subscribe to real-time updates (WebSockets, etc.)

**What Client Components CANNOT do:**

- Use `async/await` at the component level (hooks do not support it)
- Access secret environment variables (anything without `NEXT_PUBLIC_`)
- Directly import server-only modules

---

## Comparison table

| | Server Component | Client Component |
|-|-----------------|-----------------|
| Where does it run? | Server | Browser |
| Directive needed? | No (default) | `"use client"` at top |
| Can fetch data with `async/await`? | Yes | No |
| Can use `useState`? | No | Yes |
| Can use `onClick`? | No | Yes |
| Access to secrets? | Yes | No |
| JavaScript sent to browser? | No | Yes |
| Re-renders on state change? | No | Yes |

---

## The composition pattern

You do not have to choose one or the other for an entire page. The real power is **mixing them**:

```tsx
// app/dashboard/page.tsx — Server Component
import Counter from "@/components/Counter"; // Client Component

export default function DashboardPage() {
  return (
    <div>
      {/* This renders on the server — no JS for this part */}
      <h1>Dashboard</h1>
      <p>Server-rendered stats here...</p>

      {/* Only THIS component ships JavaScript to the browser */}
      <Counter initialCount={0} />
    </div>
  );
}
```

Think of it as: **keep as much as possible on the server, push interactivity to the leaves of the component tree.**

---

## Passing data from Server to Client

Server Components can pass data to Client Components as props. The props must be **serializable** (plain data — not functions, not class instances).

```tsx
// Server Component — can read secrets, fetch data
export default async function Page() {
  const user = await db.getUser(); // server-only database call

  return (
    // Passing plain data (string, number, object) is fine
    <UserCard name={user.name} email={user.email} />
  );
}
```

```tsx
// Client Component — receives the data and can be interactive
"use client";

export default function UserCard({ name, email }: { name: string; email: string }) {
  const [showEmail, setShowEmail] = useState(false);
  // ...
}
```

---

## Common mistake — importing Server Components into Client Components

You cannot import a Server Component inside a Client Component. The boundary only flows one way.

```tsx
// ❌ This will error
"use client";
import ServerOnlyThing from "@/components/ServerOnlyThing"; // not allowed
```

```tsx
// ✅ Instead, pass Server Component output as children
"use client";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

```tsx
// app/page.tsx — Server Component composes them
import ClientWrapper from "@/components/ClientWrapper";
import ServerOnlyThing from "@/components/ServerOnlyThing";

export default function Page() {
  return (
    <ClientWrapper>
      <ServerOnlyThing /> {/* This works — passed as children prop */}
    </ClientWrapper>
  );
}
```

---

## Practical decision guide

Ask yourself:

1. **Does it need `onClick`, `onChange`, or any event handler?** → Client Component
2. **Does it use `useState`, `useEffect`, or any hook?** → Client Component
3. **Does it need browser-only APIs (`window`, `localStorage`)?** → Client Component
4. **Everything else?** → Server Component

When in doubt, start with a Server Component. If you get an error, that error will tell you exactly which hook or API requires a Client Component.

---

## Where to see this in the demo

- **Server Components**: `app/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/about/page.tsx`
- **Client Component**: `components/Counter.tsx`
- **Composition pattern**: `app/dashboard/page.tsx` (Server Component using a Client Component)
- **Server passing data to Client**: `app/dashboard/page.tsx` passing `initialCount={0}` to `Counter`
