import { cookies } from 'next/headers';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { EditablePageContent } from '@/components/editor/EditablePageContent';
import { PageContent } from '@/components/editor/PageContent';
import { getQueryClient } from '@/lib/get-query-client';
import { getPageConfig } from '@/services/cms/pages/fetch';

export default async function TenantPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string; slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tenant, slug } = await params;
  const sParams = await searchParams;
  const editmode = sParams.editmode === 'true';

  // Join slug array or default to 'home'
  const pageSlug = slug && slug.length > 0 ? slug.join('/') : 'home';

  const queryClient = getQueryClient();

  const cookieStore = await cookies();
  const token = cookieStore.get('tenant_token')?.value || null;
  const isSuccess = !!token;

  let pageConfig = null;

  if (isSuccess && token) {
    try {
      pageConfig = await getPageConfig(pageSlug, token);
      console.log('pageConfig: ', pageConfig);
    } catch (error) {
      console.error(`Error fetching page config for ${pageSlug}:`, error);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        {isSuccess && pageConfig && editmode ? (
          <EditablePageContent initialConfig={pageConfig} />
        ) : (
          <div className="relative min-h-screen bg-gray-50/30">
            {pageConfig && <PageContent config={pageConfig} />}
            {!isSuccess && (
              <div className="p-8 text-center text-red-500">
                Authentication failed or Domain not verified for tenant:{' '}
                {tenant}.
              </div>
            )}
            {isSuccess && !pageConfig && (
              <div className="p-8 text-center text-red-500">
                Failed to load page content for &quot;{pageSlug}&quot;.
              </div>
            )}
          </div>
        )}
      </div>
    </HydrationBoundary>
  );
}
