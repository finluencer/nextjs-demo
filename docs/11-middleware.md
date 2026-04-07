# Middleware

Middleware runs code before a request reaches your page or API route. It is the right place for authentication checks, redirects, and request-level logic.

---

## Where it lives

Create `middleware.ts` at the **project root** (same level as `app/`, not inside it):

```
nextjs-demo/
├── app/
├── middleware.ts   ← here
├── next.config.js
└── package.json
```

---

## Basic structure

```tsx
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Run your logic here
  return NextResponse.next(); // continue to the page
}
```

The middleware function receives a `NextRequest` and must return a `NextResponse`.

---

## What you can do in middleware

### Redirect the user

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect /old-blog to /blog
  if (request.nextUrl.pathname === "/old-blog") {
    return NextResponse.redirect(new URL("/blog", request.url));
  }

  return NextResponse.next();
}
```

The user is sent to `/blog` automatically and permanently (if you add `{ status: 301 }`).

### Rewrite (serve different content without changing the URL)

```tsx
export function middleware(request: NextRequest) {
  // User visits /products but we serve /api/products content
  // URL in browser stays as /products
  if (request.nextUrl.pathname === "/products") {
    return NextResponse.rewrite(new URL("/api/products", request.url));
  }

  return NextResponse.next();
}
```

Rewrites are useful for A/B testing — show different pages to different users without them knowing.

### Block a request

```tsx
export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

### Add or modify headers

```tsx
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add a custom header to every response
  response.headers.set("x-app-version", "1.2.0");

  return response;
}
```

---

## Authentication pattern

The most common use of middleware is protecting routes:

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/settings", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Check for a session token (cookie, header, etc.)
    const sessionToken = request.cookies.get("session-token")?.value;

    if (!sessionToken) {
      // Not logged in — send to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname); // remember where they were going
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
```

---

## The matcher config

By default, middleware runs on EVERY request including images, CSS files, and Next.js internals. That is wasteful. Use the `config` export to limit which paths trigger middleware:

```tsx
export const config = {
  matcher: [
    // Only run on these specific paths
    "/dashboard/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
```

Or exclude static files using a regex:

```tsx
export const config = {
  matcher: [
    // Run on everything EXCEPT static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

---

## Reading cookies and headers

```tsx
export function middleware(request: NextRequest) {
  // Read a cookie
  const theme = request.cookies.get("theme")?.value ?? "light";

  // Read a request header
  const userAgent = request.headers.get("user-agent") ?? "";

  // Read the current URL path
  const { pathname, searchParams } = request.nextUrl;

  console.log(`[Middleware] ${request.method} ${pathname} (theme: ${theme})`);

  return NextResponse.next();
}
```

---

## What middleware CANNOT do

Middleware runs on the **Edge runtime** which is a lightweight JavaScript environment (not full Node.js). This means:

- No Node.js built-ins (`fs`, `path`, `crypto` from Node, etc.)
- No database connections (no Prisma, no pg, etc.)
- No large npm packages that require Node.js internals

For database-dependent auth checks, use a session cookie or JWT that middleware can verify without a DB call, then verify the full token in the page.

---

## Middleware vs layout for auth

Both middleware and layouts can check authentication. When to use each:

| | Middleware | Layout |
|-|-----------|--------|
| Runs on | Edge (before page) | Server (same as page) |
| Can redirect? | Yes | Yes (with `redirect()`) |
| Can access DB? | No | Yes |
| Performance | Faster | Slightly slower |
| Best for | Token/cookie checks | Full session verification |

A common pattern: middleware checks if a token exists (fast), layout verifies the token is valid with the DB (safe).

---

## Logging example

```tsx
export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();

  // Log after the request is handled
  // Note: middleware cannot wait for the response — log before passing through
  console.log(
    `[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`
  );

  return response;
}
```

---

## Where to see this in the demo

`middleware.ts` in this project demonstrates:

1. Request logging for every route
2. A redirect from `/old-blog` to `/blog`
3. Custom response headers (`x-demo-middleware`, `x-pathname`)
4. A commented-out auth guard for `/dashboard` so you can see the pattern

The `config.matcher` is set to exclude static files and Next.js internals.
