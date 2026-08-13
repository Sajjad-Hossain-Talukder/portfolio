// Visit logging backed by Vercel KV (Upstash Redis) over its REST API.
//
// Deliberately dependency-free: Upstash's REST endpoint is plain HTTP, so this
// works from Edge middleware without pulling in an SDK. If the env vars are not
// set the whole thing no-ops, so a missing KV store degrades to "no analytics"
// rather than a broken site.
//
// PRIVACY: no IP address, no cookie, no fingerprint, no identifier of any kind.
// We keep timestamp, path, referrer, coarse geo (country/city, provided free by
// Vercel's edge) and the user-agent string, which is what makes bot filtering
// possible. Nothing here identifies a person.

const URL_ = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

/** Newest-first list. Trimmed to this many so storage stays inside the free tier. */
export const MAX_VISITS = 2000;
const KEY = "visits";

export type Visit = {
  t: number;        // epoch ms
  path: string;
  ref: string;      // referrer, "" when opened directly
  country: string;
  city: string;
  ua: string;
};

export const kvConfigured = Boolean(URL_ && TOKEN);

async function kv(command: unknown[]): Promise<unknown> {
  if (!kvConfigured) return null;
  const res = await fetch(URL_!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { result?: unknown };
  return json.result ?? null;
}

/** Fire-and-forget. Never throws — a logging failure must not break a page load. */
export async function recordVisit(v: Visit): Promise<void> {
  if (!kvConfigured) return;
  try {
    await kv(["LPUSH", KEY, JSON.stringify(v)]);
    await kv(["LTRIM", KEY, "0", String(MAX_VISITS - 1)]);
  } catch {
    /* ignore */
  }
}

export async function readVisits(limit = MAX_VISITS): Promise<Visit[]> {
  if (!kvConfigured) return [];
  try {
    const raw = (await kv(["LRANGE", KEY, "0", String(limit - 1)])) as
      | string[]
      | null;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((s) => {
        try {
          return JSON.parse(s) as Visit;
        } catch {
          return null;
        }
      })
      .filter((v): v is Visit => v !== null);
  } catch {
    return [];
  }
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
const BOT = /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|slackbot|discord|preview|monitor|pingdom|uptime|headless|lighthouse|gtmetrix|curl|wget|python-requests|axios|node-fetch|go-http/i;

export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
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
  const mail = /mail\.google|gmail|outlook|mail\.yahoo|proofpoint|zoho|mimecast|protonmail|roundcube|webmail/i;
  if (mail.test(host)) return { label: `📧 Email (${host})`, email: true };
  if (/linkedin/i.test(host)) return { label: "LinkedIn", email: false };
  if (/github/i.test(host)) return { label: "GitHub", email: false };
  if (/google\.|bing\.|duckduckgo|search/i.test(host))
    return { label: `Search (${host})`, email: false };
  return { label: host, email: false };
}
