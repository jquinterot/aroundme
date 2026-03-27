import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for AroundMe E2E tests
 * 
 * Structure:
 * - e2e/ui/     : UI/End-to-end tests with browser automation
 * - e2e/api/    : API tests using request context
 * 
 * Commands:
 * - npm run test:e2e:ui        : Run UI tests
 * - npm run test:e2e:api       : Run API tests
 * - npm run test:e2e:all       : Run all E2E tests
 */

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
  
  // UI Tests Configuration (chromium)
  projects: [
    {
      name: 'chromium',
      testMatch: /ui\/.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    
    // API Tests Configuration
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts$/,
      use: {
        baseURL: 'http://localhost:3000/api',
      },
    },
  ],
  
  // Development server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  
  // Global settings
  expect: {
    timeout: 10000,
  },
  
  // Test timeout
  timeout: 30 * 1000,
});