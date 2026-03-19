'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCities } from '@/hooks/useCities';
import { Header } from '@/components/layout';
import { FormStepper, SuccessState } from '@/components/ui';
import { StepBasicInfo, StepDateTime, StepLocation } from '@/components/forms/create-event';
import { apiService } from '@/services';
import { EventCategory } from '@/types';

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { cities } = useCities();

  const [formData, setFormData] = useState({
    cityId: 'bogota',
    title: '',
    description: '',
    category: '' as EventCategory | '',
    venueName: '',
    venueAddress: '',
    venueLat: 4.7110,
    venueLng: -74.0721,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isFree: true,
    price: '',
    imageUrl: '',
    tags: '',
  });

  const updateField = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await apiService.createEvent({
        citySlug: formData.cityId,
        title: formData.title,
        description: formData.description,
        category: formData.category as string,
        venueName: formData.venueName,
        venueAddress: formData.venueAddress,
        venueLat: formData.venueLat,
        venueLng: formData.venueLng,
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate || undefined,
        endTime: formData.endTime || undefined,
        isFree: formData.isFree,
        price: formData.price || undefined,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags || undefined,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${formData.cityId}`);
        }, 2000);
      } else {
        alert(response.error || 'Failed to submit event');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to submit event. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
      <Header />
        <SuccessState
          title="Event Submitted!"
          message="Your event is pending review and will be published soon."
          redirectTo={`/${formData.cityId}`}
          redirectDelay={2000}
          colorScheme="indigo"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={`/${formData.cityId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 mt-1">Fill in the details to submit your event</p>
        </div>

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
      </main>
    </div>
  );
}
