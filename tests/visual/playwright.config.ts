import {defineConfig, devices} from "@playwright/test";

const chromiumChannel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
  testDir: ".",
  testMatch: "*.visual.ts",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
    viewport: {width: 1280, height: 900},
    deviceScaleFactor: 1,
  },
  webServer: [
    {
      command:
        "pnpm --filter @sail-ui/playground preview --port 4173 --strictPort --host 127.0.0.1",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @sail-ui/reference-react preview --host 127.0.0.1",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {width: 1280, height: 900},
        deviceScaleFactor: 1,
        ...(chromiumChannel ? {channel: chromiumChannel} : {}),
      },
    },
  ],
});
