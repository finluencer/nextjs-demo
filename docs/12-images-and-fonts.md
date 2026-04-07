# Images & Fonts

Next.js has built-in components that automatically optimize images and fonts. These features improve performance and page load scores without any extra configuration.

---

## next/image — Image Optimization

Import `Image` from `"next/image"` instead of using a plain `<img>` tag:

```tsx
import Image from "next/image";

export default function ProfileCard() {
  return (
    <Image
      src="/profile.jpg"     // path relative to the public/ folder
      alt="Jane Doe"         // required for accessibility
      width={400}            // original image width in pixels
      height={300}           // original image height in pixels
    />
  );
}
```

That is all you need. Next.js automatically:

- **Compresses** the image (reduces file size)
- **Converts** to modern formats like WebP and AVIF (smaller than JPEG/PNG)
- **Resizes** based on the device screen size (serves a small image to phones)
- **Lazy loads** by default (only loads when the image scrolls into view)
- **Prevents layout shift** (reserves space before the image loads)

---

## Local images (in `public/` folder)

Put images in the `public/` folder. Reference them starting from the root `/`:

```
public/
├── profile.jpg
└── logo.png
```

```tsx
<Image src="/profile.jpg" alt="Profile" width={400} height={300} />
<Image src="/logo.png"    alt="Logo"    width={120} height={40} />
```

---

## Remote images

To use images hosted on external URLs (like a CDN or image service), you must allow the domain in `next.config.js`:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
```

Then use the full URL in your component:

```tsx
<Image
  src="https://images.unsplash.com/photo-xyz"
  alt="A mountain"
  width={800}
  height={600}
/>
```

The `remotePatterns` setting prevents attackers from using your image optimization API to process arbitrary URLs.

---

## Fill mode — image takes up the parent container

Use `fill` when you want the image to fill its container and you do not know the exact dimensions:

```tsx
<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <Image
    src="/hero.jpg"
    alt="Hero banner"
    fill
    style={{ objectFit: "cover" }} // crop to fill, no stretching
  />
</div>
```

The parent container must have `position: relative` (or `absolute`/`fixed`).

---

## Priority images

Images above the fold (visible without scrolling) should load eagerly. Add the `priority` prop:

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={400}
  priority  // preload this image — do not lazy load
/>
```

Add `priority` to your largest visible image (the "LCP element"). This improves your Largest Contentful Paint score, which affects SEO rankings.

---

## Common Image props

| Prop | Purpose |
|------|---------|
| `src` | Path or URL of the image (required) |
| `alt` | Accessible description (required) |
| `width` | Width in pixels (required unless `fill`) |
| `height` | Height in pixels (required unless `fill`) |
| `fill` | Image fills the parent container |
| `priority` | Load eagerly (above the fold) |
| `quality` | Compression 1–100, default 75 |
| `placeholder="blur"` | Show a blurred preview while loading |
| `sizes` | Hint for browser about display size |

---

## next/font — Font Optimization

Import fonts directly from `"next/font/google"`. Next.js downloads the font at build time and self-hosts it.

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

Apply `inter.className` to any element to use the font for that element and its children.

---

## Why next/font instead of a `<link>` tag?

Traditional approach (slower):
```html
<!-- Requires a network request to Google's servers at page load -->
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
```

Problems:
- Extra DNS lookup and HTTP request on every page load
- Fonts can cause layout shift (page "jumps" when font loads)
- Sends user's IP to Google (privacy concern)

next/font approach:
- Downloads the font file at build time
- Serves from your own domain (no external request)
- No layout shift (font is available immediately)
- Automatic font subsetting (only downloads the characters you use)

---

## Using a CSS variable for more flexibility

Instead of `className`, expose the font as a CSS variable:

```tsx
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",  // creates var(--font-inter)
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>  {/* set the variable on html */}
      <body style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}
```

This is useful when you use a CSS-in-JS library or CSS modules that reference the variable.

---

## Multiple fonts

```tsx
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  );
}
```

Now you can use `var(--font-serif)` for headings and `var(--font-sans)` for body text.

---

## Local fonts

For custom fonts that are not on Google Fonts:

```tsx
import localFont from "next/font/local";

const myFont = localFont({
  src: "./my-font.woff2",  // path relative to the file
  display: "swap",
});
```

---

## Where to see this in the demo

- `app/layout.tsx` — `Inter` font loaded with `next/font/google`, applied via `inter.className`
- `next.config.js` — `remotePatterns` configured for Unsplash images
