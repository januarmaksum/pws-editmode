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

| Komponen     | Deskripsi                                     |
| ------------ | --------------------------------------------- |
| `CardInfo`   | Kartu informasi (teks, ikon, nilai statistik) |
| `CTA Banner` | CTA Banner                                    |
| `(dst.)`     | Komponen tambahan sesuai kebutuhan tenant     |

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

## Struktur Direktori (Terbaru)

```
src/
├── app/
│   ├── layout.tsx               # Root layout (Global template/fonts)
│   ├── page.tsx                 # Entry point (Handles SSR & Edit Mode toggle)
│   ├── loading.tsx              # Fallback UI saat transisi route
│   ├── globals.css              # Global styles & Tailwind layers
│   └── [tenant]/                # (TODO) Dynamic Tenant Routing
│       └── [[...slug]]/
│           └── page.tsx         # Catch-all route untuk multi-page per tenant
│
├── components/
│   ├── ui/                      # Shadcn/UI primitives (low-level components)
│   ├── blocks/                  # Komponen bisnis/widget (CardInfo, SlideBanner, dll.)
│   │   └── index.tsx            # Registry untuk mapping JSON type -> React component
│   └── editor/                  # Fitur-fitur khusus Edit Mode
│       ├── EditorSidebar.tsx    # Panel samping untuk kontrol layout
│       ├── SlotList.tsx         # Sortable area untuk slot
│       ├── SlotItem.tsx         # Wrapper draggable untuk tiap slot
│       ├── ComponentItem.tsx    # Wrapper untuk komponen di dalam slot
│       ├── EditorToolbar.tsx    # Bar navigasi atas (Toggle & Save)
│       ├── PageContent.tsx      # Viewer utama yang merender PageConfig
│       ├── EditablePageContent.tsx # Wrapper editor untuk manipulasi slot
│       └── ConfigPreview.tsx    # Live JSON viewer untuk debugging
│
├── templates/                   # Kerangka layout halaman
│   ├── TemplateA/               # Struktur spesifik untuk TemplateA
│   │   ├── index.tsx            # Main layout component
│   │   ├── config.ts            # (Optional) Konfigurasi spesifik template
│   │   └── styles.css           # (Optional) Styling lokal / design system template
│   └── index.ts                 # Registry semua template layout
│
├── lib/
│   ├── renderer.tsx             # Inti engine: mengonversi JSON Config ke React Tree
│   ├── schema/                  # Validasi JSON PageConfig menggunakan Zod
│   ├── mock/                    # Mock API & Data untuk simulasi database
│   └── utils.ts                 # Helper umum (cn, formatting, dll.)
│
├── store/
│   └── editorStore.ts           # Global state menggunakan Zustand + Persist + Immer
│
└── types/
    └── schema.ts                # Kontrak TypeScript (Interfaces) untuk PageConfig
```

## Best Practices & Saran untuk Rendering Dinamis

Untuk mendukung kebutuhan multi-page dan multi-tenant (contoh: Tenant A menggunakan Template B dengan halaman `home`, `about`, `products`, `contact`), direkomendasikan pendekatan berikut:

### 1. Struktur URL Berbasis Slug (Dynamic Routing)

Gunakan _catch-all segments_ bawaan Next.js App Router: `app/[tenant]/[[...slug]]/page.tsx`.

- `/[tenant]/` -> Secara otomatis mengenali root halaman tenant (Home).
- `/[tenant]/about` -> Parameter `slug` berisi `['about']`.
- `/[tenant]/products/shoes` -> Parameter `slug` berisi `['products', 'shoes']`.

### 2. Resolusi PageConfig via Database

- Mengembalikan **PageConfig** yang spesifik untuk halaman tersebut.
- Hal ini berarti _sebuah tenant dapat memiliki banyak halaman (banyak PageConfig), dan masing-masing halaman dapat menggunakan Template yang berbeda-beda_.

### 3. Skalabilitas Template

Karena `templateId` terikat langsung di level `PageConfig` (bukan di level tenant secara glonal), fleksibilitas maksimal tercapai:

- Halaman `Home` bisa menggunakan `TemplateLandingPage` (banyak slide/animasi).
- Halaman `About` dan `Contact` bisa menggunakan `TemplateArticle` (berbasis text/content reader).

Hal ini membuat CMS (Edit Mode) tetap konsisten. Edit Mode sidebar nantinya hanya dimuat (di-_mount_) memodifikasi satu `PageConfig` untuk _URL yang sedang diakses_.

---

## Tech Stack

| Library           | Versi    | Peran                                      |
| ----------------- | -------- | ------------------------------------------ |
| Next.js           | 16.2.2   | Framework utama (App Router)               |
| React             | 19.2.4   | UI rendering                               |
| TypeScript        | ^5       | Type safety                                |
| Zustand           | ^5.0.12  | State management editor (Global state)     |
| @tanstack/query   | ^5       | Fetching data & caching (Client-side)      |
| axios             | ^1       | HTTP Client untuk REST API                 |
| @dnd-kit          | ^6 / ^10 | Drag & Drop urutan slot di sidebar         |
| Zod               | ^4.3.6   | Validasi JSON config schema                |
| Shadcn/UI + Radix | latest   | UI primitives (button, dialog, dll.)       |
| immer             | ^11.1.4  | Immutable state updates untuk JSON config  |
| nanoid            | ^5.1.7   | Generate unique ID per komponen instance   |
| Tailwind CSS      | ^4       | Styling utility                            |
| dayjs             | ^1.11.20 | Formatting tanggal (untuk komponen konten) |
| React Hook Form   | ^7.72.1  | Form di panel properti editor              |

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
- Husky + lint-staged aktif: setiap commit harus lolos **Prettier** + **ESLint**.
- Jangan gunakan `useState` untuk state editor level atas — **semuanya harus melalui Zustand**.
- Pastikan setiap komponen baru menggunakan `'use client'` directive jika menggunakan hooks atau event handler.
- Gunakan `arrayMove` dari `@dnd-kit/sortable` untuk menghitung urutan baru setelah drag.
- Import `persist` dari `zustand/middleware` — bukan `zustand/middleware/persist`.
- Urutan compose middleware: `persist(immer(...))` — bukan `immer(persist(...))`.
- **Apabila setiap kali generate/edit code apapun, pastikan selalu run `yarn lint-fix` dan `yarn format` setelahnya.**
