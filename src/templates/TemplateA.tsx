import React from 'react';

import { ComponentRenderer } from '@/lib/renderer';
import type { SlotConfig } from '@/types/schema';

type Props = {
  slots: SlotConfig[];
};

export const TemplateA: React.FC<Props> = ({ slots }) => {
  const getSlot = (id: string) => slots.find((s) => s.slotId === id);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Header Slot */}
      <header className="sticky top-0 z-10 border-b bg-white px-6 py-4">
        {getSlot('header')?.components.map((comp) => (
          <ComponentRenderer key={comp.id} config={comp} />
        )) || <div className="text-sm text-zinc-400">Header Slot</div>}
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-6 md:grid-cols-4">
        {/* Sidebar Slot */}
        <aside className="h-fit rounded-xl border bg-white p-4 md:col-span-1">
          <div className="mb-4 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            Sidebar
          </div>
          {getSlot('sidebar')?.components.map((comp) => (
            <ComponentRenderer key={comp.id} config={comp} />
          )) || (
            <div className="text-sm text-zinc-300 italic">No components</div>
          )}
        </aside>

        {/* Content Slot */}
        <section className="space-y-6 md:col-span-3">
          {getSlot('content')?.components.map((comp) => (
            <ComponentRenderer key={comp.id} config={comp} />
          )) || (
            <div className="rounded-xl border bg-white p-12 text-center text-zinc-400">
              Content Slot — Drag components here
            </div>
          )}
        </section>
      </main>

      {/* Footer Slot */}
      <footer className="bg-zinc-900 px-6 py-12 text-zinc-400">
        <div className="mx-auto max-w-7xl">
          {getSlot('footer')?.components.map((comp) => (
            <ComponentRenderer key={comp.id} config={comp} />
          )) || <div>Footer Slot</div>}
        </div>
      </footer>
    </div>
  );
};
