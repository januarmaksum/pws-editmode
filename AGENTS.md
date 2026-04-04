<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:project-context -->

# Project: PWS Edit Mode — Elementor-lite (JSON-driven UI Builder)

## Visi

Membangun sistem **Elementor-lite** di Next.js yang mendukung kustomisasi UI _on-the-fly_ untuk level **tenant member**. Database menyimpan **JSON config**, Next.js merender komponen secara dinamis berdasarkan config tersebut.

## Arsitektur Kunci

- **Template System** — Template predefined (A, B, C, dst.) dengan slot/zone yang bisa diisi komponen.
- **Block/Widget Registry** — Komponen reusable (`CardInfo`, `SlideBanner`, dst.) yang bisa di-inject atau di-DnD ke slot template.
- **ComponentRenderer** — Core engine yang mengubah JSON config → React tree (`src/lib/renderer.tsx`).
- **Zustand** — State management untuk editor (drag state, selected component, config edits).
- **@dnd-kit** — Drag & drop komponen ke dalam template slot (sudah terinstall).

## Struktur Direktori Utama

```
src/
├── app/           # Next.js App Router
├── components/
│   ├── ui/        # Shadcn/UI primitives (JANGAN install ulang yang sudah ada)
│   ├── blocks/    # Block components — WAJIB didaftarkan di blocks/index.ts
│   └── editor/    # Editor UI (canvas, toolbar, property panel)
├── templates/     # Template predefined — hanya definisi slot, bukan konten
├── lib/
│   ├── renderer.tsx   # Core ComponentRenderer
│   └── schema/        # Zod schema untuk validasi JSON config
└── types/
    └── schema.ts      # TypeScript types (PageConfig, SlotConfig, ComponentConfig)
```

## Aturan Wajib

1. Setiap block HARUS punya Zod schema (`lib/schema/`).
2. Setiap block WAJIB didaftarkan di `components/blocks/index.ts`.
3. State config level atas menggunakan **Zustand** + **immer**, bukan `useState`.
4. ID instance komponen selalu di-generate dengan **nanoid**.
5. Template hanya mendefinisikan struktur slot — **tidak ada hardcoded konten**.
6. Import alias `@/` → `src/`. Gunakan selalu.
7. Husky aktif: setiap commit harus lolos **Prettier** + **ESLint** (`--max-warnings=0`).

## Tech Stack Relevan

| Library           | Peran                         |
| ----------------- | ----------------------------- |
| `@dnd-kit`        | DnD komponen ke slot          |
| `zustand`         | State editor                  |
| `immer`           | Mutasi JSON config            |
| `nanoid`          | Generate ID unik per instance |
| `zod`             | Validasi JSON config schema   |
| `react-hook-form` | Form di property panel        |

Baca `issue.md` untuk detail lengkap arsitektur, schema, milestone, dan aturan pengembangan.

<!-- END:project-context -->
