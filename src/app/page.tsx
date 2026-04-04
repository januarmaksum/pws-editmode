import React from 'react';

import { TemplateRegistry } from '@/templates';
import type { PageConfig } from '@/types/schema';

// Mock Config from Database
const mockPageConfig: PageConfig = {
  templateId: 'TemplateA',
  slots: [
    {
      slotId: 'header',
      components: [
        {
          id: 'logo-1',
          type: 'TestBlock',
          props: {},
        },
      ],
    },
    {
      slotId: 'content',
      components: [
        {
          id: 'banner-1',
          type: 'SlideBanner',
          props: {
            title: 'Welcome to Elementor-Lite',
            description:
              'This UI is entirely driven by a JSON configuration. No hardcoded layouts, just blocks and slots.',
            ctaText: 'Explore Features',
          },
        },
        {
          id: 'stats-row',
          type: 'TestBlock',
          props: {},
        },
      ],
    },
    {
      slotId: 'sidebar',
      components: [
        {
          id: 'card-1',
          type: 'CardInfo',
          props: {
            title: 'Active Users',
            value: '1,234',
            icon: '👥',
          },
        },
        {
          id: 'card-2',
          type: 'CardInfo',
          props: {
            title: 'Total Revenue',
            value: '$45,678',
            icon: '💰',
          },
        },
      ],
    },
    {
      slotId: 'footer',
      components: [
        {
          id: 'footer-text',
          type: 'TestBlock',
          props: {},
        },
      ],
    },
  ],
};

export default function DemoPage() {
  const Template =
    TemplateRegistry[
      mockPageConfig.templateId as keyof typeof TemplateRegistry
    ];

  if (!Template) {
    return <div>Template not found</div>;
  }

  return <Template slots={mockPageConfig.slots} />;
}
