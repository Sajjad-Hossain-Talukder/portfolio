// Chiki conversation log.
//
// One row per exchange (question + answer), not per conversation, so the write
// path stays a plain append — the same LPUSH/LTRIM shape as the visit log, with
// no read-modify-write and no risk of two concurrent turns clobbering each
// other. Turns carry a session id and the dashboard regroups them, which is
// cheap at portfolio volume and needs no second key.
//
// ⚠️ PRIVACY: this stores what visitors typed, alongside their IP and coarse
// location. It is a record of real people's questions. Same GDPR note as
// visits.ts — see the header there.

import { kv, kvConfigured, pushCapped, readList } from "./kv";

/** Newest-first. Each row is at most ~5 KB, so this stays small. */
export const MAX_TURNS = 1000;
const KEY = "chats";

/** Long answers are capped before storage — the log is for reading, not replay. */
const MAX_Q = 2000;
const MAX_A = 4000;

export type ChatTurn = {
  sid: string; // conversation id, generated client-side per browser tab
  t: number; // epoch ms, when the answer finished
  ms: number; // how long the answer took
  q: string; // what they asked
  a: string; // what Chiki replied
  n: number; // turn number within the conversation, 1-based
  ip: string;
  country: string;
  region: string;
  city: string;
  tz: string;
  ref: string; // the ORIGINAL landing referrer, captured client-side
  page: string; // page they were on when they opened the chat
  ua: string;
};

export async function recordChatTurn(turn: ChatTurn): Promise<void> {
  await pushCapped(
    KEY,
    { ...turn, q: turn.q.slice(0, MAX_Q), a: turn.a.slice(0, MAX_A) },
    MAX_TURNS,
  );
}

export async function readChatTurns(limit = MAX_TURNS): Promise<ChatTurn[]> {
  return readList<ChatTurn>(KEY, limit);
}

export async function clearChats(): Promise<void> {
  if (!kvConfigured) return;
  try {
    await kv(["DEL", KEY]);
  } catch {
    /* ignore */
  }
}

export type Conversation = {
  sid: string;
  turns: ChatTurn[];
  startedAt: number;
  endedAt: number;
  ip: string;
  country: string;
  region: string;
  city: string;
  tz: string;
  ref: string;
  ua: string;
};

/**
 * Regroup a flat turn list into conversations, newest conversation first and
 * turns in the order they were actually asked. Identity fields are taken from
 * the first turn, which is the one that carries the true landing referrer.
 */
export function groupConversations(turns: ChatTurn[]): Conversation[] {
  const bySid = new Map<string, ChatTurn[]>();
  for (const t of turns) {
    const list = bySid.get(t.sid);
    if (list) list.push(t);
    else bySid.set(t.sid, [t]);
  }

  const convos: Conversation[] = [];
  for (const [sid, list] of bySid) {
    list.sort((a, b) => a.t - b.t);
    const first = list[0];
    convos.push({
      sid,
      turns: list,
      startedAt: first.t,
      endedAt: list[list.length - 1].t,
      ip: first.ip,
      country: first.country,
      region: first.region,
      city: first.city,
      tz: first.tz,
      ref: first.ref,
      ua: first.ua,
    });
  }

  return convos.sort((a, b) => b.endedAt - a.endedAt);
}
