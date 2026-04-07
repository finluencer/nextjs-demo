/**
 * ROOT LAYOUT (app/layout.tsx)
 * ─────────────────────────────────────────────────────────────────────────────
 * Every page in the App Router is wrapped by this layout.
 * Think of it as the "shell" of your application — it renders ONCE and
 * persists across page navigations (no full re-mount).
 *
 * Key Concepts Demonstrated:
 *  - Metadata API  : Set <title> and <meta> tags from a single export
 *  - RootLayout    : Required wrapper; must include <html> and <body> tags
 *  - children prop : Slot where the active page/nested layout is injected
 *  - next/font     : Load Google Fonts with zero layout shift, no external request
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";

// ─── Font Optimization (next/font) ───────────────────────────────────────────
// next/font downloads the font at BUILD TIME and self-hosts it.
// Benefits:
//   - Zero layout shift (font is available before page renders)
//   - No request to Google's servers at runtime (better privacy + performance)
//   - Automatic font subsetting (only downloads the characters you use)
//
// The `inter` object has a `.className` property you apply to your <body>.
const inter = Inter({
  subsets: ["latin"],    // Only download Latin characters (not Chinese, Arabic, etc.)
  display: "swap",       // Show fallback font while loading, swap when ready
  variable: "--font-inter", // Optional: expose as a CSS variable for custom usage
});

// ─── Metadata API ────────────────────────────────────────────────────────────
// Next.js reads this object and automatically generates the correct <head> tags.
// No need to manually write <title> or <meta> inside JSX.
export const metadata: Metadata = {
  title: "Next.js Demo App",
  description: "A demo project showing how Next.js App Router works",
};

// ─── Root Layout Component ────────────────────────────────────────────────────
// This is a SERVER COMPONENT by default (no "use client" directive needed).
// It receives `children` which Next.js fills with the matched page or layout.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // The active page content injected here
}) {
  return (
    <html lang="en" className={inter.variable}>
      {/*
        inter.className applies the Inter font to the entire page.
        inter.variable makes it available as var(--font-inter) in CSS.
        Both techniques work — className is simpler; variable is more flexible.
      */}
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>

        {/* ── Global Navigation ─────────────────────────────────────────────
            This nav renders on EVERY page because it lives in the root layout.
            Change it here once → updates everywhere automatically.          */}
        <nav style={{ background: "#0070f3", color: "#fff", padding: "12px 24px", display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>🏠 Home</a>
          <a href="/about" style={{ color: "#fff", textDecoration: "none" }}>About</a>
          <a href="/blog" style={{ color: "#fff", textDecoration: "none" }}>Blog</a>
          <a href="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</a>
          <a href="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
        </nav>

        {/* ── Page Content ──────────────────────────────────────────────────
            `children` is replaced by the active route's page.tsx             */}
        <main style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}>
          {children}
        </main>

        {/* ── Global Footer ─────────────────────────────────────────────── */}
        <footer style={{ textAlign: "center", padding: "24px", borderTop: "1px solid #eee", color: "#888", fontSize: "14px" }}>
          Built with Next.js App Router — Demo Project
        </footer>

      </body>
    </html>
  );
}
