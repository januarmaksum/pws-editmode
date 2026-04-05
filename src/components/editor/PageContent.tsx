import type { PageConfig } from '@/services/cms/pages';
import { TemplateRegistry } from '@/templates';

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
