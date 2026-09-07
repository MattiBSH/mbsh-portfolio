/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first, WebP as the fallback. Without this Next only negotiates WebP,
    // and the profile photo is the LCP element on the front page — it was
    // arriving at ~1.7s as a 140 kB WebP. AVIF is typically 30-50% smaller for
    // photographic content at the same perceived quality.
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
