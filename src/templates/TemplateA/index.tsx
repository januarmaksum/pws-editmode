import React from 'react';

import { ComponentRenderer } from '@/lib/renderer';
import type { SlotConfig } from '@/services/cms/pages';

type Props = {
  slots: SlotConfig[];
};

export const TemplateA: React.FC<Props> = ({ slots }) => {
  const renderSlotWrapper = (slot: SlotConfig) => {
    const hasComponents = slot.components && slot.components.length > 0;
    const content = hasComponents ? (
      slot.components.map((comp) => (
        <ComponentRenderer key={comp.id} config={comp} />
      ))
    ) : (
      <div className="p-4 text-center text-sm text-zinc-400 italic">
        Empty {slot.slotId} slot
      </div>
    );

    switch (slot.slotId) {
      case 'header':
        return (
          <header
            key={slot.slotId}
            className="sticky top-0 z-10 w-full shrink-0 border-b bg-white px-6 py-4"
          >
            {content}
          </header>
        );
      case 'sidebar':
        return (
          <aside
            key={slot.slotId}
            className="mx-auto h-fit w-full max-w-7xl shrink-0 rounded-xl border bg-white p-4"
          >
            <div className="mb-4 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
              Sidebar
            </div>
            {content}
          </aside>
        );
      case 'content':
        return (
          <section
            key={slot.slotId}
            className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6"
          >
            {content}
          </section>
        );
      case 'footer':
        return (
          <footer
            key={slot.slotId}
            className="mt-auto w-full shrink-0 bg-zinc-900 px-6 py-12 text-zinc-400"
          >
            <div className="mx-auto max-w-7xl">{content}</div>
          </footer>
        );
      default:
        return (
          <div
            key={slot.slotId}
            className="mx-auto w-full max-w-7xl border border-dashed border-zinc-300 p-4"
          >
            {content}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-zinc-50">
      {/* Semua slot dirender secara dinamis mengikuti urutannya di JSON state */}
      {slots.map((slot) => renderSlotWrapper(slot))}
    </div>
  );
};
