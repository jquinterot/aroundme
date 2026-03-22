'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, MapPin, Loader2, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { CATEGORY_ICONS, EVENT_CATEGORY_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  dateStart: Date | string;
  venueName: string;
  imageUrl?: string | null;
  isFree: boolean;
  priceMin?: number | null;
  cityName: string;
  score: number;
  reason: string;
}

interface RecommendationsPanelProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export function RecommendationsPanel({ limit = 5, showTitle = true, compact = false }: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/recommendations?limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (eventId: string, action: 'view' | 'click') => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      });
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'similar_interests':
        return { icon: Sparkles, label: 'Basado en tus gustos', color: 'text-purple-600' };
      case 'popular':
        return { icon: TrendingUp, label: 'Popular', color: 'text-green-600' };
      case 'trending':
        return { icon: TrendingUp, label: 'Tendencias', color: 'text-orange-600' };
      case 'featured':
        return { icon: Sparkles, label: 'Destacado', color: 'text-yellow-600' };
      case 'followed_organizer':
        return { icon: Sparkles, label: 'De alguien que sigues', color: 'text-blue-600' };
      case 'happening_soon':
        return { icon: Clock, label: 'Próximamente', color: 'text-indigo-600' };
      case 'nearby':
        return { icon: MapPin, label: 'Cerca de ti', color: 'text-teal-600' };
      default:
        return { icon: Sparkles, label: 'Recomendado', color: 'text-indigo-600' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {showTitle && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Para Ti</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">Eventos que podrían interesarte</p>
        </div>
      )}

      <div className={`divide-y divide-gray-100 ${compact ? '' : 'p-4'}`}>
        {recommendations.map((rec, index) => {
          const reason = getReasonLabel(rec.reason);
          const ReasonIcon = reason.icon;
          const CategoryIcon = CATEGORY_ICONS[rec.category] || CATEGORY_ICONS.other;
          const categoryColor = EVENT_CATEGORY_COLORS[rec.category] || 'bg-gray-100 text-gray-700';

          return (
            <Link
              key={rec.id}
              href={`/event/${rec.id}`}
              onClick={() => handleInteraction(rec.id, 'click')}
              className={`block ${compact ? 'p-3' : 'p-4'} hover:bg-gray-50 transition-colors group`}
            >
              <div className="flex gap-4">
                {rec.imageUrl && !compact && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={rec.imageUrl}
                      alt={rec.title}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors ${compact ? 'text-sm line-clamp-1' : ''}`}>
                        {rec.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${categoryColor}`}>
                          <CategoryIcon className="w-3 h-3" />
                          {rec.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs ${reason.color}`}>
                          <ReasonIcon className="w-3 h-3" />
                          {reason.label}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(rec.dateStart), "d MMM", { locale: es })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {rec.venueName}
                    </span>
                    <span className={`font-medium ${rec.isFree ? 'text-green-600' : 'text-indigo-600'}`}>
                      {rec.isFree ? 'Gratis' : `$${rec.priceMin?.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/discover"
          className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Ver más recomendaciones
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

interface RecommendationsCarouselProps {
  limit?: number;
}

export function RecommendationsCarousel({ limit = 10 }: RecommendationsCarouselProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/recommendations?limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {recommendations.map((rec) => (
          <Link
            key={rec.id}
            href={`/event/${rec.id}`}
            className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {rec.imageUrl ? (
              <div className="h-32 overflow-hidden">
                <Image
                  src={rec.imageUrl}
                  alt={rec.title}
                  width={256}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-indigo-300" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{rec.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(rec.dateStart), "d 'de' MMM", { locale: es })}
              </p>
              <p className="text-sm text-gray-500 truncate">{rec.venueName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
