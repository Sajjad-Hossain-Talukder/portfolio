import { buildSystemPrompt } from "@/lib/profile";
import { recordChatTurn } from "@/lib/chats";
import { clientIp, geoOf } from "@/lib/request";

export const runtime = "nodejs";

type Msg = { role: "user" | "bot"; text: string };

// Best-effort in-memory rate limit (per warm serverless instance). For strict
// production limits, back this with a durable store (e.g. Upstash Redis).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("Chiki isn't configured yet (missing GEMINI_API_KEY).", { status: 500 });
  }
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const ip = clientIp(req.headers);
  if (rateLimited(ip)) {
    return new Response("You're sending messages a bit fast — please wait a moment.", { status: 429 });
  }

  let body: { messages?: Msg[]; sid?: string; ref?: string; page?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request.", { status: 400 });
  }

  const msgs = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "bot") && typeof m.text === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, text: m.text.slice(0, 1000) }));

  if (!msgs.length || msgs[msgs.length - 1].role !== "user") {
    return new Response("Bad request.", { status: 400 });
  }

  // Everything needed to log this exchange, resolved before streaming starts.
  // `ref` is the visitor's ORIGINAL landing referrer, sent by the client — the
  // Referer header on this POST is only ever the portfolio itself, which would
  // hide the one fact worth knowing (did they arrive from an email link?).
  const question = msgs[msgs.length - 1].text;
  const meta = {
    sid: typeof body.sid === "string" ? body.sid.slice(0, 40) : "no-sid",
    n: msgs.filter((m) => m.role === "user").length,
    ip,
    ...geoOf(req.headers),
    ref: typeof body.ref === "string" ? body.ref.slice(0, 300) : "",
    page: typeof body.page === "string" ? body.page.slice(0, 200) : "",
    ua: (req.headers.get("user-agent") ?? "").slice(0, 200),
  };
  const startedAt = Date.now();

  // Gemini requires the conversation to begin with a user turn — our history does.
  const contents = msgs.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Rebuilt per request so the model is told today's date; a build-time
        // constant would go stale and it would get tenses wrong.
        system_instruction: { parts: [{ text: buildSystemPrompt() }] },
        contents,
        generationConfig: {
          // Raised from 600: with the papers in context, answers to real
          // technical questions were being cut off mid-sentence.
          maxOutputTokens: 1400,
          temperature: 0.6,
          // Disable "thinking" so the whole budget is the actual answer (fast + cheap).
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
  } catch {
    return new Response("Chiki couldn't reach the AI service. Please try again shortly.", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Chiki is having trouble right now. Please try again shortly.", { status: 502 });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  let answer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const parts = json?.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                for (const p of parts) {
                  if (p?.text) {
                    answer += p.text;
                    controller.enqueue(encoder.encode(p.text));
                  }
                }
              }
            } catch {
              // ignore non-JSON keepalive lines
            }
          }
        }
      } catch {
        // surface nothing extra — the client shows a friendly fallback
      } finally {
        // Logged BEFORE close(): once the stream closes the response is
        // complete and the serverless instance may be frozen mid-write, which
        // would silently drop the last turn of every conversation. One Redis
        // round-trip after the final token is not perceptible.
        try {
          await recordChatTurn({
            ...meta,
            t: Date.now(),
            ms: Date.now() - startedAt,
            q: question,
            a: answer,
          });
        } catch {
          /* logging must never break the reply */
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      // nginx-family proxies buffer a response body by default, which would
      // hold the whole answer back and defeat the streaming.
      "X-Accel-Buffering": "no",
    },
  });
}
