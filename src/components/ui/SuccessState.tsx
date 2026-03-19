'use client';

import { useRouter } from 'next/navigation';
import { SuccessStateProps } from '@/types/components';

export function SuccessState({
  title,
  message,
  redirectDelay = 2000,
  redirectTo,
  colorScheme = 'indigo',
}: SuccessStateProps) {
  const router = useRouter();

  if (redirectTo) {
    setTimeout(() => {
      router.push(redirectTo);
    }, redirectDelay);
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div
          className={`w-16 h-16 ${
            colorScheme === 'indigo' ? 'bg-green-100' : 'bg-teal-100'
          } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <svg
            className={`w-8 h-8 ${
              colorScheme === 'indigo' ? 'text-green-600' : 'text-teal-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}
