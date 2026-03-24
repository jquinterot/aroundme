'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { 
  Calendar, 
  MapPin, 
  Users, 
  QrCode, 
  Star, 
  Bell,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Crown,
  TrendingUp,
  DollarSign,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface FeatureSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  features: { title: string; description: string; link?: string }[];
  cta?: { label: string; href: string };
}

export default function DocsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections: FeatureSection[] = [
    {
      id: 'overview',
      title: 'Getting Started',
      icon: <HelpCircle className="w-6 h-6" />,
      description: 'Quick overview of the platform',
      features: [
        { title: 'What is AroundMe?', description: 'AroundMe helps you discover events, places, and activities in your city. Create events, book tickets, and connect with local organizers.' },
        { title: 'For Event Attendees', description: 'Browse events by category, RSVP, purchase tickets, save favorites, and receive reminders.' },
        { title: 'For Organizers', description: 'Create and promote events, sell tickets with automatic payouts, track analytics, and build your audience.' },
        { title: 'For Businesses', description: 'Claim your venue, receive reviews, manage your presence, and get insights into visitor engagement.' },
      ],
      cta: { label: 'Sign Up Free', href: '/signup' },
    },
    {
      id: 'events',
      title: 'Events',
      icon: <Calendar className="w-6 h-6" />,
      description: 'Create and manage events in your city',
      features: [
        { title: 'Create Events', description: 'Fill in a multi-step form with city, category, date, time, venue, and pricing details. Events are reviewed before publishing.' },
        { title: 'Event Categories', description: 'Choose from: Music, Food, Sports, Art, Tech, Community, Nightlife, Outdoor, Education, or Other.' },
        { title: 'Ticket Types', description: 'Create multiple ticket tiers (VIP, General, Early Bird) with different prices, quantities, sale start/end dates, and per-user limits.' },
        { title: 'RSVP System', description: 'Users can mark as Going, Interested, or Maybe. See attendance counts and manage capacity.' },
        { title: 'Waitlist', description: 'When tickets sell out, users can join a waitlist. You\'ll see waitlist count and can notify people when spots open.' },
        { title: 'QR Check-in', description: 'Generate QR codes for each ticket. Use the scanner at the venue to check attendees in instantly.' },
        { title: 'Featured Events', description: 'Get more visibility with Basic (7 days) or Premium (30 days) featured badges. Premium featured events appear first.' },
        { title: 'Event Analytics', description: 'Track views, saves, RSVPs, ticket sales, check-ins, and conversion rates. See which channels bring the most traffic.' },
        { title: 'Recurring Events', description: 'Set up event series that repeat daily, weekly, or monthly. Save time creating similar events.' },
        { title: 'Event Duplication', description: 'Copy an existing event as a template for a new one. Great for recurring meetups.' },
      ],
      cta: { label: 'Create an Event', href: '/create-event' },
    },
    {
      id: 'places',
      title: 'Places',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Discover and manage local venues',
      features: [
        { title: 'Submit Places', description: 'Recommend local venues by submitting name, address, category, contact info, website, and Instagram.' },
        { title: 'Place Categories', description: 'Browse by Restaurant, Café, Bar, Club, Park, Museum, Shopping, Hotel, or Coworking.' },
        { title: 'Reviews & Ratings', description: 'Rate places 1-5 stars and leave detailed reviews. See aggregate ratings and read community feedback.' },
        { title: 'Photo Gallery', description: 'View photos uploaded by the community. See what each place looks like before visiting.' },
        { title: 'Operating Hours', description: 'Check current hours, open/closed status, and special holiday hours. Plan your visit accordingly.' },
        { title: 'Claim Business', description: 'Business owners can claim their venue to manage info, respond to reviews, and add photos.' },
        { title: 'Place Filters', description: 'Filter by category, price range, and attributes like WiFi, outdoor seating, or live music.' },
      ],
    },
    {
      id: 'activities',
      title: 'Activities',
      icon: <Star className="w-6 h-6" />,
      description: 'Book experiences, classes, and tours',
      features: [
        { title: 'Browse Activities', description: 'Discover classes, tours, experiences, entertainment, and wellness activities in your area.' },
        { title: 'Flexible Scheduling', description: 'View schedule type: Fixed time (specific datetime), Flexible (varies), or By Appointment (book ahead).' },
        { title: 'Duration & Capacity', description: 'See how long activities last and maximum group size. Book with confidence.' },
        { title: 'Book Online', description: 'Reserve spots directly through the platform. Get instant confirmation.' },
        { title: 'Multiple Views', description: 'Switch between grid, list, or map views. Find activities near you.' },
      ],
    },
    {
      id: 'social',
      title: 'Social',
      icon: <Users className="w-6 h-6" />,
      description: 'Connect with users and follow organizers',
      features: [
        { title: 'User Profiles', description: 'View profiles with bio, website, social links, events created, followers, and activity history.' },
        { title: 'Follow System', description: 'Follow organizers to see their new events in your feed. Get notified when they create something new.' },
        { title: 'Activity Feed', description: 'See real-time activity: events created, RSVPs, reviews, follows from people you follow.' },
        { title: 'Recommendations', description: 'Get personalized suggestions based on categories you engage with and your location.' },
        { title: 'Discover Page', description: 'Explore curated collections and trending events. Find what\'s popular in your city.' },
      ],
      cta: { label: 'Explore', href: '/discover' },
    },
    {
      id: 'payments',
      title: 'For Organizers: Getting Paid',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Accept payments and receive automatic payouts',
      features: [
        { title: 'Stripe Connect Required', description: 'To receive payouts, connect your Stripe account. This is required for selling tickets.' },
        { title: 'How to Connect', description: 'Go to Dashboard → Earnings → "Connect with Stripe". Complete the Stripe onboarding process.' },
        { title: 'Automatic Payouts', description: 'When a customer buys tickets, funds go directly to your Stripe account minus our 10% platform fee.' },
        { title: 'Payout Timeline', description: 'Stripe typically transfers funds to your bank within 2-7 business days, depending on your Stripe account type.' },
        { title: 'Earnings Dashboard', description: 'Track total earnings, pending payouts, completed payouts, and detailed transaction history.' },
        { title: 'Platform Fee Breakdown', description: 'We keep 10% to cover server costs, payment processing, maintenance, and platform development.' },
        { title: 'Order Management', description: 'View all ticket orders, buyer info, and delivery status. Issue refunds if needed.' },
      ],
      cta: { label: 'Go to Earnings', href: '/dashboard/earnings' },
    },
    {
      id: 'premium',
      title: 'Premium Subscription',
      icon: <Crown className="w-6 h-6" />,
      description: 'Unlock advanced features for serious organizers',
      features: [
        { title: 'Free Tier', description: '3 events/month, basic analytics, 7-day data retention. Great for trying out.' },
        { title: 'Basic Tier', description: '10 events/month, advanced analytics, data export (CSV/JSON), 30-day retention. $19/month.' },
        { title: 'Premium Tier', description: 'Unlimited events, competitor insights, email automation, priority support, API access. $49/month.' },
        { title: 'Upgrade Plan', description: 'Go to /pricing, select your tier, and complete payment. Changes are instant.' },
        { title: 'Premium Analytics', description: 'Access /premium-analytics for deep insights: page performance, engagement funnel, category breakdown.' },
        { title: 'Competitor Analysis', description: 'See your ranking vs similar organizers. Know where you stand in your category.' },
        { title: 'Data Export', description: 'Download attendee lists, revenue reports, and engagement data anytime as CSV or JSON.' },
        { title: 'Email Automation', description: 'Create templates for event reminders (24h before), thank you messages, and urgency alerts (low availability).' },
        { title: 'API Access', description: 'Premium users get API access to build custom integrations and sync with external tools.' },
      ],
      cta: { label: 'View Pricing', href: '/pricing' },
    },
    {
      id: 'checkin',
      title: 'Check-in System',
      icon: <QrCode className="w-6 h-6" />,
      description: 'Efficient event entry management',
      features: [
        { title: 'QR Code Tickets', description: 'Each ticket has a unique QR code containing encrypted user ID, order ID, and ticket type.' },
        { title: 'Check-in Page', description: 'Event owners access /event/[id]/check-in to open the QR scanner.' },
        { title: 'Scan Process', description: 'Point the camera at the attendee\'s QR code. See instant status: Success, Already Used, or Invalid.' },
        { title: 'Attendance Tracking', description: 'See real-time check-in count vs RSVPs. Identify no-shows for follow-up.' },
        { title: 'Manual Check-in', description: 'Can\'t scan? Search by name or email to check in manually.' },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Manage your content and track performance',
      features: [
        { title: 'My Events', description: 'View, edit, duplicate, or feature events you\'ve created. See performance at a glance.' },
        { title: 'My RSVPs', description: 'See events you\'re attending with dates, venues, and ticket QR codes.' },
        { title: 'Saved Events', description: 'Access bookmarked events. Never miss an event you want to attend.' },
        { title: 'My Places', description: 'Manage places you\'ve submitted or claimed. Update info and photos.' },
        { title: 'Tickets', description: 'View purchased tickets with QR codes. Add to calendar or share with friends.' },
        { title: 'Notifications', description: 'Stay updated: ticket sales, new followers, event reminders, and system announcements.' },
        { title: 'User Stats', description: 'See your engagement: events attended, places visited, check-ins, profile views.' },
        { title: 'Earnings', description: 'Track revenue from ticket sales, pending payouts, and payout history.' },
      ],
      cta: { label: 'Go to Dashboard', href: '/dashboard' },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      description: 'Stay updated on what matters',
      features: [
        { title: 'Push Notifications', description: 'Enable browser notifications to receive updates even when the site is closed.' },
        { title: 'Event Reminders', description: 'Get reminded 24 hours before events you\'ve RSVPed to.' },
        { title: 'Ticket Sales', description: 'As an organizer, get notified instantly when someone buys tickets.' },
        { title: 'New Followers', description: 'Know when someone follows you. Grow your audience.' },
        { title: 'Comment Replies', description: 'Get notified when someone replies to your review or comment.' },
        { title: 'Weekly Digest', description: 'Receive a weekly summary of trending events in your city every Monday.' },
      ],
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      icon: <Shield className="w-6 h-6" />,
      description: 'Platform management for administrators',
      features: [
        { title: 'Dashboard Overview', description: 'View platform-wide stats: total users, events, places, orders, and revenue.' },
        { title: 'User Management', description: 'Browse all users, verify accounts, change roles (user/admin), or suspend accounts.' },
        { title: 'Content Moderation', description: 'Review reported content: events, places, reviews, or comments that violate guidelines.' },
        { title: 'City Management', description: 'Add new cities, update city info, or remove cities from the platform.' },
        { title: 'Report Queue', description: 'Handle user-submitted reports. Take action: approve, remove content, or warn users.' },
        { title: 'Platform Revenue', description: 'View collected platform fees, payout history, and financial summaries.' },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <AlertTriangle className="w-6 h-6" />,
      description: 'Common issues and how to fix them',
      features: [
        { title: 'Can\'t create events', description: 'Check if you\'ve hit your monthly limit (Free: 3, Basic: 10). Upgrade or wait for next month.' },
        { title: 'Stripe Connect issues', description: 'Ensure your Stripe account is fully verified. Check /dashboard/earnings for onboarding status.' },
        { title: 'Ticket not working', description: 'Refresh the page or download the ticket again. QR codes are generated at purchase.' },
        { title: 'Push notifications not working', description: 'Enable in browser settings. Make sure you\'re on a supported browser (Chrome, Firefox, Safari).' },
        { title: 'Event not appearing', description: 'New events go through review. Check your email for approval status or contact support.' },
        { title: 'Refund not received', description: 'Refunds take 5-10 business days to appear. Contact support with your order ID if delayed.' },
      ],
      cta: { label: 'Contact Support', href: '/contact' },
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
            Everything you need to know about AroundMe
          </p>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-8 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">For Organizers & Businesses</h2>
          </div>
          <p className="text-indigo-800 dark:text-indigo-200 mb-4">
            Want to sell tickets and receive payouts? Here&apos;s how:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/docs#payments" className="p-4 bg-white dark:bg-indigo-800/50 rounded-lg hover:shadow-md transition-shadow">
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">1. Connect Stripe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Set up payouts via Stripe Connect</p>
            </Link>
            <Link href="/docs#premium" className="p-4 bg-white dark:bg-indigo-800/50 rounded-lg hover:shadow-md transition-shadow">
              <Crown className="w-8 h-8 text-amber-600 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">2. Choose a Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Free, Basic, or Premium tiers</p>
            </Link>
            <Link href="/dashboard/earnings" className="p-4 bg-white dark:bg-indigo-800/50 rounded-lg hover:shadow-md transition-shadow">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">3. Track Earnings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Monitor sales in your dashboard</p>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
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
                  {section.cta && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <Link
                        href={section.cta.href}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {section.cta.label}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8" />
            <h2 className="text-xl font-bold">Still Need Help?</h2>
          </div>
          <p className="text-indigo-100 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
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
