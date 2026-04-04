# Project Context: PWS Edit Mode — Elementor-lite (JSON-driven UI Builder)

## Visi Proyek

Membangun sistem **"Elementor-lite"** di Next.js yang memungkinkan kustomisasi UI secara _on-the-fly_ untuk level **tenant member**. Pendekatan yang digunakan adalah **JSON-driven UI**: database hanya menyimpan konfigurasi JSON, dan Next.js merender komponen secara dinamis berdasarkan config tersebut.

---

## Arsitektur Inti

### 1. JSON-driven UI

- Setiap halaman/tampilan tenant disimpan sebagai **JSON config** di database.
- Next.js membaca JSON config dan merender React component tree secara dinamis.
- Perubahan tampilan tidak memerlukan deploy ulang — cukup update JSON di DB.

### 2. Template System

- Terdapat beberapa **template predefined** (Template A, B, C, dst.) yang menjadi kerangka layout halaman.
- Setiap template mendefinisikan **slot/zone** yang bisa diisi komponen (mirip widget area di Elementor).
- Template bersifat opinionated tapi tetap fleksibel terhadap injeksi komponen baru.

### 3. Komponen Reusable (Blocks/Widgets)

Komponen berdiri sendiri yang bisa diinjeksi ke dalam slot template:

| Komponen      | Deskripsi                                     |
| ------------- | --------------------------------------------- |
| `CardInfo`    | Kartu informasi (teks, ikon, nilai statistik) |
| `SlideBanner` | Banner slider/carousel gambar atau konten     |
| `(dst.)`      | Komponen tambahan sesuai kebutuhan tenant     |

### 4. Drag & Drop (DnD)

- Menggunakan **`@dnd-kit`** (sudah terinstall) untuk drag-and-drop urutan slot di dalam sidebar editor.
- User tenant bisa menyusun ulang urutan slot (dan komponen di dalamnya) secara visual.
- Urutan hasil drag disimpan ke state Zustand, lalu diapply ke config saat tombol **Save** ditekan.

---

## Alur Data

```
Tenant konfigurasi layout via Edit Mode Sidebar
         ↓
Drag & drop mengubah urutan slot di Zustand state (draft config)
         ↓
Tombol "Save" ditekan → draft config di-commit ke PageConfig utama
         ↓
ComponentRenderer membaca config terbaru → render React tree
         ↓
User tenant melihat halaman yang sudah dikustomisasi
```

---

## Struktur Direktori yang Diantisipasi

```
src/
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing / dev sandbox
│   └── [tenant]/               # Route per tenant (future)
│
├── components/
│   ├── ui/                      # Shadcn/UI primitives (accordion, button, dll.)
│   ├── blocks/                  # Komponen yang bisa di-inject ke template
│   │   ├── CardInfo/
│   │   ├── SlideBanner/
│   │   └── index.ts             # Registry semua blocks
│   └── editor/                  # UI untuk edit mode
│       ├── EditorSidebar.tsx    # Sidebar overlay utama (buka/tutup)
│       ├── SlotList.tsx         # List slot yang dapat di-reorder via DnD
│       ├── SlotItem.tsx         # Item slot tunggal (placeholder draggable)
│       └── EditorToolbar.tsx    # Tombol toggle sidebar + tombol Save
│
├── templates/                   # Template predefined A, B, C, dst.
│   ├── TemplateA/
│   ├── TemplateB/
│   └── index.ts                 # Registry semua template
│
├── lib/
│   ├── utils.ts
│   ├── renderer.tsx             # Core: ComponentRenderer (JSON → React)
│   └── schema/                  # Zod schema untuk validasi JSON config
│
├── store/
│   └── editorStore.ts           # Zustand store untuk editor state
│
└── types/
    └── schema.ts                # TypeScript types untuk JSON config
```

---

## JSON Config Schema (Contoh)

