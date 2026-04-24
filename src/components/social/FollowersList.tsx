'use client';

import { UserCard } from './UserCard';

export interface FollowerUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

export interface FollowersListProps {
  users: FollowerUser[];
  type: 'followers' | 'following';
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function FollowersList({ users, type, onLoadMore, hasMore }: FollowersListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {type === 'followers' ? 'Seguidores' : 'Siguiendo'}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{users.length}</span>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} compact />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-medium transition-colors"
        >
          Cargar más
        </button>
      )}
    </div>
  );
}
