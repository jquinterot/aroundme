import { TestUser } from '../steps/auth.steps';

/**
 * User Factory — creates test users with sensible defaults
 * 
 * Pattern: Factory Pattern
 * Usage:
 * const user = UserFactory.create();
 * const admin = UserFactory.createAdmin();
 * const custom = UserFactory.create({ name: 'John' });
 */

export class UserFactory {
  static create(overrides: Partial<TestUser> = {}): TestUser {
    const timestamp = Date.now();
    return {
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
      ...overrides,
    };
  }

  static createAdmin(): TestUser {
    return {
      email: 'admin@aroundme.co',
      password: 'admin123',
      name: 'Admin User',
    };
  }
}
