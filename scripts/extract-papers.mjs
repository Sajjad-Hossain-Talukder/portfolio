#!/usr/bin/env node
/**
 * extract-papers.mjs — build Chiki's research corpus from the source PDFs.
 *
 *   node scripts/extract-papers.mjs
 *
 * Reads the three papers in the scholarship master folder and writes
 * lib/research-corpus.generated.ts, which Chiki loads into context so it can
 * answer real technical questions ("how does PDAF suppress duplicates?",
 * "what state features does FORCE use?") instead of only reciting titles.
 *
 * Run this rarely — only when a paper itself changes. The generated file is
 * committed, so neither the build nor the deploy needs pdftotext or the PDFs.
 *
 * Requires `pdftotext` (poppler):  brew install poppler
 *
 * Each paper is trimmed to the part worth talking about. References and
 * appendices are dropped: they are a fifth of the tokens and nobody asks the
 * bot to recite a bibliography.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PAPER_DIR = resolve(
  ROOT,
  process.env.PAPER_DIR ?? "../scholarships/documents/00-master/research"
);
const OUT = join(ROOT, "lib", "research-corpus.generated.ts");

/** @type {{id:string,file:string,title:string,venue:string,status:string,link:string,note:string,trim:(t:string)=>string}[]} */
const PAPERS = [
  {
    id: "pdaf",
    file: "pdaf.pdf",
    title:
      "PDAF: Performance-Driven Adaptive Forwarding in SDN-Assisted NDN-MANETs",
    venue: "IEEE Transactions on Mobile Computing",
    status: "Published 2026, IEEE Transactions on Mobile Computing",
    link: "https://doi.org/10.1109/TMC.2026.3722116",
    note:
      "Sajjad is FIRST AUTHOR. This is his undergraduate thesis work, supervised " +
      "by Dr. Shahid Md. Asif Iqbal. PUBLISHED in IEEE Transactions on Mobile " +
      "Computing — live on IEEE Xplore since 11 Aug 2026 as document 11646474, " +
      "DOI 10.1109/TMC.2026.3722116 (resolves). It is an Early Access article, so " +
      "it has no volume or issue number yet. Accepted 6 Aug 2026 with no further " +
      "changes requested.",
    // Everything up to the bibliography. pdftotext renders the small-caps
    // heading as "R EFERENCES".
    trim: (t) => cutAt(t, /^\s*R\s*EFERENCES\s*$/m),
  },
  {
    id: "iciev",
    file: "iciev.pdf",
    title:
      "Empowering Bengali Language in Drone Control with Artificial Neural Networks",
    venue:
      "Book chapter in Applied Machine Learning on Sensing Technologies, CRC Press / Taylor & Francis, pp. 81-93",
    status: "Published, 2026",
    link: "https://doi.org/10.1201/9781003506218-6",
    note:
      "Sajjad is FIRST AUTHOR of seven. Co-authors include Mohammad Shahadat " +
      "Hossain (University of Chittagong) and Karl Andersson (Lulea University " +
      "of Technology, Sweden). Point people to the DOI — the published PDF is " +
      "the publisher's and is not hosted on this site.",
    trim: (t) => cutAt(t, /^\s*References\s*$/m),
  },
  {
    id: "force",
    file: "force.pdf",
    title:
      "FORCE — Federated ORchestration for Cache Eviction in Mobile NDN",
    venue: "Joint research with Dr. S. M. A. Iqbal, Premier University",
    status: "Ongoing, 2026 - present",
    link: "",
    note:
      "Sajjad's current research. Design document, not yet submitted anywhere.",
    // Body only: the second "§I." (the first is the table of contents) up to
    // "§VIII.", after which the document turns into parameter bookkeeping that
    // is long, low-value in conversation, and a third of the tokens.
    trim: (t) => between(t, /^§I\.\s/gm, /^§VIII\.\s/gm),
  },
];

function cutAt(text, re) {
  const m = text.match(re);
  return m ? text.slice(0, m.index) : text;
}

/** Slice from the LAST match of `start` to the LAST match of `end`. Both
 *  headings appear twice — once in the table of contents, once in the body. */
function between(text, startRe, endRe) {
  const starts = [...text.matchAll(startRe)];
  const ends = [...text.matchAll(endRe)];
  if (!starts.length) return text;
  const from = starts[starts.length - 1].index;
  const to = ends.length ? ends[ends.length - 1].index : text.length;
  return to > from ? text.slice(from, to) : text.slice(from);
}

function clean(text) {
  return text
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    // table-of-contents dot leaders
    .filter((l) => !/\.\s\.\s\.\s\./.test(l))
    // bare page numbers and form-feeds
    .filter((l) => !/^\s*\d{1,3}\s*$/.test(l))
    .join("\n")
    .replace(/\f/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const ok = [];
for (const p of PAPERS) {
  const src = join(PAPER_DIR, p.file);
  if (!existsSync(src)) {
    console.error(`  ! missing ${src} — skipped`);
    continue;
  }
  const raw = execFileSync("pdftotext", ["-q", src, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const body = clean(p.trim(raw));
  ok.push({ ...p, body });
  const kt = Math.round(body.length / 4 / 100) / 10;
  console.log(
    `  ${p.id.padEnd(6)} ${String(body.length).padStart(7)} chars  ~${kt}k tokens`
  );
}

if (!ok.length) {
  console.error("No papers found. Set PAPER_DIR or check the paths.");
  process.exit(1);
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const out = `// GENERATED by scripts/extract-papers.mjs — do not edit by hand.
// Source: ${PAPER_DIR.replace(ROOT, "<repo>/..")}
// Re-run: npm run sync:papers

export type Paper = {
  id: string;
  title: string;
  venue: string;
  status: string;
  link: string;
  note: string;
  body: string;
};

export const PAPERS: Paper[] = [
${ok
  .map(
    (p) => `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    venue: ${JSON.stringify(p.venue)},
    status: ${JSON.stringify(p.status)},
    link: ${JSON.stringify(p.link)},
    note: ${JSON.stringify(p.note)},
    body: \`${esc(p.body)}\`,
  },`
  )
  .join("\n")}
];

/** The full corpus, formatted for the model's context window. */
export const RESEARCH_CORPUS = PAPERS.map(
  (p) =>
    \`=== PAPER: \${p.title} ===
VENUE: \${p.venue}
STATUS: \${p.status}\${p.link ? \`\\nLINK: \${p.link}\` : ""}
NOTE: \${p.note}

\${p.body}\`
).join("\\n\\n");
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, "utf8");
const total = ok.reduce((n, p) => n + p.body.length, 0);
console.log(
  `\n  wrote ${OUT.replace(ROOT + "/", "")} — ${ok.length} papers, ~${Math.round(
    total / 4 / 1000
  )}k tokens total`
);
