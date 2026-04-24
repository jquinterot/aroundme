'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User, Check, Loader2, Calendar } from 'lucide-react';
import { AvatarPlaceholder } from '@/components/ui/Placeholder';

export interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
    followerCount?: number;
    eventCount?: number;
    bio?: string;
  };
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  compact?: boolean;
}

export function UserCard({ user, isFollowing = false, onFollow, onUnfollow, compact = false }: UserCardProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await fetch(`/api/follow?userId=${user.id}`, { method: 'DELETE' });
        onUnfollow?.();
      } else {
        await fetch('/api/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ followingId: user.id }),
        });
        onFollow?.();
      }
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <Link
        href={`/profile/${user.id}`}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <AvatarPlaceholder name={user.name} size="md" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
            {user.isVerified && (
              <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <Link href={`/profile/${user.id}`} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <AvatarPlaceholder name={user.name} size="lg" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
              {user.isVerified && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </div>
            {user.bio && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {user.followerCount || 0} seguidores
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {user.eventCount || 0} eventos
        </span>
      </div>

      {currentUser && currentUser.id !== user.id && (
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            isFollowing
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isFollowing ? (
            'Siguiendo'
          ) : (
            'Seguir'
          )}
        </button>
      )}
    </div>
  );
}
