'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MousePointer2 } from 'lucide-react';

import type { ComponentConfig } from '@/types/schema';

type Props = {
  component: ComponentConfig;
};

export const ComponentItem = ({ component }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 0,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg border p-2 transition-all duration-200 ${
        isDragging
          ? 'z-30 border-blue-200 bg-blue-50/50 shadow-lg ring-1 ring-blue-100'
          : 'border-gray-50 bg-white hover:border-gray-200 hover:shadow-sm'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-7 w-6 cursor-grab items-center justify-center rounded border border-transparent text-gray-300 transition-colors hover:border-gray-100 hover:bg-gray-50 hover:text-gray-400 active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>

      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-50 text-gray-400">
          <MousePointer2 size={12} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-[11px] font-semibold text-gray-700">
            {component.type}
          </p>
          <p className="truncate text-[9px] font-medium text-gray-400">
            ID: {component.id.slice(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
};
