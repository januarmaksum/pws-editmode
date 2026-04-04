'use client';

import { useEffect } from 'react';

import { useEditorStore } from '@/store/editorStore';
import type { PageConfig } from '@/types/schema';

import { EditorSidebar } from './EditorSidebar';
import { EditorToolbar } from './EditorToolbar';
import { PageContent } from './PageContent';

export const EditablePageContent = ({
  initialConfig,
}: {
  initialConfig: PageConfig;
}) => {
  const setInitialConfig = useEditorStore((s) => s.setInitialConfig);
  const activeConfig = useEditorStore((s) => s.activeConfig);

  useEffect(() => {
    // Initialize the store once if there's no active config or to sync with server
    // In this simulation, we always sync the provided server config
    setInitialConfig(initialConfig);
  }, [initialConfig, setInitialConfig]);

  return (
    <>
      <PageContent config={activeConfig} />
      <EditorSidebar />
      <EditorToolbar />
    </>
  );
};
