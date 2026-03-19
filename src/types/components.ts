import { City, Event, Place, EventCategory, PlaceCategory } from './index';

export interface EventCardProps {
  event: Event;
}

export interface PlaceCardProps {
  place: Place;
}

export interface EventListProps {
  events: Event[];
  viewMode: 'list' | 'map' | 'split';
  city: City;
}

export interface PlaceListProps {
  places: Place[];
  viewMode: 'grid' | 'map';
  city: City;
}

export interface EventMapProps {
  events: Event[];
  city: City;
  selectedEvent?: Event | null;
  onEventSelect?: (event: Event | null) => void;
  className?: string;
}

export interface PlaceMapProps {
  places: Place[];
  city: City;
  selectedPlace?: Place | null;
  onPlaceSelect?: (place: Place | null) => void;
  className?: string;
}

export interface EventFiltersProps {
  onFilterChange: (filters: EventFilterState) => void;
}

export interface EventFilterState {
  category: EventCategory | 'all';
  date: 'today' | 'week' | 'month' | 'all';
  price: 'all' | 'free' | 'paid';
  search: string;
}

export interface PlaceFiltersProps {
  onFilterChange: (filters: PlaceFilterState) => void;
}

export interface PlaceFilterState {
  category: PlaceCategory | 'all';
  search: string;
}

export interface OptimizedImageProps {
  src?: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  placeholderImage?: string;
}

export interface CardSkeletonProps {
  variant?: 'event' | 'place';
  count?: number;
  className?: string;
}

export interface ViewModeToggleProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  options: { value: string; label: string }[];
}

export interface SuccessStateProps {
  title: string;
  message: string;
  redirectDelay?: number;
  redirectTo?: string;
  colorScheme?: 'indigo' | 'teal';
}

export interface FormStepperProps {
  totalSteps: number;
  currentStep: number;
  colorScheme: 'indigo' | 'teal';
  stepLabels?: string[];
}

export interface CitySelectorProps {
  cities: City[];
  currentCity?: City;
}

export interface HeroTab {
  label: string;
  href: string;
  icon: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  gradient: 'indigo' | 'teal';
  tabs: HeroTab[];
  activeTab?: string;
  cities: City[];
  currentCity?: City;
  showCitySelector?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
}

export interface CityEventsClientProps {
  citySlug: string;
}

export interface CityPageProps {
  params: Promise<{ city: string }>;
}

export interface EventFormData {
  cityId: string;
  title: string;
  description: string;
  category: EventCategory | '';
}

export interface PlaceFormData {
  cityId: string;
  name: string;
  description: string;
  category: PlaceCategory | '';
}

export interface EventStepBasicInfoProps {
  formData: EventFormData;
  cities: City[];
  onUpdate: (field: string, value: string) => void;
  onNext: () => void;
}

export interface PlaceStepBasicInfoProps {
  formData: PlaceFormData;
  cities: City[];
  onUpdate: (field: string, value: string) => void;
  onNext: () => void;
}

export interface EventStepDateTimeFormData {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export interface EventStepDateTimeProps {
  formData: EventStepDateTimeFormData;
  onUpdate: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface EventStepLocationFormData {
  venueName: string;
  venueAddress: string;
  isFree: boolean;
  price: string;
  imageUrl: string;
  tags: string;
}

export interface EventStepLocationProps {
  formData: EventStepLocationFormData;
  onUpdate: (field: string, value: string | boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export interface PlaceStepLocationContactFormData {
  address: string;
  website: string;
  instagram: string;
  features: string;
}

export interface PlaceStepLocationContactProps {
  formData: PlaceStepLocationContactFormData;
  onUpdate: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'user';
  cityId?: string;
  isVerified: boolean;
}

export interface Analytics {
  viewCount: number;
  saveCount: number;
  rsvpCount: {
    going: number;
    interested: number;
    maybe: number;
    total: number;
  };
  isOwner: boolean;
  isSaved: boolean;
  userRsvp: { status: string } | null;
}
