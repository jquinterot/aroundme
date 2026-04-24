import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Architect refactoring tests', () => {
  describe('PlaceCardBadges color mapping', () => {
    it('should export all badge components after refactor', async () => {
      const placeCardBadgesModule = await import('@/components/places/PlaceCardBadges');
      expect(placeCardBadgesModule.PlaceCategoryBadge).toBeDefined();
      expect(placeCardBadgesModule.PlaceVerifiedBadge).toBeDefined();
      expect(placeCardBadgesModule.PlacePriceRange).toBeDefined();
      expect(placeCardBadgesModule.PlaceRating).toBeDefined();
    });

    it('should not use dynamic template literals for dark classes', () => {
      const filePath = path.join(process.cwd(), 'src/components/places/PlaceCardBadges.tsx');
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toContain('dark:${');
      expect(content).toContain('dark:bg-orange-900/50');
    });
  });

  describe('Social component exports', () => {
    it('should export UserCard, ActivityCard, and FollowersList from social index', async () => {
      const social = await import('@/components/social');
      expect(social.UserCard).toBeDefined();
      expect(social.ActivityCard).toBeDefined();
      expect(social.FollowersList).toBeDefined();
    });
  });

  describe('RouteError component', () => {
    it('should export RouteError from error directory', async () => {
      const { default: RouteError } = await import('@/components/error/RouteError');
      expect(RouteError).toBeDefined();
      expect(typeof RouteError).toBe('function');
    });
  });

  describe('Error boundary consolidation', () => {
    it('should have a shared RouteError component', () => {
      const routeErrorPath = path.join(process.cwd(), 'src/components/error/RouteError.tsx');
      expect(fs.existsSync(routeErrorPath)).toBe(true);
    });

    it('should have thin wrappers in all error.tsx files', () => {
      function findErrorFiles(dir: string, files: string[] = []): string[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            findErrorFiles(fullPath, files);
          } else if (entry.name === 'error.tsx') {
            files.push(fullPath);
          }
        }
        return files;
      }

      const errorFiles = findErrorFiles(path.join(process.cwd(), 'src/app'));
      expect(errorFiles.length).toBeGreaterThan(0);

      for (const file of errorFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content).toContain("import RouteError from '@/components/error/RouteError'");
        expect(content).not.toContain('AlertCircle');
        expect(content).not.toContain('RefreshCw');
      }
    });
  });
});
