'use client';

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Platform Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App URL</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              placeholder="https://yourapp.com"
              defaultValue={process.env.NEXT_PUBLIC_APP_URL}
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">Set via environment variable NEXT_PUBLIC_APP_URL</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stripe Mode</label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${
                process.env.NODE_ENV === 'production' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {process.env.NODE_ENV === 'production' ? 'Live' : 'Test'}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Push Notifications</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">VAPID Keys Configured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" disabled>Clear All Caches (Coming Soon)</button>
      </div>
    </div>
  );
}
