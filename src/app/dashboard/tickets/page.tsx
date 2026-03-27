'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { Ticket, Calendar, MapPin, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface OrderItem {
  quantity: number;
  priceAtTime: number;
  ticketType?: {
    name: string;
    event?: {
      id: string;
      title: string;
      dateStart: string;
      venueName: string;
      imageUrl?: string;
    };
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  email: string;
  createdAt: string;
  items: OrderItem[];
}

export default function TicketsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setFetchLoading(true);
    try {
      const url = filter === 'all' ? '/api/orders' : `/api/orders?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error(error);
    }
    setFetchLoading(false);
  }, [user, filter]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    startTransition(() => {
      fetchOrders();
    });
  }, [fetchOrders]);

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

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard-tickets-page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="dashboard-tickets-title">My Tickets</h1>
            <p className="text-gray-500">View your purchased tickets</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {fetchLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h2>
            <p className="text-gray-500 mb-6">
              Browse events and purchase tickets to see them here.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const primaryEvent = order.items[0]?.ticketType?.event;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm text-gray-400">#{order.id.slice(-8)}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Ordered {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        ${order.total.toLocaleString('COP')}
                      </p>
                    </div>

                    {primaryEvent && (
                      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                        {primaryEvent.imageUrl && (
                          <Image
                            src={primaryEvent.imageUrl}
                            alt={primaryEvent.title}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{primaryEvent.title}</h3>
                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(primaryEvent.dateStart), 'EEEE, MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {format(new Date(primaryEvent.dateStart), 'h:mm a')}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {primaryEvent.venueName}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tickets</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg"
                          >
                            <Ticket className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-medium text-indigo-900">
                              {item.ticketType?.name} x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {order.status === 'completed' && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Confirmation sent to {order.email}
                        </p>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                          Download Tickets
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
