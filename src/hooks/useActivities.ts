import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityBookingData, ActivityBookingResult } from '@/types';

export function useActivities(citySlug: string) {
  return useQuery({
    queryKey: ['activities', citySlug],
    queryFn: async () => {
      const res = await fetch(`/api/cities/${citySlug}/activities`);
      return res.json();
    },
    enabled: !!citySlug,
  });
}

export function useActivity(activityId: string) {
  return useQuery({
    queryKey: ['activity', activityId],
    queryFn: async () => {
      const res = await fetch(`/api/activities/${activityId}`);
      return res.json();
    },
    enabled: !!activityId,
  });
}

export function useBookActivity(activityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ActivityBookingData) => 
      fetch(`/api/activities/${activityId}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()) as Promise<{ success: boolean; data?: ActivityBookingResult; error?: string }>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
    },
  });
}

export function useActivityActions(activityId: string) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => 
      fetch(`/api/activities/${activityId}/booking/${bookingId}`, { 
        method: 'DELETE' 
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] });
    },
  });

  return {
    cancel: cancelMutation.mutate,
    cancelAsync: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isLoading,
  };
}
