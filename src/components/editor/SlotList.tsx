import { useId } from 'react';

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

import { SlotItem } from '@/components/editor/SlotItem';
import { useEditorStore } from '@/store/editorStore';

export const SlotList = () => {
  const dndId = useId();
  const slots = useEditorStore((s) => s.draftConfig.slots);
  const reorderSlots = useEditorStore((s) => s.reorderSlots);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slots.findIndex((s) => s.slotId === active.id);
      const newIndex = slots.findIndex((s) => s.slotId === over.id);
      reorderSlots(arrayMove(slots, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={slots.map((s) => s.slotId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {slots.map((slot) => (
            <SlotItem key={slot.slotId} slot={slot} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
