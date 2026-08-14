import {
  readVisits,
  describeSource,
  kvConfigured,
  type Visit,
} from "../../lib/visits";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Visits",
  robots: { index: false, follow: false },
};

// Private dashboard. Gated by ANALYTICS_KEY, which must be supplied as ?key=…
// Without a correct key it renders a plain 404-style page and reveals nothing —
// not even that analytics exist here.

function Denied() {
  return (
    <main style={{ padding: "4rem 1.5rem", textAlign: "center", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>404 — Not found</h1>
    </main>
  );
}

function since(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function count<T extends string>(rows: T[]): [T, number][] {
  const m = new Map<T, number>();
  rows.forEach((r) => m.set(r, (m.get(r) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.ANALYTICS_KEY;

  if (!secret || !key || key !== secret) return <Denied />;

  if (!kvConfigured) {
    return (
      <main style={S.page}>
        <h1 style={S.h1}>Visits</h1>
        <p style={S.warn}>
          No Redis store connected. In the Vercel dashboard go to{" "}
          <strong>Storage → Browse Storage → Upstash → Redis</strong> and create
          one, then redeploy. It sets the connection variables automatically
          (either <code>UPSTASH_REDIS_REST_*</code> or <code>KV_REST_API_*</code>{" "}
          — both are accepted). Until then nothing is being recorded, and the
          rest of the site is unaffected.
        </p>
      </main>
    );
  }

  const visits: Visit[] = await readVisits();
  const now = Date.now();
  const day = 86_400_000;

  const last24 = visits.filter((v) => now - v.t < day).length;
  const last7d = visits.filter((v) => now - v.t < 7 * day).length;
  const fromEmail = visits.filter((v) => describeSource(v.ref).email);

  const countries = count(visits.map((v) => v.country || "??").filter(Boolean));
  const pages = count(visits.map((v) => v.path));
  const sources = count(visits.map((v) => describeSource(v.ref).label));

  return (
    <main style={S.page}>
      <h1 style={S.h1}>Visits</h1>
      <p style={S.sub}>
        {visits.length} recorded · newest first · bots filtered · no IPs, no cookies
      </p>

      <div style={S.cards}>
        <Card label="Last 24 hours" value={last24} />
        <Card label="Last 7 days" value={last7d} />
        <Card label="Total stored" value={visits.length} />
        <Card label="📧 From email links" value={fromEmail.length} highlight />
      </div>

      {fromEmail.length > 0 && (
        <>
          <h2 style={S.h2}>📧 Arrived from an email client</h2>
          <p style={S.note}>
            The ones that matter — a professor following the link in your
            signature shows up here.
          </p>
          <Table
            rows={fromEmail.slice(0, 25).map((v) => [
              since(v.t),
              v.path,
              [v.city, v.country].filter(Boolean).join(", ") || "—",
              describeSource(v.ref).label,
            ])}
          />
        </>
      )}

      <div style={S.grid}>
        <Panel title="Countries" rows={countries.slice(0, 12)} />
        <Panel title="Pages" rows={pages.slice(0, 12)} />
        <Panel title="Sources" rows={sources.slice(0, 12)} />
      </div>

      <h2 style={S.h2}>Recent visits</h2>
      <Table
        rows={visits.slice(0, 100).map((v) => [
          since(v.t),
          v.path,
          [v.city, v.country].filter(Boolean).join(", ") || "—",
          describeSource(v.ref).label,
        ])}
      />
    </main>
  );
}

function Card({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div style={{ ...S.card, ...(highlight ? S.cardHi : {}) }}>
      <div style={S.cardVal}>{value}</div>
      <div style={S.cardLab}>{label}</div>
    </div>
  );
}

function Panel({ title, rows }: { title: string; rows: [string, number][] }) {
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

function Table({ rows }: { rows: string[][] }) {
  if (rows.length === 0) return <p style={S.note}>Nothing recorded yet.</p>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={S.table}>
        <thead>
          <tr>
            {["When", "Page", "Where", "Came from"].map((h) => (
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

const S: Record<string, React.CSSProperties> = {
  page: { maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.25rem", fontFamily: "system-ui, sans-serif", color: "#111" },
  h1: { fontSize: "1.7rem", fontWeight: 700, marginBottom: ".25rem" },
  h2: { fontSize: "1.1rem", fontWeight: 600, margin: "2rem 0 .5rem" },
  h3: { fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#666", marginBottom: ".6rem" },
  sub: { color: "#666", fontSize: ".88rem", marginBottom: "1.5rem" },
  note: { color: "#777", fontSize: ".82rem", margin: "0 0 .75rem" },
  warn: { background: "#fff8e1", border: "1px solid #ffe082", padding: "1rem", borderRadius: 10, fontSize: ".9rem", lineHeight: 1.6 },
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
  td: { padding: ".45rem .6rem", borderBottom: "1px solid #f2f2f2", whiteSpace: "nowrap" },
};