```ts
// types/schema.ts
type ComponentConfig = {
  id: string; // nanoid — unique per instance
  type: string; // nama komponen, e.g. "CardInfo", "SlideBanner"
  props: Record<string, unknown>; // props yang diteruskan ke komponen
  children?: ComponentConfig[]; // nested components (opsional)
};

type SlotConfig = {
  slotId: string;
  components: ComponentConfig[];
};

type PageConfig = {
  templateId: string; // e.g. "TemplateA"
  slots: SlotConfig[];
  meta?: {
    title?: string;
    theme?: string;
  };
};
```

---

## Tech Stack

| Library           | Versi    | Peran                                      |
| ----------------- | -------- | ------------------------------------------ |
| Next.js           | 16.2.2   | Framework utama (App Router)               |
| React             | 19.2.4   | UI rendering                               |
| TypeScript        | ^5       | Type safety                                |
| Zustand           | ^5       | State management editor (drag state, dll.) |
| @dnd-kit          | ^6 / ^10 | Drag & Drop urutan slot di sidebar         |
| Zod               | ^4       | Validasi JSON config schema                |
| Shadcn/UI + Radix | latest   | UI primitives (button, dialog, dll.)       |
| immer             | ^11      | Immutable state updates untuk JSON config  |
| nanoid            | ^5       | Generate unique ID per komponen instance   |
| Tailwind CSS      | ^4       | Styling utility                            |
| dayjs             | ^1       | Formatting tanggal (untuk komponen konten) |
| React Hook Form   | ^7       | Form di panel properti editor              |

---

## Aturan Pengembangan

1. **Setiap block/komponen HARUS memiliki Zod schema** untuk validasinya — gunakan schema di `lib/schema/`.
2. **Semua komponen block WAJIB didaftarkan** di `components/blocks/index.ts` (component registry).
3. **State editor** dikelola dengan Zustand — jangan pakai `useState` untuk state canvas/config level atas.
4. **Gunakan `immer`** saat melakukan mutasi JSON config (nested object update).
5. **ID setiap instance komponen** wajib di-generate dengan `nanoid` saat komponen di-drop ke canvas.
6. **Tidak ada hardcoded config** di dalam template — semua konten harus berasal dari JSON config.
7. **Template hanya mendefinisikan struktur slot**, bukan konten.

---

## Milestone Awal (Sudah Selesai)

- [x] **Phase 1 — Foundation**
  - [x] Definisi TypeScript types + Zod schema untuk `PageConfig`
  - [x] Implementasi `ComponentRenderer` (core renderer JSON → React)
  - [x] Setup component registry (`blocks/index.ts`)

- [x] **Phase 2 — Blocks**
  - [x] Buat block `CardInfo`
  - [x] Buat block `SlideBanner`

- [x] **Phase 3 — Templates**
  - [x] Buat `TemplateA` (layout 1 kolom dengan beberapa slot)

---

## Feature: Edit Mode Sidebar dengan DnD Slot Reordering

> **Tujuan feature ini:** Memberikan antarmuka visual kepada tenant untuk melihat daftar slot yang ada di config, menyusun ulang urutannya via drag-and-drop, lalu menyimpan perubahannya dengan tombol Save.

### Ringkasan Fitur

| Aspek           | Detail                                                                             |
| --------------- | ---------------------------------------------------------------------------------- |
| **Sidebar**     | Overlay dari sisi kanan/kiri layar, bisa dibuka dan ditutup                        |
| **Konten**      | Menampilkan seluruh slot dari `mockPageConfig` sebagai list                        |
| **Setiap Slot** | Ditampilkan sebagai **placeholder card** yang menunjukkan `slotId` + preview isi   |
| **Interaksi**   | Setiap slot bisa di-drag untuk mengubah urutannya di dalam list                    |
| **Simpan**      | Tombol "Save" mengapply urutan baru ke `PageConfig` dan memperbarui tampilan utama |

---

## Tahapan Implementasi

### Phase 4 — Zustand Editor Store

**File baru:** `src/store/editorStore.ts`

**Tujuan:** Menyimpan state global editor, termasuk:

