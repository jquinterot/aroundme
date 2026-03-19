'use client';

import { useState } from 'react';
import { Event, City } from '@/types';
import { EventCard } from './EventCard';
import { EventMap } from '@/components/map';

interface EventListProps {
  events: Event[];
  viewMode: 'list' | 'map' | 'split';
  city: City;
}

export function EventList({ events, viewMode, city }: EventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  if (viewMode === 'map') {
    return (
      <div className="h-[600px] rounded-xl overflow-hidden shadow-inner">
        <EventMap
          events={events}
          city={city}
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (viewMode === 'split') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        <div className="overflow-y-auto pr-2 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`cursor-pointer transition-all ${
                selectedEvent?.id === event.id
                  ? 'ring-2 ring-indigo-500 rounded-xl'
                  : ''
              }`}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden shadow-inner">
          <EventMap
            events={events}
            city={city}
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
