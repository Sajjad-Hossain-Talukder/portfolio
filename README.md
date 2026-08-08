# Sajjad Hossain Talukder — Portfolio

Personal portfolio (Next.js App Router + TypeScript) with **Chiki**, an AI
assistant that answers questions about Sajjad, powered by **Gemini Flash (free tier)**.

The visual design is a 1:1 port of the approved mockup (`mockup.reference.html`) —
the exact CSS is reused verbatim in `app/globals.css`.

## Stack
- **Next.js 15** (App Router) + React 19 + TypeScript
- **next/font** for Roboto / Roboto Mono / Caveat
- **Gemini Flash** — Chiki chatbot (`/api/chiki`, streaming, rate-limited)
- **Single source of truth: the CV.** `lib/facts.generated.ts` is generated from
  `CV/cv-generator/data/personal.yaml` — the same file that produces the PDFs.

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
  facts.generated.ts          # GENERATED from the CV — every fact on the site
  research-corpus.generated.ts# GENERATED from the three papers — Chiki's depth
  profile.ts                  # composes both + the prompt rules (hand-written)
scripts/
  sync-profile.mjs    # personal.yaml -> facts.generated.ts
  extract-papers.mjs  # pdaf/iciev/force PDFs -> research-corpus.generated.ts
public/images/        # logo.png, profile-cutout.png, profile.png
mockup.reference.html # original approved static mockup (reference only)
```

## Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. Import it on https://vercel.com → it auto-detects Next.js.
3. Add env var **`GEMINI_API_KEY`** (and optionally `GEMINI_MODEL`) in Vercel → Project → Settings → Environment Variables.
4. Add the custom domain **sajjadhossaintalukder.com** in Vercel → Domains, and point DNS as instructed.

## Content: never hand-edit a fact

The page and the bot both read `lib/facts.generated.ts`. Do not type a date, a
score or a title into `app/page.tsx` — fix the CV and re-sync:

```bash
# 1. edit CV/cv-generator/data/personal.yaml
npm run sync          # -> lib/facts.generated.ts   (site + Chiki)
```

This exists because the two drifted badly: the site advertised **IELTS 6.5**
against an actual **7.0**, a **2024** graduation against **Jan 2026**, and a
paper as "accepted at ICIEV" months after it was published as a CRC Press book
chapter. Anything hard-coded will drift again.

Deliberately **not** synced — `personal.yaml` is an application document, this
is a public page: phone number, date of birth, nationality, gender, and the
referees (their names, titles and email addresses are other people's data).

### Chiki's research corpus

Chiki holds the full text of all three papers (~25k tokens), so it can answer
real technical questions rather than reciting titles. Regenerate only when a
paper itself changes:

```bash
npm run sync:papers   # -> lib/research-corpus.generated.ts   (needs poppler)
```

No vector store and no retrieval step — the corpus fits Gemini Flash's window
many times over, so the model simply reads it.

**The PDFs are not hosted.** PDAF is accepted at IEEE (DOI 10.1109/TMC.2026.3722116), and the book chapter
belongs to CRC Press / Taylor & Francis. Chiki knows the content and points
people to the DOI; no paper PDF is served from `public/`.

## CVs

`public/cv/` holds three, all generated from the same data file as the facts:

| File | For |
|---|---|
| `…-Academic-CV.pdf` | professors, PhD/Master's applications outside Europe |
| `…-Europass-CV.pdf` | DAAD, Erasmus, EU portals |
| `…-Professional-CV.pdf` | software engineering roles |

Replace them by re-running the CV generator and copying the PDFs across.