- Apakah sidebar terbuka atau tidak (`isSidebarOpen`)
- **Draft config** — salinan `PageConfig` yang sedang diedit (belum disimpan)
- **Active config** — `PageConfig` yang sudah disimpan dan sedang dirender

**Isi store yang harus dibuat:**

```ts
// src/store/editorStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { PageConfig, SlotConfig } from '@/types/schema';

type EditorStore = {
  isSidebarOpen: boolean;
  activeConfig: PageConfig; // config yang sedang dirender di halaman
  draftConfig: PageConfig; // config sedang diedit di sidebar (belum disimpan)

  // Actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  reorderSlots: (newSlots: SlotConfig[]) => void; // update urutan slot di draft
  saveConfig: () => void; // commit draft → active
  resetDraft: () => void; // buang perubahan draft, sync dari active
};
```

**Aturan:**

- Gunakan middleware `immer` dari Zustand untuk mutasi nested state.
- `draftConfig` harus di-initialize dari `activeConfig` (deep clone) saat store dibuat.
- `saveConfig` cukup melakukan `activeConfig = draftConfig`.
- `resetDraft` melakukan `draftConfig = activeConfig` (sync ulang dari active).

---

### Phase 5 — Komponen Editor Sidebar

#### 5.1 `EditorSidebar.tsx`

**File baru:** `src/components/editor/EditorSidebar.tsx`

**Tujuan:** Sidebar overlay yang bisa dibuka/ditutup. Berisi daftar slot (`SlotList`).

**Spesifikasi:**

- Sidebar muncul dari sisi kanan layar dengan animasi slide-in (gunakan Tailwind `translate-x` + `transition`).
- Saat tertutup, sidebar tersembunyi di luar viewport (misalnya `translate-x-full`).
- Ada tombol **"×"** (close) di pojok kiri atas sidebar.
- Background sidebar menggunakan warna solid/glass, berada di atas konten halaman (`position: fixed`, `z-index` tinggi).
- Lebar sidebar: `w-80` atau `w-96`.
- Baca state `isSidebarOpen` dari Zustand store untuk mengontrol visibilitas.

**Struktur JSX (gambaran):**

```jsx
<aside
  className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
>
  <div className="flex items-center justify-between border-b p-4">
    <h2>Edit Mode</h2>
    <button onClick={closeSidebar}>×</button>
  </div>
  <div className="h-[calc(100%-64px)] overflow-y-auto p-4">
    <SlotList />
  </div>
</aside>
```

---

#### 5.2 `SlotList.tsx`

**File baru:** `src/components/editor/SlotList.tsx`

**Tujuan:** Menampilkan daftar semua slot dari `draftConfig` dan mengaktifkan DnD reordering.

**Spesifikasi:**

- Ambil `draftConfig.slots` dari Zustand store.
- Render setiap slot sebagai `SlotItem` komponen.
- Gunakan `@dnd-kit/sortable` untuk mengaktifkan drag-and-drop reordering.
- Setup DnD harus menggunakan: `DndContext`, `SortableContext`, `useSensor`, `PointerSensor`.
- Setelah drop selesai (`onDragEnd`), panggil `reorderSlots(newOrder)` ke Zustand.

**Struktur DnD (gambaran):**

```tsx
import {
  DndContext,
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

// Di dalam komponen:
const sensors = useSensors(useSensor(PointerSensor));

function handleDragEnd(event) {
  const { active, over } = event;
  if (active.id !== over.id) {
    const oldIndex = slots.findIndex((s) => s.slotId === active.id);
    const newIndex = slots.findIndex((s) => s.slotId === over.id);
    reorderSlots(arrayMove(slots, oldIndex, newIndex));
  }
}

return (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >
    <SortableContext
      items={slots.map((s) => s.slotId)}
      strategy={verticalListSortingStrategy}
    >
      {slots.map((slot) => (
        <SlotItem key={slot.slotId} slot={slot} />
      ))}
    </SortableContext>
  </DndContext>
);
```

---

#### 5.3 `SlotItem.tsx`

**File baru:** `src/components/editor/SlotItem.tsx`

