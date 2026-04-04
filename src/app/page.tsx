'use client';

import dynamic from 'next/dynamic';

import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';

const PageContent = dynamic(
  () =>
    import('@/components/editor/PageContent').then((mod) => mod.PageContent),
  { ssr: false }
);

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-gray-50/30">
      <PageContent />

      {/* Editor Components */}
      <EditorSidebar />
      <EditorToolbar />
    </div>
  );
}
