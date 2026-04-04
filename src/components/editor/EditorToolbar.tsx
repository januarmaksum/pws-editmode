'use client';

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';

export const EditorToolbar = () => {
  const isSidebarOpen = useEditorStore((s) => s.isSidebarOpen);
  const openSidebar = useEditorStore((s) => s.openSidebar);
  const saveConfig = useEditorStore((s) => s.saveConfig);
  const closeSidebar = useEditorStore((s) => s.closeSidebar);

  const handleSave = () => {
    saveConfig();
    closeSidebar();
  };

  return (
    <div className="fixed right-6 bottom-6 z-60 flex items-center gap-2">
      {!isSidebarOpen ? (
        <Button onClick={openSidebar} className="shadow-lg">
          ✏️ Edit Mode
        </Button>
      ) : (
        <Button
          onClick={handleSave}
          variant="default"
          className="bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        >
          Save Changes
        </Button>
      )}
    </div>
  );
};
