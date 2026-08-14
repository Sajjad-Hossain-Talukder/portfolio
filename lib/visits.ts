// Visit logging backed by Upstash Redis over its REST API.
//
// ⚠️ PRIVACY — changed 14 Aug 2026. This log now records IP addresses, on
// purpose, so individual visitors can be told apart and a professor following
// an email link can be recognised across pages. Before this it stored no
// identifier at all.
//
// What is stored: timestamp, path, referrer, IP, coarse geo (country, region,
// city, timezone) and the user-agent. There are still no cookies and no
// client-side script — everything comes from headers Vercel already provides
// at the edge.
//
// An IP is personal data under GDPR. This is a personal portfolio with a tiny
// audience, but if it ever grows, the honest options are a short privacy note
// on the site and a retention cap shorter than MAX_VISITS implies.

import { kv, kvConfigured, pushCapped, readList } from "./kv";

export { kvConfigured };

/** Newest-first list. Trimmed to this many so storage stays inside the free tier. */
export const MAX_VISITS = 2000;
const KEY = "visits";

export type Visit = {
  t: number; // epoch ms
  path: string;
  ref: string; // referrer, "" when opened directly
  ip: string;
  country: string;
  region: string;
  city: string;
  tz: string; // visitor's local timezone, from the edge
  ua: string;
};

/** Fire-and-forget. Never throws — a logging failure must not break a page load. */
export async function recordVisit(v: Visit): Promise<void> {
  await pushCapped(KEY, v, MAX_VISITS);
}

export async function readVisits(limit = MAX_VISITS): Promise<Visit[]> {
  return readList<Visit>(KEY, limit);
}

export async function clearVisits(): Promise<void> {
  if (!kvConfigured) return;
  try {
    await kv(["DEL", KEY]);
  } catch {
    /* ignore */
  }
}

/**
 * Crawlers, preview-link unfurlers and uptime pingers. Worth filtering because
 * an email client fetching a link preview would otherwise look like a professor
 * reading the site.
 */
const BOT =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|slackbot|discord|preview|monitor|pingdom|uptime|headless|lighthouse|gtmetrix|curl|wget|python-requests|axios|node-fetch|go-http/i;

export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
}

/**
 * Vulnerability scanners probing for software this site does not run —
 * WordPress endpoints, exposed .env / .git, admin panels, backup dumps.
 *
 * These arrive with an ordinary desktop user-agent and often a spoofed
 * same-site referrer, so isBot() cannot see them; only the requested path
 * gives them away. Nothing here is a real page on this portfolio, so a hit is
 * proof of a scan rather than a visitor. Filtered because three /wp-json
 * probes were sitting in the Pages panel looking like genuine traffic.
 */
const SCAN =
  /^\/(wp-|wordpress|xmlrpc\.php|\.env|\.git|\.aws|\.ssh|vendor\/|phpmyadmin|pma|adminer|cgi-bin|admin\.php|administrator|typo3|joomla|drupal|autodiscover|owa\/|solr|actuator|telescope|debug|backup|dump|db\.sql|config\.(json|php|yml))/i;

export function isScannerPath(path: string): boolean {
  return SCAN.test(path);
}

/**
 * Where the visit came from, in words. The point of the whole exercise: a hit
 * with a Gmail or Outlook referrer is very likely a professor following the
 * link in an application email.
 */
export function describeSource(ref: string): { label: string; email: boolean } {
  if (!ref) return { label: "Direct / typed", email: false };
  let host = ref;
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw */
  }
  const mail =
    /mail\.google|gmail|outlook|mail\.yahoo|proofpoint|zoho|mimecast|protonmail|roundcube|webmail/i;
  if (mail.test(host)) return { label: `📧 Email (${host})`, email: true };
  if (/linkedin/i.test(host)) return { label: "LinkedIn", email: false };
  if (/github/i.test(host)) return { label: "GitHub", email: false };
  if (/google\.|bing\.|duckduckgo|search/i.test(host))
    return { label: `Search (${host})`, email: false };
  return { label: host, email: false };
}

/** Rough device class from the UA. Enough to tell a phone from a laptop. */
export function deviceOf(ua: string): string {
  if (/iphone|ipod/i.test(ua)) return "iPhone";
  if (/ipad/i.test(ua)) return "iPad";
  if (/android/i.test(ua)) return /mobile/i.test(ua) ? "Android phone" : "Android tablet";
  if (/macintosh|mac os x/i.test(ua)) return "Mac";
  if (/windows/i.test(ua)) return "Windows";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
}

/** Browser family, for the detail column. */
export function browserOf(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua)) return "Safari";
  return "Other";
}

/** Full place string: "Chattogram, Dhaka, BD". Blank parts are dropped. */
export function placeOf(v: {
  city?: string;
  region?: string;
  country?: string;
}): string {
  return [v.city, v.region, v.country].filter(Boolean).join(", ") || "—";
}
