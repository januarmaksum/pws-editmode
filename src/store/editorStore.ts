import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { mockPageConfig } from '@/lib/mock/pageConfig';
import type { PageConfig, SlotConfig } from '@/types/schema';

type EditorStore = {
  isSidebarOpen: boolean;
  activeConfig: PageConfig;
  draftConfig: PageConfig;

  // Actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  reorderSlots: (newSlots: SlotConfig[]) => void;
  saveConfig: () => void;
  resetDraft: () => void;
};

export const useEditorStore = create<EditorStore>()(
  persist(
    immer((set) => ({
      isSidebarOpen: false,
      activeConfig: mockPageConfig,
      draftConfig: JSON.parse(JSON.stringify(mockPageConfig)),

      toggleSidebar: () =>
        set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen;
        }),
      openSidebar: () =>
        set((state) => {
          state.isSidebarOpen = true;
        }),
      closeSidebar: () =>
        set((state) => {
          state.isSidebarOpen = false;
        }),
      reorderSlots: (newSlots) =>
        set((state) => {
          state.draftConfig.slots = newSlots;
        }),
      saveConfig: () =>
        set((state) => {
          state.activeConfig = JSON.parse(JSON.stringify(state.draftConfig));
        }),
      resetDraft: () =>
        set((state) => {
          state.draftConfig = JSON.parse(JSON.stringify(state.activeConfig));
        }),
    })),
    {
      name: 'pws-editor-config',
      partialize: (state) => ({ activeConfig: state.activeConfig }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.draftConfig = JSON.parse(JSON.stringify(state.activeConfig));
        }
      },
    }
  )
);
