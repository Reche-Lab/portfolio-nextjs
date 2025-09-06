# Bruno Reche — Portfolio

A modern, multilingual developer portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **react‑three‑fiber**/**@react-three/drei** for 3D, **Framer Motion** for micro‑animations, and **next‑intl** for i18n (English/Português/Español).

> Live demo: *add your deployed URL here (e.g., Vercel)*.

---

## ✨ Features

* **3D background** (R3F + drei) with a **cinematic reveal** (blur + fade‑in after assets load via `useProgress`) and an optional **scale‑in** for specific models (e.g., Black Dragon).
* **Interactive hover typography**: titles split **by letter**, body text **by word**, with smooth hover transforms.
* **Custom comet cursor** (head follows the pointer exactly + trailing particles), disabled for touch and when `prefers-reduced-motion` is set.
* **Internationalization (i18n)** with `next-intl` (EN/PT/ES), **LocaleSelect** dropdown (closes on outside click & via `Esc`) and locale‑aware routing.
* **Projects** section with animated cards (Framer Motion), stack badges, and external links. Optional lightweight video previews.
* **Export CV split button**: downloads `cv-bruno-reche-<locale>.pdf` based on the current locale, with a dropdown to download in any language.
* **Accessible + performant** defaults: `Preload all`, `Suspense` + `useProgress`, pointer‑events isolation for the WebGL canvas, focus management in menus, and motion fallbacks.

---

## 🧰 Tech Stack

* **Framework:** Next.js (App Router), TypeScript
* **Styling:** Tailwind CSS, next/font (e.g., Inter / Space Grotesk)
* **3D:** react‑three‑fiber, @react-three/drei (useGLTF, Bounds, Center, Edges, Preload, useProgress)
* **Animations:** Framer Motion
* **i18n:** next-intl

---

## 📁 Project Structure (high‑level)

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
    layout.tsx
    globals.css
  components/
    core/
      Background3D.tsx
      InteractiveBackground.tsx
    sections/
      AboutSection.tsx
      ExperienceSection.tsx
      ProjectsSection.tsx
      ContactSection.tsx
    ui/
      HoverText.tsx            # tokenizes by word/char
      typography.tsx           # TitleFX / TextFX wrappers
      FancyCursorComet.tsx     # custom cursor with trail
      ExportCVButton.tsx       # locale-aware CV downloader
      LocaleSelect.tsx         # i18n dropdown (outside-click close)
      ContactIcons.tsx
  i18n/
    navigation.ts              # locale-aware Link/router helpers
  messages/
    en.json
    pt.json
    es.json
public/
  assets/models/               # .glb/.gltf
  cv/                          # cv-bruno-reche-*.pdf
  media/                       # optional video previews / posters
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js **18+** (or 20+)
* pnpm / npm / yarn

### Install & Run

```bash
# install
pnpm install
# or npm i / yarn

# dev
pnpm dev
# build & start
pnpm build && pnpm start

# lint
pnpm lint
```

> By default, no `.env` is required. If you add APIs later (e.g., analytics), document them here.

---

## 🌍 Internationalization (next-intl)

* Messages live in `src/messages/{en,pt,es}.json` (or your configured path).
* Use `useTranslations()` in components to read keys; use the `TitleFX`/`TextFX` wrappers to apply hover effects without breaking translation strings.
* The `LocaleSelect` updates the locale via `router.replace(pathname, { locale })` and **closes** when clicking outside or pressing `Esc`.

**Adding a new language**

1. Create `src/messages/<xx>.json` with your keys.
2. Register the locale in your i18n config and `LocaleSelect`.
3. Add CV file `public/cv/cv-bruno-reche-<xx>.pdf` if using `ExportCVButton`.

---

## 🧩 3D Background

* Models are placed in `public/assets/models` and loaded via `useGLTF`.
* The Canvas wrapper keeps **opacity:0 + blur** until `useProgress().active === false`, then transitions to **opacity:1 + blur(0)**.
* For hero objects (e.g., **BlackDragon**), a subtle **scale‑in (0.25 → 1.0)** is driven by R3F’s frame loop using `MathUtils.damp` and the same “reveal” trigger.
* Camera/fit: use `<Bounds fit observe><Center>...</Center></Bounds>` for auto‑framing. For a hero offset above the title, apply a simple `translate‑y` on the Canvas wrapper in the hero layout.

**Performance tips**

* Use `<Preload all />` and keep textures lightweight.
* Prefer compressed `.glb` and consider Draco/KTX2 when applicable.
* Keep the 3D layer `pointer-events: none` so UI interactivity is unaffected.

---

## 🖋️ Hover Typography

* `HoverText` wraps each **word** or **character** in a `<span>` and applies hover transitions.
* Use **`TitleFX`** for headings (`split="char"`) and **`TextFX`** for paragraphs (`split="word"`).

Example:

```tsx
<TitleFX as="h1" text={t("Hero.title")} className="text-6xl font-bold" />
<TextFX as="p" text={t("Hero.subtitle")} className="text-xl text-zinc-400" />
```

---

## 📂 Projects Section — add projects fast

Projects are defined in `ProjectsSection` (or pulled from i18n messages). Add new items to the array:

```ts
const projects = [
  {
    title: "Tattoo Platform — Next.js + Minimalist 3D",
    description:
      "Page with 3D elements, minimalist and sophisticated design, performance and subtle interactions.",
    stack: ["Next.js", "React", "Three.js", "R3F", "Tailwind", "Framer Motion"],
    url: "https://tattoo-platform.vercel.app/",
  },
  {
    title: "Pricing Pro — Pricing with Geometric Scale",
    description:
      "Modern web app to price products with a geometric scale, Correios shipping, PDF proposal, copy to WhatsApp.",
    stack: ["JavaScript", "Tailwind CSS", "Correios API", "PDF", "Vercel"],
    url: "https://pricing-pro-vercel.vercel.app/",
  },
  // add future projects here ↴
];
```

**Optional video previews**: use a lightweight MP4/WEBM (e.g., 960×540 @ 24fps, ≤ 1–2 MB) and a WebP poster; autoplay muted on hover/in‑view.

---

## 🧾 Export CV Button (locale‑aware)

Place PDFs in `public/cv/`:

```
cv-bruno-reche-en.pdf
cv-bruno-reche-pt.pdf
cv-bruno-reche-es.pdf
```

The split button will download the file matching the active locale, and the dropdown lets users choose any language manually.

---

## 🎨 Fonts & Theming

* Tailwind provides the base theme; tweak colors in `tailwind.config.js`.
* Use `next/font` to load fonts (e.g., Inter for body, Space Grotesk for headings). Example with CSS variables:

```tsx
// app/layout.tsx
import { Inter, Space_Grotesk } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

<html className={`${inter.variable} ${space.variable}`}>...
```

```css
/* globals.css */
body { font-family: var(--font-sans), system-ui, sans-serif; }
h1,h2,h3,.font-display { font-family: var(--font-display), var(--font-sans), sans-serif; }
```

---

## 🛫 Deployment

**Vercel** is recommended:

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the root to the repo, framework **Next.js**; no envs are required by default.
4. Set your custom domain if desired.

---

## 📜 Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## ✅ Accessibility & UX Notes

* Menus close on **outside click** and **Esc**; focus returns to the trigger.
* Motion respects `prefers-reduced-motion` (cursor disables itself automatically).
* Keep contrast high on dark backgrounds and ensure focus rings are visible.

---

## 🗺️ Roadmap / Ideas

* Project lightbox with HD video/image gallery.
* Blog/notes page with MDX.
* Loading skeletons for projects before in‑view.
* Unit tests for UI primitives and i18n utils.

---

## 🤝 Acknowledgments

* [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
* [Framer Motion](https://www.framer.com/motion/)
* [next-intl](https://next-intl-docs.vercel.app/)

---

## 📄 License

MIT — feel free to reuse parts of this setup for your own portfolio.
