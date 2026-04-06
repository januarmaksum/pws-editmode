'use client';

import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/get-query-client';

/**
 * Provider to wrap the entire application with TanStack Query.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Devtools (uncomment to enable) */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
