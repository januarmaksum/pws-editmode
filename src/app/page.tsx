import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { EditablePageContent } from '@/components/editor/EditablePageContent';
import { PageContent } from '@/components/editor/PageContent';
import { getQueryClient } from '@/lib/get-query-client';
import { getPageConfig } from '@/services/cms/pages/fetch';
import { verifyDomain } from '@/services/verifyDomain';

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const editmode = params.editmode === 'true';

  const queryClient = getQueryClient();

  const { isSuccess, token } = await verifyDomain({
    domain: 'localhost:3000',
  });

  let pageConfig = null;

  if (isSuccess && token) {
    try {
      pageConfig = await getPageConfig('home', token);
    } catch (error) {
      console.error('Error fetching page config:', error);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isSuccess && pageConfig && editmode ? (
        <EditablePageContent initialConfig={pageConfig} />
      ) : (
        <div className="relative min-h-screen bg-gray-50/30">
          {pageConfig && <PageContent config={pageConfig} />}
          {!isSuccess && (
            <div className="p-8 text-center text-red-500">
              Authentication failed or Domain not verified.
            </div>
          )}
          {isSuccess && !pageConfig && (
            <div className="p-8 text-center text-red-500">
              Failed to load page content.
            </div>
          )}
        </div>
      )}
    </HydrationBoundary>
  );
}
