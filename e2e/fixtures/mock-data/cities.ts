import { City } from '@/types';

export const cities: City[] = [
  {
    id: 'bogota',
    name: 'Bogotá',
    country: 'Colombia',
    slug: 'bogota',
    lat: 4.7110,
    lng: -74.0721,
    zoom: 12,
    timezone: 'America/Bogota',
    isActive: true,
  },
  {
    id: 'pereira',
    name: 'Pereira',
    country: 'Colombia',
    slug: 'pereira',
    lat: 4.8133,
    lng: -75.6961,
    zoom: 13,
    timezone: 'America/Bogota',
    isActive: true,
  },
  {
    id: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    slug: 'medellin',
    lat: 6.2442,
    lng: -75.5812,
    zoom: 12,
    timezone: 'America/Bogota',
    isActive: false,
  },
  {
    id: 'cartagena',
    name: 'Cartagena',
    country: 'Colombia',
    slug: 'cartagena',
    lat: 10.3910,
    lng: -75.4794,
    zoom: 12,
    timezone: 'America/Bogota',
    isActive: false,
  },
  {
    id: 'barranquilla',
    name: 'Barranquilla',
    country: 'Colombia',
    slug: 'barranquilla',
    lat: 10.9685,
    lng: -74.7813,
    zoom: 12,
    timezone: 'America/Bogota',
    isActive: false,
  },
];

export const getCityBySlug = (slug: string): City | undefined => {
  return cities.find((city) => city.slug === slug);
};

export const getActiveCities = (): City[] => {
  return cities.filter((city) => city.isActive);
};
