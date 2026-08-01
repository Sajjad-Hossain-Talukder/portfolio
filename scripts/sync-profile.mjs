#!/usr/bin/env node
/**
 * sync-profile.mjs — make the CV the single source of truth for this site.
 *
 *   npm run sync
 *
 * Reads CV/cv-generator/data/personal.yaml (the same file that generates the
 * five PDFs) and writes lib/facts.generated.ts, which both the page and Chiki
 * import. Edit the CV once, run this, and the site, the bot and the PDFs all
 * agree.
 *
 * This exists because they did NOT agree: the site sat on IELTS 6.5 (it is
 * 7.0), a 2024 graduation (it is Jan 2026), and a paper marked "accepted at
 * ICIEV" that has since been published as a CRC Press book chapter.
 *
 * WHAT IS DELIBERATELY NOT COPIED — personal.yaml is an application document,
 * this is a public web page:
 *   - phone number         (spam magnet)
 *   - date of birth, nationality, gender  (no business being on a portfolio)
 *   - referees             (their names, titles and EMAIL ADDRESSES are other
 *                          people's data; publishing them is not Sajjad's call)
 * Add them here only if that changes deliberately.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const YAML_PATH = resolve(
  ROOT,
  process.env.CV_YAML ?? "../CV/cv-generator/data/personal.yaml"
);
const OUT = join(ROOT, "lib", "facts.generated.ts");

if (!existsSync(YAML_PATH)) {
  console.error(
    `Cannot find the CV data file:\n  ${YAML_PATH}\n` +
      `Set CV_YAML=/path/to/personal.yaml if it lives elsewhere.`
  );
  process.exit(1);
}

const data = parse(readFileSync(YAML_PATH, "utf8")) ?? {};

// --- dates ---------------------------------------------------------------
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ONGOING = new Set(["present", "current", "ongoing", "now"]);

/** "2019-01" -> "Jan 2019"; 2026 -> "2026"; "present" -> "Present". Mirrors
 *  fmt_date() in the CV generator so the site and the PDFs read alike. */
function fmtDate(v) {
  if (v == null) return "";
  if (v instanceof Date) return `${MONTHS[v.getUTCMonth()]} ${v.getUTCFullYear()}`;
  const s = String(v).trim();
  if (!s) return "";
  if (ONGOING.has(s.toLowerCase())) return "Present";
  let m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(s);
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  if (/^\d{4}$/.test(s)) return s;
  return s; // free text ("Expected 2027") passes through
}
/** Full date for things where the day matters, e.g. a test sitting. */
function fmtFullDate(v) {
  if (v == null) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return `${d.getUTCDate()} ${
    ["January","February","March","April","May","June","July",
     "August","September","October","November","December"][d.getUTCMonth()]
  } ${d.getUTCFullYear()}`;
}

/** IELTS bands are always written to one decimal — 7.0, not 7. */
const fmtBand = (v) =>
  v == null || v === "" ? "" : Number.isFinite(Number(v)) ? Number(v).toFixed(1) : String(v);

