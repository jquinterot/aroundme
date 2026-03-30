'use client';

export function ActivitiesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activities</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Activities feature allows providers to offer recurring classes, tours, and experiences.
        </p>
        <p className="text-sm text-gray-400">
          Coming soon - Create activities at /create-activity
        </p>
      </div>
    </div>
  );
}
