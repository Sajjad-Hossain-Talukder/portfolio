// Shared chrome for the two private dashboards (/analytics and
// /analytics/chats) so they stay one design and the key gate is written once.

import type React from "react";

/** Wrong or missing key renders this and nothing else — it must not leak that
 *  a dashboard exists here at all. */
export function Denied() {
  return (
    <main style={{ padding: "4rem 1.5rem", textAlign: "center", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>404 — Not found</h1>
    </main>
  );
}

export function NoStore() {
  return (
    <main style={S.page}>
      <h1 style={S.h1}>Not connected</h1>
      <p style={S.warn}>
        No Redis store connected. In the Vercel dashboard go to{" "}
        <strong>Storage → Browse Storage → Upstash → Redis</strong> and create
        one, then redeploy. It sets the connection variables automatically
        (either <code>UPSTASH_REDIS_REST_*</code> or <code>KV_REST_API_*</code> —
        both are accepted). Until then nothing is being recorded, and the rest of
        the site is unaffected.
      </p>
    </main>
  );
}

/** "5m ago" — cheap orientation above the exact stamp. */
export function since(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/**
 * Exact timestamp, always rendered in Dhaka time regardless of where the
 * dashboard is opened from. Server components render on a UTC box, so leaving
 * this to the default locale would quietly show the wrong hour.
 */
export function exact(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

export function Card({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div style={{ ...S.card, ...(highlight ? S.cardHi : {}) }}>
      <div style={S.cardVal}>{value}</div>
      <div style={S.cardLab}>{label}</div>
    </div>
  );
}

export function Panel({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div style={S.panel}>
      <h3 style={S.h3}>{title}</h3>
      {rows.length === 0 && <p style={S.note}>No data yet.</p>}
      {rows.map(([k, n]) => (
        <div key={k} style={S.row}>
          <span style={S.rowK}>{k}</span>
          <span style={S.rowN}>{n}</span>
        </div>
      ))}
    </div>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  if (rows.length === 0) return <p style={S.note}>Nothing recorded yet.</p>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={S.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} style={S.td}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Tally identical strings, most frequent first. */
export function count<T extends string>(rows: T[]): [T, number][] {
  const m = new Map<T, number>();
  rows.forEach((r) => m.set(r, (m.get(r) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export const S: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1180, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "system-ui, sans-serif", color: "#111" },
  h1: { fontSize: "1.7rem", fontWeight: 700, marginBottom: ".25rem" },
  h2: { fontSize: "1.1rem", fontWeight: 600, margin: "2rem 0 .5rem" },
  h3: { fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#666", marginBottom: ".6rem" },
  sub: { color: "#666", fontSize: ".88rem", marginBottom: "1rem" },
  note: { color: "#777", fontSize: ".82rem", margin: "0 0 .75rem" },
  warn: { background: "#fff8e1", border: "1px solid #ffe082", padding: "1rem", borderRadius: 10, fontSize: ".9rem", lineHeight: 1.6 },
  nav: { display: "flex", gap: ".5rem", margin: "0 0 1.5rem", flexWrap: "wrap" },
  navLink: { fontSize: ".82rem", fontWeight: 600, padding: ".4rem .8rem", borderRadius: 999, border: "1px solid #e5e5e5", color: "#333", textDecoration: "none", background: "#fafafa" },
  navOn: { background: "#111", color: "#fff", borderColor: "#111" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: ".75rem", marginBottom: "1rem" },
  card: { border: "1px solid #e5e5e5", borderRadius: 12, padding: "1rem" },
  cardHi: { background: "#f0f7ff", borderColor: "#b3d7ff" },
  cardVal: { fontSize: "1.9rem", fontWeight: 700, lineHeight: 1 },
  cardLab: { fontSize: ".76rem", color: "#666", marginTop: ".35rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1rem", marginTop: "1.5rem" },
  panel: { border: "1px solid #e5e5e5", borderRadius: 12, padding: "1rem" },
  row: { display: "flex", justifyContent: "space-between", padding: ".3rem 0", borderBottom: "1px solid #f2f2f2", fontSize: ".85rem" },
  rowK: { color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" },
  rowN: { fontWeight: 600, color: "#111" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: ".84rem" },
  th: { textAlign: "left", padding: ".5rem .6rem", borderBottom: "2px solid #e5e5e5", color: "#666", fontWeight: 600, whiteSpace: "nowrap" },
  td: { padding: ".45rem .6rem", borderBottom: "1px solid #f2f2f2", whiteSpace: "nowrap", verticalAlign: "top" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: ".78rem" },
  dim: { color: "#888", fontSize: ".74rem" },

  // Conversation view
  convo: { border: "1px solid #e5e5e5", borderRadius: 14, padding: "1rem 1.1rem", marginBottom: "1rem" },
  convoHi: { borderColor: "#b3d7ff", background: "#f7fbff" },
  convoHead: { display: "flex", flexWrap: "wrap", gap: ".4rem .9rem", alignItems: "baseline", borderBottom: "1px solid #f0f0f0", paddingBottom: ".6rem", marginBottom: ".8rem" },
  pill: { fontSize: ".72rem", fontWeight: 600, padding: ".15rem .55rem", borderRadius: 999, background: "#f1f1f1", color: "#444" },
  pillMail: { background: "#dbeafe", color: "#1e40af" },
  q: { background: "#111", color: "#fff", padding: ".55rem .8rem", borderRadius: "12px 12px 12px 3px", fontSize: ".86rem", maxWidth: "85%", whiteSpace: "pre-wrap", marginBottom: ".45rem" },
  a: { background: "#f4f4f5", color: "#18181b", padding: ".55rem .8rem", borderRadius: "12px 12px 3px 12px", fontSize: ".86rem", maxWidth: "85%", whiteSpace: "pre-wrap", marginBottom: ".9rem", marginLeft: "auto" },
  turnMeta: { fontSize: ".7rem", color: "#999", marginBottom: ".9rem", textAlign: "right" },
};
