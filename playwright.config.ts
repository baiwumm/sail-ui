import {defineConfig, devices} from "@playwright/test";

// Local escape hatch for machines where the bundled Chromium download is
// unavailable; CI keeps using the pinned Playwright build.
const chromiumChannel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", {open: "never"}]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm --filter @sail-ui/playground preview --port 4173 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(chromiumChannel ? {channel: chromiumChannel} : {}),
      },
    },
    {
      name: "webkit",
      use: {...devices["Desktop Safari"]},
    },
  ],
});
