'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';

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

            <div className="inline-flex items-center gap-4 bg-white/10 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-indigo-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-gray-500 mt-2">{plan.description}</p>

                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-500">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`block w-full text-center py-3 px-6 rounded-xl font-medium transition-colors ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Business Bundle
              </h3>
              <p className="text-gray-600">
                Organizer Pro + Venue Profile together
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Organizer Pro</p>
                <p className="text-lg line-through text-gray-400">$29/mo</p>
              </div>
              <div className="text-2xl text-gray-400">+</div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Venue Profile</p>
                <p className="text-lg line-through text-gray-400">$19/mo</p>
              </div>
              <div className="text-2xl text-gray-400">=</div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">$39/mo</p>
                <p className="text-xs text-gray-500">Save $9/month</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-teal-600 text-white py-3 px-8 rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                Get the Bundle
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">14-day free trial</h4>
              <p className="text-sm text-gray-500">No credit card required. Cancel anytime.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cancel anytime</h4>
              <p className="text-sm text-gray-500">No long-term contracts. Month-to-month.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
              <p className="text-sm text-gray-500">Email support for all plans</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
