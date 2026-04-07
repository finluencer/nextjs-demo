# API Routes (Route Handlers)

Next.js lets you build a backend API inside the same project as your frontend. No separate Express server needed.

---

## What are API routes?

A file named `route.ts` inside the `app/` folder creates an HTTP endpoint. Instead of returning JSX (HTML), it returns JSON (or any other data format).

```
app/api/blog/route.ts   →  GET /api/blog
```

---

## Basic structure

Export named functions for each HTTP method you want to support:

```tsx
// app/api/hello/route.ts
import { NextResponse } from "next/server";

// Handles GET /api/hello
export async function GET() {
  return NextResponse.json({ message: "Hello, World!" });
}

// Handles POST /api/hello
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
```

Supported method names: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

---

## Reading the request

### Query parameters (URL `?key=value`)

```tsx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id   = searchParams.get("id");
  const page = searchParams.get("page") ?? "1";

  return NextResponse.json({ id, page });
}
```

Visit `/api/hello?id=42&page=2` → returns `{ "id": "42", "page": "2" }`

### Request body (JSON from a POST)

```tsx
export async function POST(request: Request) {
  const body = await request.json();
  const { title, content } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // save to database here...
  return NextResponse.json({ success: true, title }, { status: 201 });
}
```

### Dynamic route parameters

Combine `route.ts` with a dynamic folder like `[id]`:

```
app/api/posts/[id]/route.ts  →  /api/posts/42
```

```tsx
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await db.findPost(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}
```

---

## HTTP status codes

Always return the right status code so clients know what happened:

```tsx
// 200 OK — default, everything worked
return NextResponse.json(data);

// 201 Created — new resource was created
return NextResponse.json(newItem, { status: 201 });

// 400 Bad Request — the client sent invalid data
return NextResponse.json({ error: "Missing title" }, { status: 400 });

// 401 Unauthorized — user is not logged in
return NextResponse.json({ error: "Login required" }, { status: 401 });

// 403 Forbidden — user is logged in but not allowed
return NextResponse.json({ error: "Access denied" }, { status: 403 });

// 404 Not Found — the resource does not exist
return NextResponse.json({ error: "Post not found" }, { status: 404 });

// 500 Internal Server Error — something broke on the server
return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
```

---

## Setting response headers

```tsx
export async function GET() {
  return NextResponse.json(
    { data: "example" },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60", // cache this response for 60s
        "X-Custom-Header": "my-value",
      },
    }
  );
}
```

---

## Caching API routes

By default, GET route handlers are cached. To always fetch fresh data:

```tsx
export const dynamic = "force-dynamic"; // disable caching for this route

export async function GET() {
  // This will run on every request
}
```

---

## Error handling pattern

Wrap your logic in a try/catch so errors never crash the server:

```tsx
export async function GET(request: Request) {
  try {
    const data = await fetchSomeData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

---

## Calling your API from a Server Component

When a Server Component calls your own API route, use the full URL:

```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res  = await fetch(`${base}/api/blog`);
  const data = await res.json();
}
```

In a real app you might skip the API call and call the database function directly from the Server Component. The API route is useful when you want to expose the data to external apps too.

---

## Do you always need an API route?

Not always. In Next.js App Router, you have an alternative:

| Need | Solution |
|------|----------|
| Fetch data for a page | `async` Server Component (no API route needed) |
| Handle a form submission | Server Action (no API route needed) |
| Expose data to external apps | API route |
| Called from a mobile app | API route |
| Called from a Client Component | API route or Server Action |

---

## The demo's API route

Look at `app/api/blog/route.ts`. It:

1. Proxies requests to JSONPlaceholder (a free fake API)
2. Supports `GET` with `?id=`, `?page=`, `?limit=`, `?userId=` query params
3. Supports `POST` to simulate creating a post
4. Has proper error handling with correct status codes
5. Returns a consistent response shape: `{ success, data, pagination, source }`

Try it in your browser:
- `http://localhost:3000/api/blog` — list of posts
- `http://localhost:3000/api/blog?id=1` — single post
- `http://localhost:3000/api/blog?page=2&limit=5` — paginated
