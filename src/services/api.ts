import { FilterParams, PlaceFilterParams, ApiResponse, City, Event, Place, Review } from '@/types';

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

const API_BASE = getBaseUrl() + '/api';

export interface CreateEventPayload {
  citySlug: string;
  title: string;
  description: string;
  category: string;
  venueName: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  isFree: boolean;
  price?: string;
  imageUrl?: string;
  tags?: string;
}

export interface CreatePlacePayload {
  citySlug: string;
  name: string;
  description: string;
  category: string;
  address: string;
  lat?: number;
  lng?: number;
  website?: string;
  instagram?: string;
  features?: string;
  imageUrl?: string;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

class ApiService {
  private async fetchWithRetry<T>(
    url: string,
    method: string = 'GET',
    body?: unknown,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        const errorText = await res.text().catch(() => 'Unable to read response');
        const parseMsg = parseError instanceof Error ? parseError.message : 'JSON parse failed';
        console.error('API Error: Failed to parse response. Status: ' + res.status + ', URL: ' + url + ', ParseError: ' + parseMsg + ', ResponseText: ' + errorText);
        return {
          success: false,
          error: `Server returned invalid response (${res.status}). Please try again.`,
        };
      }
      
      if (!res.ok) {
        const shouldRetry = attempt < retryConfig.maxRetries && 
                          retryConfig.retryableStatuses.includes(res.status);
        
        if (shouldRetry) {
          console.warn(`API request failed with status ${res.status}, retrying... (${attempt}/${retryConfig.maxRetries})`);
          await this.delay(retryConfig.retryDelay * attempt);
          return this.fetchWithRetry(url, method, body, retryConfig, attempt + 1);
        }
        
        const errorMsg = data?.error || this.getHttpErrorMessage(res.status);
        const errorCode = data?.code || 'UNKNOWN_ERROR';
        const responseStr = JSON.stringify(data);
        console.error('API Error: Status=' + res.status + ', URL=' + url + ', Error=' + errorMsg + ', Code=' + errorCode + ', Response=' + responseStr);
        return {
          success: false,
          error: errorMsg,
        };
      }
      
      return data;
    } catch (err) {
      const isNetworkError = err instanceof TypeError || 
                            (err instanceof Error && err.message.includes('fetch'));
      
      if (isNetworkError && attempt < retryConfig.maxRetries) {
        console.warn(`Network error, retrying... (${attempt}/${retryConfig.maxRetries})`);
        await this.delay(retryConfig.retryDelay * attempt);
        return this.fetchWithRetry(url, method, body, retryConfig, attempt + 1);
      }
      
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('API Error: Network/fetch failed. URL=' + url + ', Error=' + errMsg);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error. Please check your connection.',
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetch<T>(url: string, method: string = 'GET', body?: unknown): Promise<ApiResponse<T>> {
    return this.fetchWithRetry(url, method, body);
  }

  private getHttpErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified. Please try again later.';
      default:
        return `Request failed (${status}). Please try again.`;
    }
  }

  async getCities(): Promise<ApiResponse<City[]>> {
    return this.fetch<City[]>(`${API_BASE}/cities`);
  }

  async getEvents(citySlug: string, filters?: Partial<FilterParams>): Promise<ApiResponse<Event[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category && filters.category !== 'all') {
      params.set('category', filters.category);
    }
    if (filters?.date && filters.date !== 'all') {
      params.set('date', filters.date);
    }
    if (filters?.price && filters.price !== 'all') {
      params.set('price', filters.price);
    }
    if (filters?.search) {
      params.set('search', filters.search);
    }
    if (filters?.page) {
      params.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.set('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    return this.fetch<Event[]>(`${API_BASE}/cities/${citySlug}/events${queryString ? `?${queryString}` : ''}`);
  }

  async getCity(slug: string): Promise<ApiResponse<City>> {
    const citiesResponse = await this.getCities();
    
    if (!citiesResponse.success || !citiesResponse.data) {
      return { success: false, error: 'Failed to fetch cities' };
    }

    const city = citiesResponse.data.find((c) => c.slug === slug);
    
    if (!city) {
      return { success: false, error: 'City not found' };
    }

    return { success: true, data: city };
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return this.fetch<Event>(`${API_BASE}/events/${id}`);
  }

  async getPlaces(citySlug: string, filters?: Partial<PlaceFilterParams>): Promise<ApiResponse<Place[]>> {
    const params = new URLSearchParams();
    
    if (filters?.category && filters.category !== 'all') {
      params.set('category', filters.category);
    }
    if (filters?.search) {
      params.set('search', filters.search);
    }
    if (filters?.page) {
      params.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.set('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    return this.fetch<Place[]>(`${API_BASE}/cities/${citySlug}/places${queryString ? `?${queryString}` : ''}`);
  }

  async getPlaceById(id: string): Promise<ApiResponse<Place>> {
    return this.fetch<Place>(`${API_BASE}/places/${id}`);
  }

  async getPlaceReviews(id: string): Promise<ApiResponse<Review[]>> {
    return this.fetch<Review[]>(`${API_BASE}/places/${id}/reviews`);
  }

  private async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return this.fetch<T>(url, 'POST', data);
  }

  async createEvent(payload: CreateEventPayload): Promise<ApiResponse<{ id: string; title: string; status: string }>> {
    return this.post(`${API_BASE}/events`, payload);
  }

  async createPlace(payload: CreatePlacePayload): Promise<ApiResponse<{ id: string; name: string; isVerified: boolean }>> {
    return this.post(`${API_BASE}/places`, payload);
  }

  async featureEvent(id: string, tier: 'basic' | 'premium', userId: string): Promise<ApiResponse<{ isFeatured: boolean; featuredUntil: string; featuredTier: string; tierInfo: { durationDays: number; priceCOP: number; label: string } }>> {
    return this.post(`${API_BASE}/events/${id}/feature`, { tier, userId });
  }

  async removeFeature(id: string): Promise<ApiResponse<{ isFeatured: boolean }>> {
    return this.fetch(`${API_BASE}/events/${id}/feature`);
  }
}

export const apiService = new ApiService();
