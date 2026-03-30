'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  lat: number;
  lng: number;
  isActive: boolean;
  _count?: { events: number; places: number };
}

export function CitiesTab() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', country: '', slug: '', lat: '', lng: '' });
  const [isAdding, setIsAdding] = useState(false);

  const { data: citiesData, isLoading } = useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const res = await fetch('/api/cities');
      return res.json();
    },
  });

  const cities = citiesData?.data || [];

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCity,
          lat: parseFloat(newCity.lat),
          lng: parseFloat(newCity.lng),
        }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
        setShowAddModal(false);
        setNewCity({ name: '', country: '', slug: '', lat: '', lng: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cities</h2>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Add City</button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New City</h3>
            <form onSubmit={handleAddCity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City Name</label>
                <input type="text" required value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Salento" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input type="text" required value={newCity.country} onChange={(e) => setNewCity({ ...newCity, country: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Colombia" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                <input type="text" required value={newCity.slug} onChange={(e) => setNewCity({ ...newCity, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="salento" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                  <input type="number" step="any" required value={newCity.lat} onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="4.6372" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                  <input type="number" step="any" required value={newCity.lng} onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="-75.5676" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isAdding} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">{isAdding ? 'Adding...' : 'Add City'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No cities found</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Coordinates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cities.map((city: City) => (
                <tr key={city.id}>
                  <td className="px-6 py-4"><p className="font-medium text-gray-900 dark:text-white">{city.name}</p><p className="text-sm text-gray-500">{city.country}</p></td>
                  <td className="px-6 py-4"><code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{city.slug}</code></td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-500">{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-500">Events: {city._count?.events || 0}</p><p className="text-sm text-gray-500">Places: {city._count?.places || 0}</p></td>
                  <td className="px-6 py-4">{city.isActive ? <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span> : <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Inactive</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
