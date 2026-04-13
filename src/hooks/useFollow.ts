import { useQuery, useMutation } from '@tanstack/react-query';

export function useFollow() {
  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId, followingId }),
      });
      return res.json();
    },
  });
}

export function useUnfollow() {
  return useMutation({
    mutationFn: async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
      const res = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId, followingId }),
      });
      return res.json();
    },
  });
}

export function useFollowStatus(followerId: string, followingId: string) {
  return useQuery({
    queryKey: ['follow-status', followerId, followingId],
    queryFn: async () => {
      const res = await fetch(`/api/follow?followerId=${followerId}&followingId=${followingId}`);
      const data = await res.json();
      return data?.data as boolean ?? false;
    },
    enabled: !!followerId && !!followingId && followerId !== followingId,
  });
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/followers/${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const res = await fetch(`/api/user/following/${userId}`);
      return res.json();
    },
    enabled: !!userId,
  });
}
