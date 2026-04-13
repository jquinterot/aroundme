import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@/types';

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserProfile(userId: string, viewerId?: string) {
  return useQuery({
    queryKey: ['user-profile', userId, viewerId],
    queryFn: async () => {
      const res = await fetch(`/api/profile?userId=${userId}${viewerId ? `&viewerId=${viewerId}` : ''}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] });
    },
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/stats?userId=${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserEarnings(userId: string) {
  return useQuery({
    queryKey: ['user-earnings', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/earnings?userId=${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserEvents(userId: string) {
  return useQuery({
    queryKey: ['user-events', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/events?userId=${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserPlaces(userId: string) {
  return useQuery({
    queryKey: ['user-places', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/places?userId=${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUserRsvps() {
  return useQuery({
    queryKey: ['user-rsvps'],
    queryFn: async () => {
      const res = await fetch('/api/user/rsvps');
      return res.json();
    },
  });
}

export function useUserSavedEvents() {
  return useQuery({
    queryKey: ['user-saved-events'],
    queryFn: async () => {
      const res = await fetch('/api/user/saved-events');
      return res.json();
    },
  });
}

export function useUserHistory() {
  return useQuery({
    queryKey: ['user-history'],
    queryFn: async () => {
      const res = await fetch('/api/user/history');
      return res.json();
    },
  });
}
