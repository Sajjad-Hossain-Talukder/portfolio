"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Entry = {
  readonly event: string;
  readonly year: string;
  readonly team: string;
  readonly result: string;
};
type Group = {
  readonly group: string;
  readonly note: string;
  readonly entries: readonly Entry[];
};

/**
 * "Details" button + modal holding the full contest history.
 *
 * The Contest Highlights card shows three results, which reads as though the
 * participation stopped. The record is seven ICPC appearances across four
 * years plus NCPC and IUPC — worth showing, but not worth the vertical space
 * on the page itself.
 */
export default function ContestDetails({ groups }: { groups: readonly Group[] }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // The overlay is portalled to <body>, so it must only render after mount —
  // document does not exist during the server render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);

    // Stop the page scrolling behind the dialog. Hiding overflow removes the
    // scrollbar, which widens the viewport and makes the whole page jump — the
    // flicker on open. Pad the body by exactly the scrollbar width to hold it
    // still.
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onEsc);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      // Send focus back where it came from, or a keyboard user is stranded.
      openerRef.current?.focus();
    };
  }, [open]);

  if (!groups.length) return null;

  return (
    <>
      <button
        type="button"
        className="ct-more"
        ref={openerRef}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {/* Deliberately not "all N contests": the IUPC group is a note without
            countable entries, so any number here would undercount. */}
        Details — full contest history →
      </button>

      {/* Portalled to <body>. Rendered in place, the fixed backdrop is trapped
          inside the card: any ancestor with a transform (the .reveal scroll
          animation sets one) becomes the containing block for position:fixed,
          so the overlay covered only the card instead of the viewport. */}
      {mounted &&
        open &&
        createPortal(
          <div
            className="ct-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="ct-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ct-title"
            >
              <header className="ct-head">
                <div>
                  <h3 id="ct-title">Contest history</h3>
                  <p>Every ICPC, NCPC and IUPC appearance</p>
                </div>
                <button
                  ref={closeRef}
                  className="ct-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close contest history"
                >
                  ×
                </button>
              </header>

              <div className="ct-body">
                {groups.map((g) => (
                  <section className="ct-group" key={g.group}>
                    <h4>{g.group}</h4>
                    {g.entries.length > 0 && (
                      <ul className="ct-list">
                        {g.entries.map((e, i) => (
                          <li key={`${e.event}-${e.year}-${i}`}>
                            <span className="ct-year">{e.year}</span>
                            <span className="ct-main">
                              <b>{e.event}</b>
                              {e.result && <em>{e.result}</em>}
                            </span>
                            {e.team && <span className="ct-team">{e.team}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    {g.note && <p className="ct-note">{g.note}</p>}
                  </section>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
