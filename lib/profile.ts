// Chiki's knowledge base.
//
// Two generated inputs, one hand-written layer:
//   facts.generated.ts           <- CV/cv-generator/data/personal.yaml (npm run sync)
//   research-corpus.generated.ts <- the three papers  (npm run sync:papers)
//   this file                    <- framing, project colour, and the rules
//
// Nothing factual is typed here. Facts drifted badly when they were: the site
// claimed IELTS 6.5 against an actual 7.0, and a 2024 graduation against Jan
// 2026. If a fact is wrong now, fix personal.yaml and re-run the sync — do not
// patch it below.
//
// The whole thing (~28k tokens) fits Gemini Flash's window many times over, so
// there is no vector store and no retrieval step: Chiki simply holds the papers.

import { CV_VERSION, FACTS } from "./facts.generated";
import { RESEARCH_CORPUS } from "./research-corpus.generated";

const bullets = (items: readonly string[], indent = "  ") =>
  items.map((i) => `${indent}- ${i}`).join("\n");

function renderFacts(): string {
  const f = FACTS;
  const s: string[] = [];

  s.push(`NAME: ${f.name}`);
  s.push(`LOCATION: ${f.location}`);
  s.push(`EMAIL: ${f.email}`);
  s.push(
    `LINKS:\n${bullets(f.profiles.map((p) => `${p.label}: ${p.url}`))}`
  );
  s.push(`SUMMARY:\n${f.summary}`);

  s.push(
    `EDUCATION:\n${f.education
      .map((e) =>
        [
          `  - ${e.degree}, ${e.institution}${e.location ? `, ${e.location}` : ""} (${e.when})`,
          e.grade ? `    ${e.grade}` : "",
          ...e.details.map((d) => `    ${d}`),
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n")}`
  );

  s.push(
    `LANGUAGES:\n${bullets(f.languages.map((l) => `${l.name}: ${l.level}`))}`
  );

  if (f.certifications.length) {
    s.push(
      `CERTIFICATIONS & TEST SCORES:\n${f.certifications
        .map(
          (c) =>
            `  - ${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.year ? ` (${c.year})` : ""}`
        )
        .join("\n")}`
    );
  }

  s.push(
    `RESEARCH EXPERIENCE:\n${f.research
      .map((r) =>
        [
          `  - ${r.title}${r.organization ? ` — ${r.organization}` : ""} (${r.when})`,
          ...r.details.map((d) => `    ${d}`),
        ].join("\n")
      )
      .join("\n")}`
  );

  s.push(
    `PUBLICATIONS:\n${f.publications
      .map((p) =>
        [
          `  - "${p.title}"`,
          p.authors ? `    Authors: ${p.authors}` : "",
          `    ${[p.venue, p.year, p.status].filter(Boolean).join(" · ")}`,
          p.url ? `    ${p.url}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n")}`
  );

  s.push(
    `PROFESSIONAL EXPERIENCE:\n${f.experience
      .map((x) =>
        [
          `  - ${x.title}, ${x.organization}${x.location ? ` (${x.location})` : ""} — ${x.when}`,
          ...x.details.map((d) => `    ${d}`),
        ].join("\n")
      )
      .join("\n")}`
  );

  s.push(
    `PROJECTS:\n${f.projects
      .map((p) =>
        [
          `  - ${p.name}${p.tags.length ? ` [${p.tags.join(", ")}]` : ""}`,
          p.url ? `    ${p.url}` : "",
          ...p.details.map((d) => `    ${d}`),
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n")}`
  );

  s.push(
    `AWARDS & COMPETITIVE PROGRAMMING:\n${f.achievements
      .map((a) => `  ${a.category}:\n${bullets(a.items, "    ")}`)
      .join("\n")}`
  );

  s.push(
    `SKILLS:\n${f.skills.map((g) => `  - ${g.category}: ${g.items.join(", ")}`).join("\n")}`
  );

  // The full contest record, not just the headline results — it is the
  // difference between "went to ICPC once" and four years of it.
  if (f.contests.length) {
    s.push(
      `FULL CONTEST HISTORY:\n${f.contests
        .map((g) =>
          [
            `  ${g.group}:`,
            ...g.entries.map(
              (e) =>
                `    - ${e.year} ${e.event}${e.result ? ` — ${e.result}` : ""}${
                  e.team ? ` (team ${e.team})` : ""
                }`
            ),
            g.note ? `    ${g.note}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        )
        .join("\n")}`
    );
  }

  s.push(
    `LEADERSHIP & COMMUNITY:\n${[
      ...f.organizations.map(
        (o) =>
          `  - ${o.title}, ${o.name} (${o.when})${o.summary ? `\n    ${o.summary}` : ""}`
      ),
      ...f.memberships.map(
        (m) =>
          `  - ${m.role}, ${m.name} (${m.when})${m.summary ? `\n    ${m.summary}` : ""}`
      ),
    ].join("\n")}`
  );

  s.push(`RESEARCH INTERESTS:\n${bullets([...f.interests])}`);

  return s.join("\n\n");
}

/** Colour the CV cannot carry: what each project actually is, and why it was
 *  built. Hand-written — safe to edit, contains no dates or figures. */
const PROJECT_NOTES = `
PROJECT BACKGROUND (context, not new facts):
  - Grade Now — the agentic pipeline is the interesting part: rubrics are
    generated from the question paper first, then answer scripts are graded
    against them in parallel multi-stage passes, so grading stays consistent
    across a whole batch rather than drifting script to script.
  - Connect My Advocate — a legal-aid platform for Bangladesh connecting
    clients to advocates with real-time video consultation. Sajjad was the sole
    engineer: client web, mobile app, admin panel, PostgreSQL backend and the
    AWS infrastructure.
  - IELTS Pro BD — a live computer-delivered mock-IELTS platform. The hard part
    was the test-engine editor: staff compose full four-skill tests without a
    developer. It runs as a real business with subscription billing.
  - SmartWeight — edge computer vision on a Raspberry Pi: OpenCV object
    detection fused with HX711 weight sensors so a shop counter identifies the
    product and prices it in one step, fully on-device with no cloud call.
`.trim();

const AVAILABILITY = `
AVAILABILITY & GOALS:
  - Actively seeking FULLY FUNDED PhD positions (and Master's) abroad, and open
    to research collaborations and engineering roles.
  - Research direction: AI applied to networking — Named Data Networking, SDN,
    and deep/federated reinforcement learning for in-network decisions.
  - Best contact: ${FACTS.email}
`.trim();

const CV_DOWNLOADS = `
CV DOWNLOADS (all current, generated from one source, CV v${CV_VERSION}):
  - Europass CV — /cv/Sajjad-Hossain-Talukder-Europass-CV.pdf — for European
    applications (DAAD, Erasmus, EU portals).
  - Academic CV — /cv/Sajjad-Hossain-Talukder-Academic-CV.pdf — for professors
    and for PhD/Master's applications outside Europe.
  - Professional CV — /cv/Sajjad-Hossain-Talukder-Professional-CV.pdf — for
    software engineering roles.
  If a visitor asks for a CV or resume, point them at the "Download CV" button
  in the site header and say which of the three fits their situation.
`.trim();

export const PROFILE = [
  renderFacts(),
  PROJECT_NOTES,
  AVAILABILITY,
  CV_DOWNLOADS,
].join("\n\n");

/** The prompt is built per request so the model knows today's date. Without it
 *  it guesses tense from the data and gets it wrong — it told a visitor Sajjad
 *  was "scheduled to take" an IELTS exam he sat in July 2026. */
export function buildSystemPrompt(now: Date = new Date()): string {
  const today = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return SYSTEM_PROMPT.replace("{{TODAY}}", today);
}

export const SYSTEM_PROMPT = `
You are "Chiki", the personal AI assistant of ${FACTS.name}, embedded on his
portfolio website. You answer visitors' questions about him — recruiters,
professors, scholarship committees, and collaborators.

TODAY'S DATE IS {{TODAY}}. Use it to get tense right: anything dated before
today has happened, not "is scheduled". A role with no end date is current.

IDENTITY:
- If asked who or what you are, say you are Chiki, Sajjad's AI assistant, here
  to answer anything about his work, research, projects and background.
- Never claim to BE Sajjad. Never present yourself as Gemini, Google, or a
  generic chatbot. You speak ON BEHALF of Sajjad, about him, in third person
  ("Sajjad built...", "his thesis shows...").

WHAT YOU KNOW:
- The PROFILE below is his full verified record, generated from the same data
  file that produces his CVs.
- The RESEARCH CORPUS below is the actual text of his papers. You may answer
  detailed technical questions from it — methods, metrics, architecture,
  experimental setup, results, limitations. This is the point of you: a
  professor should be able to interrogate the work and get real answers.

RULES:
- Answer ONLY from the material below. If something is not covered, say so
  plainly and suggest emailing him at ${FACTS.email}. Never invent facts,
  employers, dates, figures or collaborators.
- Numbers matter. Quote results exactly as the papers state them and do not
  round, extrapolate or soften them.
- Sajjad is FIRST AUTHOR on both papers. Say so when publications come up.
- PDAF is under review at IEEE Transactions on Mobile Computing, so there is no
  public PDF. The book chapter is published by CRC Press / Taylor & Francis —
  point people to its DOI rather than offering a file.
- PDAF contains NO deep reinforcement learning. It is BFS-based node-disjoint
  route discovery, multi-metric route ranking, and packet suppression via an
  extended Dead Nonce List. The D3QN / federated learning work is FORCE, a
  separate ongoing project. Never merge the two.
- You do not have his referees' details, and you must not speculate about who
  would recommend him. Direct those requests to him by email.
- Never state a phone number, date of birth, or home address.

STYLE:
- Never prefix a reply with your own name. The chat UI already labels you,
  so "Chiki: ..." renders as a stutter. Just answer.
- Warm, concise, confident. Default to 2-4 short sentences.
- When a question is genuinely technical, go deeper — up to a couple of short
  paragraphs — because that is what the corpus is for. Match the asker's level.
- PLAIN TEXT ONLY. The page renders your reply verbatim, so any markdown shows
  up as literal punctuation and looks broken. Never use *, **, _, #, backticks,
  bullet characters or numbered-list syntax, and never escape characters with a
  backslash. Write "The state has six families: cache performance, eviction
  quality, ..." — never "1. **Cache performance:**". If you need to separate
  points, use separate sentences or a new line of plain prose.
- At most one emoji per reply, and often none.
- If asked something off-topic or inappropriate, steer politely back to his
  work, research, skills, projects, experience or availability.

PROFILE:
${PROFILE}

RESEARCH CORPUS (full text of his papers):
${RESEARCH_CORPUS}
`.trim();
