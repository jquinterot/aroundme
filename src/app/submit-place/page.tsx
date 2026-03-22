'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCities } from '@/hooks/useCities';
import { Header } from '@/components/layout';
import { FormStepper, SuccessState } from '@/components/ui';
import { StepBasicInfo, StepLocationContact } from '@/components/forms/submit-place';
import { apiService } from '@/services';
import { PlaceCategory } from '@/types';

export default function SubmitPlacePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { cities } = useCities();

  const [formData, setFormData] = useState({
    cityId: 'bogota',
    name: '',
    description: '',
    category: '' as PlaceCategory | '',
    address: '',
    website: '',
    instagram: '',
    features: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await apiService.createPlace({
        citySlug: formData.cityId,
        name: formData.name,
        description: formData.description,
        category: formData.category as string,
        address: formData.address,
        website: formData.website || undefined,
        instagram: formData.instagram || undefined,
        features: formData.features || undefined,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${formData.cityId}/places`);
        }, 2000);
      } else {
        alert(response.error || 'Failed to submit place');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting place:', error);
      alert('Failed to submit place. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
        <SuccessState
          title="Place Submitted!"
          message="Your recommendation is pending review and will be published soon."
          redirectTo={`/${formData.cityId}/places`}
          redirectDelay={2000}
          colorScheme="teal"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={`/${formData.cityId}/places`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit a Place</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Recommend a cool place in your city</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <FormStepper totalSteps={2} currentStep={step} colorScheme="teal" />

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
              <StepLocationContact
                formData={formData}
                onUpdate={updateField}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                isLoading={isLoading}
              />
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
