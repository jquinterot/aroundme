'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services';
import { City } from '@/types';

export function useCities() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cities'],
    queryFn: () => apiService.getCities(),
  });

  return {
    cities: (data?.data || []) as City[],
    isLoading,
    error,
  };
}
