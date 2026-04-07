/**
 * NEXT.JS CONFIGURATION (next.config.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is loaded at BUILD TIME and DEV SERVER start.
 * It configures the Next.js compiler, bundler, and runtime behavior.
 *
 * Key Options Explained:
 *  - reactStrictMode   : Enables React's strict mode — surfaces potential bugs
 *                        by double-invoking some lifecycle methods in development.
 *  - images.domains    : Whitelist external domains for the Next.js Image component.
 *  - env               : Expose custom env vars to the client bundle.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ── Strict Mode ────────────────────────────────────────────────────────────
  // Highly recommended during development. Helps catch issues early.
  reactStrictMode: true,

  // ── Image Optimization ─────────────────────────────────────────────────────
  // Add any external hostnames your <Image> components will load from.
  // Example: images from "images.unsplash.com" or "cdn.yourapi.com"
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // example — remove if unused
      },
    ],
  },

  // ── Environment Variables (public) ─────────────────────────────────────────
  // Variables prefixed with NEXT_PUBLIC_ are automatically exposed to the browser.
  // Never put secrets here — use server-side env vars (process.env) for those.
  // env: {
  //   NEXT_PUBLIC_APP_VERSION: "1.0.0",
  // },
};

module.exports = nextConfig;
