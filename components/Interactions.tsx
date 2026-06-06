"use client";

import { useEffect } from "react";

// Progressive-enhancement behaviors ported verbatim from the mockup:
// nav shadow on scroll, scroll-reveal, and the projects filter.
export default function Interactions() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const filters = document.getElementById("filters");
    const cards = Array.from(document.querySelectorAll<HTMLElement>("#projGrid .card"));
    const onFilter = (ev: Event) => {
      const b = (ev.target as HTMLElement).closest<HTMLElement>(".filter");
      if (!b) return;
      filters?.querySelectorAll(".filter").forEach((f) => f.classList.remove("active"));
      b.classList.add("active");
      const f = b.dataset.f;
      cards.forEach((c) =>
        c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f)
      );
    };
    filters?.addEventListener("click", onFilter);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      filters?.removeEventListener("click", onFilter);
    };
  }, []);

  return null;
}
