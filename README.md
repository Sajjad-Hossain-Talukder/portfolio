# Sajjad Hossain Talukder — Portfolio

Personal portfolio (Next.js App Router + TypeScript) with **Chiki**, an AI
assistant that answers questions about Sajjad, powered by **Gemini Flash (free tier)**.

The visual design is a 1:1 port of the approved mockup (`mockup.reference.html`) —
the exact CSS is reused verbatim in `app/globals.css`.

## Stack
- **Next.js 15** (App Router) + React 19 + TypeScript
- **next/font** for Roboto / Roboto Mono / Caveat
- **@google/generative-ai** — Chiki chatbot (`/api/chiki`, streaming)
- Single source of truth for Chiki: `lib/profile.ts`

## Getting started

```bash
npm install

# add your key
cp .env.local.example .env.local
#   then edit .env.local and paste your Gemini key

npm run dev      # http://localhost:3000
```

Get a **free** Gemini API key at https://aistudio.google.com/apikey and put it in
`.env.local` as `GEMINI_API_KEY`. (Default model: `gemini-2.0-flash`.)

## Project structure
```
app/
  layout.tsx          # fonts + metadata, mounts <Chiki/> and <Interactions/>
  page.tsx            # the full portfolio (faithful JSX port of the mockup)
  globals.css         # exact mockup CSS (only font vars rewired to next/font)
  api/chiki/route.ts  # Gemini streaming endpoint
components/
  Chiki.tsx           # chat widget (client) — calls /api/chiki
  Interactions.tsx    # nav shadow, scroll-reveal, projects filter
lib/
  profile.ts          # Sajjad's profile = Chiki's system prompt
public/images/        # logo.png, profile-cutout.png, profile.png
mockup.reference.html # original approved static mockup (reference only)
```

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import it on https://vercel.com → it auto-detects Next.js.
3. Add env var **`GEMINI_API_KEY`** (and optionally `GEMINI_MODEL`) in Vercel → Project → Settings → Environment Variables.
4. Add the custom domain **sajjadhossaintalukder.com** in Vercel → Domains, and point DNS as instructed.

## TODO (content)
- Real **GitHub** and **LinkedIn** URLs (placeholders in `app/page.tsx`).
- Wire the **Download CV** button to a hosted PDF (drop it in `public/`).
- Add **professional/office projects** to the Projects grid.
