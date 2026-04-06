'use client';

import { useRef } from 'react';

import type { PageConfig } from '@/services/cms/pages/types';
import { useEditorStore } from '@/store/editorStore';

import { EditorSidebar } from './EditorSidebar';
import { EditorToolbar } from './EditorToolbar';
import { PageContent } from './PageContent';

export const EditablePageContent = ({
  initialConfig,
}: {
  initialConfig: PageConfig;
}) => {
  const initialized = useRef(false);

  if (!initialized.current) {
    useEditorStore.getState().setInitialConfig(initialConfig);
    initialized.current = true;
  }

  const activeConfig = useEditorStore((s) => s.activeConfig);

  return (
    <>
      <PageContent config={activeConfig} />
      <EditorSidebar />
      <EditorToolbar />
    </>
  );
};
