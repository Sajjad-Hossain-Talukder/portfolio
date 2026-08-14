import {
  readVisits,
  describeSource,
  deviceOf,
  browserOf,
  placeOf,
  kvConfigured,
  type Visit,
} from "../../lib/visits";
import { readChatTurns, groupConversations } from "../../lib/chats";
import {
  Denied,
  NoStore,
  Tabs,
  Card,
  Panel,
  Table,
  count,
  since,
  exact,
  S,
} from "./ui";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Visits",
  robots: { index: false, follow: false },
};

// Private dashboard. Gated by ANALYTICS_KEY, which must be supplied as ?key=…
// Without a correct key it renders a plain 404-style page and reveals nothing —
// not even that analytics exist here.

export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.ANALYTICS_KEY;

  if (!secret || !key || key !== secret) return <Denied />;
  if (!kvConfigured) return <NoStore />;

  const [visits, turns] = await Promise.all([readVisits(), readChatTurns()]);
  const convos = groupConversations(turns);

  const now = Date.now();
  const day = 86_400_000;

  const last24 = visits.filter((v) => now - v.t < day).length;
  const last7d = visits.filter((v) => now - v.t < 7 * day).length;
  const fromEmail = visits.filter((v) => describeSource(v.ref).email);
  const uniqueIps = new Set(visits.map((v) => v.ip).filter((i) => i && i !== "unknown"));

  const countries = count(visits.map((v) => v.country || "??"));
  const pages = count(visits.map((v) => v.path));
  const sources = count(visits.map((v) => describeSource(v.ref).label));
  const devices = count(visits.map((v) => deviceOf(v.ua)));
  const topIps = count(visits.map((v) => v.ip || "unknown"));

  const row = (v: Visit) => [
    <>
      <div>{exact(v.t)}</div>
      <div style={S.dim}>{since(v.t)}</div>
    </>,
    <span style={S.mono}>{v.ip || "—"}</span>,
    <>
      <div>{placeOf(v)}</div>
      {v.tz && <div style={S.dim}>{v.tz}</div>}
    </>,
    v.path,
    describeSource(v.ref).label,
    <>
      <div>{deviceOf(v.ua)}</div>
      <div style={S.dim}>{browserOf(v.ua)}</div>
    </>,
  ];

  const HEAD = ["When (Dhaka)", "IP", "Where", "Page", "Came from", "Device"];

  return (
    <main style={S.page}>
      <h1 style={S.h1}>Visits</h1>
      <p style={S.sub}>
        {visits.length} recorded · {uniqueIps.size} unique IPs · newest first ·
        bots filtered · times shown in Dhaka
      </p>

      <Tabs active="visits" secret={key} chats={convos.length} />

      <div style={S.cards}>
        <Card label="Last 24 hours" value={last24} />
        <Card label="Last 7 days" value={last7d} />
        <Card label="Unique IPs" value={uniqueIps.size} />
        <Card label="Total stored" value={visits.length} />
        <Card label="📧 From email links" value={fromEmail.length} highlight />
        <Card label="💬 Chat conversations" value={convos.length} highlight />
      </div>

      {fromEmail.length > 0 && (
        <>
          <h2 style={S.h2}>📧 Arrived from an email client</h2>
          <p style={S.note}>
            The ones that matter — a professor following the link in your
            signature shows up here.
          </p>
          <Table head={HEAD} rows={fromEmail.slice(0, 25).map(row)} />
        </>
      )}

      <div style={S.grid}>
        <Panel title="Countries" rows={countries.slice(0, 12)} />
        <Panel title="Pages" rows={pages.slice(0, 12)} />
        <Panel title="Sources" rows={sources.slice(0, 12)} />
        <Panel title="Devices" rows={devices.slice(0, 12)} />
        <Panel title="Most frequent IPs" rows={topIps.slice(0, 12)} />
      </div>

      <h2 style={S.h2}>Recent visits</h2>
      <Table head={HEAD} rows={visits.slice(0, 200).map(row)} />
    </main>
  );
}
