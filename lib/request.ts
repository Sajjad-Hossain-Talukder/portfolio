// Header plumbing shared by the middleware and the Chiki API route, so both
// read identity the same way and neither drifts.

/**
 * The visitor's IP. x-forwarded-for is a chain — the client is the first entry;
 * everything after it is a proxy. Vercel also sets x-real-ip, kept as a
 * fallback for local/self-hosted runs where the chain is absent.
 */
export function clientIp(h: Headers): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Coarse location, free from Vercel's edge. Empty strings on localhost, which
 * is why the dashboard falls back to "—" rather than showing gaps.
 */
export function geoOf(h: Headers): {
  country: string;
  region: string;
  city: string;
  tz: string;
} {
  const dec = (v: string | null) => {
    if (!v) return "";
    try {
      // Vercel percent-encodes city names with spaces or accents.
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    country: h.get("x-vercel-ip-country") ?? "",
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
    tz: h.get("x-vercel-ip-timezone") ?? "",
  };
}
