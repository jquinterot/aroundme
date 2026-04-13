import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services';
import type { CreatePlacePayload } from '@/services/api';
import type { PlaceFilterParams } from '@/types';

export function usePlaces(citySlug: string, filters?: Partial<PlaceFilterParams>) {
  return useQuery({
    queryKey: ['places', citySlug, filters],
    queryFn: () => apiService.getPlaces(citySlug, filters),
    enabled: !!citySlug,
  });
}

export function usePlace(placeId: string) {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: () => apiService.getPlaceById(placeId),
    enabled: !!placeId,
  });
}

export function usePlaceReviews(placeId: string) {
  return useQuery({
    queryKey: ['place-reviews', placeId],
    queryFn: () => apiService.getPlaceReviews(placeId),
    enabled: !!placeId,
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreatePlacePayload) => apiService.createPlace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
}

export function usePlaceActions(placeId: string) {
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: () => 
      fetch(`/api/places/${placeId}/claim`, { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place', placeId] });
    },
  });

  return {
    claim: claimMutation.mutate,
    claimAsync: claimMutation.mutateAsync,
    isClaiming: claimMutation.isLoading,
  };
}
