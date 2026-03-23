'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { Calendar, MapPin, Check, Loader2, Settings, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User } from '@/types';

interface UserProfile extends User {
  city?: { name: string };
  events?: Array<{
    id: string;
    title: string;
    imageUrl?: string;
    dateStart: string;
    venueName: string;
  }>;
  isFollowing?: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = (params?.id as string) || '';
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'activity' | 'followers' | 'following'>('events');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setIsFollowing(data.data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  const handleFollow = async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await fetch(`/api/follow?userId=${userId}`, { method: 'DELETE' });
        setIsFollowing(false);
        setUser((prev) => prev ? {
          ...prev,
          followerCount: (prev.followerCount || 0) - 1,
        } : null);
      } else {
        await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId: userId }),
        });
        setIsFollowing(true);
        setUser((prev) => prev ? {
          ...prev,
          followerCount: (prev.followerCount || 0) + 1,
        } : null);
      }
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Usuario no encontrado</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={92}
                    height={92}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  {user.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <Check className="w-3 h-3" />
                      Verificado
                    </span>
                  )}
                </div>

                {user.city && (
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {user.city.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {currentUser?.id === user.id ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Editar
                  </Link>
                ) : (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {followLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      'Siguiendo'
                    ) : (
                      'Seguir'
                    )}
                  </button>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="mt-4 text-gray-700">{user.bio}</p>
            )}

            <div className="flex items-center gap-6 mt-4 text-sm">
              <span className="font-semibold text-gray-900">{user.followerCount}</span>
              <span className="text-gray-500">seguidores</span>
              <span className="font-semibold text-gray-900">{user.followingCount}</span>
              <span className="text-gray-500">siguiendo</span>
              <span className="font-semibold text-gray-900">{user.eventCount}</span>
              <span className="text-gray-500">eventos</span>
            </div>

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'events'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Actividad
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'followers'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {user.followerCount} Seguidores
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'following'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {user.followingCount} Siguiendo
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'events' && (
              <div className="space-y-4">
                {user.events && user.events.length > 0 ? (
                  user.events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/event/${event.id}`}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {event.imageUrl ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-8 h-8 text-indigo-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(event.dateStart), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                        <p className="text-sm text-gray-500">{event.venueName}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay eventos públicos</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Actividad reciente</p>
              </div>
            )}

            {activeTab === 'followers' && (
              <div className="text-center py-12">
                <p className="text-gray-500">{user.followerCount} seguidores</p>
              </div>
            )}

            {activeTab === 'following' && (
              <div className="text-center py-12">
                <p className="text-gray-500">{user.followingCount} siguiendo</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
