"use client";

import { useEffect, useRef, useState } from "react";

const CVS = [
  {
    label: "Europass CV",
    desc: "EU academic / scholarship format",
    icon: "🎓",
    href: "/cv/Sajjad-Hossain-Talukder-Europass-CV.pdf",
  },
  {
    label: "Professional CV",
    desc: "Concise industry résumé",
    icon: "💼",
    href: "/cv/Sajjad-Hossain-Talukder-CV.pdf",
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
