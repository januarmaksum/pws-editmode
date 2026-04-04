import type { ComponentType } from 'react';

import dynamic from 'next/dynamic';

const TestBlock = () => (
  <div className="rounded-lg border bg-zinc-100 p-4">Test Block Content</div>
);

// Registry of block components
// Using next/dynamic for code-splitting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BlockRegistry: Record<string, ComponentType<any>> = {
  // Placeholder for CardInfo and SlideBanner
  CardInfo: dynamic(() => import('./CardInfo')),
  SlideBanner: dynamic(() => import('./SlideBanner')),
  // Simple test component
  TestBlock: dynamic(() => Promise.resolve(TestBlock)),
};
