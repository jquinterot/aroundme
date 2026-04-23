# CI/CD Testing Reference for AroundMe

## GitHub Actions Workflows

### 1. Unit Tests Workflow (`unit-tests.yml`)

```yaml
name: Unit Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit-tests:
    name: Vitest Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run test:run
```

**Key points:**
- Runs on every push to main/develop and all PRs
- Cancels previous runs on new push (saves CI minutes)
- Generates Prisma client before running tests
- Uses `npm ci` for deterministic installs

### 2. E2E UI Tests Workflow (`e2e-ui.yml`)

```yaml
name: E2E UI Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  e2e-ui:
    name: UI E2E Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: aroundme_test
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run db:reset
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
      - run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
          NODE_ENV: production
      - name: Start application
        run: |
          npm start &
          for i in {1..30}; do
            if curl -sf http://localhost:3000 > /dev/null; then
              echo "App is ready"; exit 0
            fi
            echo "Waiting... ($i/30)"; sleep 5
          done
          echo "App failed to start"; exit 1
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
          PLAYWRIGHT: 'true'
      - run: npx playwright install chromium
      - run: npm run test:e2e:ui
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-ui
          path: playwright-report/
          retention-days: 7
```

**Key points:**
- PostgreSQL service container for isolated tests
- Full production build (catches build-time errors)
- Waits for app to be ready before running tests
- Uploads screenshots and reports on failure
- Uses `PLAYWRIGHT: 'true'` env var for test detection

### 3. E2E API Tests Workflow (`e2e-api.yml`)

```yaml
name: E2E API Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  e2e-api:
    name: API E2E Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: aroundme_test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run db:reset
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
      - run: npm run test:e2e:api
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public
```

**Key points:**
- API tests can run against dev server (no build needed)
- Faster than UI tests (no browser installation)

### 4. Lint & Build Workflow (`lint-build.yml`)

```yaml
name: Lint and Build
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-build:
    name: Lint and Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run build
```

## CI Environment Variables

Required secrets/vars for CI:
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aroundme_test?schema=public

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production

# Testing
PLAYWRIGHT=true

# Optional (for full integration)
RESEND_API_KEY=re_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

## CI Performance Optimization

### Current Build Times (approximate)

| Step | Time |
|------|------|
| Checkout | 2s |
| Install deps | 30-45s |
| Prisma generate | 5s |
| DB reset + seed | 10s |
| Build | 60-90s |
| Start app | 10s |
| Unit tests | 5s |
| E2E UI tests | 120-180s |
| E2E API tests | 30-60s |

### Optimization Strategies

1. **Cache node_modules** - Already using `actions/setup-node` cache
2. **Cache Prisma client** - Can cache `node_modules/.prisma`
3. **Parallel workflows** - UI and API tests run in parallel
4. **Conditional runs** - Skip E2E if only docs changed:

```yaml
# Add path filters
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

5. **Shard E2E tests** - Split tests across multiple runners:

```yaml
strategy:
  matrix:
    shard: [1/3, 2/3, 3/3]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}
```

## Adding New CI Workflows

When adding a new test suite, create a workflow file:

```yaml
# .github/workflows/new-tests.yml
name: New Test Suite
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  new-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      # Add your test command here
      - run: npm run test:your-suite
```

## CI Failure Response Playbook

### "Unit tests failing in CI but pass locally"

1. Check Node version mismatch (CI uses 20)
2. Check if test depends on `.env.local` (not available in CI)
3. Check if test depends on DB state (use mocks instead)
4. Check for timezone issues (CI is UTC)
5. Run `npm run test:run` locally (not watch mode)

### "E2E tests failing only in CI"

1. Check screenshots in uploaded artifacts
2. Run locally with `PLAYWRIGHT=true npm run dev`
3. Check if test is flaky (timing-dependent)
4. Increase timeout for slow operations
5. Check if element needs scroll into view in headless mode

### "Build failing in CI"

1. Check TypeScript errors: `npx tsc --noEmit`
2. Check for missing environment variables
3. Check Prisma client is generated before build
4. Check for case-sensitive import issues (Linux is case-sensitive)

## Required Status Checks

Configure branch protection rules in GitHub:

**Required checks for `main` and `develop`:**
- [ ] Lint and Build
- [ ] Unit Tests
- [ ] E2E UI Tests
- [ ] E2E API Tests

**Settings:**
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Do not allow bypassing the above settings
