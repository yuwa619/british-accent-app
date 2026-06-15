import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ENABLE_REAL_AI: "false",
      ENABLE_ELEVENLABS: "false",
      ENABLE_STRIPE_CHECKOUT: "false",
      ENABLE_ANALYTICS: "false",
      NEXT_PUBLIC_ENABLE_ANALYTICS: "false",
      ENABLE_SENTRY: "false",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
