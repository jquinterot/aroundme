'use client';

import Link from 'next/link';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    cta: string;
    popular: boolean;
  };
  billingCycle: 'monthly' | 'yearly';
}

export function PlanCard({ plan, billingCycle }: PlanCardProps) {
  return (
    <div
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
  );
}

interface BillingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onChange: (cycle: 'monthly' | 'yearly') => void;
}

export function BillingToggle({ billingCycle, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-4 bg-white/10 rounded-full p-1">
      <button
        onClick={() => onChange('monthly')}
        className={`px-6 py-2 rounded-full font-medium transition-colors ${
          billingCycle === 'monthly'
            ? 'bg-white text-indigo-600'
            : 'text-white hover:bg-white/10'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('yearly')}
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
  );
}

interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureHighlight({ icon, title, description }: FeatureHighlightProps) {
  return (
    <div className="p-6">
      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface BusinessBundleProps {
  isYearly: boolean;
}

export function BusinessBundle({ isYearly }: BusinessBundleProps) {
  const bundlePrice = isYearly ? 390 : 39;
  const period = isYearly ? 'year' : 'month';

  return (
    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
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
          <p className="text-lg line-through text-gray-400">{isYearly ? '$290/yr' : '$29/mo'}</p>
        </div>
        <div className="text-2xl text-gray-400">+</div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Venue Profile</p>
          <p className="text-lg line-through text-gray-400">{isYearly ? '$190/yr' : '$19/mo'}</p>
        </div>
        <div className="text-2xl text-gray-400">=</div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">${bundlePrice}/{period}</p>
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
  );
}
