import { APIRequestContext } from '@playwright/test';

export interface ApiResponse<T = unknown> {
  success: boolean;
  status?: number;
  data?: T;
  error?: string;
  code?: string;
  errorId?: string;
  timestamp?: string;
}

export class ApiClient {
  private request: APIRequestContext;
  private sessionCookie?: string;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.request = request;
    // Use provided baseUrl, API_BASE_URL env var, or default
    this.baseUrl = baseUrl || process.env.API_BASE_URL || 'http://localhost:3000/api';
    // Remove trailing slash if present
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  setSessionCookie(cookie: string) {
    this.sessionCookie = cookie;
  }

  private extractSessionCookie(headers: { [key: string]: string | string[] }): void {
    // Try different header name variations
    const setCookieHeader = headers['set-cookie'] || headers['Set-Cookie'] || headers['SET-COOKIE'];
    if (!setCookieHeader) return;

    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    for (const cookie of cookies) {
      const match = cookie.match(/aroundme_session=([^;]+)/);
      if (match) {
        this.sessionCookie = match[1];
        break;
      }
    }
  }

  async requestWithAuth<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.sessionCookie) {
      headers['Cookie'] = `aroundme_session=${this.sessionCookie}`;
    }

    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${path}`;

    try {
      let response;
      
      switch (method) {
        case 'GET':
          response = await this.request.get(url, { headers });
          break;
        case 'POST':
          response = await this.request.post(url, {
            headers,
            data: data ? JSON.stringify(data) : undefined,
          });
          break;
        case 'PUT':
          response = await this.request.put(url, {
            headers,
            data: data ? JSON.stringify(data) : undefined,
          });
          break;
        case 'DELETE':
          response = await this.request.delete(url, { headers });
          break;
      }

      // Capture session cookie from Set-Cookie header
      const responseHeaders = response.headers();
      this.extractSessionCookie(responseHeaders);

      const responseData = await response.json().catch(() => ({}));

      return {
        success: response.ok() && responseData.success !== false,
        status: response.status(),
        data: responseData.data,
        error: responseData.error,
        code: responseData.code,
        errorId: responseData.errorId,
        timestamp: responseData.timestamp,
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        error: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ id: string; email: string; name: string }>> {
    return this.requestWithAuth('POST', '/auth/login', { email, password });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.requestWithAuth('POST', '/auth/logout');
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ id: string; email: string }>> {
    return this.requestWithAuth('POST', '/auth/register', { email, password, name });
  }

  // Event endpoints
  async getEvents(citySlug: string): Promise<ApiResponse<Array<{ id: string; title: string }>>> {
    return this.requestWithAuth('GET', `/cities/${citySlug}/events`);
  }

  async getEvent(id: string): Promise<ApiResponse<{ id: string; title: string; description: string }>> {
    return this.requestWithAuth('GET', `/events/${id}`);
  }

  async createEvent(data: Record<string, unknown>): Promise<ApiResponse<{ id: string; title: string }>> {
    return this.requestWithAuth('POST', '/events', data);
  }

  async updateEvent(id: string, data: Record<string, unknown>): Promise<ApiResponse<void>> {
    return this.requestWithAuth('PUT', `/events/${id}`, data);
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.requestWithAuth('DELETE', `/events/${id}`);
  }

  async rsvpToEvent(id: string, status: 'going' | 'interested' | 'maybe'): Promise<ApiResponse<{ rsvp: { id: string; status: string } }>> {
    return this.requestWithAuth('POST', `/events/${id}/rsvp`, { status });
  }

  // Place endpoints
  async getPlaces(citySlug: string): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    return this.requestWithAuth('GET', `/cities/${citySlug}/places`);
  }

  async getPlace(id: string): Promise<ApiResponse<{ id: string; name: string }>> {
    return this.requestWithAuth('GET', `/places/${id}`);
  }

  async createPlace(data: Record<string, unknown>): Promise<ApiResponse<{ id: string; name: string }>> {
    return this.requestWithAuth('POST', '/places', data);
  }
}

export function createApiClient(request: APIRequestContext, baseUrl?: string): ApiClient {
  return new ApiClient(request, baseUrl);
}
