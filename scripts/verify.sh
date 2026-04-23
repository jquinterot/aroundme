#!/bin/bash
set -e

echo "=== Step 1: Lint ==="
npm run lint

echo "=== Step 2: Unit Tests ==="
npm run test

echo "=== Step 3: Build ==="
npm run build

echo "=== Step 4: E2E Tests ==="
npx playwright test

echo "=== ALL CHECKS PASSED ==="
