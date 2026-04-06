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
  const { slug } = await params;
  const sParams = await searchParams;
  const editmode = sParams.editmode === 'true';

  // Join slug array or default to 'home'
  const pageSlug = slug && slug.length > 0 ? slug.join('/') : 'home';

  const queryClient = getQueryClient();

  let pageConfig = null;

  try {
    pageConfig = await getPageConfig(pageSlug);
    console.log('pageConfig: ', pageConfig);
  } catch (error) {
    console.error(`Error fetching page config for "${pageSlug}":`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        {pageConfig && editmode ? (
          <EditablePageContent initialConfig={pageConfig} />
        ) : (
          <div className="relative min-h-screen bg-gray-50/30">
            {pageConfig && <PageContent config={pageConfig} />}
            {!pageConfig && (
              <div className="p-8 text-center text-red-500">
                Failed to load page content for &quot;{pageSlug}&quot;. Make
                sure the mock server is running with{' '}
                <code className="rounded bg-gray-100 px-1 font-mono">
                  yarn mock
                </code>
                .
              </div>
            )}
          </div>
        )}
      </div>
    </HydrationBoundary>
  );
}
