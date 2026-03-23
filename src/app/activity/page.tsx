'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { ActivityCard } from '@/components/social';
import { Activity, Users, Loader2 } from 'lucide-react';
import { Activity as ActivityType } from '@/types';

export default function ActivityFeedPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  const fetchActivities = useCallback(async (loadMore = false) => {
    if (loadMore && !hasMore) return;

    setLoading(true);
    try {
      const pageNum = loadMore ? page + 1 : 1;
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
      });

      if (filter === 'following' && user) {
        params.set('following', 'true');
      }

      const res = await fetch(`/api/activity?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        if (loadMore) {
          setActivities(prev => [...prev, ...data.activities]);
        } else {
          setActivities(data.activities);
        }
        setPage(pageNum);
        setHasMore(data.page < data.pages);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, user, page, hasMore]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleFilterChange = (newFilter: 'all' | 'following') => {
    setFilter(newFilter);
    setActivities([]);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Actividad</h1>
              <p className="text-gray-500">Descubre qué están haciendo otros</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleFilterChange('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              Todos
            </button>
            <button
              onClick={() => handleFilterChange('following')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === 'following'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Solo Siguiendo
            </button>
          </div>
        )}

        {!user && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <p className="text-indigo-700 text-sm">
              <Link href="/login" className="font-semibold hover:underline">
                Inicia sesión
              </Link>{' '}
              para ver actividad de las personas que sigues.
            </p>
          </div>
        )}

        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay actividad</h2>
            <p className="text-gray-500">
              {filter === 'following'
                ? 'Sigue a personas para ver su actividad aquí'
                : 'Aún no hay actividad en tu ciudad'}
            </p>
            <Link
              href="/bogota"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Explorar Eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}

            {hasMore && (
              <button
                onClick={() => fetchActivities(true)}
                disabled={loading}
                className="w-full py-4 bg-white rounded-xl shadow-sm text-indigo-600 hover:bg-indigo-50 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  'Cargar más'
                )}
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
