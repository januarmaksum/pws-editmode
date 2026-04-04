'use client';

import { useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { useEditorStore } from '@/store/editorStore';

export const ConfigPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slots = useEditorStore((s) => s.draftConfig.slots);

  const preview = {
    slots: slots.map((s) => ({
      slotId: s.slotId,
      blocks: s.components.length,
    })),
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between p-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase transition-colors hover:text-gray-600"
      >
        <span className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
          JSON Preview
        </span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isOpen && (
        <div className="border-t border-gray-50 bg-gray-50/30 p-3">
          <pre className="custom-scrollbar max-h-48 overflow-auto text-[11px] leading-relaxed font-medium text-gray-500">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
