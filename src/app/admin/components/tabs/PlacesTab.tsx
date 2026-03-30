'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, CheckCircle, Star } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  city?: { name: string };
  owner?: { name: string };
  isVerified: boolean;
  rating: number;
  _count?: { reviews: number };
}

export function PlacesTab() {
  const queryClient = useQueryClient();

  const { data: placesData, isLoading: loading } = useQuery({
    queryKey: ['admin-places'],
    queryFn: async () => {
      const res = await fetch('/api/admin/places');
      return res.json();
    },
  });

  const places = placesData?.data || [];

  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/places/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-places'] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Places</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No places found</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {places.map((place: Place) => (
                <tr key={place.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{place.name}</p>
                    <p className="text-sm text-gray-500">{place.city?.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-white">{place.owner?.name || 'Unclaimed'}</p>
                  </td>
                  <td className="px-6 py-4">
                    {place.isVerified ? (
                      <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Verified</span>
                    ) : (
                      <span className="text-gray-400">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{place.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-gray-400">({place._count?.reviews || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/place/${place.id}`} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-4 h-4" />
                      </Link>
                      {!place.isVerified && (
                        <button onClick={() => handleAction(place.id, 'verify')} className="p-2 text-green-600 hover:text-green-700" title="Verify">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
