import { readChatTurns, groupConversations } from "../../../lib/chats";
import { describeSource, deviceOf, browserOf, placeOf, kvConfigured } from "../../../lib/visits";
import { Denied, NoStore, Tabs, Card, Panel, count, since, exact, S } from "../ui";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Chiki conversations",
  robots: { index: false, follow: false },
};

// Full transcript of every Chiki conversation, grouped by session. Same key
// gate as /analytics — see ../page.tsx. The middleware matcher already excludes
// anything under /analytics, so opening this does not log a visit.

export default async function Chats({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.ANALYTICS_KEY;

  if (!secret || !key || key !== secret) return <Denied />;
  if (!kvConfigured) return <NoStore />;

  const turns = await readChatTurns();
  const convos = groupConversations(turns);

  const now = Date.now();
  const day = 86_400_000;
  const last7d = convos.filter((c) => now - c.endedAt < 7 * day).length;
  const fromEmail = convos.filter((c) => describeSource(c.ref).email);
  const uniqueIps = new Set(convos.map((c) => c.ip).filter((i) => i && i !== "unknown"));
  const askedFrom = count(convos.map((c) => describeSource(c.ref).label));
  const askedWhere = count(convos.map((c) => c.country || "??"));

  return (
    <main style={S.page}>
      <h1 style={S.h1}>Chiki conversations</h1>
      <p style={S.sub}>
        {convos.length} conversations · {turns.length} questions ·{" "}
        {uniqueIps.size} unique IPs · newest first · times shown in Dhaka
      </p>

      <Tabs active="chats" secret={key} chats={convos.length} />

      <div style={S.cards}>
        <Card label="Conversations" value={convos.length} />
        <Card label="Questions asked" value={turns.length} />
        <Card label="Last 7 days" value={last7d} />
        <Card label="Unique IPs" value={uniqueIps.size} />
        <Card label="📧 Started from email" value={fromEmail.length} highlight />
      </div>

      <div style={S.grid}>
        <Panel title="Where they came from" rows={askedFrom.slice(0, 10)} />
        <Panel title="Countries" rows={askedWhere.slice(0, 10)} />
      </div>

      <h2 style={S.h2}>Transcripts</h2>
      {convos.length === 0 && (
        <p style={S.note}>
          Nothing yet. Conversations appear here as soon as someone talks to
          Chiki.
        </p>
      )}

      {convos.map((c) => {
        const src = describeSource(c.ref);
        return (
          <section
            key={c.sid}
            style={{ ...S.convo, ...(src.email ? S.convoHi : {}) }}
          >
            <header style={S.convoHead}>
              <strong style={{ fontSize: ".92rem" }}>{exact(c.startedAt)}</strong>
              <span style={S.dim}>{since(c.endedAt)}</span>
              <span style={{ ...S.pill, ...(src.email ? S.pillMail : {}) }}>
                {src.label}
              </span>
              <span style={S.pill}>
                {c.turns.length} question{c.turns.length === 1 ? "" : "s"}
              </span>
              <span style={{ ...S.pill, ...S.mono }}>{c.ip || "—"}</span>
              <span style={S.pill}>{placeOf(c)}</span>
              {c.tz && <span style={S.dim}>{c.tz}</span>}
              <span style={S.dim}>
                {deviceOf(c.ua)} · {browserOf(c.ua)}
              </span>
            </header>

            {c.turns.map((t, i) => (
              <div key={`${t.t}-${i}`}>
                <div style={S.q}>{t.q}</div>
                <div style={S.a}>{t.a || "(no answer returned)"}</div>
                <div style={S.turnMeta}>
                  {exact(t.t)} · {(t.ms / 1000).toFixed(1)}s
                  {t.page ? ` · on ${t.page}` : ""}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
