'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Minus, Plus, Loader2, CreditCard, Check } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  sold: number;
  maxPerUser: number;
  saleStart: string | null;
  saleEnd: string | null;
  isActive: boolean;
  available: number;
}

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  eventId?: string;
  eventTitle?: string;
  currency?: string;
  onTicketsSelected?: (selected: Map<string, number>) => void;
}

export function TicketSelector({ 
  ticketTypes, 
  eventId: _,
  eventTitle: _2,
  currency = 'COP',
  onTicketsSelected 
}: TicketSelectorProps) {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (ticketTypeId: string, delta: number) => {
    const ticket = ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticket) return;

    const currentQty = selectedTickets.get(ticketTypeId) || 0;
    const newQty = Math.max(0, Math.min(currentQty + delta, ticket.available, ticket.maxPerUser));
    
    const newSelected = new Map(selectedTickets);
    if (newQty === 0) {
      newSelected.delete(ticketTypeId);
    } else {
      newSelected.set(ticketTypeId, newQty);
    }
    
    setSelectedTickets(newSelected);
    onTicketsSelected?.(newSelected);
  };

  const getTotal = () => {
    let total = 0;
    selectedTickets.forEach((qty, ticketId) => {
      const ticket = ticketTypes.find(t => t.id === ticketId);
      if (ticket) {
        total += ticket.price * qty;
      }
    });
    return total;
  };

  const getTotalTickets = () => {
    let count = 0;
    selectedTickets.forEach(qty => {
      count += qty;
    });
    return count;
  };

  const isTicketAvailable = (ticket: TicketType) => {
    const now = new Date();
    if (ticket.saleStart && new Date(ticket.saleStart) > now) return false;
    if (ticket.saleEnd && new Date(ticket.saleEnd) < now) return false;
    if (ticket.available <= 0) return false;
    return ticket.isActive;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `${currency === 'COP' ? '$' : ''}${price.toLocaleString()} ${currency === 'COP' ? 'COP' : ''}`;
  };

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (selectedTickets.size === 0) return;

    setLoading(true);
    try {
      const items = Array.from(selectedTickets.entries()).map(([ticketTypeId, quantity]) => ({
        ticketTypeId,
        quantity,
      }));

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email: user.email,
          name: user.name,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        alert(data.error || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <div className="text-center">
          <Ticket className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Compra tus boletos</h3>
          <p className="text-gray-600 mb-4">Inicia sesión para comprar boletos para este evento</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6" />
          <h2 className="text-xl font-bold">Boletos</h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {ticketTypes.map((ticket) => {
          const available = ticket.quantity - ticket.sold;
          const isAvailable = isTicketAvailable(ticket);
          const selectedQty = selectedTickets.get(ticket.id) || 0;
          const isLowStock = available <= 10 && available > 0;

          return (
            <div
              key={ticket.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                isAvailable
                  ? selectedQty > 0
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                  {ticket.description && (
                    <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                  )}
                  {ticket.saleStart && new Date(ticket.saleStart) > new Date() && (
                    <span className="inline-block mt-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Venta inicia {new Date(ticket.saleStart).toLocaleDateString()}
                    </span>
                  )}
                  {ticket.saleEnd && new Date(ticket.saleEnd) < new Date() && (
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Venta terminada
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">{formatPrice(ticket.price)}</p>
                  {isLowStock && (
                    <p className="text-xs text-orange-600">¡Solo {available} restantes!</p>
                  )}
                  {available <= 0 && (
                    <p className="text-xs text-red-600">Agotado</p>
                  )}
                </div>
              </div>

              {isAvailable && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(ticket.id, -1)}
                      disabled={selectedQty === 0}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{selectedQty}</span>
                    <button
                      onClick={() => handleQuantityChange(ticket.id, 1)}
                      disabled={selectedQty >= Math.min(available, ticket.maxPerUser)}
                      className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Máx. {ticket.maxPerUser} por persona
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {getTotalTickets() > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">
                {getTotalTickets()} boleto{getTotalTickets() > 1 ? 's' : ''}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                Total: {formatPrice(getTotal())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceder al Pago
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              Al procesar tu compra, aceptas nuestros términos y condiciones
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TicketConfirmationProps {
  order: {
    id: string;
    status: string;
    total: number;
    items: Array<{
      id: string;
      quantity: number;
      priceAtTime: number;
      ticketType: {
        name: string;
        event: {
          title: string;
          dateStart: Date;
          venueName: string;
        };
      };
    }>;
  };
}

export function TicketConfirmation({ order }: TicketConfirmationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Compra Exitosa!</h2>
        <p className="text-green-100">
          Tu orden #{order.id.slice(0, 8)} ha sido confirmada
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">
                  {item.ticketType.event.title}
                </p>
                <p className="text-sm text-gray-500">
                  {item.ticketType.name} • {new Date(item.ticketType.event.dateStart).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {item.ticketType.event.venueName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${item.priceAtTime.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  x{item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Pagado</span>
            <span className="text-2xl font-bold text-green-600">
              ${order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            href="/dashboard/my-rsvps"
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center"
          >
            Ver Mis Eventos
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Imprimir Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
