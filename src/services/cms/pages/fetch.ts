import { apiClient } from '@/api/client';
import { PageConfig } from '@/services/cms/pages/types';

export const CMS_PAGES = '/cms/pages';

/**
 * Fetch functions for Page Service
 * Reads mock data from the local json mock server (mock-server.cjs).
 */
export const getPageConfig = async (
  slug: string = 'home'
): Promise<PageConfig> => {
  const { data } = await apiClient.get<PageConfig>(`${CMS_PAGES}/${slug}`);
  return data;
};
