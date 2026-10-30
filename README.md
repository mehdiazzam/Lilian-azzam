# Lilian Azzam

Electronic press kit for lyric soprano Lilian Azzam. A single-page React app with four movements — stage, biography, gallery, and contact — built as a dark opera-house stage: velvet, oxblood, and gold leaf.

## Stack

- [Vite](https://vite.dev/) 8
- React 19 and TypeScript
- React Router 7
- Tailwind CSS 4
- Framer Motion
- Oxlint

## Pages

| Route | Movement | What it shows |
| --- | --- | --- |
| `/` | I. Preludio | Stage hero with looping film and an audio-reactive waveform, then short sound bites |
| `/about` | II. Aria | Biography, headshot, repertoire, and workshops |
| `/media` | III. Intermezzo | Horizontal performance film, then a photo gallery |
| `/contact` | IV. Coda | Instagram, phone, Facebook, and email |

Navigation is a numbered side rail on large screens and a compact bar on small ones. Route changes play a curtain transition and return the page to the top.

## Develop

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints a local URL. The default is `http://localhost:5173`.

Other scripts:

```bash
npm run lint      # oxlint
npm run build     # typecheck, then production bundle in dist/
npm run preview   # serve the production build locally
```

## Environment

Create a `.env` file in the project root. Vite reads it at **build time**, so change it and rebuild (or restart `npm run dev`) before the new value takes effect.

```env
VITE_R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

This is the public base URL of the Cloudflare R2 bucket that holds performance video. Do not commit `.env`.

## Media

`src/lib/r2.ts` turns every media key into a URL:

| Key looks like | Resolved as |
| --- | --- |
| `https://…` | Used as-is |
| `/audio/…` or `/portfolio-img/…` | Served from `public/` on this site |
| `1.mp4`, `videos/hero-loop.mp4` | Prefixed with `VITE_R2_PUBLIC_URL` |

Photos and sound bites currently live in the repo:

```
public/portfolio-img/   headshot and gallery stills
public/audio/           sound-bite MP3s
```

Performance video is streamed from R2. Object keys are set in `src/data/media.ts`:

```
videos/hero-loop.mp4          home hero
thumbnails/hero-poster.jpg    hero poster frame
1.mp4 … 10.mp4                gallery films (one entry is 3.webm)
videos/showreel.mp4           declared, not shown on a page yet
```

Upload those objects to the public bucket, keeping the keys exactly as written. A key with no matching object renders as a missing film.

## Editing content

| What | Where |
| --- | --- |
| Contact links and home base | `src/data/data.ts` |
| Sound bites | `src/data/audio.ts` |
| Films, photos, hero keys | `src/data/media.ts` |
| Repertoire | `src/data/repertoire.ts` |
| Workshops | `src/data/workshops.ts` |
| Biography copy | `src/pages/AboutPage.tsx` |

Paths that start with `/` must exist under `public/`. Bare filenames and `videos/…` keys must exist on R2.

## Project layout

```
public/                 static photos, audio, favicon
src/components/         stage chrome, hero, audio, media, motion
src/data/               content
src/lib/r2.ts           media URL resolver
src/pages/              one page per movement
src/index.css           palette, type, and stage utilities
```

## Visual system

Palette and type live in `src/index.css`.

- Velvet `#0A0708`, oxblood `#4A1420`, gold `#D4AF37`, stage light `#F2C879`, ivory `#F4EFE6`
- Display: Fraunces. Body: Figtree
- Staff lines, film grain, vignette, and a drifting stage wash
- Reduced-motion preferences turn off the drift, curtain, and waveform animation

## Deploy

```bash
npm run build
```

Upload the **contents** of `dist/` to the host’s web root. `VITE_R2_PUBLIC_URL` must already be set; it is compiled into the bundle and is not read at runtime.

This app uses client-side routes. The host must serve `index.html` for `/about`, `/media`, and `/contact`, or a refresh on those URLs returns 404. On Apache (including Hostinger), a rewrite in the web root does that:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
