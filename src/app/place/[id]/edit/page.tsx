'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, MapPin, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout';
import { apiService } from '@/services';
import { useCities } from '@/hooks/useCities';
import { PLACE_CATEGORY_OPTIONS } from '@/lib/constants';
import { PlaceCategory } from '@/types';

interface PlaceData {
  id: string;
  name: string;
  description: string;
  category: string;
  cityId: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  image?: string;
  priceRange?: string;
  features?: string[];
  tags?: string[];
  contact?: {
    phone?: string;
    website?: string;
    instagram?: string;
  };
}

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const [placeId, setPlaceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useCities();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as PlaceCategory | '',
    address: '',
    imageUrl: '',
    priceRange: '',
    features: '',
    tags: '',
    contactPhone: '',
    contactWebsite: '',
    contactInstagram: '',
  });

  useEffect(() => {
    params.then(p => setPlaceId(p.id));
  }, [params]);

  const { data: placeData, isLoading: placeLoading } = useQuery({
    queryKey: ['place', placeId],
    queryFn: () => apiService.getPlaceById(placeId),
    enabled: !!placeId,
  });

  useEffect(() => {
    if (placeData?.data) {
      const place: PlaceData = placeData.data;
      startTransition(() => {
        setFormData({
          name: place.name,
          description: place.description,
          category: place.category as PlaceCategory,
          address: place.address,
          imageUrl: place.image || '',
          priceRange: place.priceRange || '',
          features: (place.features || []).join(', '),
          tags: (place.tags || []).join(', '),
          contactPhone: place.contact?.phone || '',
          contactWebsite: place.contact?.website || '',
          contactInstagram: place.contact?.instagram || '',
        });
      });
    }
  }, [placeData]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          address: formData.address,
          imageUrl: formData.imageUrl || null,
          priceRange: formData.priceRange || null,
          features: formData.features,
          tags: formData.tags,
          contactPhone: formData.contactPhone || null,
          contactWebsite: formData.contactWebsite || null,
          contactInstagram: formData.contactInstagram || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/place/${placeId}`);
      } else {
        alert(data.error || 'Failed to update place');
      }
    } catch (error) {
      console.error('Error updating place:', error);
      alert('Failed to update place. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/${placeData?.data?.cityId || 'bogota'}/places`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete place');
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      alert('Failed to delete place. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOwner = user && placeData?.data?.ownerId === user.id;

  if (placeLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  if (!placeData?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Place not found</h1>
          <Link href="/dashboard/places" className="text-teal-600 hover:text-teal-700">
            ← Back to places
          </Link>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You are not authorized to edit this place.</p>
          <Link href={`/place/${placeId}`} className="text-teal-600 hover:text-teal-700">
            ← Back to place
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href={`/place/${placeId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to place
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Place</h1>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Place
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select a category</option>
              {PLACE_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={formData.priceRange}
              onChange={(e) => updateField('priceRange', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Not specified</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Upscale</option>
              <option value="$$$$">$$$$ - Fine Dining</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => updateField('features', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="WiFi, Parking, Air Conditioning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="coffee, quiet, romantic"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.contactWebsite}
                  onChange={(e) => updateField('contactWebsite', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.contactInstagram}
                  onChange={(e) => updateField('contactInstagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
            <Link
              href={`/place/${placeId}`}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Place</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">&quot;{formData.name}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Place
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
