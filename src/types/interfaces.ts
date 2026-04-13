import type { Event, Place, User, Experience } from '@/types';

export interface IEventRepository {
  findById(id: string): Promise<Event | null>;
  findByCity(cityId: string, filters?: Record<string, unknown>): Promise<Event[]>;
  create(data: Record<string, unknown>): Promise<Event>;
  update(id: string, data: Record<string, unknown>): Promise<Event>;
  delete(id: string): Promise<void>;
}

export interface IPlaceRepository {
  findById(id: string): Promise<Place | null>;
  findByCity(cityId: string, filters?: Record<string, unknown>): Promise<Place[]>;
  create(data: Record<string, unknown>): Promise<Place>;
  update(id: string, data: Record<string, unknown>): Promise<Place>;
  delete(id: string): Promise<void>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Record<string, unknown>): Promise<User>;
  update(id: string, data: Record<string, unknown>): Promise<User>;
}

export interface IExperienceRepository {
  findById(id: string): Promise<Experience | null>;
  findByCity(cityId: string): Promise<Experience[]>;
  create(data: Record<string, unknown>): Promise<Experience>;
  book(experienceId: string, userId: string, data: Record<string, unknown>): Promise<unknown>;
}

export interface ISessionRepository {
  create(userId: string): Promise<string>;
  validate(token: string): Promise<User | null>;
  invalidate(token: string): Promise<void>;
}

export interface INotificationRepository {
  create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
  }): Promise<void>;
  findByUser(userId: string): Promise<unknown[]>;
  markAsRead(id: string): Promise<void>;
}

export interface IEmailService {
  send(params: {
    template: string;
    userId: string;
    data: Record<string, string>;
  }): Promise<boolean>;
}

export interface IPaymentService {
  createCheckoutSession(params: {
    items: Array<{ ticketTypeId: string; quantity: number }>;
    email: string;
    name: string;
    userId: string;
  }): Promise<{ sessionId: string; url: string }>;
  handleWebhook(payload: unknown): Promise<void>;
}
