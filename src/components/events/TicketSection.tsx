'use client';

import Link from 'next/link';
import { Ticket, Plus } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  sold: number;
  maxPerUser: number | null;
  saleStart: string | null;
  saleEnd: string | null;
  isActive: boolean;
}

interface TicketSectionProps {
  tickets: {
    ticketTypes?: TicketType[];
  };
  eventId: string;
}

export function TicketSection({ tickets, eventId }: TicketSectionProps) {
  const ticketTypes = tickets?.ticketTypes || [];
  
  if (ticketTypes.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Get Tickets
        </h3>
      </div>
      <div className="space-y-2">
        {ticketTypes.map((ticket) => {
          const available = ticket.quantity - ticket.sold;
          const isOnSale = (!ticket.saleStart || new Date() >= new Date(ticket.saleStart)) &&
                         (!ticket.saleEnd || new Date() <= new Date(ticket.saleEnd));
          return (
            <div key={ticket.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{ticket.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {available > 0 ? `${available} available` : 'Sold out'}
                  {ticket.maxPerUser && ` • Max ${ticket.maxPerUser} per person`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {ticket.price === 0 ? 'Free' : `$${ticket.price.toLocaleString('COP')}`}
                </span>
                {isOnSale && available > 0 && (
                  <Link
                    href={`/checkout?event_id=${eventId}`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Buy
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
