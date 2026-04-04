import { TemplateRegistry } from '@/templates';
import type { PageConfig } from '@/types/schema';

export const PageContent = ({ config }: { config: PageConfig }) => {
  const Template =
    TemplateRegistry[config.templateId as keyof typeof TemplateRegistry];

  if (!Template) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-gray-500">Template not found: {config.templateId}</p>
      </div>
    );
  }

  return <Template slots={config.slots} />;
};
