'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, Users, MapPin, CheckCircle, 
  Calendar, DollarSign, AlertCircle, Loader2, Share2, Heart
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { ActivityMap } from '@/components/map';
import { apiService } from '@/services';
import { City } from '@/types';

interface Activity {
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

const categoryColors: Record<string, string> = {
  class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tour: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  experience: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  wellness: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const skillLevelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  all_levels: 'All Levels',
};

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;

  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tickets: 1,
    notes: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    id: string;
    subtotal: number;
    commission: number;
    total: number;
    status: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!activity) return;
    try {
      await fetch(`/api/activities/${activityId}/save`, { method: 'POST' });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleShare = async () => {
    if (!activity) return;
    const url = `${window.location.origin}/activity/${activityId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: activity.title, url });
      } catch {
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const res = await fetch(`/api/activities/${activityId}`);
      if (!res.ok) throw new Error('Failed to fetch activity');
      return res.json();
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: typeof bookingData) => {
      const res = await fetch(`/api/activities/${activityId}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create booking');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setBookingSuccess(true);
      setBookingResult(data.data);
    },
  });

  const activity: Activity | null = activityData?.data || null;
  const cities: City[] = citiesData?.data || [];
  const mapCity: City | null = cities.find((c: City) => c.slug === activity?.city?.slug) || (activity?.city ? {
    ...activity.city,
    id: '',
    country: '',
    timezone: '',
    isActive: true,
  } as City : null);
  const spotsLeft = activity?.capacity ? activity.capacity - activity.bookingCount : null;
  const subtotal = activity && !activity.isFree ? activity.price * bookingData.tickets : 0;
  const commissionAmount = subtotal * (activity?.commission || 0.08);
  const total = subtotal + commissionAmount;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    bookingMutation.mutate(bookingData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This activity may have been removed or is unavailable.</p>
          <Link href={`/${activityData?.data?.city?.slug || 'bogota'}/activities`} className="text-amber-600 hover:underline">
            Browse activities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (bookingSuccess && bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your spot for {activity.title} has been reserved.
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-left mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Activity</span>
                <span className="text-gray-900 dark:text-white font-medium">{activity.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Guest</span>
                <span className="text-gray-900 dark:text-white">{bookingData.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tickets</span>
                <span className="text-gray-900 dark:text-white">{bookingData.tickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toLocaleString()} {activity.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Service fee (8%)</span>
                <span className="text-gray-900 dark:text-white">${commissionAmount.toLocaleString()} {activity.currency}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">${total.toLocaleString()} {activity.currency}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href={`/${activity.city.slug}/activities`} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              Browse More
            </Link>
            <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              View Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href={`/${activity.city.slug}/activities`} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to activities
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                {activity.image ? (
                  <div className="relative h-64 md:h-80 bg-gray-200">
                    <Image src={activity.image} alt={activity.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                    <span className="text-6xl">🎯</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category] || 'bg-gray-100 text-gray-700'}`}>
                        {activity.category}
                      </span>
                      {activity.skillLevel && (
                        <span className="ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {skillLevelLabels[activity.skillLevel] || activity.skillLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isSaved ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {activity.title}
                  </h1>

                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    by {activity.providerName}
                  </p>

                  <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{activity.description}</p>
                  </div>

                  {activity.includes && activity.includes.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What&apos;s Included</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activity.includes.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {activity.schedule && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Schedule</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.schedule}</p>
                          </div>
                        </div>
                      )}
                      {activity.duration && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.duration}</p>
                          </div>
                        </div>
                      )}
                      {activity.address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.address}</p>
                          </div>
                        </div>
                      )}
                      {spotsLeft !== null && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
                            <p className={`text-sm font-medium ${spotsLeft > 5 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {spotsLeft} spots left
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {activity.lat && activity.lng && mapCity && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {activity.address && (
                          <p className="text-gray-600 dark:text-gray-400">{activity.address}</p>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          Open in Google Maps
                        </a>
                      </div>
                      <div className="h-64 rounded-xl overflow-hidden">
                        <ActivityMap
                          activities={[{
                            id: activity.id,
                            title: activity.title,
                            description: activity.description,
                            category: activity.category,
                            subcategory: activity.subcategory,
                            image: activity.image,
                            address: activity.address,
                            coordinates: { lat: activity.lat, lng: activity.lng },
                            schedule: activity.schedule,
                            duration: activity.duration,
                            price: activity.price,
                            currency: activity.currency,
                            isFree: activity.isFree,
                            providerName: activity.providerName,
                            bookingCount: activity.bookingCount,
                          }]}
                          city={mapCity}
                          selectedActivity={{ id: activity.id, coordinates: { lat: activity.lat, lng: activity.lng } }}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
                <div className="mb-6">
                  {activity.isFree ? (
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        ${activity.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> {activity.currency}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">per person</p>
                    </div>
                  )}
                </div>

                {spotsLeft !== null && spotsLeft <= 5 && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Only {spotsLeft} spots remaining!
                    </p>
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of Tickets
                    </label>
                    <select
                      value={bookingData.tickets}
                      onChange={(e) => setBookingData({ ...bookingData, tickets: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      {Array.from({ length: Math.min(spotsLeft || 10, 10) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'ticket' : 'tickets'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows={3}
                      placeholder="Any special requirements or questions..."
                    />
                  </div>

                  {!activity.isFree && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {bookingData.tickets} x ${activity.price.toLocaleString()}
                        </span>
                        <span className="text-gray-900 dark:text-white">${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Service fee (8%)</span>
                        <span className="text-gray-900 dark:text-white">${commissionAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-amber-600 dark:text-amber-400">${total.toLocaleString()} {activity.currency}</span>
                      </div>
                    </div>
                  )}

                  {bookingMutation.isError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {bookingMutation.error instanceof Error ? bookingMutation.error.message : 'Booking failed'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingMutation.isPending || (spotsLeft !== null && spotsLeft < bookingData.tickets)}
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        {activity.isFree ? 'Reserve Spot' : 'Book Now'}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    You won&apos;t be charged until the activity provider confirms your booking.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}