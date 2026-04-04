'use client';

import { useEditorStore } from '@/store/editorStore';
import { TemplateRegistry } from '@/templates';

export const PageContent = () => {
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

  return <Template slots={activeConfig.slots} />;
};
