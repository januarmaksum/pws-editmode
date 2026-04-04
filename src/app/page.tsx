'use client';

import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useEditorStore } from '@/store/editorStore';
import { TemplateRegistry } from '@/templates';

export default function DemoPage() {
  const activeConfig = useEditorStore((s) => s.activeConfig);

  const Template =
    TemplateRegistry[activeConfig.templateId as keyof typeof TemplateRegistry];

  if (!Template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">
          Template not found: {activeConfig.templateId}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50/30">
      <Template slots={activeConfig.slots} />

      {/* Editor Components */}
      <EditorSidebar />
      <EditorToolbar />
    </div>
  );
}
