'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { BillingToggle, BusinessBundle, FeatureHighlight } from '@/components/ui/PricingComponents';
import { Check, Crown, Zap, BarChart3, Users, Download, Mail, Target } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for casual attendees and basic event discovery',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Browse events and places',
        'Save favorite events',
        'Basic RSVPs',
        'View counts on events',
        'Write reviews',
        'Follow other users',
        '3 events per month',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
      tier: 'free' as const,
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For casual organizers and small venues',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Everything in Free',
        'Create events',
        'Claim venue page',
        'Basic analytics',
        '20 events per month',
        'Email support',
        'Standard listing placement',
      ],
      cta: 'Start Free',
      popular: false,
      tier: 'basic' as const,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For serious organizers and businesses who want to grow',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Everything in Basic',
        'Unlimited events',
        'Advanced analytics dashboard',
        'Competitor insights',
        'Data export (CSV/JSON)',
        'Email automation',
        'Priority listing placement',
        'Verified badge',
        'Custom branding',
        'API access',
        'Multi-location support',
        'Team collaboration',
        'Priority support',
      ],
      cta: 'Start 14-day trial',
      popular: true,
      tier: 'premium' as const,
    },
  ];

  const premiumFeatures = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your audience, engagement rates, and performance trends',
    },
    {
      icon: Target,
      title: 'Competitor Insights',
      description: 'See how you compare to similar organizers and venues in your area',
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Export attendee lists, revenue reports, and engagement data to CSV or JSON',
    },
    {
      icon: Mail,
      title: 'Email Automation',
      description: 'Automated reminders, follow-ups, and personalized email campaigns',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members to help manage your events and venues',
    },
    {
      icon: Zap,
      title: 'API Access',
      description: 'Build custom integrations and automate workflows with our API',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border-2 ${
                  plan.popular 
                    ? 'border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {plan.tier === 'premium' && <Crown className="w-5 h-5 text-amber-500" />}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === 'free' || plan.id === 'basic' ? '/signup' : '/checkout?plan=premium'}
                  className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Premium Features</h2>
            </div>
            <p className="text-amber-100 mb-8">
              Unlock powerful tools to grow your audience and make data-driven decisions
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <feature.icon className="w-6 h-6 mb-2 text-amber-200" />
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-amber-100">{feature.description}</p>
                </div>
              ))}
            </div>
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

          <div className="mt-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What&apos;s included in Basic?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Basic includes event creation, basic analytics, venue claiming, and up to 20 events per month. It&apos;s perfect for casual organizers getting started.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Can I upgrade later?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! You can upgrade from Free to Basic or Premium at any time. Your data and settings will be preserved.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What are competitor insights?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Premium members can see how their events compare to similar ones in their city - including conversion rates, pricing, and engagement metrics.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How does team access work?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Premium members can invite up to 10 team members to help manage events and venues. Each member gets their own login.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
