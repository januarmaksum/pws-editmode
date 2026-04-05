import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { EditablePageContent } from '@/components/editor/EditablePageContent';
import { PageContent } from '@/components/editor/PageContent';
import { getQueryClient } from '@/lib/get-query-client';
import { getPageConfig } from '@/services/cms/pages/fetch';
import { verifyDomain } from '@/services/verifyDomain';

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

  // In a real app, 'tenant' would be used to verify the domain or fetch tenant-specific data
  const { isSuccess, token } = await verifyDomain({
    domain: 'localhost:3000', // In production, this should be dynamic or derived from the request
  });

  let pageConfig = null;

  if (isSuccess && token) {
    try {
      pageConfig = await getPageConfig(pageSlug, token);
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
