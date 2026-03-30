'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  status: string;
  city?: { name: string };
  user?: { name: string; email: string };
  _count?: { saves: number; rsvps: number };
}

export function EventsTab() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);

  const { data: eventsData, isLoading: loading } = useQuery({
    queryKey: ['admin-events', statusFilter, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/events?status=${statusFilter}&page=${page}`);
      return res.json();
    },
  });

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  const handleAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statuses = ['pending', 'approved', 'rejected', 'cancelled', 'all'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Events</h2>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No events found</div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stats</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.map((event: Event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.city?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">{event.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{event.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'approved' ? 'bg-green-100 text-green-700' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        event.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">Saves: {event._count?.saves || 0}</p>
                      <p className="text-sm text-gray-500">RSVPs: {event._count?.rsvps || 0}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/event/${event.id}`} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {event.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(event.id, 'approve')} className="p-2 text-green-600 hover:text-green-700" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => { const reason = prompt('Rejection reason (optional):'); handleAction(event.id, 'reject', { reason }); }} className="p-2 text-red-600 hover:text-red-700" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Previous</button>
              <span className="px-4 py-2">Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
