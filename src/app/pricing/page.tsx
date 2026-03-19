'use client';

import { useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { PlanCard, BillingToggle, BusinessBundle, FeatureHighlight } from '@/components/ui/PricingComponents';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'organizer-pro',
      name: 'Organizer Pro',
      description: 'For event creators who want to grow their audience',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Unlimited events',
        'Auto-publish (no review wait)',
        'Priority placement in search',
        'Verified organizer badge',
        'Basic analytics (views, saves)',
        'Custom event page branding',
        'Email support',
      ],
      cta: 'Start 14-day trial',
      popular: true,
    },
    {
      id: 'venue-profile',
      name: 'Venue Profile',
      description: 'For restaurants, bars, and venues',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Permanent venue page',
        'Photo gallery',
        'Hours & contact info',
        'Weekly event highlights',
        '"Popular near you" placement',
        'User reviews & ratings',
        'Link to reservation system',
        'Basic analytics',
      ],
      cta: 'Claim your venue',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-indigo-100 mb-8">
              Choose the plan that fits your needs
            </p>
            <BillingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
            ))}
          </div>

          <div className="mt-12">
            <BusinessBundle isYearly={billingCycle === 'yearly'} />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <FeatureHighlight
              icon={
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="14-day free trial"
              description="No credit card required. Cancel anytime."
            />
            <FeatureHighlight
              icon={
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Cancel anytime"
              description="No long-term contracts. Month-to-month."
            />
            <FeatureHighlight
              icon={
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="Support"
              description="Email support for all plans"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
