import DownloadCV from "@/components/DownloadCV";

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
              <a href="https://github.com/" target="_blank" rel="noreferrer" title="GitHub"><svg viewBox="0 0 24 24"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" /></svg></a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" title="LinkedIn"><svg viewBox="0 0 24 24"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7 20.4H3.5V9H7v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" /></svg></a>
              <a href="https://codeforces.com/profile/SajjadHuseyn" target="_blank" rel="noreferrer" title="Codeforces"><svg viewBox="0 0 24 24"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" /></svg></a>
              <a href="https://leetcode.com/u/sajjadhuseyn/" target="_blank" rel="noreferrer" title="LeetCode"><svg viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg></a>
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
            <p>Peer-reviewed work in AI &amp; networking, including a paper under review at IEEE Transactions on Mobile Computing.</p>
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
            <p>My foundation is <strong>algorithmic problem-solving</strong> — an ICPC Asia-West finalist who has solved over a thousand problems — which carries into both my engineering and my <strong>research</strong> in AI &amp; networking (a paper under review at IEEE Transactions on Mobile Computing).</p>
            <p>I&apos;ve shipped real products across web, iOS, and the App Store, and today I build AI backends remotely for a US startup. I also care deeply about <strong>mentorship</strong> — I spent three years training my university&apos;s competitive-programming teams.</p>
          </div>
          <div className="info-card">
            <h4>// at a glance</h4>
            <div className="info-row"><span>Based in</span><span>Chattogram, BD</span></div>
            <div className="info-row"><span>Experience</span><span>4+ years</span></div>
            <div className="info-row"><span>Education</span><span>BSc CSE · 1st in batch</span></div>
            <div className="info-row"><span>Focus</span><span>AI · Full-stack</span></div>
            <div className="info-row"><span>Research</span><span>AI · Networking</span></div>
            <div className="info-row"><span>Languages</span><span>Bengali · English (IELTS 6.5)</span></div>
          </div>
        </div>
      </section>

      {/* ACADEMICS & RESEARCH */}
      <div className="band"><section id="academics" className="inner reveal">
        <div className="eyebrow">Academics &amp; Research</div>
        <h2 className="section-title">Education &amp; scholarship</h2>
        <p className="section-sub">A strong academic record paired with peer-reviewed research in AI and networking.</p>
        <ul className="hlist">
          <li className="entry">
            <div className="when">Jan 2019 — 2024</div>
            <div>
              <h3>BSc in Computer Science &amp; Engineering</h3>
              <div className="org">Premier University, Chattogram, Bangladesh</div>
              <p>Undergraduate thesis: <em>Performance-Driven Adaptive Forwarding in SDN-Assisted NDN-MANETs.</em></p>
              <span className="honor">🎓 First Rank in Batch</span>
              <span className="honor">🏅 Merit-Based Scholarship</span>
            </div>
          </li>
        </ul>
        <h3 className="sub-h">Publications</h3>
        <div className="pub">
          <div className="venue">IEEE Transactions on Mobile Computing</div>
          <h3>PDAF: Performance-Driven Adaptive Forwarding in SDN-Assisted NDN-MANETs</h3>
          <p>A performance-driven forwarding strategy leveraging SDN control to improve routing in NDN-based mobile ad-hoc networks.</p>
          <span className="status">Submitted Jan 2026 · Under Review</span>
        </div>
        <div className="pub">
          <div className="venue">ICIEV &amp; IVPR</div>
          <h3>Empowering Bengali Language in Drone Control with Artificial Neural Networks</h3>
          <p>Using artificial neural networks to enable Bengali-language voice control for drones.</p>
          <span className="status">Accepted</span>
        </div>
        <h3 className="sub-h">Research Interests</h3>
        <div className="interests">
          <span className="interest">Agentic AI</span>
          <span className="interest">Reinforcement Learning (DQN/DDQN)</span>
          <span className="interest">Named Data Networking</span>
          <span className="interest">Knowledge Graphs</span>
          <span className="interest">AI / ML</span>
          <span className="interest">Software-Defined Networking</span>
          <span className="interest">XR / AR / VR</span>
        </div>
      </section></div>

      {/* EXPERIENCE */}
      <section id="experience" className="reveal">
        <div className="eyebrow">Experience</div>
        <h2 className="section-title">Professional engineering</h2>
        <p className="section-sub">Building real products end to end — across AI, cloud, web, and mobile.</p>
        <ul className="hlist">
          <li className="entry">
            <div className="when">Nov 2025 — Present</div>
            <div>
              <h3>Software Engineer · Pivotly</h3>
              <div className="org">Minnesota, USA (Remote)</div>
              <p>Build AI-powered backend services and agentic LLM workflows that automate complex, high-volume business processes; develop the accompanying web &amp; mobile frontends and deploy to production on cloud infrastructure.</p>
              <div className="tags"><span className="tag">Agentic AI</span><span className="tag">LLM</span><span className="tag">Node.js</span><span className="tag">Cloud</span></div>
            </div>
          </li>
          <li className="entry">
            <div className="when">Sep 2024 — Oct 2025</div>
            <div>
              <h3>Software Engineer · Silicon Orchard Ltd.</h3>
              <div className="org">Dhaka, Bangladesh</div>
              <p>Built and maintained cross-platform (React Native) and native iOS (Swift) applications; integrated backend APIs and optimized performance for reliability on unstable networks, working across product, backend, and design.</p>
              <div className="tags"><span className="tag">Swift</span><span className="tag">React Native</span><span className="tag">REST APIs</span></div>
            </div>
          </li>
          <li className="entry">
            <div className="when">Mar 2024 — Sep 2024</div>
            <div>
              <h3>Software Engineer (iOS) · Xotech</h3>
              <div className="org">Chittagong, Bangladesh</div>
              <p>Developed AI-based iOS applications with Swift &amp; UIKit; built backend services and REST APIs with PHP (Laravel) and managed the full app lifecycle through to App Store release.</p>
              <div className="tags"><span className="tag">iOS</span><span className="tag">UIKit</span><span className="tag">Laravel</span></div>
            </div>
          </li>
        </ul>
      </section>

      {/* SKILLS */}
      <div className="band"><section id="skills" className="inner reveal">
        <div className="eyebrow">Toolkit</div>
        <h2 className="section-title">Skills &amp; technologies</h2>
        <p className="section-sub">A full-stack toolkit spanning AI, backend, frontend, mobile, and cloud.</p>
        <div className="skills-grid">
          <div className="skill-cat"><h4>🧩 Languages</h4><div className="chips">
            <span className="chip">TypeScript</span><span className="chip">Python</span><span className="chip">Swift</span><span className="chip">Go</span><span className="chip">C++</span><span className="chip">PHP</span><span className="chip">SQL</span>
          </div></div>
          <div className="skill-cat"><h4>⚙️ Frameworks</h4><div className="chips">
            <span className="chip">Next.js</span><span className="chip">React</span><span className="chip">Node.js</span><span className="chip">React Native</span><span className="chip">SwiftUI/UIKit</span><span className="chip">Laravel</span>
          </div></div>
          <div className="skill-cat"><h4>🤖 AI &amp; Systems</h4><div className="chips">
            <span className="chip">Agentic AI</span><span className="chip">LLM Integration</span><span className="chip">AI/ML</span><span className="chip">OpenCV</span><span className="chip">DQN/DDQN</span><span className="chip">SDN/NDN</span>
          </div></div>
          <div className="skill-cat"><h4>☁️ Cloud &amp; DevOps</h4><div className="chips">
            <span className="chip">AWS</span><span className="chip">Azure</span><span className="chip">Docker</span><span className="chip">CI/CD</span><span className="chip">PostgreSQL</span><span className="chip">Firebase</span><span className="chip">Linux</span>
          </div></div>
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
        <div className="proj-note" style={{ textAlign: "left" }}>📝 We&apos;ll add your professional/office work here once you share the details.</div>
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
            <h3>Grade Now</h3>
            <p>AI grading platform evaluating answer scripts against AI-generated rubrics via a parallel, multi-stage agentic pipeline.</p>
            <div className="tags"><span className="tag">LLM</span><span className="tag">Next.js</span><span className="tag">AWS</span></div>
          </div>
          <div className="card" data-cat="web">
            <div className="top"><span className="ico">📝</span><span className="badge live">● Live</span></div>
            <h3>IELTS Pro BD</h3>
            <p>A live computer-delivered mock-IELTS platform with a flexible test-engine editor, student management, and billing.</p>
            <div className="tags"><span className="tag">Next.js</span><span className="tag">Node.js</span></div>
          </div>
          <div className="card" data-cat="web">
            <div className="top"><span className="ico">⚖️</span><span className="badge">Full-stack</span></div>
            <h3>Connect My Advocate</h3>
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
            <h3>SmartWeight</h3>
            <p>Edge-vision weighing system fusing real-time OpenCV object detection with weight sensors on Raspberry Pi.</p>
            <div className="tags"><span className="tag">OpenCV</span><span className="tag">Raspberry Pi</span></div>
          </div>
        </div>
      </section></div>

      {/* LEADERSHIP */}
      <section id="leadership" className="reveal">
        <div className="eyebrow">Leadership &amp; Community</div>
        <h2 className="section-title">Mentoring &amp; co-curricular</h2>
        <p className="section-sub">Giving back through teaching, organizing, and student leadership.</p>
        <ul className="hlist">
          <li className="entry">
            <div className="when">2021 — 2023</div>
            <div><h3>CP Trainer &amp; Manager</h3><div className="org">PUC CSE Club</div>
              <p>Led data-structures &amp; algorithms bootcamps and trained the university&apos;s competitive-programming teams for national contests.</p></div>
          </li>
          <li className="entry">
            <div className="when">2022</div>
            <div><h3>Program Secretary</h3><div className="org">PUC Robotics Club</div>
              <p>Organized robotics programs and events, coordinating members and activities across the club.</p></div>
          </li>
          <li className="entry">
            <div className="when">2023</div>
            <div><h3>Member</h3><div className="org">IEEE</div>
              <p>Active member of the global professional body for engineering and technology.</p></div>
          </li>
          <li className="entry">
            <div className="when">2020 — 2022</div>
            <div><h3>Member</h3><div className="org">Rotaract Club of Chattogram Commercial City</div>
              <p>Took part in community-service initiatives and youth-leadership activities.</p></div>
          </li>
        </ul>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact reveal">
        <div className="hello">Let&apos;s talk</div>
        <h2>Let&apos;s build something <span className="grad">great</span>.</h2>
        <p>I&apos;m open to engineering roles, research collaborations, and interesting problems. Reach me by email — or ask <b>Chiki</b>, my AI assistant, anything in the corner. 👉</p>
        <div className="hero-cta" style={{ justifyContent: "center" }}>
          <a href="mailto:sajjadhossain.cse35@gmail.com" className="btn primary">✉ Email me</a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="btn ghost">LinkedIn ↗</a>
        </div>
      </section>

      <footer>Designed &amp; built by Sajjad Hossain Talukder · sajjadhossaintalukder.com · © 2026</footer>
    </>
  );
}
