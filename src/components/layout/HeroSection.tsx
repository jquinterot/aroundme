'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { CitySelector } from '@/components/ui';
import { HeroSectionProps } from '@/types/components';

const gradientClasses = {
  indigo: 'from-indigo-600 to-purple-600',
  teal: 'from-teal-600 to-cyan-600',
  amber: 'from-amber-600 to-orange-600',
};

const textColor = {
  indigo: 'text-indigo-100',
  teal: 'text-teal-100',
  amber: 'text-amber-100',
};

const activeBg = {
  indigo: 'bg-white text-indigo-600',
  teal: 'bg-white text-teal-600',
  amber: 'bg-white text-amber-600',
};

export function HeroSection({
  title, 
  subtitle, 
  gradient, 
  tabs, 
  activeTab, 
  cities, 
  currentCity,
  showCitySelector = true 
}: HeroSectionProps) {
  return (
    <section data-testid="hero-section" className={`bg-gradient-to-r ${gradientClasses[gradient]} text-white py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 data-testid="hero-title" className="text-3xl font-bold mb-4">{title}</h1>
            <p data-testid="hero-subtitle" className={`mb-6 ${textColor[gradient]}`}>{subtitle}</p>
          </div>
          
          {showCitySelector && cities.length > 0 && (
            <div className="hidden md:block">
              <CitySelector cities={cities} currentCity={currentCity} />
            </div>
          )}
        </div>

        <div data-testid="hero-tabs" className="flex flex-wrap gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            const Icon = tab.icon as LucideIcon;
            return (
              <Link
                data-testid={`tab-${tab.label.toLowerCase()}`}
                key={tab.href}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? activeBg[gradient]
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {showCitySelector && cities.length > 0 && (
          <div className="mt-4 md:hidden">
            <CitySelector cities={cities} currentCity={currentCity} />
          </div>
        )}
      </div>
    </section>
  );
}
