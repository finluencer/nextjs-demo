# Metadata & SEO

Search engines and social media platforms read `<title>` and `<meta>` tags to understand your pages. Next.js provides a typed API to set these without writing raw HTML.

---

## Static metadata

Export a `metadata` object from any `page.tsx` or `layout.tsx`:

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our team and mission.",
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

Next.js automatically generates:

```html
<title>About Us</title>
<meta name="description" content="Learn more about our team and mission." />
```

---

## Metadata in layouts

Metadata in `layout.tsx` applies to all pages in that folder unless a page overrides it.

```tsx
// app/layout.tsx — global defaults
export const metadata: Metadata = {
  title: "My App",
  description: "Default description for all pages",
};
```

```tsx
// app/about/page.tsx — overrides the layout's title for /about only
export const metadata: Metadata = {
  title: "About Us",     // replaces "My App"
  // description not set → inherits "Default description for all pages"
};
```

---

## Title templates

Instead of repeating your site name in every page title, use a template:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: "%s | My App",  // %s = the page's own title
    default: "My App",         // shown when a page has no title
  },
};
```

```tsx
// app/about/page.tsx
export const metadata: Metadata = {
  title: "About Us",  // browser shows: "About Us | My App"
};
```

The blog layout in this demo uses this pattern — see `app/blog/layout.tsx`.

---

## Dynamic metadata

When page content depends on data (like a blog post), generate metadata from that data:

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 150), // first 150 chars as description
  };
}
```

`generateMetadata` receives the same `params` as your page component, so you can fetch the same data to build the title and description.

---

## Open Graph (social media previews)

When someone shares your URL on Twitter, LinkedIn, or Slack, these platforms read Open Graph tags to build the preview card.

```tsx
export const metadata: Metadata = {
  title: "My Blog Post",
  description: "A great article about Next.js",
  openGraph: {
    title: "My Blog Post",
    description: "A great article about Next.js",
    images: [
      {
        url: "https://example.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Blog Post",
    description: "A great article about Next.js",
    images: ["https://example.com/og-image.png"],
  },
};
```

---

## Robots and canonical URLs

```tsx
export const metadata: Metadata = {
  // Tell search engines not to index this page
  robots: {
    index: false,
    follow: false,
  },

  // Tell search engines the "official" URL of this page
  alternates: {
    canonical: "https://example.com/about",
  },
};
```

---

## Other common metadata fields

```tsx
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description for search results",

  // Favicon (place icon.png in app/ folder — Next.js picks it up automatically)
  // No code needed for favicon — just create app/icon.png

  // Keywords (less important for SEO today, but still used)
  keywords: ["Next.js", "React", "tutorial"],

  // Author
  authors: [{ name: "Jane Doe", url: "https://janedoe.com" }],

  // Stop search engines from indexing (useful for staging/admin pages)
  robots: "noindex, nofollow",
};
```

---

## Metadata priority (which one wins?)

When multiple `metadata` exports exist in the layout stack, they merge. More specific routes override less specific ones for the same field.

```
app/layout.tsx          → title: "My App"
  app/blog/layout.tsx   → title: { template: "%s | Blog — My App" }
    app/blog/page.tsx   → title: "All Posts"
```

Result for `/blog`: `"All Posts | Blog — My App"`

---

## Where to see this in the demo

- `app/layout.tsx` — global title and description
- `app/about/page.tsx` — static per-page metadata
- `app/blog/layout.tsx` — title template for the blog section
- `app/blog/[slug]/page.tsx` — `generateMetadata` for dynamic post titles
- `app/contact/page.tsx` — page-level metadata override