**Tujuan:** Merender satu slot sebagai placeholder card yang bisa di-drag.

**Spesifikasi:**

- Gunakan hook `useSortable` dari `@dnd-kit/sortable` dengan `id = slot.slotId`.
- Tampilkan informasi slot:
  - **Nama slot** (`slotId`) sebagai judul card (misalnya: "header", "content", "sidebar", "footer").
  - **Jumlah komponen** di dalam slot (misalnya: "3 komponen").
  - **Preview opsional**: daftar `type` komponen di dalam slot (misalnya: "CardInfo, SlideBanner").
- Tampilkan **drag handle icon** (dari Lucide React: `GripVertical`) di sisi kiri card.
- Saat sedang di-drag, card menampilkan state visual yang berbeda (opacity lebih rendah atau shadow berbeda).

**Struktur JSX (gambaran):**

```tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({ id: slot.slotId });

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
};

return (
  <div
    ref={setNodeRef}
    style={style}
    className="mb-2 flex items-center gap-3 rounded-md border bg-gray-50 p-3"
  >
    <button {...attributes} {...listeners} className="cursor-grab">
      <GripVertical size={16} className="text-gray-400" />
    </button>
    <div className="flex-1">
      <p className="font-medium capitalize">{slot.slotId}</p>
      <p className="text-xs text-gray-500">{slot.components.length} komponen</p>
    </div>
  </div>
);
```

---

#### 5.4 `EditorToolbar.tsx`

**File baru:** `src/components/editor/EditorToolbar.tsx`

**Tujuan:** Toolbar floating/fixed yang berisi tombol untuk membuka sidebar dan menyimpan config.

**Spesifikasi:**

- Posisi: `fixed bottom-6 right-6` atau di bagian atas sebagai bar.
- Berisi dua tombol:
  1. **"Edit"** / **"✏️ Edit Mode"** — memanggil `openSidebar()` dari Zustand.
  2. **"Save"** — memanggil `saveConfig()` dari Zustand lalu menutup sidebar (`closeSidebar()`).
- Tombol Save sebaiknya hanya aktif (tidak disabled) ketika sidebar sedang terbuka dan ada perubahan draft.
- Gunakan Shadcn/UI `Button` component.

---

### Phase 6 — Integrasi ke Page

**File yang dimodifikasi:** `src/app/page.tsx`

**Tujuan:** Menggabungkan semua komponen editor ke dalam halaman utama.

**Langkah-langkah:**

1. Inisialisasi Zustand store dengan `mockPageConfig` sebagai `activeConfig` awal.
2. Baca `activeConfig` dari Zustand store (bukan langsung dari `mockPageConfig` const).
3. Render `<EditorSidebar />` dan `<EditorToolbar />` di luar template, tapi masih di dalam root layout.
4. Template dan ComponentRenderer merender berdasarkan `activeConfig` yang aktif.

**Struktur halaman (gambaran):**

```tsx
'use client'; // Diperlukan karena mengakses Zustand store
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useEditorStore } from '@/store/editorStore';
import { TemplateRegistry } from '@/templates';

export default function DemoPage() {
  const activeConfig = useEditorStore((s) => s.activeConfig);
  const Template =
    TemplateRegistry[activeConfig.templateId as keyof typeof TemplateRegistry];

  if (!Template) return <div>Template not found</div>;

  return (
    <>
      <Template slots={activeConfig.slots} />
      <EditorSidebar />
      <EditorToolbar />
    </>
  );
}
```

> **Catatan:** Karena menggunakan `useEditorStore`, komponen ini menjadi Client Component (`'use client'`). Ini sudah sesuai arsitektur kita.

---

### Phase 7 — Inisialisasi Store di Root

**File yang dimodifikasi:** `src/app/layout.tsx` _(opsional)_ atau langsung di `page.tsx`

**Tujuan:** Memastikan Zustand store langsung diisi dengan `mockPageConfig` saat aplikasi pertama kali dimuat.

**Cara:**

