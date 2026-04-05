'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { CMS_PAGES, getPageConfig } from './fetch';
import { PageConfig } from './types';

/**
 * Custom hooks for the Page Service.
 * These wrap TanStack Query logic and return the state directly.
 */
export const usePageConfig = (slug: string = 'home') => {
  // We use useQueryClient in the hook so it can be used for invalidations, etc.
  const queryClient = useQueryClient();

  const query = useQuery<PageConfig>({
    queryKey: [CMS_PAGES, slug],
    queryFn: () => getPageConfig(slug),
  });

  return {
    ...query,
    queryClient, // Expose for easy access if needed
  };
};
