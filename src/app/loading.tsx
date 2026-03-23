import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );
}
