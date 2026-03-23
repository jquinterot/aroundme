'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star, Phone, Instagram, Heart, Share2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { EventMap } from '@/components/map';
import { ReviewForm, ReviewCard } from '@/components/places';
import { apiService } from '@/services';
import { City } from '@/types';
import { CATEGORY_ICONS, PLACE_CATEGORY_COLORS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
const getCategoryColor = (category: string) => PLACE_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = (params.id as string) || '';
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isClaiming, setIsClaiming] = useState(false);

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: placeData, isLoading: placeLoading } = useQuery({
    queryKey: ['place', placeId],
    queryFn: () => apiService.getPlaceById(placeId),
    enabled: !!placeId,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['place-reviews', placeId],
    queryFn: () => apiService.getPlaceReviews(placeId),
    enabled: !!placeId,
  });

  const refetchReviews = () => {
    queryClient.invalidateQueries({ queryKey: ['place-reviews', placeId] });
  };

  const cities = citiesData?.data || [];
  const place = placeData?.data;
  const reviews = reviewsData?.data || [];
  const city = cities.find((c: City) => c.id === place?.cityId) || cities[0];
  const isOwner = user && place?.ownerId === user.id;

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const response = await fetch(`/api/places/${placeId}/claim`, {
        method: 'POST',
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['place', placeId] });
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const handleUnclaim = async () => {
    setIsClaiming(true);
    try {
      const response = await fetch(`/api/places/${placeId}/claim`, {
        method: 'DELETE',
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['place', placeId] });
      }
    } finally {
      setIsClaiming(false);
    }
  };

  if (placeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Place not found</h1>
          <Link href={`/${city?.slug || 'bogota'}/places`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
            ← Back to places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${city?.slug || 'bogota'}/places`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to places
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700">
            {place.image ? (
              <Image
                src={place.image}
                alt={place.name}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50">
                {(() => { const Icon = CategoryIcon(place.category); return <Icon className="w-20 h-20 text-teal-300 dark:text-teal-600" />; })()}
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getCategoryColor(place.category)}`}>
                {(() => { const Icon = CategoryIcon(place.category); return <Icon size={16} />; })()} {place.category}
              </span>
              {place.isVerified && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white">
                  Verified
                </span>
              )}
              {place.priceRange && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200">
                  {place.priceRange}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {place.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {place.isClaimed && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Claimed
                    </p>
                  )}
                  {user && !place.isClaimed && (
                    <button
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                      {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Claim this place
                    </button>
                  )}
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/place/${placeId}/edit`}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                      >
                        Edit place
                      </Link>
                      <button
                        onClick={handleUnclaim}
                        disabled={isClaiming}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1 disabled:opacity-50"
                      >
                        {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Unclaim
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{place.rating}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{place.reviewCount} reviews</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600 dark:text-gray-400">
              <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{place.address}</span>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
            {place.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{place.contact.phone}</span>
                </div>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
              {place.description}
            </p>

            {place.features && place.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {place.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {place.hours && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hours</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(place.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between max-w-xs">
                      <span className="capitalize text-gray-600 dark:text-gray-400">{day}</span>
                      <span className="text-gray-900 dark:text-white">
                        {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {place.contact?.instagram && (
              <div className="mb-6">
                <a
                  href={`https://instagram.com/${place.contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90"
                >
                  <Instagram className="w-5 h-5" />
                  {place.contact.instagram}
                </a>
              </div>
            )}

            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
              <div className="h-64 rounded-xl overflow-hidden">
                <EventMap
                  events={[]}
                  city={city}
                  selectedEvent={null}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Reviews ({place.reviewCount})
              </h3>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 10).map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      placeId={placeId}
                      currentUserId={user?.id}
                      onUpdate={refetchReviews}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <ReviewForm placeId={place.id} placeName={place.name} />
              
              <div className="flex gap-4 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
