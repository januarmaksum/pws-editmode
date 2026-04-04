import { EditablePageContent } from '@/components/editor/EditablePageContent';
import { PageContent } from '@/components/editor/PageContent';
import { checkAuth, fetchPageConfig } from '@/lib/mock/api';
import type { PageConfig } from '@/types/schema';

// This is a Server Component in Next.js 15
export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const editmode = params.editmode === 'true';

  // Fetch data on the server
  const [isAuth, serverConfig] = await Promise.all([
    checkAuth(),
    fetchPageConfig() as Promise<PageConfig>,
  ]);

  // Logic: Show editor if authenticated and editmode is true
  if (isAuth && editmode) {
    return <EditablePageContent initialConfig={serverConfig} />;
  }

  // Public View: Just the page content, No Editor Components
  return (
    <div className="relative min-h-screen bg-gray-50/30">
      <PageContent config={serverConfig} />
    </div>
  );
}
