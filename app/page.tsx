import ContestDetails from "@/components/ContestDetails";
import DownloadCV from "@/components/DownloadCV";
import { FACTS } from "@/lib/facts.generated";

// Everything factual below comes from FACTS, which is generated from the CV
// data file (`npm run sync`). Hard-coding facts here is what let the page drift
// to IELTS 6.5 and a 2024 graduation. Prose is hand-written; numbers are not.
const link = (label: string) =>
  FACTS.profiles.find((p) => p.label === label)?.url ?? "#";

// Project cards are hand-curated (the site shows more than the 2-page CV has
// room for), but their links come from the CV so they cannot go stale.
// Matched on the card title being the start of the CV's project name.
const projUrl = (cardTitle: string) =>
  FACTS.projects.find((p) => p.name.startsWith(cardTitle))?.url ?? "";

// The certificate that carries a per-skill breakdown (IELTS). Optional —
// every consumer must handle it being absent.
const IELTS = FACTS.certifications.find((c) => c.bands.length > 0);

const ieltsBand =
  FACTS.certifications
    .find((c) => /IELTS/i.test(c.name))
    ?.name.match(/Band\s+([\d.]+)/)?.[1] ?? "";

// Years of professional experience, counted from the earliest dated role
// rather than asserted. Add earlier work to personal.yaml to raise it.
const yearsExperience = (() => {
  const years = FACTS.experience
    .map((e) => Number(/\b(\d{4})\b/.exec(e.when)?.[1]))
    .filter((y) => Number.isFinite(y));
  if (!years.length) return "";
  return `${Math.max(1, new Date().getFullYear() - Math.min(...years))}+ years`;
})();

// Presentation only — which chips sit under a role. Keyed by employer so it
// survives a re-sync. An employer with no entry simply shows no tags.
const ROLE_TAGS: Record<string, string[]> = {
  Pivotly: ["Agentic AI", "LLM", "Node.js", "Cloud"],
  "Silicon Orchard Ltd.": ["Swift", "React Native", "REST APIs"],
  Xotech: ["iOS", "UIKit", "Laravel"],
};

