// Business configuration constants
// These should be configurable via environment variables or admin settings in production

export const BUSINESS_CONFIG = {
  // Commission rates
  defaultCommission: 0.08, // 8% default commission for activities
  platformFeePercent: 0.10, // 10% platform fee
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Email
  emailFromName: 'AroundMe',
  emailFromAddress: 'noreply@aroundme.app',
  
  // Booking
  maxTicketsPerBooking: 10,
  minTicketsPerBooking: 1,
  
  // Reviews
  maxReviewLength: 2000,
  minRating: 1,
  maxRating: 5,
  
  // Timeouts
  bookingExpirationMinutes: 15,
  sessionExpirationDays: 7,
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;
