import { apiClient } from '@/api/client';

import { PageConfig } from './types';

export const CMS_PAGES = '/cms/pages';

/**
 * Fetch functions for Page Service
 */
export const getPageConfig = async (
  slug: string = 'home',
  token: string = ''
): Promise<PageConfig> => {
  const { data } = await apiClient.get<PageConfig>(`${CMS_PAGES}/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
