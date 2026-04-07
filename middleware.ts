/**
 * MIDDLEWARE (middleware.ts)
 * ─────────────────────────────────────────────────────────────────────────────
 * Middleware runs BEFORE a request reaches your page or API route.
 * It lives at the root of your project (same level as app/).
 *
 * Key Concepts Demonstrated:
 *  - Middleware      : Intercept every request for auth checks, redirects, etc.
 *  - NextResponse    : Rewrite URLs, redirect, or modify response headers
 *  - matcher config  : Limit which routes this middleware runs on
 *  - Request headers : Read and forward custom headers
 *
 * Common use cases for middleware:
 *  - Authentication  : Redirect to /login if user is not signed in
 *  - A/B testing     : Send 50% of users to a variant page
 *  - Geo-routing     : Redirect users based on their country
 *  - Logging         : Record every request for monitoring
 *  - Rate limiting   : Block excessive requests from an IP
 *
 * ⚠️  Important: Middleware runs on the Edge runtime — it must be lightweight.
 *     Do NOT import heavy Node.js libraries here.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Log every request (great for debugging) ────────────────────────────
  // In production, you would send this to your logging service (Datadog, etc.)
  console.log(`[Middleware] ${request.method} ${pathname}`);

  // ── 2. Redirect example: /old-blog → /blog ────────────────────────────────
  // Useful when you rename or move routes and need backward compatibility.
  if (pathname === "/old-blog") {
    return NextResponse.redirect(new URL("/blog", request.url));
  }

  // ── 3. Add custom headers to all responses ────────────────────────────────
  // These headers can be read by pages or external monitoring tools.
  const response = NextResponse.next();
  response.headers.set("x-demo-middleware", "true");
  response.headers.set("x-pathname", pathname);

  // ── 4. Example: simple auth guard for /dashboard ─────────────────────────
  // In a real app, you would verify a session token or JWT here.
  // We check for a query param "?auth=true" just to demonstrate the pattern.
  if (pathname.startsWith("/dashboard")) {
    const isAuthenticated = request.nextUrl.searchParams.get("auth") === "true";

    if (!isAuthenticated) {
      // Uncomment these lines to enable the redirect (currently disabled so
      // the demo /dashboard works without authentication):

      // const loginUrl = new URL("/", request.url);
      // loginUrl.searchParams.set("message", "Please log in to view the dashboard");
      // return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// ── Matcher configuration ─────────────────────────────────────────────────────
// Control WHICH routes trigger this middleware.
// Without a matcher, middleware runs on EVERY request (including static files).
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (Next.js static assets)
     *  - _next/image   (Next.js image optimization)
     *  - favicon.ico   (browser favicon)
     *  - public folder files (images, fonts, etc.)
     *
     * This regex pattern is the standard recommended by Next.js docs.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
