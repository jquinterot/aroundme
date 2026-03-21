'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star, Phone, Instagram, Heart, Share2 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { EventMap } from '@/components/map';
import { ReviewForm } from '@/components/places';
import { apiService } from '@/services';
import { City } from '@/types';
import { CATEGORY_ICONS, PLACE_CATEGORY_COLORS } from '@/lib/constants';

const CategoryIcon = (category: string) => CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
const getCategoryColor = (category: string) => PLACE_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = (params.id as string) || '';

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

  const cities = citiesData?.data || [];
  const place = placeData?.data;
  const reviews = reviewsData?.data || [];
  const city = cities.find((c: City) => c.id === place?.cityId) || cities[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (placeLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h1>
          <Link href={`/${city?.slug || 'bogota'}/places`} className="text-indigo-600 hover:text-indigo-700">
            ← Back to places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${city?.slug || 'bogota'}/places`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to places
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80 bg-gray-200">
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
                {(() => { const Icon = CategoryIcon(place.category); return <Icon className="w-20 h-20 text-teal-300" />; })()}
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
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/90 text-gray-700">
                  {place.priceRange}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {place.name}
                </h1>
                {place.isClaimed && (
                  <p className="text-sm text-indigo-600 mt-1">Business verified</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">{place.rating}</span>
                </div>
                <p className="text-sm text-gray-500">{place.reviewCount} reviews</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
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

            <p className="text-gray-700 mb-6 whitespace-pre-wrap">
              {place.description}
            </p>

            {place.features && place.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {place.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {place.hours && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(place.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between max-w-xs">
                      <span className="capitalize text-gray-600">{day}</span>
                      <span className="text-gray-900">
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
              <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
              <div className="h-64 rounded-xl overflow-hidden">
                <EventMap
                  events={[]}
                  city={city}
                  selectedEvent={null}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Reviews ({place.reviewCount})
              </h3>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {review.userName.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{review.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">{formatDate(review.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <ReviewForm placeId={place.id} placeName={place.name} />
              
              <div className="flex gap-4 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                  <Heart className="w-5 h-5" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
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