- Zustand store bisa diinisialisasi dengan default state langsung di file `editorStore.ts` (paling simpel).
- Import `mockPageConfig` dari sebuah file konstanta: `src/lib/mock/pageConfig.ts`.
- Jangan letakkan mock data langsung di store — pisahkan ke file tersendiri.

**File baru yang perlu dibuat:** `src/lib/mock/pageConfig.ts`

- Isi: pindahkan `mockPageConfig` yang saat ini ada di `page.tsx` ke file ini.
- Export sebagai named export: `export const mockPageConfig: PageConfig = { ... }`.

---

## Checklist Implementasi

Gunakan checklist ini untuk melacak progress pengerjaan feature:

- [ ] **Phase 4 — Zustand Store**
  - [ ] Buat file `src/lib/mock/pageConfig.ts` — pindahkan mock data dari `page.tsx`
  - [ ] Buat file `src/store/editorStore.ts` dengan semua state dan actions yang disebutkan
  - [ ] Pastikan `draftConfig` di-initialize dengan deep clone dari `mockPageConfig`

- [ ] **Phase 5 — Komponen Editor**
  - [ ] Buat `src/components/editor/EditorSidebar.tsx`
    - [ ] Sidebar bisa dibuka dan ditutup (animasi slide)
    - [ ] Membaca state `isSidebarOpen` dari Zustand
  - [ ] Buat `src/components/editor/SlotList.tsx`
    - [ ] Render semua slot dari `draftConfig`
    - [ ] DnD reordering dengan `@dnd-kit/sortable`
    - [ ] `onDragEnd` memanggil `reorderSlots()`
  - [ ] Buat `src/components/editor/SlotItem.tsx`
    - [ ] Implementasi `useSortable`
    - [ ] Tampilkan nama slot, jumlah komponen, preview tipe komponen
    - [ ] Drag handle dengan `GripVertical` icon
    - [ ] Visual state saat `isDragging`
  - [ ] Buat `src/components/editor/EditorToolbar.tsx`
    - [ ] Tombol "Edit" → `openSidebar()`
    - [ ] Tombol "Save" → `saveConfig()` + `closeSidebar()`

- [ ] **Phase 6 — Integrasi Page**
  - [ ] Update `src/app/page.tsx`
    - [ ] Tambahkan `'use client'` directive
    - [ ] Baca `activeConfig` dari Zustand store
    - [ ] Render `<EditorSidebar />` dan `<EditorToolbar />`

- [ ] **Verifikasi**
  - [ ] Sidebar bisa dibuka dan ditutup tanpa error
  - [ ] Slot tampil sebagai list di sidebar berdasarkan urutan mock data
  - [ ] Slot bisa di-reorder via drag-and-drop
  - [ ] Tombol Save mengapply perubahan urutan ke tampilan halaman
  - [ ] Tidak ada TypeScript error (`tsc --noEmit`)
  - [ ] Kode lolos lint dan format (`eslint --max-warnings=0` + Prettier)

---

## Catatan Penting untuk AI Agent / Junior Developer

- **Baca `node_modules/next/dist/docs/`** sebelum menulis kode Next.js — versi ini memiliki breaking changes.
- `@dnd-kit` sudah terinstall. Gunakan `@dnd-kit/core`, `@dnd-kit/sortable`, dan `@dnd-kit/utilities`.
- Shadcn/UI components ada di `src/components/ui/` — jangan install ulang yang sudah ada.
- Import alias `@/` sudah dikonfigurasi untuk `src/`. **Selalu gunakan alias ini**, jangan relative import.
- Husky + lint-staged aktif: setiap commit harus lolos **Prettier** + **ESLint** (`--max-warnings=0`).
- Jangan gunakan `useState` untuk state editor level atas — **semuanya harus melalui Zustand**.
- Pastikan setiap komponen baru menggunakan `'use client'` directive jika menggunakan hooks atau event handler.
- Sidebar harus menggunakan `position: fixed` agar berada di atas seluruh konten halaman.
- Gunakan `arrayMove` dari `@dnd-kit/sortable` untuk menghitung urutan baru setelah drag.
