// Shared Upstash Redis REST client.
//
// Extracted from visits.ts once the Chiki chat log needed the same connection.
// Deliberately dependency-free: Upstash's REST endpoint is plain HTTP, so this
// works from Edge middleware without pulling in an SDK. If the env vars are not
// set every call no-ops, so a missing store degrades to "no logging" rather
// than a broken site.

// Accept either naming convention. Vercel retired the "KV" product name and
// moved it to the Upstash marketplace integration, which sets UPSTASH_* vars —
// but older projects (and Vercel's own docs) still use KV_*. Taking both means
// this works no matter which route the store was created through.
const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvConfigured = Boolean(URL_ && TOKEN);

export async function kv(command: unknown[]): Promise<unknown> {
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

/** LPUSH a JSON blob onto a capped list. Never throws. */
export async function pushCapped(
  key: string,
  value: unknown,
  max: number,
): Promise<void> {
  if (!kvConfigured) return;
  try {
    await kv(["LPUSH", key, JSON.stringify(value)]);
    await kv(["LTRIM", key, "0", String(max - 1)]);
  } catch {
    /* a logging failure must never break a page load */
  }
}

/** Read a JSON list back, newest first. Bad rows are dropped, not thrown on. */
export async function readList<T>(key: string, limit: number): Promise<T[]> {
  if (!kvConfigured) return [];
  try {
    const raw = (await kv(["LRANGE", key, "0", String(limit - 1)])) as
      | string[]
      | null;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((s) => {
        try {
          return JSON.parse(s) as T;
        } catch {
          return null;
        }
      })
      .filter((v): v is T => v !== null);
  } catch {
    return [];
  }
}
