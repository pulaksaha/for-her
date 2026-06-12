# ♡ For Her — A Private Gift Website

A cinematic, single-page love letter built inside this Next.js project. Accessible at `/for-her`.

---

## Running locally

The dev server is already running. Open your browser to:

```
http://localhost:3001/for-her
```

Or restart the dev server anytime:

```bash
npm run dev
```

Then visit `http://localhost:3000/for-her`

---

## Personalising your content

All personalisation is done by editing constants at the **top of each component file**. Every spot is marked with a `← Replace` comment.

| Section | File | What to edit |
|---------|------|-------------|
| **Hero** | `src/components/gift/gift-hero.tsx` | Your names, anniversary date, tagline |
| **Timeline** | `src/components/gift/gift-timeline.tsx` | `TIMELINE_EVENTS` array — dates, titles, captions |
| **Gallery** | `src/components/gift/gift-gallery.tsx` | `GALLERY_PHOTOS` array — captions |
| **Voice note** | `src/components/gift/gift-voice-note.tsx` | Label text |
| **Letter** | `src/components/gift/gift-letter.tsx` | `LETTER_LINES` array — your full letter |
| **Closing** | `src/components/gift/gift-closing.tsx` | Final lines, countdown target date |

---

## Adding your photos

Drop images into `/public/images/`. See `/public/images/README.md` for the full filename list.

```
public/
  images/
    hero-bg.jpg        ← Full-screen hero background
    timeline-1.jpg     ← How you met
    timeline-2.jpg     ← First date
    timeline-3.jpg     ← Milestone 3
    timeline-4.jpg     ← Milestone 4
    timeline-5.jpg     ← Most recent / "today"
    gallery-1.jpg      ← Wide hero gallery photo
    gallery-2.jpg      ← Portrait
    gallery-3.jpg      ← Portrait
    gallery-4.jpg      ← Wide gallery photo
    gallery-5.jpg      ← 2/3-width
    gallery-6.jpg      ← 1/3-width portrait
    closing-bg.jpg     ← Closing screen background
```

**Tip:** Compress images to < 500 KB using [squoosh.app](https://squoosh.app) before adding them.

---

## Adding audio

Drop files into `/public/audio/`:

```
public/
  audio/
    voice-note.mp3         ← Your recorded voice message
    background-music.mp3   ← Soft background track (loops at low volume)
```

**Recording your voice note:** Use iPhone Voice Memos → share as M4A → rename to `.mp3`.

**Background music:** Find royalty-free ambient/piano tracks on [Pixabay](https://pixabay.com/music/) or [Free Music Archive](https://freemusicarchive.org).

---

## Deploying

### Vercel (recommended — one command)

```bash
npx vercel
```

Set it to a private URL, then send the link directly to her.

### Netlify

```bash
npm run build
# Drag the `.next` folder (or use `netlify deploy`) 
```

> **Note:** Since this is a Next.js app (not static), use Vercel or Netlify for full support. For GitHub Pages, you'd need to add `output: 'export'` to `next.config.ts` — but that disables some features.

---

## Architecture

The gift site lives entirely in:

```
src/
  app/for-her/
    layout.tsx       ← No nav chrome, just the experience
    page.tsx         ← Entry point
  components/gift/
    gift-film.tsx    ← Orchestrator (registers GSAP, composes sections)
    gift-hero.tsx    ← §1 Full-screen opening
    gift-timeline.tsx ← §2 Vertical scroll timeline
    gift-gallery.tsx  ← §3 Editorial photo layout
    gift-voice-note.tsx ← §4 Custom audio player
    gift-letter.tsx  ← §5 Click-to-reveal letter
    gift-closing.tsx ← §7 Emotional closing + countdown
    gift-music-player.tsx ← §6 Fixed background music toggle
```

The rest of the project (marketing page, app, etc.) is untouched.
