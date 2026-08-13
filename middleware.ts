import { NextResponse, type NextRequest } from "next/server";
import { recordVisit, isBot } from "./lib/visits";

// Server-side tracking, deliberately not client-side: an ad blocker cannot stop
// it, and Vercel hands us country/city for free at the edge. It also means no
// tracking script runs in the visitor's browser at all.
//
// The write is awaited but wrapped so it can never fail a page load, and the
// matcher below keeps it off assets, the API and the dashboard itself.

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (isBot(ua)) return res;

    await recordVisit({
      t: Date.now(),
      path: request.nextUrl.pathname,
      ref: request.headers.get("referer") ?? "",
      country: request.headers.get("x-vercel-ip-country") ?? "",
      city: decodeURIComponent(request.headers.get("x-vercel-ip-city") ?? ""),
      ua: ua.slice(0, 200),
    });
  } catch {
    /* never break the page for the sake of a log line */
  }

  return res;
}

export const config = {
  // Page routes only. Excludes _next assets, the API, the analytics dashboard,
  // and anything with a file extension (favicon, pdfs, images).
  matcher: ["/((?!_next|api|analytics|.*\\.).*)"],
};
