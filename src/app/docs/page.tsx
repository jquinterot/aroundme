'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  QrCode, 
  Star, 
  Bell,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Crown
} from 'lucide-react';

interface FeatureSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  features: { title: string; description: string }[];
}

export default function DocsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('events');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections: FeatureSection[] = [
    {
      id: 'events',
      title: 'Events',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Create and manage events in your city',
      features: [
        { title: 'Create Events', description: 'Fill in a multi-step form with city, category, date, time, venue, and pricing details.' },
        { title: 'Event Types', description: 'Choose from categories like Music, Food, Sports, Art, Tech, Community, Nightlife, Outdoor, and Education.' },
        { title: 'Ticket Management', description: 'Create multiple ticket types with different prices, quantities, and sale periods.' },
        { title: 'RSVP System', description: 'Let users confirm attendance, mark as interested, or join a waitlist when sold out.' },
        { title: 'QR Check-in', description: 'Generate QR codes for attendees. Scan with the check-in page to mark attendance.' },
        { title: 'Featured Events', description: 'Promote your event with Basic (7 days) or Premium (30 days) featured status.' },
        { title: 'Event Analytics', description: 'Track views, saves, RSVPs, check-ins, and conversion rates for your events.' },
        { title: 'Recurring Events', description: 'Set up event series that repeat daily, weekly, or monthly.' },
      ],
    },
    {
      id: 'places',
      title: 'Places',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Discover and manage local venues',
      features: [
        { title: 'Submit Places', description: 'Recommend local venues by submitting name, address, category, and contact info.' },
        { title: 'Place Categories', description: 'Browse by Restaurant, Café, Bar, Club, Park, Museum, Shopping, Hotel, or Coworking.' },
        { title: 'Reviews & Ratings', description: 'Rate places and leave reviews to help others discover great spots.' },
        { title: 'Photo Gallery', description: 'View photos uploaded by the community for each place.' },
        { title: 'Operating Hours', description: 'Check current hours, open/closed status, and special holiday hours.' },
        { title: 'Claim Business', description: 'Business owners can claim their venue to manage info and respond to reviews.' },
        { title: 'Place Filters', description: 'Filter by category, price range, and other attributes to find exactly what you need.' },
      ],
    },
    {
      id: 'activities',
      title: 'Activities',
      icon: <Star className="w-6 h-6" />,
      description: 'Book experiences and classes',
      features: [
        { title: 'Browse Activities', description: 'Discover classes, tours, experiences, entertainment, and wellness activities.' },
        { title: 'Flexible Scheduling', description: 'View schedule type (fixed time, flexible, or by appointment) and duration.' },
        { title: 'Book Online', description: 'Reserve spots directly through the platform.' },
        { title: 'Multiple Views', description: 'Switch between grid, list, or map views to browse activities.' },
      ],
    },
    {
      id: 'social',
      title: 'Social',
      icon: <Users className="w-6 h-6" />,
      description: 'Connect with other users and organizers',
      features: [
        { title: 'User Profiles', description: 'View user profiles with their events, followers, and activity history.' },
        { title: 'Follow System', description: 'Follow other users to see their activity in your feed.' },
        { title: 'Activity Feed', description: 'See recent actions from people you follow: events created, RSVPs, reviews, and follows.' },
        { title: 'Recommendations', description: 'Get personalized event and place suggestions based on your interests.' },
        { title: 'Discover Page', description: 'Explore curated recommendations and trending content in your city.' },
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Payouts',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Secure payments with automatic payouts to organizers',
      features: [
        { title: 'Secure Checkout', description: 'Pay with credit/debit cards through Stripe. All transactions are encrypted and secure.' },
        { title: 'Stripe Connect', description: 'Organizers connect their Stripe account to receive payouts directly.' },
        { title: 'Automatic Payouts', description: 'When a customer buys tickets, 90% goes to the organizer and 10% to the platform.' },
        { title: 'Earnings Dashboard', description: 'Track total earnings, pending payouts, completed payouts, and transaction history.' },
        { title: 'Order History', description: 'View all your ticket purchases with QR codes for entry.' },
        { title: 'Platform Fee', description: 'A 10% platform fee supports server costs, maintenance, and platform development.' },
      ],
    },
    {
      id: 'checkin',
      title: 'Check-in System',
      icon: <QrCode className="w-6 h-6" />,
      description: 'Efficient event entry management',
      features: [
        { title: 'QR Code Tickets', description: 'Each ticket includes a unique QR code with encrypted user and order data.' },
        { title: 'Owner Scanner', description: 'Event owners access /event/[id]/check-in to scan attendee QR codes.' },
        { title: 'Instant Status', description: 'See check-in status immediately after scanning: Success, Already Used, or Invalid.' },
        { title: 'Attendance Stats', description: 'Track check-in rates and compare against RSVPs and ticket sales.' },
      ],
    },
    {
      id: 'premium',
      title: 'Premium Features',
      icon: <Crown className="w-6 h-6" />,
      description: 'Unlock advanced tools for serious organizers',
      features: [
        { title: 'Free Tier', description: 'Create up to 3 events/month. Basic analytics and 7-day data retention.' },
        { title: 'Basic Tier', description: 'Up to 10 events/month, advanced analytics, data export, and 30-day retention.' },
        { title: 'Premium Tier', description: 'Unlimited events, competitor insights, email automation, priority support, and API access.' },
        { title: 'Pricing Page', description: 'Visit /pricing to compare tiers and upgrade your plan.' },
        { title: 'Analytics Dashboard', description: 'Premium users get deep insights: page performance, engagement funnel, and category breakdown.' },
        { title: 'Competitor Analysis', description: 'See how you rank compared to similar organizers in your category.' },
        { title: 'Data Export', description: 'Download attendee lists, revenue reports, and engagement data as CSV or JSON.' },
        { title: 'Email Automation', description: 'Create templates for event reminders, thank you messages, and urgency alerts.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Manage your content and track stats',
      features: [
        { title: 'My Events', description: 'View and manage events you\'ve created with edit and analytics options.' },
        { title: 'My RSVPs', description: 'See events you\'ve registered for with dates and venues.' },
        { title: 'Saved Events', description: 'Access your bookmarked events for quick reference.' },
        { title: 'My Places', description: 'Manage places you\'ve submitted or claimed.' },
        { title: 'Tickets', description: 'View purchased tickets with QR codes for event entry.' },
        { title: 'Notifications', description: 'Stay updated with ticket sales, new followers, and event reminders.' },
        { title: 'User Stats', description: 'See your engagement metrics: events attended, places visited, check-ins, and views.' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      description: 'Stay updated on what matters',
      features: [
        { title: 'Push Notifications', description: 'Receive browser notifications for ticket sales, RSVPs, and important updates.' },
        { title: 'Event Reminders', description: 'Get reminded 24 hours before events you\'ve RSVPed to.' },
        { title: 'New Followers', description: 'Know when someone follows you or engages with your content.' },
        { title: 'Weekly Digest', description: 'Receive a weekly summary of trending events in your city.' },
      ],
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      icon: <Shield className="w-6 h-6" />,
      description: 'Platform management tools',
      features: [
        { title: 'Dashboard Overview', description: 'View platform-wide statistics: users, events, places, and orders.' },
        { title: 'User Management', description: 'Browse users, verify accounts, and manage roles.' },
        { title: 'Content Moderation', description: 'Review reported content and take appropriate action.' },
        { title: 'City Management', description: 'Add and manage cities where events and places are hosted.' },
        { title: 'Report System', description: 'Handle user-submitted reports about inappropriate content.' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Learn about all features and how to use AroundMe
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
                  </div>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.features.map((feature, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8" />
            <h2 className="text-xl font-bold">Need More Help?</h2>
          </div>
          <p className="text-indigo-100 mb-4">
            Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-indigo-600 text-white border border-white/20 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