// Icons for the skill groups the CV defines. Unknown groups fall back to 🧰.
const SKILL_ICONS: Record<string, string> = {
  "Research & Simulation": "🔬",
  Languages: "🧩",
  "Frameworks & Backend": "⚙️",
  "AI & Systems": "🤖",
  "Cloud & DevOps": "☁️",
};

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <a className="brand" href="#top">
          <img className="brand-logo" src="/images/logo.png" alt="Sajjad Hossain Talukder — SHT monogram" suppressHydrationWarning />
          Sajjad Hossain Talukder
        </a>
        <div className="navlinks">
          <a href="#about">About</a>
          <a href="#academics">Research</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact" className="nav-cta">Get in touch</a>
        </div>
        <button className="burger" aria-label="menu">☰</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hello">Hello, I&apos;m</div>
            <h1>Sajjad Hossain <span className="grad">Talukder</span></h1>
            <div className="role">A <b>CS Researcher</b> &amp; <b>Full-Stack Engineer</b></div>
            <p className="lede"><strong>First-in-class CS graduate</strong> and ICPC Asia-West finalist. I research at the intersection of <strong>AI &amp; networking</strong> — and build <strong>production-grade software</strong> end to end, from cloud backends to AI/LLM automation.</p>
            <div className="hero-cta">
              <a href="#projects" className="btn primary">View my work →</a>
              <DownloadCV />
            </div>
            <div className="socials">
              <a href={link("GitHub")} target="_blank" rel="noreferrer" title="GitHub"><svg viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" /></svg></a>
              <a href={link("LinkedIn")} target="_blank" rel="noreferrer" title="LinkedIn"><svg viewBox="0 0 24 24"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7 20.4H3.5V9H7v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" /></svg></a>
              <a href={link("Google Scholar")} target="_blank" rel="noreferrer" title="Google Scholar"><svg viewBox="0 0 24 24"><path d="M12 2 1 8l11 6 9-4.91V17h2V8L12 2zM6 13.24v3.02c0 1.93 2.69 3.49 6 3.49s6-1.56 6-3.49v-3.02l-6 3.27-6-3.27z" /></svg></a>
              <a href={link("ORCID")} target="_blank" rel="noreferrer" title="ORCID iD"><svg viewBox="0 0 24 24"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.412 17.626H5.625V8.184h1.787v9.442zM6.518 6.982a1.109 1.109 0 1 1 0-2.218 1.109 1.109 0 0 1 0 2.218zm3.964 1.202h3.673c3.497 0 5.033 2.5 5.033 4.723 0 2.416-1.889 4.723-5.015 4.723h-3.691V8.184zm1.787 1.616v6.21h1.756c2.503 0 3.076-1.9 3.076-3.105 0-1.962-1.25-3.105-3.14-3.105h-1.692z" /></svg></a>
              <a href={link("Codeforces")} target="_blank" rel="noreferrer" title="Codeforces"><svg viewBox="0 0 24 24"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" /></svg></a>
              <a href={link("LeetCode")} target="_blank" rel="noreferrer" title="LeetCode"><svg viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg></a>
              <a href="mailto:sajjadhossain.cse35@gmail.com" title="Email"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg></a>
            </div>
          </div>

          <div className="photo-wrap">
            <img src="/images/profile-cutout.png" alt="Sajjad Hossain Talukder" suppressHydrationWarning />
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section style={{ paddingTop: "30px" }}>
        <div className="do-grid">
          <div className="do-card reveal">
            <div className="ic">🔬</div>
            <h3>Researcher</h3>
            <p>Peer-reviewed work in AI &amp; networking, including a paper published in IEEE Transactions on Mobile Computing.</p>
          </div>
          <div className="do-card reveal">
            <div className="ic">💻</div>
            <h3>Full-Stack Engineer</h3>
            <p>Cloud backends, AI/LLM automation, and cross-platform web &amp; mobile apps — built and shipped end to end.</p>
          </div>
          <div className="do-card reveal">
            <div className="ic">🧠</div>
            <h3>Problem Solver</h3>
            <p>ICPC Asia-West finalist with 1000+ problems solved — and three years training university CP teams.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="reveal">
        <div className="eyebrow">About</div>
        <h2 className="section-title">Engineer, Researcher, Problem Solver</h2>
        <div className="about-grid" style={{ marginTop: "30px" }}>
          <div>
            <p className="pull">&quot;I came up through competitive programming — that habit of breaking hard problems into clean, provable steps shapes everything I do.&quot;</p>
            <p>I&apos;m a software engineer and CS researcher from Chattogram, Bangladesh, who finished <strong>first in my batch</strong>. I like owning systems <strong>end to end</strong> — from the database and cloud up to the web, mobile, and AI layers users actually touch — and lately my focus is <strong>agentic AI and LLM-driven automation</strong>.</p>
            <p>My foundation is <strong>algorithmic problem-solving</strong> — an ICPC Asia-West finalist who has solved over a thousand problems — which carries into both my engineering and my <strong>research</strong> in AI &amp; networking (a paper published in IEEE Transactions on Mobile Computing).</p>
            <p>I&apos;ve shipped real products across web, iOS, and the App Store, and today I build AI backends remotely for a US startup. I also care deeply about <strong>mentorship</strong> — I spent three years training my university&apos;s competitive-programming teams.</p>
          </div>
          <div className="info-card">
            <h4>// at a glance</h4>
            <div className="info-row"><span>Based in</span><span>Chattogram, BD</span></div>
            <div className="info-row"><span>Experience</span><span>{yearsExperience}</span></div>
            <div className="info-row"><span>Education</span><span>BSc CSE · CGPA 3.98/4.00</span></div>
            <div className="info-row"><span>Focus</span><span>AI · Full-stack</span></div>
            <div className="info-row"><span>Research</span><span>AI · Networking</span></div>
            <div className="info-row"><span>Languages</span><span>Bengali · English (IELTS {ieltsBand})</span></div>
          </div>
        </div>
      </section>

      {/* ACADEMICS & RESEARCH */}
      <div className="band"><section id="academics" className="inner reveal">
        <div className="eyebrow">Academics &amp; Research</div>
        <h2 className="section-title">Education</h2>
        <p className="section-sub">A strong academic record paired with peer-reviewed research in AI and networking.</p>
        <ul className="hlist">
          {FACTS.education.map((e) => (
            <li className="entry" key={e.degree}>
              <div className="when">{e.when}</div>
              <div>
                <h3>{e.degree}</h3>
                <div className="org">{[e.institution, e.location].filter(Boolean).join(", ")}</div>
                <p>Undergraduate thesis: <em>Performance-Driven Adaptive Forwarding in SDN-Assisted NDN-MANETs.</em></p>
                <span className="honor">🎓 First Rank in Batch</span>
                <span className="honor">📊 CGPA 3.98 / 4.00</span>
                <span className="honor">🏅 Merit-Based Scholarship</span>
                {/* IELTS lives in its own block below — no need to repeat it here. */}
              </div>
            </li>
          ))}
        </ul>

        <h3 className="sub-h">Research Experience</h3>
        <ul className="hlist">
          {FACTS.research.map((r) => (
            <li className="entry" key={r.title}>
              <div className="when">{r.when}</div>
              <div>
                <h3>{r.title}</h3>
                {r.organization && <div className="org">{r.organization}</div>}
                {r.details.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <h3 className="sub-h">Publications</h3>
        {FACTS.publications.map((p) => {
          // FACTS is `as const`, so `p.url` is a literal type. Narrowing on it
          // directly narrows `p` itself, and once every publication has a URL
          // the else branch becomes `never`. Widening to a local keeps the
          // fallback compiling for a future entry that has no link.
          const url: string | undefined = p.url;
          return (
          <div className="pub" key={p.title}>
            <div className="venue">{p.venue}</div>
            <h3>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer">{p.title}</a>
              ) : (
                p.title
              )}
            </h3>
            <p>{p.authors}</p>
            <span className="status">
              {[p.year, p.status].filter(Boolean).join(" · ")}
            </span>
          </div>
          );
        })}

        <h3 className="sub-h">Research Interests</h3>
        <div className="interests">
          {FACTS.interests.map((i) => (
            <span className="interest" key={i}>{i}</span>
          ))}
        </div>

        <h3 className="sub-h">Languages</h3>
        <div className="card cp-card">
          <ul className="cp-list">
            {FACTS.languages.map((l) => {
              // The IELTS breakdown hangs off the English row rather than
              // living in its own card — a second card for two lines of text
              // left most of a column empty.
              const showIelts = /english/i.test(l.name) && IELTS !== undefined;
              return (
                <li key={l.name} className={showIelts ? "lang-en" : undefined}>
                  <span className="cp-label"><b>{l.name}</b></span>
                  {/* The CV stores English as "C1 (CEFR) — IELTS …, Band 7.0 …".
                      Only the level belongs here; the bands are below. */}
                  <span className="cp-val txt">{l.level.split("—")[0].trim()}</span>
                  {showIelts && IELTS && (
                    <div className="ielts-row">
                      <span className="ielts-cap">
                        {IELTS.name.split("—")[0].trim()}
                        {IELTS.testDate && ` · ${IELTS.testDate}`}
                        {IELTS.issuer && ` · ${IELTS.issuer.split("·")[0].trim()}`}
                      </span>
                      {IELTS.bands.map((b) => (
                        <span className="ielts-pill" key={b.skill}>
                          {b.skill}<b>{b.band}</b>
                        </span>
                      ))}
                      <span className="ielts-pill total">
                        Overall<b>{IELTS.overall}</b>
                      </span>
                      {IELTS.url && (
                        <a
                          className="trf-link"
                          href={IELTS.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View TRF ↗
                        </a>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

      </section></div>

      {/* EXPERIENCE */}
      <section id="experience" className="reveal">
        <div className="eyebrow">Experience</div>
        <h2 className="section-title">Professional engineering</h2>
        <p className="section-sub">Building real products end to end — across AI, cloud, web, and mobile.</p>
        <ul className="hlist">
          {FACTS.experience.map((x) => (
            <li className="entry" key={`${x.title}-${x.organization}`}>
              <div className="when">{x.when}</div>
              <div>
                <h3>{x.title} · {x.organization}</h3>
                <div className="org">{x.location}</div>
                {x.details.map((d) => (
                  <p key={d}>{d}</p>
                ))}
                <div className="tags">
                  {(ROLE_TAGS[x.organization] ?? []).map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* SKILLS */}
      <div className="band"><section id="skills" className="inner reveal">
        <div className="eyebrow">Toolkit</div>
        <h2 className="section-title">Skills &amp; technologies</h2>
        <p className="section-sub">A full-stack toolkit spanning AI, backend, frontend, mobile, and cloud.</p>
        <div className="skills-grid">
          {FACTS.skills.map((g) => (
            <div className="skill-cat" key={g.category}>
              <h4>{SKILL_ICONS[g.category] ?? "🧰"} {g.category}</h4>
              <div className="chips">
                {g.items.map((it) => (
                  <span className="chip" key={it}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section></div>

      {/* PROBLEM SOLVING */}
      <section id="problem-solving" className="reveal">
        <div className="eyebrow">Problem Solving</div>
        <h2 className="section-title">Competitive Programming</h2>
        <p className="section-sub">Years of algorithmic problem-solving — the discipline behind my research and engineering.</p>
        <div className="grid2">
          <div className="card cp-card">
            <header className="cp-head">
              <span className="cp-ic">🏆</span>
              <div>
                <h3>Contest Highlights</h3>
                <p>National &amp; regional results</p>
              </div>
            </header>
            <ul className="cp-list">
              <li><span className="cp-label"><b>ICPC</b> Asia-West Finalist</span><span className="cp-val">2022</span></li>
              <li><span className="cp-label"><b>ICPC</b> Dhaka Regional <span style={{ opacity: 0.7 }}>(best)</span></span><span className="cp-val">52nd</span></li>
              <li><span className="cp-label"><b>Dhaka</b> Online Preliminary</span><span className="cp-val">76<span className="sep">/</span>2481</span></li>
              <li><span className="cp-label">Team — <b>PUC Eternals</b></span><span className="cp-val txt">Lead</span></li>
            </ul>
            <ContestDetails groups={FACTS.contests} />
          </div>
          <div className="card cp-card">
            <header className="cp-head">
              <span className="cp-ic">⚡</span>
              <div>
                <h3>Ratings &amp; Practice</h3>
                <p>Consistent practice across judges</p>
              </div>
            </header>
            <ul className="cp-list">
              <li><span className="cp-label"><b>Codeforces</b> — Specialist</span><span className="cp-val"><span className="u">max</span>1417</span></li>
              <li><span className="cp-label"><b>CodeChef</b> — 3 Star</span><span className="cp-val"><span className="u">max</span>1721</span></li>
              <li><span className="cp-label"><b>Problems</b> solved</span><span className="cp-val">1000+</span></li>
              <li><span className="cp-label"><b>Active</b> on</span><span className="cp-val txt">LeetCode · TOPH</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <div className="band"><section id="projects" className="inner reveal center-head">
        <div className="eyebrow center">Selected Projects</div>
        <h2 className="section-title">My amazing works</h2>
        <p className="section-sub">A selection of personal &amp; open-source projects across AI, web, mobile, and IoT.</p>
        <div className="filters" id="filters">
          <button className="filter active" data-f="all">All</button>
          <button className="filter" data-f="ai">AI / ML</button>
          <button className="filter" data-f="web">Web</button>
          <button className="filter" data-f="mobile">Mobile</button>
          <button className="filter" data-f="iot">IoT</button>
        </div>
        <div className="grid3" id="projGrid" style={{ textAlign: "left" }}>
          <div className="card" data-cat="ai">
            <div className="top"><span className="ico">🎓</span><span className="badge">Agentic AI</span></div>
            <h3>{projUrl("Grade Now") ? (
              <a href={projUrl("Grade Now")} target="_blank" rel="noreferrer">Grade Now ↗</a>
            ) : "Grade Now"}</h3>
            <p>AI grading platform evaluating answer scripts against AI-generated rubrics via a parallel, multi-stage agentic pipeline.</p>
            <div className="tags"><span className="tag">LLM</span><span className="tag">Next.js</span><span className="tag">AWS</span></div>
          </div>
          <div className="card" data-cat="web">
            <div className="top"><span className="ico">📝</span><span className="badge live">● Live</span></div>
            <h3>{projUrl("IELTS Pro BD") ? (
              <a href={projUrl("IELTS Pro BD")} target="_blank" rel="noreferrer">IELTS Pro BD ↗</a>
            ) : "IELTS Pro BD"}</h3>
            <p>A live computer-delivered mock-IELTS platform with a flexible test-engine editor, student management, and billing.</p>
            <div className="tags"><span className="tag">Next.js</span><span className="tag">Node.js</span></div>
          </div>
          <div className="card" data-cat="web">
            <div className="top"><span className="ico">⚖️</span><span className="badge">Full-stack</span></div>
            <h3>{projUrl("Connect My Advocate") ? (
              <a href={projUrl("Connect My Advocate")} target="_blank" rel="noreferrer">Connect My Advocate ↗</a>
            ) : "Connect My Advocate"}</h3>
            <p>A legal-aid platform with real-time video consultation — client web, mobile, and admin apps, built solo end to end.</p>
            <div className="tags"><span className="tag">Agora SDK</span><span className="tag">AWS</span></div>
          </div>
          <div className="card" data-cat="web">
            <div className="top"><span className="ico">📄</span><span className="badge">Open source</span></div>
            <h3>CV-Forge</h3>
            <p>Open-source tool generating scholarship-tailored CVs (Europass, academic &amp; more) from one structured data source.</p>
            <div className="tags"><span className="tag">Python</span><span className="tag">LaTeX</span></div>
          </div>
          <div className="card" data-cat="mobile">
            <div className="top"><span className="ico">🎬</span><span className="badge">App Store</span></div>
            <h3>DUB it! — AI Translator</h3>
            <p>An AI dubbing iOS app for lip-synced video translation with voice cloning and subscription monetization.</p>
            <div className="tags"><span className="tag">Swift</span><span className="tag">AI Services</span></div>
          </div>
          <div className="card" data-cat="iot">
            <div className="top"><span className="ico">🔧</span><span className="badge">IoT · CV</span></div>
            <h3>{projUrl("SmartWeight") ? (
              <a href={projUrl("SmartWeight")} target="_blank" rel="noreferrer">SmartWeight ↗</a>
            ) : "SmartWeight"}</h3>
            <p>Edge-vision weighing system fusing real-time OpenCV object detection with weight sensors on Raspberry Pi.</p>
            <div className="tags"><span className="tag">OpenCV</span><span className="tag">Raspberry Pi</span></div>
          </div>
        </div>
      </section></div>

      {/* LEADERSHIP & COMMUNITY — clubs come from the CV data, memberships
          from `memberships` in the same file. This was two sections: a
          hardcoded one and a generated one listing the same two clubs. */}
      <section id="leadership" className="reveal">
        <div className="eyebrow">Leadership &amp; Community</div>
        <h2 className="section-title">Mentoring &amp; co-curricular</h2>
        <p className="section-sub">Giving back through teaching, organizing, and student leadership.</p>
        <ul className="hlist">
          {FACTS.organizations.map((o) => {
            // Widened to `string` on purpose: FACTS is `as const`, so every url
            // is a literal truthy type and TypeScript proves the no-link branch
            // unreachable — narrowing `o` itself to `never`. Keep the fallback
            // working for a future entry that has no page.
            const url: string = o.url;
            return (
              <li className="entry" key={`${o.title}-${o.name}`}>
                <div className="when">{o.when}</div>
                <div>
                  <h3>{o.title}</h3>
                  <div className="org">
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer">{o.name} ↗</a>
                    ) : (
                      o.name
                    )}
                  </div>
                  {o.summary && <p>{o.summary}</p>}
                </div>
              </li>
            );
          })}
          {FACTS.memberships.map((m) => (
            <li className="entry" key={`${m.role}-${m.name}`}>
              <div className="when">{m.when}</div>
              <div>
                <h3>{m.role}</h3>
                <div className="org">{m.name}</div>
                {m.summary && <p>{m.summary}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact reveal">
        <div className="hello">Let&apos;s talk</div>
        <h2>Let&apos;s build something <span className="grad">great</span>.</h2>
        <p>I&apos;m open to engineering roles, research collaborations, and interesting problems. Reach me by email — or ask <b>Chiki</b>, my AI assistant, anything in the corner. 👉</p>
        <div className="hero-cta" style={{ justifyContent: "center" }}>
          <a href={`mailto:${FACTS.email}`} className="btn primary">✉ Email me</a>
          <a href={link("LinkedIn")} target="_blank" rel="noreferrer" className="btn ghost">LinkedIn ↗</a>
          <a href={link("Google Scholar")} target="_blank" rel="noreferrer" className="btn ghost">Google Scholar ↗</a>
        </div>
      </section>

      <footer>Designed &amp; built by Sajjad Hossain Talukder · sajjadhossaintalukder.com · © 2026</footer>
    </>
  );
}
