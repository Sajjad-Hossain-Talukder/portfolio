"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string };

/** The bot is told to write plain text, but models slip back into markdown on
 *  long technical answers. Replies render verbatim, so leftover syntax would
 *  show up as literal ** and \_ on the page. Strip the common cases. */
export function plain(text: string): string {
  return text
    // Models occasionally open with "Chiki:" despite the rule — the UI
    // already labels the speaker, so it reads as a stutter.
    .replace(/^\s*chiki\s*:\s*/i, "")
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/\*\*(.+?)\*\*/gs, "$1")
    .replace(/(^|\s)\*(\S.*?\S)\*(?=\s|$)/gs, "$1$2")
    // Any indent, not just three spaces: nested markdown lists indent by four
    // and the first version of this let "    *   CHR" straight through.
    .replace(/^[ \t]*#{1,6}\s+/gm, "")
    .replace(/^[ \t]*[-*•]\s+/gm, "")
    .replace(/^[ \t]*\d+\.\s+/gm, "")
    .replace(/\\([_*#`[\]()])/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

const CHIPS = [
  "What's your AI experience?",
  "Tell me about your research",
  "Strongest project?",
  "Are you open to work?",
];

export default function Chiki() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const history: Msg[] = [...messages, { role: "user", text: q }];
    setMessages([...history, { role: "bot", text: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chiki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => {
          const c = m.slice();
          c[c.length - 1] = { role: "bot", text: acc };
          return c;
        });
      }
      if (!acc.trim()) {
        setMessages((m) => {
          const c = m.slice();
          c[c.length - 1] = {
            role: "bot",
            text: "Could you rephrase that? You can also email Sajjad at sajjadhossain.cse35@gmail.com.",
          };
          return c;
        });
      }
    } catch {
      setMessages((m) => {
        const c = m.slice();
        c[c.length - 1] = {
          role: "bot",
          text: "Sorry — I couldn't reach the server. Please try again in a moment, or email sajjadhossain.cse35@gmail.com.",
        };
        return c;
      });
    } finally {
      setLoading(false);
    }
  }

  function openChat() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  return (
    <>
      <button
        className={"chat-fab" + (open ? " hide" : "")}
        onClick={openChat}
        aria-label="Open chat with Chiki"
      >
        <span className="fab-ic">
          <svg viewBox="0 0 24 24">
            <path d="M12 3C6.5 3 2 6.6 2 11c0 2.1 1 4 2.7 5.4-.1 1.2-.6 2.3-1.3 3.1 1.5-.1 2.9-.6 4.1-1.4 1.1.3 2.3.5 3.5.5 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
          </svg>
        </span>
        <span className="fab-name">Chiki</span>
      </button>

      <div className={"chat-panel" + (open ? " open" : "")}>
        <div className="chat-head">
          <div className="av">🦊</div>
          <div className="meta">
            <b>Chiki</b>
            <small><span className="pulse"></span> Sajjad&apos;s AI · ask me anything</small>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
        </div>

        <div className="chat-body" ref={bodyRef}>
          <div className="msg bot">
            Hi there! 👋 I&apos;m <b>Chiki</b>, Sajjad&apos;s AI assistant. Ask me about his work, projects, research, or experience — anything you like!
          </div>
          {messages.map((m, i) =>
            m.role === "bot" && m.text === "" && loading && i === messages.length - 1 ? (
              <div key={i} className="msg bot typing"><span></span><span></span><span></span></div>
            ) : (
              <div key={i} className={"msg " + (m.role === "user" ? "user" : "bot")}>
                {m.role === "bot" ? plain(m.text) : m.text}
              </div>
            )
          )}
        </div>

        {messages.length === 0 && (
          <div className="chips-row">
            {CHIPS.map((c) => (
              <button key={c} className="qchip" onClick={() => send(c)}>{c}</button>
            ))}
          </div>
        )}

        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Chiki something…"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
          />
          <button onClick={() => send(input)} disabled={loading} aria-label="Send">↑</button>
        </div>
        <div className="chat-disclaimer">⚡ Chiki is AI, grounded in Sajjad&apos;s profile — it can occasionally be wrong.</div>
      </div>
    </>
  );
}
