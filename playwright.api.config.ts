import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  projects: [
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts$/,
      use: {
        baseURL: 'http://localhost:3000/api',
      },
    },
  ],
  
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: 'production',
      PLAYWRIGHT: 'true',
    },
  },
  
  expect: {
    timeout: 10000,
  },
  
  timeout: 30 * 1000,
});
