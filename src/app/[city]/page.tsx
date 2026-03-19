import { Metadata } from 'next';
import { apiService } from '@/services';
import CityEventsClient from './CityEventsClient';
import { CityPageProps } from '@/types/components';

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  
  try {
    const response = await apiService.getCities();
    const cities = response.data || [];
    const currentCity = cities.find((c: { slug: string }) => c.slug === citySlug);
    
    return {
      title: `Events in ${currentCity?.name || citySlug} | AroundMe`,
      description: `Discover events, activities, and experiences happening in ${currentCity?.name || citySlug}. Free and paid events, concerts, workshops, and more.`,
    };
  } catch {
    return {
      title: `Discover Events | AroundMe`,
      description: 'Find events, activities, and experiences happening in your city.',
    };
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  return <CityEventsClient citySlug={citySlug} />;
}
