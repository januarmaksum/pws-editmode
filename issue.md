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

## Catatan Penting untuk AI Agent / Junior Developer

- `@dnd-kit` sudah terinstall. Gunakan `@dnd-kit/core`, `@dnd-kit/sortable`, dan `@dnd-kit/utilities`.
- Shadcn/UI components ada di `src/components/ui/` — jangan install ulang yang sudah ada.
- Import alias `@/` sudah dikonfigurasi untuk `src/`. **Selalu gunakan alias ini**, jangan relative import.
- Husky + lint-staged aktif: setiap commit harus lolos **Prettier** + **ESLint** (`--max-warnings=0`).
- Jangan gunakan `useState` untuk state editor level atas — **semuanya harus melalui Zustand**.
- Pastikan setiap komponen baru menggunakan `'use client'` directive jika menggunakan hooks atau event handler.
- Sidebar harus menggunakan `position: fixed` agar berada di atas seluruh konten halaman.
- Gunakan `arrayMove` dari `@dnd-kit/sortable` untuk menghitung urutan baru setelah drag.
- Import `persist` dari `zustand/middleware` — bukan `zustand/middleware/persist`.
- Urutan compose middleware: `persist(immer(...))` — bukan `immer(persist(...))`.
- **Apabila setiap kali generate/edit code apapun, pastikan selalu run `yarn format` setelahnya.**
