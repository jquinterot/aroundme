'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Inter, sans-serif',
  components: {
    DateTimePicker: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            suspense: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
