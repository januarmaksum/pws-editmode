import React from 'react';

import { BlockRegistry } from '@/components/blocks';
import type { ComponentConfig } from '@/types/schema';

type Props = {
  config: ComponentConfig;
};

export const ComponentRenderer: React.FC<Props> = ({ config }) => {
  const Component = BlockRegistry[config.type as keyof typeof BlockRegistry];

  if (!Component) {
    return (
      <div className="rounded-md border border-dashed border-red-500 p-4 text-red-500">
        Component type &quot;{config.type}&quot; not found in registry.
      </div>
    );
  }

  // Pass children as a prop if they exist
  const children = config.children?.map((child) => (
    <ComponentRenderer key={child.id} config={child} />
  ));

  return <Component {...config.props}>{children}</Component>;
};
