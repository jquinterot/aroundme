'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { FormStepper, SuccessState } from '@/components/ui';
import { StepBasicInfo, StepDateTime, StepLocation } from '@/components/forms/create-event';
import { useCities } from '@/hooks/useCities';
import { EventCategory, City } from '@/types';

interface FormData {
  cityId: string;
  title: string;
  description: string;
  category: EventCategory | '';
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isFree: boolean;
  price: string;
  imageUrl: string;
  tags: string;
}

interface EventDataType {
  cityId: string;
  title: string;
  description: string;
  category: string;
  venue: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  date: { start: string; end: string | null };
  price: { isFree: boolean; max: number };
  image: string | null;
  tags: string[];
}

interface EditFormProps {
  eventId: string;
  eventData: EventDataType;
  cities: City[];
}

function buildFormData(event: EventDataType): FormData {
  const startDateObj = new Date(event.date.start);
  const endDateObj = event.date.end ? new Date(event.date.end) : null;

  return {
    cityId: event.cityId,
    title: event.title,
    description: event.description,
    category: event.category as EventCategory,
    venueName: event.venue.name,
    venueAddress: event.venue.address,
    venueLat: event.venue.coordinates.lat,
    venueLng: event.venue.coordinates.lng,
    startDate: startDateObj.toISOString().split('T')[0],
    startTime: startDateObj.toTimeString().slice(0, 5),
    endDate: endDateObj ? endDateObj.toISOString().split('T')[0] : '',
    endTime: endDateObj ? endDateObj.toTimeString().slice(0, 5) : '',
    isFree: event.price.isFree,
    price: event.price.max ? String(event.price.max) : '',
    imageUrl: event.image || '',
    tags: event.tags.join(', '),
  };
}

function buildCitySlug(event: EventDataType, cities: City[]): string {
  const city = cities.find((c) => c.id === event.cityId);
  return city?.slug || 'bogota';
}

function EditForm({ eventId, eventData, cities }: EditFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => buildFormData(eventData));

  const updateField = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const dateStart = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const dateEnd = formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`)
        : null;

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          venueName: formData.venueName,
          venueAddress: formData.venueAddress,
          venueLat: formData.venueLat,
          venueLng: formData.venueLng,
          dateStart: dateStart.toISOString(),
          dateEnd: dateEnd?.toISOString() || null,
          isFree: formData.isFree,
          priceMin: formData.isFree ? 0 : parseFloat(formData.price) || 0,
          priceMax: formData.isFree ? 0 : parseFloat(formData.price) || 0,
          imageUrl: formData.imageUrl || null,
          tags: formData.tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/event/${eventId}`);
        }, 2000);
      } else {
        alert(data.error || 'Failed to update event');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessState
        title="Event Updated!"
        message="Your changes have been saved successfully."
        redirectTo={`/event/${eventId}`}
        redirectDelay={2000}
        colorScheme="indigo"
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <FormStepper totalSteps={3} currentStep={step} colorScheme="indigo" />

      <form>
        {step === 1 && (
          <StepBasicInfo
            formData={formData}
            cities={cities}
            onUpdate={updateField}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepDateTime
            formData={formData}
            onUpdate={updateField}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepLocation
            formData={formData}
            onUpdate={updateField}
            onSubmit={handleSubmit}
            onBack={() => setStep(2)}
            isLoading={isLoading}
          />
        )}
      </form>
    </div>
  );
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [eventId, setEventId] = useState<string>('');
  const { cities } = useCities();

  useEffect(() => {
    params.then(p => setEventId(p.id));
  }, [params]);

  const { data: eventData, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetch(`/api/events/${eventId}`).then(res => res.json()),
    enabled: !!eventId,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', eventId],
    queryFn: () => fetch(`/api/events/${eventId}/analytics`).then(res => res.json()),
    enabled: !!eventId && !!user,
  });

  const citySlug = eventData?.data ? buildCitySlug(eventData.data, cities) : 'bogota';

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!eventData?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href={`/${citySlug}`} className="text-indigo-600 hover:text-indigo-700">
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  if (user && !analyticsData?.data?.isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You are not authorized to edit this event.</p>
          <Link href={`/event/${eventId}`} className="text-indigo-600 hover:text-indigo-700">
            ← Back to event
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-4">Please login to edit this event.</p>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
            ← Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to event
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-500 mt-1">Update your event details</p>
        </div>

        <EditForm
          key={eventId}
          eventId={eventId}
          eventData={eventData.data}
          cities={cities}
        />
      </main>
    </div>
  );
}
