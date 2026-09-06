// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Tests run against a production build rather than `next dev`, because the
// no-flash theme script and the prerendered meta tags are what we care about
// and dev mode adds an extra client-side render pass.
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  // Port 3100, and never reuse an existing server: a stale `next start` left
  // over on :3000 serves asset URLs from an older build, which 404 after any
  // rebuild and silently break every test that needs CSS or hydration.
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 180 * 1000,
  },
});
