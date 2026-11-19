import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure', reducedMotion: 'reduce' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Locally: build then preview, so `yarn e2e` is self-contained and works without yarn on PATH.
    // In CI the test job has already built (after check and unit tests), so only preview runs.
    // `vite build` skips the prebuild/check hooks of `yarn build`: the data file is committed.
    command: process.env.CI
      ? 'npx vite preview --port 4173 --strictPort'
      : 'npx vite build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/compscie/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
