import { defineConfig, devices } from "@playwright/test";

const defaultBaseURL = "http://localhost:3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseURL;
const shouldStartLocalServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: shouldStartLocalServer
    ? {
        command: "npm run dev -- --port 3100",
        url: baseURL,
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
      }
    : undefined,
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
