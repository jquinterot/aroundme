/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Settings,
  Wallet,
  ArrowRight
} from 'lucide-react';

interface StripeConnectStatus {
  connected: boolean;
  accountId?: string;
  onboardingComplete?: boolean;
  balance: number;
  pendingBalance: number;
  platformFeePercent: number;
  dashboardUrl?: string;
}

interface EarningsSummary {
  totalEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  totalOrders: number;
  platformFees: number;
}

export default function EarningsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [connectStatus, setConnectStatus] = useState<StripeConnectStatus | null>(null);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loadingConnect, setLoadingConnect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchConnectStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/stripe/connect');
      const data = await res.json();
      if (data.success) {
        setConnectStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching connect status:', error);
    }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await fetch('/api/user/earnings');
      const data = await res.json();
      if (data.success) {
        setEarnings(data.data);
      }
    } catch {
      setEarnings({
        totalEarnings: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
        totalOrders: 0,
        platformFees: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchConnectStatus();
      fetchEarnings();
    }
  }, [user, fetchConnectStatus, fetchEarnings]);

  const handleConnectStripe = async () => {
    setLoadingConnect(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data.onboardingUrl) {
        window.location.href = data.data.onboardingUrl;
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      setLoadingConnect(false);
    }
  };

  const handleGoToDashboard = () => {
    if (connectStatus?.dashboardUrl) {
      window.open(connectStatus.dashboardUrl, '_blank');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings & Payouts</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your revenue and manage payouts</p>
          </div>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>

        {!connectStatus?.connected ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Stripe Account
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                To receive payouts for your ticket sales, you need to connect your Stripe account. 
                This allows us to automatically transfer your earnings minus the {connectStatus?.platformFeePercent || 10}% platform fee.
              </p>
              <button
                onClick={handleConnectStripe}
                disabled={loadingConnect}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loadingConnect ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Connect with Stripe
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Secure payment processing by Stripe
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${earnings?.totalEarnings?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-400 mt-1">COP</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending Payouts</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${earnings?.pendingPayouts?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Awaiting transfer</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Completed Payouts</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${earnings?.completedPayouts?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {earnings?.totalOrders || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Tickets sold</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                  <Link href="/dashboard/tickets" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Ticket Sale</p>
                        <p className="text-sm text-gray-500">Concierto de Rock</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+$450,000</p>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Platform Fee</p>
                        <p className="text-sm text-gray-500">10% of ticket sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-500">-$50,000</p>
                      <p className="text-xs text-gray-400">Today</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Pending Transfer</p>
                        <p className="text-sm text-gray-500">Feria Gastronómica</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">+$280,000</p>
                      <p className="text-xs text-gray-400">Processing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Stripe Account</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Account Connected</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Account ID</span>
                      <span className="text-gray-900 dark:text-gray-300 font-mono text-xs">
                        {connectStatus.accountId?.slice(0, 10)}...
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform Fee</span>
                      <span className="text-gray-900 dark:text-gray-300">{connectStatus.platformFeePercent}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available Balance</span>
                      <span className="text-gray-900 dark:text-gray-300 font-semibold">
                        ${connectStatus.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGoToDashboard}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Stripe Dashboard
                  </button>
                </div>
              </div>
            </div>

            {!connectStatus.onboardingComplete && (
              <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Complete Your Stripe Onboarding</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Your Stripe account setup is not complete. Complete it to receive payouts.
                    </p>
                    <button
                      onClick={handleConnectStripe}
                      className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-200 underline"
                    >
                      Continue Setup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
