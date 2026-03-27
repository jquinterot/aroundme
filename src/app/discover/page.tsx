'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Clock, Calendar, Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Header, Footer } from '@/components/layout';
import { RecommendationsCarousel } from '@/components/events/RecommendationsPanel';
import { EventList, EventFilters } from '@/components/events';
import { EventCard } from '@/components/events/EventCard';
import { apiService } from '@/services';
import { City } from '@/types';
import { EventFilterState } from '@/types/components';

export default function DiscoverPage() {
  const [filters, setFilters] = useState<EventFilterState>({
    category: 'all',
    date: 'all',
    price: 'all',
    search: '',
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'bogota', filters],
    queryFn: () => apiService.getEvents('bogota', {
      category: filters.category === 'all' ? undefined : filters.category,
      date: filters.date === 'all' ? undefined : filters.date,
      price: filters.price === 'all' ? undefined : filters.price,
      search: filters.search || undefined,
    }),
  });

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['events', 'bogota', 'trending'],
    queryFn: () => apiService.getEvents('bogota', { limit: 5 }),
  });

  const cities = citiesData?.data || [];
  const currentCity = cities[0] as City | undefined;
  const events = eventsData?.data || [];
  const trendingEvents = trendingData?.data?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main data-testid="discover-page-container">
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16" data-testid="discover-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4" data-testid="discover-title">Descubre Eventos</h1>
              <p className="text-xl text-indigo-100">Encuentra eventos personalizados basados en tus intereses</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  data-testid="discover-search-input"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              Para Ti
            </h2>
            <RecommendationsCarousel limit={10} />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Tendencias
            </h2>
            {trendingLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" />
              Próximamente
            </h2>
            <EventFilters onFilterChange={setFilters} />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {eventsLoading ? 'Cargando...' : `${events.length} eventos encontrados`}
            </h2>
          </div>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : events.length > 0 ? (
            <EventList events={events} viewMode="list" city={currentCity!} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay eventos
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Intenta con otros filtros o explora eventos en otra ciudad
              </p>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Crear Evento
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
