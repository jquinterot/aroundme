'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Report {
  id: string;
  type: string;
  itemId: string;
  reason: string;
  description?: string;
  status: string;
  itemTitle?: string;
  createdAt: string;
}

export function ReportsTab() {
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading: loading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const res = await fetch('/api/admin/reports');
      return res.json();
    },
  });

  const reports = reportsData?.data || [];

  const handleAction = async (id: string, action: string) => {
    const adminNote = action !== 'dismiss' ? prompt('Add a note (optional):') : null;
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reports</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reports found</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: Report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    report.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status}
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{report.type}</span>
                  <h3 className="mt-2 font-medium text-gray-900 dark:text-white">{report.reason}</h3>
                  {report.itemTitle && <p className="text-sm text-gray-500">Item: {report.itemTitle}</p>}
                  {report.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{report.description}</p>}
                  <p className="mt-2 text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(report.id, 'resolve')} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Resolve</button>
                    <button onClick={() => handleAction(report.id, 'dismiss')} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
