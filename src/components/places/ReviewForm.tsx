'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  placeId: string;
  placeName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ placeId, placeName, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const submitReview = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const res = await fetch(`/api/places/${placeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit review');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['place-reviews', placeId] });
      queryClient.invalidateQueries({ queryKey: ['place', placeId] });
      setRating(0);
      setComment('');
      setIsOpen(false);
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    submitReview.mutate({ rating, comment });
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-3">Sign in to leave a review</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-teal-700 transition-colors"
      >
        Write a Review
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Review {placeName}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select a rating</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={rating === 0 || submitReview.isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setRating(0);
              setComment('');
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {submitReview.isError && (
          <p className="text-sm text-red-500">
            {(submitReview.error as Error)?.message || 'Failed to submit review'}
          </p>
        )}
      </form>
    </div>
  );
}
