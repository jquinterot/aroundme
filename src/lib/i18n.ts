import { es, enUS } from 'date-fns/locale';

export type Locale = 'es' | 'en';

export const locales: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const defaultLocale: Locale = 'es';

export function getLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  
  const preferred = acceptLanguage.split(',')[0].toLowerCase();
  
  if (preferred.startsWith('en')) return 'en';
  if (preferred.startsWith('es')) return 'es';
  
  return defaultLocale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'es' || locale === 'en';
}

export const translations: Record<Locale, Record<string, string>> = {
  es: {
    'common.events': 'Eventos',
    'common.places': 'Lugares',
    'common.search': 'Buscar',
    'common.login': 'Iniciar Sesión',
    'common.signup': 'Registrarse',
    'common.logout': 'Cerrar Sesión',
    'common.dashboard': 'Panel',
    'common.profile': 'Perfil',
    'common.notifications': 'Notificaciones',
    'common.settings': 'Configuración',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.share': 'Compartir',
    'common.free': 'Gratis',
    'common.going': 'Asistiré',
    'common.interested': 'Interesado',
    'common.maybe': 'Quizás',
    'common.rsvp': 'Confirmar Asistencia',
    'common.saved': 'Guardado',
    'common.featured': 'Destacado',
    'common.verificado': 'Verificado',
    'common.createEvent': 'Crear Evento',
    'common.submitPlace': 'Agregar Lugar',
    'common.tickets': 'Boletos',
    'common.organizer': 'Organizador',
    'common.attendees': 'Asistentes',
    'common.reviews': 'Reseñas',
    'common.follow': 'Seguir',
    'common.following': 'Siguiendo',
    'common.followers': 'Seguidores',
    'event.upcoming': 'Próximos Eventos',
    'event.past': 'Eventos Pasados',
    'event.today': 'Hoy',
    'event.thisWeek': 'Esta Semana',
    'event.thisMonth': 'Este Mes',
    'event.all': 'Todos',
    'event.free': 'Gratis',
    'event.paid': 'De Pago',
    'event.category.all': 'Todas las Categorías',
    'place.restaurant': 'Restaurante',
    'place.cafe': 'Cafetería',
    'place.bar': 'Bar',
    'place.club': 'Club',
    'place.park': 'Parque',
    'place.museum': 'Museo',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.resetPassword': 'Restablecer Contraseña',
    'dashboard.welcome': '¡Bienvenido!',
    'dashboard.myEvents': 'Mis Eventos',
    'dashboard.savedEvents': 'Eventos Guardados',
    'dashboard.myRsvps': 'Mis Confirmaciones',
    'dashboard.myPlaces': 'Mis Lugares',
    'error.required': 'Este campo es requerido',
    'error.invalidEmail': 'Correo electrónico inválido',
    'error.passwordMismatch': 'Las contraseñas no coinciden',
    'success.created': '¡Creado exitosamente!',
    'success.updated': '¡Actualizado exitosamente!',
    'success.deleted': '¡Eliminado exitosamente!',
  },
  en: {
    'common.events': 'Events',
    'common.places': 'Places',
    'common.search': 'Search',
    'common.login': 'Login',
    'common.signup': 'Sign Up',
    'common.logout': 'Logout',
    'common.dashboard': 'Dashboard',
    'common.profile': 'Profile',
    'common.notifications': 'Notifications',
    'common.settings': 'Settings',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.share': 'Share',
    'common.free': 'Free',
    'common.going': 'Going',
    'common.interested': 'Interested',
    'common.maybe': 'Maybe',
    'common.rsvp': 'RSVP',
    'common.saved': 'Saved',
    'common.featured': 'Featured',
    'common.verified': 'Verified',
    'common.createEvent': 'Create Event',
    'common.submitPlace': 'Add Place',
    'common.tickets': 'Tickets',
    'common.organizer': 'Organizer',
    'common.attendees': 'Attendees',
    'common.reviews': 'Reviews',
    'common.follow': 'Follow',
    'common.following': 'Following',
    'common.followers': 'Followers',
    'event.upcoming': 'Upcoming Events',
    'event.past': 'Past Events',
    'event.today': 'Today',
    'event.thisWeek': 'This Week',
    'event.thisMonth': 'This Month',
    'event.all': 'All',
    'event.free': 'Free',
    'event.paid': 'Paid',
    'event.category.all': 'All Categories',
    'place.restaurant': 'Restaurant',
    'place.cafe': 'Café',
    'place.bar': 'Bar',
    'place.club': 'Club',
    'place.park': 'Park',
    'place.museum': 'Museum',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'dashboard.welcome': 'Welcome!',
    'dashboard.myEvents': 'My Events',
    'dashboard.savedEvents': 'Saved Events',
    'dashboard.myRsvps': 'My RSVPs',
    'dashboard.myPlaces': 'My Places',
    'error.required': 'This field is required',
    'error.invalidEmail': 'Invalid email address',
    'error.passwordMismatch': 'Passwords do not match',
    'success.created': 'Created successfully!',
    'success.updated': 'Updated successfully!',
    'success.deleted': 'Deleted successfully!',
  },
};

export function t(key: string, locale: Locale = defaultLocale): string {
  return translations[locale][key] || translations[defaultLocale][key] || key;
}

export function formatDate(date: Date, locale: Locale = defaultLocale): string {
  const localeMap: Record<Locale, Locale> = {
    es: 'es',
    en: 'en',
  };
  
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date, locale: Locale = defaultLocale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeDate(date: Date, locale: Locale = defaultLocale): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (locale === 'es') {
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    if (days === -1) return 'Ayer';
    if (days > 0 && days <= 7) return `En ${days} días`;
    if (days < 0 && days >= -7) return `Hace ${Math.abs(days)} días`;
  } else {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0 && days <= 7) return `In ${days} days`;
    if (days < 0 && days >= -7) return `${Math.abs(days)} days ago`;
  }
  
  return formatDate(date, locale);
}
