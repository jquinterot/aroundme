'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { MapPin, Star, Loader2, Pencil, CheckCircle } from 'lucide-react';
import { CATEGORY_ICONS } from '@/lib/constants';

interface UserPlace {
  id: string;
  name: string;
  category: string;
  city: { name: string; slug: string };
  address: string;
  rating: number;
  reviewCount: number;
  image: string | null;
  isVerified: boolean;
  isClaimed: boolean;
}

export default function DashboardPlacesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/user/places')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPlaces(data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Lugares</h1>
            <p className="text-gray-500">Gestiona tus venues reclamados</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <span>+</span>
            Reclamar Venue
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : places.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes venues reclamados</h2>
              <p className="text-gray-500 mb-6">Reclama tu venue para obtener análisis y gestionar tu perfil</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {places.map((place) => {
              const Icon = CategoryIcon(place.category);
              return (
                <div key={place.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {place.image ? (
                      <Image src={place.image} alt={place.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
                        <Icon className="w-8 h-8 text-teal-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                          {place.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {place.address}
                          </span>
                          {place.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              {place.rating.toFixed(1)} ({place.reviewCount} reseñas)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/place/${place.id}`}
                          className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                          title="Ver lugar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/place/${place.id}/edit`}
                          className="p-2 text-gray-500 hover:text-teal-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="capitalize">{place.category}</span>
                      <span>{place.city.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
