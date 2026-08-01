"use client";

import { useEffect, useRef, useState } from "react";

// All three are generated from one data file (CV/cv-generator). Replace them by
// re-running that generator and copying the PDFs here — do not hand-edit.
// Ordered by how often a visitor needs them: academics first, then Europe, then
// industry. `desc` says WHERE each one goes, since that is the actual question.
const CVS = [
  {
    label: "Academic CV",
    desc: "Professors, PhD & Master's applications",
    icon: "🎓",
    href: "/cv/Sajjad-Hossain-Talukder-Academic-CV.pdf",
  },
  {
    label: "Europass CV",
    desc: "European applications — DAAD, Erasmus, EU portals",
    icon: "🇪🇺",
    href: "/cv/Sajjad-Hossain-Talukder-Europass-CV.pdf",
  },
  {
    label: "Professional CV",
    desc: "Software engineering roles",
    icon: "💼",
    href: "/cv/Sajjad-Hossain-Talukder-Professional-CV.pdf",
  },
];

export default function DownloadCV() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="cv-dd" ref={ref}>
      <button
        type="button"
        className="btn ghost"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        ⤓ Download CV
      </button>
      {open && (
        <div className="cv-menu" role="menu">
          {CVS.map((cv) => (
            <a
              key={cv.href}
              href={cv.href}
              download
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="cv-ic">{cv.icon}</span>
              <span className="cv-txt">
                <b>{cv.label}</b>
                <small>{cv.desc}</small>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
