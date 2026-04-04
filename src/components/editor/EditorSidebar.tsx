'use client';

import dynamic from 'next/dynamic';

import { X } from 'lucide-react';

import { useEditorStore } from '@/store/editorStore';

const SlotList = dynamic(
  () => import('@/components/editor/SlotList').then((mod) => mod.SlotList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[74px] w-full animate-pulse rounded-xl border border-gray-100 bg-gray-50/50"
          />
        ))}
      </div>
    ),
  }
);

export const EditorSidebar = () => {
  const isSidebarOpen = useEditorStore((s) => s.isSidebarOpen);
  const closeSidebar = useEditorStore((s) => s.closeSidebar);

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-45 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-85 border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-800">Edit Mode</h2>
          <button
            onClick={closeSidebar}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="custom-scrollbar h-[calc(100%-64px)] overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="mb-4 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Layout Structure
            </h3>
            <SlotList />
          </div>

          <div className="mt-8 border-t border-gray-50 pt-6">
            <p className="text-center text-xs text-gray-400 italic">
              Drag and drop slots to reorder the page layout.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
