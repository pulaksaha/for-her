# Anniversary Recap System

Premium AI pipeline that turns a memory world into a luxury documentary-style film.

## Pipeline

1. **Analyze** — heuristic salience + optional OpenAI Vision (`gpt-4o`)
2. **Rank** — strongest moments for the cut
3. **Narrative arc** — Claude or GPT-4o (documentary trailer tone)
4. **Poetic captions** — on-screen typography per scene
5. **Narration script** — full voice-over text
6. **TTS** — ElevenLabs or OpenAI `tts-1-hd`
7. **Compose** — scene timing, transitions, soundtrack bed
8. **Render** — Remotion → silent MP4
9. **Assemble** — FFmpeg mux narration + music

## API

```bash
# Generate plan (and optional render)
POST /api/recap/generate
{ "worldSlug": "our-story", "aspectRatio": "16:9", "maxScenes": 8 }

# Poll job
GET /api/recap/:jobId

# Export MP4
POST /api/recap/:jobId/render
{ "both": true }
```

## Studio UI

`/worlds/our-story/films/studio` — generate, preview (`@remotion/player`), export.

## CLI render

```bash
npm run recap:studio
node scripts/render-recap.mjs ./public/recaps/<jobId>/props.json
node scripts/render-recap.mjs ./public/recaps/<jobId>/props.json --vertical
```

## Requirements

- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` (Vision + story)
- `ELEVENLABS_API_KEY` or OpenAI TTS for narration
- `ffmpeg` on PATH for assembly
- Optional: `/public/audio/recap-ambient.mp3` soundtrack bed

## Outputs

- `public/recaps/<jobId>/recap-widescreen.mp4` (1920×1080)
- `public/recaps/<jobId>/recap-vertical.mp4` (1080×1920)
- `public/recaps/<jobId>/narration.mp3`
- `public/recaps/<jobId>/props.json` (Remotion input)
