'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, AlertTriangle, Loader2, XCircle, Copy } from 'lucide-react';

interface OwnerControlsProps {
  eventId: string;
  eventTitle: string;
  eventStatus: string;
  citySlug: string;
}

export function OwnerControls({ eventId, eventTitle, eventStatus, citySlug }: OwnerControlsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/${citySlug}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to cancel event');
        setIsCancelling(false);
      }
    } catch (error) {
      console.error('Error cancelling event:', error);
      alert('Failed to cancel event. Please try again.');
      setIsCancelling(false);
    }
  };

  const handleRestore = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to restore event');
        setIsCancelling(false);
      }
    } catch (error) {
      console.error('Error restoring event:', error);
      alert('Failed to restore event. Please try again.');
      setIsCancelling(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const response = await fetch(`/api/events/${eventId}/duplicate`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/event/${data.data.id}/edit`);
      } else {
        alert(data.error || 'Failed to duplicate event');
        setIsDuplicating(false);
      }
    } catch (error) {
      console.error('Error duplicating event:', error);
      alert('Failed to duplicate event. Please try again.');
      setIsDuplicating(false);
    }
  };

  const isCancelled = eventStatus === 'cancelled';

  return (
    <>
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Manage your event</p>
          <div className="flex gap-3">
            <Link
              href={`/event/${eventId}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Event
            </Link>
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isDuplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
              Duplicate
            </button>
            {isCancelled ? (
              <button
                onClick={handleRestore}
                disabled={isCancelling}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                Restore Event
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 text-sm font-medium rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Cancel Event
              </button>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Event</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">&quot;{eventTitle}&quot;</span>? This action cannot be undone.
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
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