/** 1 -> "1st", 52 -> "52nd", 106 -> "106th". Handles the 11/12/13 exception. */
function ordinal(n) {
  if (!Number.isFinite(n)) return "";
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

const range = (a, b) => {
  const s = fmtDate(a), e = fmtDate(b);
  return s && e ? `${s} — ${e}` : s || e || "";
};

// --- pickers -------------------------------------------------------------
const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (v == null ? "" : String(v));

const p = data.personal ?? {};
const contact = p.contact ?? {};
const addr = contact.address ?? {};

const profiles = arr(p.profiles).map((x) => ({
  label: str(x.label),
  url: str(x.url),
  display: str(x.display || x.handle || x.label),
}));

const education = arr(data.education).map((e) => ({
  degree: [str(e.degree), str(e.field)].filter(Boolean).join(" in "),
  institution: str(e.institution),
  location: str(e.location),
  when: range(e.start, e.end),
  grade: str(e.grade),
  details: arr(e.details).map(str),
}));

const research = arr(data.research).map((r) => ({
  title: str(r.title),
  organization: str(r.organization),
  when: range(r.start, r.end),
  details: arr(r.details).map(str),
}));

const publications = arr(data.publications).map((x) => ({
  title: str(x.title),
  authors: str(x.authors),
  venue: str(x.venue),
  year: str(x.year),
  status: str(x.status).replace(/_/g, " "),
  url: str(x.url),
}));

const experience = arr(data.experience).map((x) => ({
  title: str(x.title),
  organization: str(x.organization),
  location: str(x.location),
  when: range(x.start, x.end),
  details: arr(x.details).map(str),
}));

const projects = arr(data.projects).map((x) => ({
  name: str(x.name),
  url: str(x.url),
  tags: arr(x.tags ?? x.technologies).map(str),
  details: arr(x.details ?? x.highlights).map(str),
}));

const achievements = arr(data.achievements).map((a) => ({
  category: str(a.category),
  items: arr(a.items).map(str),
}));

const certifications = arr(data.certifications).map((c) => ({
  name: str(c.name),
  issuer: str(c.issuer),
  year: str(c.year),
  url: str(c.url),
  // Optional structured score breakdown (IELTS L/R/W/S). Absent on most
  // certificates, so everything downstream must treat it as optional.
  overall: fmtBand(c.overall),
  cefr: str(c.cefr),
  testDate: fmtFullDate(c.test_date),
  bands: arr(c.bands).map((b) => ({
    skill: str(b.skill),
    band: fmtBand(b.band),
  })),
}));

const skills = arr(data.skills).map((s) => ({
  category: str(s.category),
  items: arr(s.items).map(str),
}));

const organizations = arr(data.organizations).map((o) => ({
  title: str(o.title),
  name: str(o.name),
  url: str(o.url),
  when: range(o.start, o.end),
  summary: str(o.summary),
}));

// Full contest history — the long form the CV has no room for.
const contests = arr(data.contests).map((g) => ({
  group: str(g.group),
  note: str(g.note).trim(),
  entries: arr(g.entries).map((e) => ({
    event: str(e.event),
    year: str(e.year),
    team: str(e.team),
    // "52nd of 162 teams" / "Finalist" — placement pre-formatted so the page
    // never has to know about ordinal suffixes.
    result: e.result
      ? str(e.result)
      : e.rank
      ? `${ordinal(Number(e.rank))}${e.of ? ` of ${e.of} teams` : ""}`
      : "",
  })),
}));

// Professional bodies / service clubs. Separate from `organizations` so they
// can appear on the site without touching the CV's Activities section.
const memberships = arr(data.memberships).map((m) => ({
  role: str(m.role),
  name: str(m.name),
  url: str(m.url),
  when: range(m.start, m.end),
  summary: str(m.summary),
}));

const languages = arr(data.languages).map((l) => ({
  name: str(l.name),
  level: str(l.level),
}));

const facts = {
  name: str(p.name?.full),
  location: [str(addr.city), str(addr.country)].filter(Boolean).join(", "),
  email: str(contact.email),
  summary: str(data.summary).trim(),
  profiles,
  education,
  research,
  publications,
  experience,
  projects,
  achievements,
  certifications,
  skills,
  organizations,
  contests,
  memberships,
  languages,
  interests: arr(data.interests).map(str),
};

// --- version stamp, so a stale site is visible -----------------------------
const version =
  /^#\s*VERSION:\s*([\d.]+)/m.exec(readFileSync(YAML_PATH, "utf8"))?.[1] ?? "unknown";

const out = `// GENERATED by scripts/sync-profile.mjs — do not edit by hand.
// Source of truth: CV/cv-generator/data/personal.yaml (CV v${version})
// Re-run: npm run sync
//
// Phone, date of birth, nationality, gender and referees are intentionally
// NOT here — see the header of scripts/sync-profile.mjs.

export const CV_VERSION = ${JSON.stringify(version)};

export const FACTS = ${JSON.stringify(facts, null, 2)} as const;

export type Facts = typeof FACTS;
`;

writeFileSync(OUT, out, "utf8");

const n = (k) => (facts[k]?.length ?? 0);
console.log(
  `  wrote lib/facts.generated.ts from CV v${version}\n` +
    `    ${n("education")} education · ${n("research")} research · ${n("publications")} publications\n` +
    `    ${n("experience")} roles · ${n("projects")} projects · ${n("skills")} skill groups\n` +
    `    ${n("achievements")} award groups · ${n("contests")} contest groups · ${n("organizations")} activities · ${n("memberships")} memberships · ${n("languages")} languages`
);
