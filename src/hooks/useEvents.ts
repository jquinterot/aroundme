import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services';
import type { CreateEventPayload } from '@/services/api';
import type { FilterParams } from '@/types';

export function useEvents(citySlug: string, filters?: Partial<FilterParams>) {
  return useQuery({
    queryKey: ['events', citySlug, filters],
    queryFn: () => apiService.getEvents(citySlug, filters),
    enabled: !!citySlug,
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => apiService.getEventById(eventId),
    enabled: !!eventId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => apiService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useEventActions(eventId: string) {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => 
      fetch(`/api/events/${eventId}/save`, { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', eventId] });
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: (status: string) => 
      fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', eventId] });
    },
  });

  const featureMutation = useMutation({
    mutationFn: ({ tier, userId }: { tier: 'basic' | 'premium'; userId: string }) => 
      fetch(`/api/events/${eventId}/feature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, userId }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', eventId] });
    },
  });

  const removeFeatureMutation = useMutation({
    mutationFn: () => 
      fetch(`/api/events/${eventId}/feature`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', eventId] });
    },
  });

  return {
    save: saveMutation.mutate,
    rsvp: rsvpMutation.mutate,
    feature: featureMutation.mutate,
    removeFeature: removeFeatureMutation.mutate,
    saveAsync: saveMutation.mutateAsync,
    rsvpAsync: rsvpMutation.mutateAsync,
    featureAsync: featureMutation.mutateAsync,
    removeFeatureAsync: removeFeatureMutation.mutateAsync,
    isSaving: saveMutation.isLoading,
    isRsvping: rsvpMutation.isLoading,
    isFeaturing: featureMutation.isLoading,
    isRemovingFeature: removeFeatureMutation.isLoading,
  };
}
