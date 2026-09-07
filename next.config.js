/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Inlines the CSS needed for the first paint into <head> and loads the rest
    // asynchronously, removing the two render-blocking stylesheet requests.
    // Needs the `critters` package. Verify with `npm test` after changing it:
    // critters decides what is "critical" by scanning the markup, and anything
    // it misses would flash unstyled.
    optimizeCss: true,
  },
  images: {
    // AVIF first, WebP as the fallback. Without this Next only negotiates WebP,
    // and the profile photo is the LCP element on the front page — it was
    // arriving at ~1.7s as a 140 kB WebP. AVIF is typically 30-50% smaller for
    // photographic content at the same perceived quality.
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
