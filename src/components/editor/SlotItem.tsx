'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import type { SlotConfig } from '@/types/schema';

type Props = {
  slot: SlotConfig;
};

export const SlotItem = ({ slot }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.slotId });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 0,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
        isDragging
          ? 'z-20 border-blue-200 bg-blue-50/50 shadow-xl ring-1 ring-blue-100'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-10 w-8 cursor-grab items-center justify-center rounded-lg border border-transparent text-gray-300 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-400 active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1 overflow-hidden">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[13px] font-bold tracking-tight text-gray-800 capitalize">
            {slot.slotId}
          </p>
          <div className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {slot.components.length} Blocks
            </span>
          </div>
        </div>
        <p className="truncate text-[11px] font-medium text-gray-400">
          {slot.components.map((c) => c.type).join(' • ') || 'Empty Zone'}
        </p>
      </div>
    </div>
  );
};
