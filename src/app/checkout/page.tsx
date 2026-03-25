'use client';

import Link from 'next/link';

import { useEffect, useState, useCallback, startTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Header } from '@/components/layout';
import { Ticket, Plus, Minus, CreditCard, Loader2 } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerUser: number;
  saleStart?: string;
  saleEnd?: string;
}

interface Event {
  id: string;
  title: string;
  ticketTypes: TicketType[];
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('event_id');
  const [event, setEvent] = useState<Event | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setError('No event ID provided');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/events/${eventId}/tickets`);
      const data = await res.json();
      if (data.success) {
        const initialCart: Record<string, number> = {};
        data.data.ticketTypes.forEach((tt: TicketType) => {
          initialCart[tt.id] = 0;
        });
        setEvent(data.data);
        startTransition(() => {
          setCart(initialCart);
        });
      } else if (data.code === 'UNAUTHORIZED') {
        setError('Please log in to purchase tickets');
      } else if (data.code === 'NOT_FOUND') {
        setError('Event not found');
      } else {
        setError(data.error || 'Failed to load event');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load event. Please try again.');
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    startTransition(() => {
      fetchEvent();
    });
  }, [fetchEvent]);

  const updateQuantity = (ticketTypeId: string, delta: number) => {
    const ticketType = event?.ticketTypes.find((tt) => tt.id === ticketTypeId);
    if (!ticketType) return;

    const available = ticketType.quantity - ticketType.sold;
    const current = cart[ticketTypeId] || 0;
    const newQty = Math.max(0, Math.min(current + delta, available, ticketType.maxPerUser));
    
    setCart(prev => ({ ...prev, [ticketTypeId]: newQty }));
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = event?.ticketTypes.reduce((sum, tt) => {
    return sum + (cart[tt.id] || 0) * tt.price;
  }, 0) || 0;

  const handleCheckout = async () => {
    if (!name || !email) {
      alert('Please enter your name and email');
      return;
    }

    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

    if (items.length === 0) {
      alert('Please select at least one ticket');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email, name }),
      });
      const data = await res.json();
      
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch {
      alert('Failed to start checkout');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Event not found'}
          </h1>
          {error?.includes('log in') && (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Log In to Continue
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Tickets</h1>
        <p className="text-gray-500 mb-8">{event.title}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {event.ticketTypes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No tickets available</h3>
                <p className="text-gray-500 mt-2">This event doesn&apos;t have any tickets for sale yet.</p>
              </div>
            ) : (
              event.ticketTypes.map((ticketType) => {
                const available = ticketType.quantity - ticketType.sold;
                const isOnSale = (!ticketType.saleStart || new Date() >= new Date(ticketType.saleStart)) &&
                               (!ticketType.saleEnd || new Date() <= new Date(ticketType.saleEnd));
                
                return (
                  <div key={ticketType.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{ticketType.name}</h3>
                        {ticketType.description && (
                          <p className="text-sm text-gray-500 mt-1">{ticketType.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {ticketType.price === 0 ? 'Free' : `$${ticketType.price.toLocaleString('COP')}`}
                        </p>
                        {available === 0 && (
                          <p className="text-sm text-red-500">Sold out</p>
                        )}
                      </div>
                    </div>

                    {isOnSale && available > 0 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(ticketType.id, -1)}
                            disabled={!cart[ticketType.id]}
                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-semibold w-8 text-center">
                            {cart[ticketType.id] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(ticketType.id, 1)}
                            disabled={cart[ticketType.id] >= Math.min(available, ticketType.maxPerUser)}
                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {available} of {ticketType.quantity} remaining
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {ticketType.saleStart && new Date() < new Date(ticketType.saleStart) && (
                          <p>Sales start {new Date(ticketType.saleStart).toLocaleDateString()}</p>
                        )}
                        {ticketType.saleEnd && new Date() > new Date(ticketType.saleEnd) && (
                          <p>Sales have ended</p>
                        )}
                        {available === 0 && <p>Sold out</p>}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {totalItems > 0 ? (
                <div className="space-y-3 mb-4">
                  {event.ticketTypes.filter((tt) => cart[tt.id] > 0).map((tt) => (
                    <div key={tt.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{tt.name} x{cart[tt.id]}</span>
                      <span className="font-medium">${(tt.price * cart[tt.id]).toLocaleString('COP')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No tickets selected</p>
              )}

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString('COP')}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={totalItems === 0 || submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
