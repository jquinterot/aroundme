'use client';

import Link from 'next/link';
import { City } from '@/types';
import { CitySelector } from '@/components/ui';

interface Tab {
  label: string;
  href: string;
  icon: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  gradient: 'indigo' | 'teal';
  tabs: Tab[];
  activeTab?: string;
  cities: City[];
  currentCity?: City;
  showCitySelector?: boolean;
}

const gradientClasses = {
  indigo: 'from-indigo-600 to-purple-600',
  teal: 'from-teal-600 to-cyan-600',
};

const textColor = {
  indigo: 'text-indigo-100',
  teal: 'text-teal-100',
};

const activeBg = {
  indigo: 'bg-white text-indigo-600',
  teal: 'bg-white text-teal-600',
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
    <section className={`bg-gradient-to-r ${gradientClasses[gradient]} text-white py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className={`mb-6 ${textColor[gradient]}`}>{subtitle}</p>
          </div>
          
          {showCitySelector && cities.length > 0 && (
            <div className="hidden md:block">
              <CitySelector cities={cities} currentCity={currentCity} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? activeBg[gradient]
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.icon} {tab.label}
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
