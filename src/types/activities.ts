export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  city: { name: string; slug: string; lat: number; lng: number; zoom: number };
  providerName: string;
  providerContact: string | null;
  schedule: string;
  scheduleDays: string[] | null;
  scheduleTime: string | null;
  duration: string | null;
  capacity: number | null;
  price: number;
  currency: string;
  isFree: boolean;
  image: string | null;
  includes: string[];
  skillLevel: string | null;
  status: string;
  viewCount: number;
  bookingCount: number;
  commission: number;
  address: string | null;
  lat: number | null;
  lng: number | null;
}

export interface ActivityBookingData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  tickets: number;
  notes: string;
}

export interface ActivityBookingResult {
  id: string;
  subtotal: number;
  commission: number;
  total: number;
  status: string;
}
