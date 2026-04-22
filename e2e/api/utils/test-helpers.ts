import { APIRequestContext, expect } from '@playwright/test';
import { ApiClient, ApiResponse } from './api-client';
import { TestUser } from '../types';

/**
 * API Test Utilities
 * 
 * Best Practices for API Testing:
 * - Data isolation
 * - Cleanup after tests
 * - Authentication helpers
 * - Retry logic
 */

/**
 * Create authenticated API client
 */
export async function createAuthenticatedClient(
  request: APIRequestContext,
  user: TestUser,
  baseUrl?: string
): Promise<ApiClient> {
  const client = new ApiClient(request, baseUrl);
  
  // Use unique email to avoid conflicts between parallel tests
  const uniqueEmail = `${user.email.split('@')[0]}+${Date.now()}@${user.email.split('@')[1]}`;
  
  try {
    const response = await client.login(uniqueEmail, user.password);
    if (!response.success) {
      // Register if user doesn't exist
      await client.register(uniqueEmail, user.password, user.name);
      await client.login(uniqueEmail, user.password);
    }
  } catch {
    // If login/register fails, try with original email
    try {
      const response = await client.login(user.email, user.password);
      if (!response.success) {
        await client.register(user.email, user.password, user.name);
        await client.login(user.email, user.password);
      }
    } catch {
      // Continue without authentication - test will fail with proper error
    }
  }
  
  return client;
}

/**
 * Cleanup test data
 */
export async function cleanupTestData(client: ApiClient, ids: { events?: string[]; places?: string[] }): Promise<void> {
  // Delete test events
  if (ids.events) {
    for (const id of ids.events) {
      try {
        await client.deleteEvent(id);
      } catch {
        // Ignore errors during cleanup
      }
    }
  }
  
  // Delete test places
  if (ids.places) {
    for (const id of ids.places) {
      try {
        await client.requestWithAuth('DELETE', `/places/${id}`);
      } catch {
        // Ignore errors during cleanup
      }
    }
  }
}

/**
 * Verify standard error response
 */
export function verifyErrorResponse<T = unknown>(
  response: ApiResponse<T>,
  expectedStatus: number,
  expectedCode?: string
): void {
  expect(response.success).toBe(false);
  expect(response.status).toBe(expectedStatus);
  
  if (response.errorId) {
    expect(response.errorId).toBeDefined();
  }
  if (response.timestamp) {
    expect(response.timestamp).toBeDefined();
  }
  
  if (expectedCode) {
    expect(response.code).toBe(expectedCode);
  }
}

/**
 * Verify standard success response
 */
export function verifySuccessResponse<T = unknown>(response: ApiResponse<T>): void {
  expect(response.success).toBe(true);
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 500 } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, i)));
    }
  }
  
  throw new Error('API call failed after retries');
}

/**
 * Wait for database consistency
 */
export async function waitForDbConsistency(delay: number = 500): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Assert field validation error
 */
export function assertFieldError(
  response: ApiResponse,
  fieldName: string,
  expectedMessage?: string
): void {
  expect(response.success).toBe(false);
  expect(response.code).toBe('VALIDATION_ERROR');
  
  if (expectedMessage) {
    expect(response.error).toContain(expectedMessage);
  } else {
    expect(response.error).toContain(fieldName);
  }
}

/**
 * Assert pagination response
 */
export function assertPaginationResponse(
  response: ApiResponse,
  expectedPage: number,
  expectedLimit: number
): void {
  expect(response.success).toBe(true);
  expect(response.data).toBeDefined();
  const data = response.data as unknown[];
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeLessThanOrEqual(expectedLimit);
}

/**
 * Test data collector for cleanup
 */
export class TestDataCollector {
  private eventIds: string[] = [];
  private placeIds: string[] = [];
  private userIds: string[] = [];

  addEvent(id: string): void {
    this.eventIds.push(id);
  }

  addPlace(id: string): void {
    this.placeIds.push(id);
  }

  addUser(id: string): void {
    this.userIds.push(id);
  }

  getEventIds(): string[] {
    return [...this.eventIds];
  }

  getPlaceIds(): string[] {
    return [...this.placeIds];
  }

  getUserIds(): string[] {
    return [...this.userIds];
  }

  clear(): void {
    this.eventIds = [];
    this.placeIds = [];
    this.userIds = [];
  }
}

/**
 * Log API request/response for debugging
 */
export function logApiRequest(
  method: string,
  endpoint: string,
  data?: Record<string, unknown>
): void {
  if (process.env.DEBUG_API) {
    console.log(`[API] ${method} ${endpoint}`, data ? { body: data } : '');
  }
}

export function logApiResponse(response: ApiResponse): void {
  if (process.env.DEBUG_API) {
    console.log(`[API Response]`, {
      success: response.success,
      status: response.status,
      code: response.code,
      error: response.error,
      data: response.data ? '<data>' : undefined,
    });
  }
}

interface TestResult {
  status: 'passed' | 'failed' | 'skipped';
  duration?: number;
}

/**
 * Generate test report data
 */
export function generateApiTestReport(testResults: TestResult[]): object {
  return {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    skipped: testResults.filter(r => r.status === 'skipped').length,
    duration: testResults.reduce((sum, r) => sum + (r.duration || 0), 0),
  };
}

// Re-export test from playwright for test steps
export { test } from '@playwright/test';
