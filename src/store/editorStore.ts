import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type {
  ComponentConfig,
  PageConfig,
  SlotConfig,
} from '@/services/cms/pages/types';

type EditorStore = {
  isSidebarOpen: boolean;
  activeConfig: PageConfig;
  draftConfig: PageConfig;

  // Actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  reorderSlots: (newSlots: SlotConfig[]) => void;
  reorderComponents: (slotId: string, newComponents: ComponentConfig[]) => void;
  saveConfig: () => void;
  resetDraft: () => void;
  setInitialConfig: (config: PageConfig) => void;
};

export const useEditorStore = create<EditorStore>()(
  persist(
    immer((set) => ({
      isSidebarOpen: false,
      activeConfig: {} as PageConfig,
      draftConfig: {} as PageConfig,

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
      reorderComponents: (slotId, newComponents) =>
        set((state) => {
          const slot = state.draftConfig.slots.find((s) => s.slotId === slotId);
          if (slot) {
            slot.components = newComponents;
          }
        }),
      saveConfig: () =>
        set((state) => {
          state.activeConfig = JSON.parse(JSON.stringify(state.draftConfig));
        }),
      resetDraft: () =>
        set((state) => {
          state.draftConfig = JSON.parse(JSON.stringify(state.activeConfig));
        }),
      setInitialConfig: (config) =>
        set((state) => {
          state.activeConfig = config;
          state.draftConfig = JSON.parse(JSON.stringify(config));
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
