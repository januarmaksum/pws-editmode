import { useId, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical, Plus } from 'lucide-react';

import { ComponentItem } from '@/components/editor/ComponentItem';
import type { SlotConfig } from '@/services/cms/pages';
import { useEditorStore } from '@/store/editorStore';

type Props = {
  slot: SlotConfig;
};

export const SlotItem = ({ slot }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nestedDndId = useId();
  const reorderComponents = useEditorStore((s) => s.reorderComponents);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSlotDragging,
  } = useSortable({ id: slot.slotId });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slot.components.findIndex((c) => c.id === active.id);
      const newIndex = slot.components.findIndex((c) => c.id === over.id);
      reorderComponents(
        slot.slotId,
        arrayMove(slot.components, oldIndex, newIndex)
      );
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isSlotDragging ? 20 : 0,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-2">
      <div
        className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
          isSlotDragging
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

        <div
          className="flex flex-1 cursor-pointer items-center justify-between overflow-hidden"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1 overflow-hidden">
            <div className="mb-0.5 flex items-center justify-between">
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
            {!isExpanded && (
              <p className="truncate text-[11px] font-medium text-gray-400">
                {slot.components.map((c) => c.type).join(' • ') || 'Empty Zone'}
              </p>
            )}
          </div>
          <div className="ml-2 text-gray-400">
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-8 space-y-2 border-l-2 border-dashed border-gray-100 py-1 pl-4">
          <DndContext
            id={nestedDndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleChildDragEnd}
          >
            <SortableContext
              items={slot.components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {slot.components.map((component) => (
                  <ComponentItem key={component.id} component={component} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Component Placeholder */}
          <button
            onClick={() => alert('TODO: Show Component Dialog')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-100 p-3 text-gray-400 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-500"
          >
            <Plus size={14} />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Add Component
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
