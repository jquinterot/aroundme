'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { Calendar, MapPin, Users, Eye, Loader2, Pencil, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserEvent {
  id: string;
  title: string;
  category: string;
  status: string;
  city: { name: string; slug: string };
  venueName: string;
  dateStart: string;
  isFree: boolean;
  price: number;
  image: string | null;
  isFeatured: boolean;
  viewCount: number;
  rsvpCount: number;
  saveCount: number;
}

export default function DashboardEventsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/user/events')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEvents(data.data);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Eventos</h1>
            <p className="text-gray-500">Gestiona tus eventos creados</p>
          </div>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>+</span>
            Crear Evento
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes eventos aún</h2>
              <p className="text-gray-500 mb-6">Crea tu primer evento y comienza a ver análisis</p>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Crear Tu Primer Evento
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {event.image ? (
                    <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <Calendar className="w-8 h-8 text-indigo-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        {event.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            <Star className="w-3 h-3 fill-current" />
                            Destacado
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.dateStart), 'd MMM, yyyy', { locale: es })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.venueName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.rsvpCount} RSVPs
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/event/${event.id}`}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Ver evento"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/event/${event.id}/edit`}
                        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>{event.viewCount} vistas</span>
                    <span>{event.saveCount} guardados</span>
                    <span>{event.isFree ? 'Gratis' : `$${event.price.toLocaleString()}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
