"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Freedom Business Summit 2026 — USA Edition (June)
 * Partner Intelligence Report
 *
 * Self-contained React component. No external deps beyond React.
 * Drop into a Next.js/Vercel app or render standalone.
 * Data source: 91 qualified submissions, FBS USA Edition, data through 28 Jun 2026.
 */

/* ----------------------------------------------------------------------------
   DATA
---------------------------------------------------------------------------- */

const HERO_STATS = [
  { value: 91, label: "Qualified submissions", suffix: "" },
  { value: 82, label: "Seeking trusted providers", suffix: "%" },
  { value: 87, label: "Want the playbooks after", suffix: "%" },
  { value: 34, label: "Near-term / move-ready", suffix: "%" },
];

const SNAPSHOT = [
  { value: 91, label: "Qualified submissions", suffix: "" },
  { value: 58, label: "Want a 2nd passport (top driver)", suffix: "%" },
  { value: 51, label: "Want borderless-business help", suffix: "%" },
  { value: 55, label: "Are founders / owners / C-suite", suffix: "%" },
  { value: 74, label: "Outbound / global focus", suffix: "%" },
  { value: 35, label: "Mean lead score (0–73)", suffix: "" },
];

const LEAD_TIERS = [
  { tier: "Hot", range: "49+", pct: 16, note: "Trigger-ready — route first" },
  { tier: "Warm", range: "36–48", pct: 29, note: "Engaged, budgeting now" },
  { tier: "Qualified", range: "25–35", pct: 33, note: "Real intent, longer fuse" },
  { tier: "Nurture", range: "<25", pct: 22, note: "Early — feed the engine" },
];

const JURISDICTION_INTEREST = [
  { flag: "🇲🇹", label: "Malta — Residency & Citizenship", pct: 42 },
  { flag: "🇵🇹", label: "Portugal — Golden Visa", pct: 38 },
  { flag: "🇬🇷", label: "Greece — Real Estate & Residency", pct: 32 },
  { flag: "🏝", label: "Caribbean / Grenada — Citizenship", pct: 31 },
  { flag: "🇺🇸", label: "US Green Card (EB-5)", pct: 24 },
  { flag: "🇦🇪", label: "Dubai / UAE — Residency", pct: 22 },
];

const DEMOGRAPHICS = [
  { flag: "🌍", label: "Non-US citizens", pct: 60 },
  { flag: "🏠", label: "Living as a local resident", pct: 60 },
  { flag: "👨‍👩‍👧", label: "Relocating with family (of 66 who answered)", pct: 52 },
  { flag: "🛂", label: "No second residency yet", pct: 43 },
  { flag: "🌐", label: "Already hold multiple residencies", pct: 21 },
  { flag: "📍", label: "Active in just one country today", pct: 49 },
];

const FINANCIAL_READINESS = [
  { flag: "⚙️", label: "Planning a budget", pct: 59, sub: "Liquid capital, active due diligence on allocation" },
  { flag: "🧭", label: "Not ready yet", pct: 27, sub: "Watching the macro, setting milestones first" },
  { flag: "💼", label: "Ready to invest", pct: 11, sub: "Trigger-ready, seeking the right framework" },
  { flag: "🚀", label: "Capital allocated", pct: 2, sub: "Escrow / structure prepared, immediate deploy" },
];

const STRATEGY = [
  { flag: "🧑‍🤝‍🧑", label: "Individual / family exploring relocation", pct: 45 },
  { flag: "🏢", label: "Business owner exploring expansion / structuring", pct: 41 },
  { flag: "🛰", label: "Service provider in the industry", pct: 9 },
  { flag: "📈", label: "Investor exploring internationally", pct: 5 },
];

const TIMELINE = [
  { flag: "🗺", label: "9–12 months — exploring", pct: 52, stage: "Top of funnel" },
  { flag: "🧭", label: "Not ready — tracking", pct: 14, stage: "Top of funnel" },
  { flag: "⚙️", label: "6–9 months — planning", pct: 12, stage: "Mid funnel" },
  { flag: "✈️", label: "3–6 months — ready to move", pct: 12, stage: "Bottom funnel" },
  { flag: "🌐", label: "Fully mobile / in process", pct: 10, stage: "Bottom funnel" },
];

const PRIORITY_NEEDS = [
  { flag: "✈️", label: "Relocation / 2nd residency / citizenship", pct: 58 },
  { flag: "💻", label: "Building & scaling a borderless business", pct: 51 },
  { flag: "🧾", label: "Offshore strategies (legal tax minimization)", pct: 35 },
  { flag: "💵", label: "Tax optimization & structuring", pct: 33 },
  { flag: "🏠", label: "Real estate investment (PT / GR / LATAM)", pct: 29 },
  { flag: "🛡", label: "Health, mobility & family safety net", pct: 20 },
];

const INCORPORATION = [
  { flag: "🇸🇬", label: "Singapore", pct: 29, note: "Tier-1 reputation, territorial tax, banking" },
  { flag: "🇪🇪", label: "Estonia (e-Residency)", pct: 27, note: "Digital-first, 0% undistributed tax" },
  { flag: "🇲🇹", label: "Malta", pct: 23, note: "EU access, effective 5% via refunds" },
  { flag: "🇦🇪", label: "UAE", pct: 21, note: "0% personal income tax, MENA gateway" },
];

const ROLES = [
  { flag: "👑", label: "Founders, Owners & C-Suite", pct: 55, note: "CEO, Owner, Founder, Partner, MD, President" },
  { flag: "⚖️", label: "Advisors, Legal & Business Dev", pct: 15, note: "Attorney, Investment Advisor, BD" },
  { flag: "🏥", label: "Healthcare, Education & Specialists", pct: 11, note: "Medical Director, Professor, Therapist" },
  { flag: "💻", label: "Tech & Engineering", pct: 8, note: "Developer, SDET, Project Engineer, PM" },
  { flag: "🧩", label: "Other / unclassified", pct: 11, note: "Manager, retired, reinventing" },
];

const INDUSTRIES = [
  { flag: "📊", label: "Professional Services, Legal & Finance", pct: 35, note: "Consulting, legal, finance, marketing, trade, advisory" },
  { flag: "✈️", label: "Hospitality, Travel, Education & Creative", pct: 26, note: "Tourism, EdTech, events, charters, journalism" },
  { flag: "💻", label: "Tech, Engineering & Software", pct: 19, note: "Software, IT, automation, robotics, crypto/AI" },
  { flag: "🏠", label: "Real Estate, Property & Construction", pct: 14, note: "Development, property, construction mgmt" },
  { flag: "🏥", label: "Healthcare & Wellness", pct: 5, note: "Medicine, mental health, wellness" },
];

const DEEP_DIVES = [
  {
    flag: "🇲🇹",
    name: "Malta",
    n: "n = 38 · 42%",
    split: "15 US · 23 non-US",
    outbound: "82% outbound",
    ready: "37% near-term ready",
    play: "Your premium European track. More residency/citizenship-serious than Portugal's real-estate browsers — route the move-ready subset to partners faster.",
  },
  {
    flag: "🇵🇹",
    name: "Portugal",
    n: "n = 35 · 38%",
    split: "14 US · 21 non-US",
    outbound: "83% outbound",
    ready: "29% near-term ready",
    play: "The broad-appeal anchor. Widest top-of-funnel pull, longest fuse. Pair with real-estate ROI content — Portugal is the obvious vehicle.",
  },
  {
    flag: "🏝",
    name: "Grenada / Caribbean",
    n: "n = 28 · 31%",
    split: "16 US · 12 non-US",
    outbound: "89% outbound",
    ready: "36% near-term ready",
    play: "The American passport-hedge — most US-skewed segment in the set. Lead with speed-to-passport and the E-2 treaty route into the US.",
  },
  {
    flag: "🇺🇸",
    name: "US Residency (EB-5 / E-2)",
    n: "n = 22 · 24%",
    split: "1 US · 21 non-US",
    outbound: "18 inbound",
    ready: "36% near-term ready",
    play: "The inbound engine — almost entirely foreign nationals. Separate funnel, copy and partners. Don't co-mingle with outbound European messaging.",
  },
];

const KEY_FINDINGS = [
  { n: "01", lead: "Lead with Europe, segment by direction.", body: "Malta / Portugal / Greece are the gravity. The citizenship × direction split — 35 Americans out, 23 foreigners in — is the line every campaign branches on." },
  { n: "02", lead: "Sell the roadmap, not the close.", body: "66% are 9–12 months out and budgeting. Nurture beats pitch; reserve a hot tier of ~31 for immediate hand-off." },
  { n: "03", lead: "Pair passport + business.", body: "58% want residency, 51% want borderless-business help. The winning hook does both in one breath." },
  { n: "04", lead: "Mind the money reality.", body: "Only 13% are capital-ready. Teach what it actually costs before any partner pitch lands." },
  { n: "05", lead: "82% are demand, 18% are supply.", body: "That ratio is the FBS Intelligence business — capture it cleanly and route the 18% to the partner conversation, not the lead pool." },
  { n: "06", lead: "87% pre-committed to the content.", body: "The single strongest consensus in the dataset — a green light for the post-summit playbook bundle." },
];

const SUMMITS = [
  { when: "28–29 Jun 2026", title: "🇺🇸 USA Edition", desc: "This report. Outbound structuring, EB-5 flows, cross-border diversification." },
  { when: "Sep 2026", title: "🏝 Caribbean Edition", desc: "Citizenship-by-investment, E-2 treaty routes, fast-track second passports." },
  { when: "Q1 2027", title: "🇪🇺 Europe Edition", desc: "Golden visas, Malta / Portugal / Greece, jurisdictional arbitrage." },
];

/* ----------------------------------------------------------------------------
   HOOKS / PRIMITIVES
---------------------------------------------------------------------------- */

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function CountUp({ value, suffix = "", duration = 1100 }) {
  const [ref, seen] = useInView(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function Bar({ flag, label, pct, max = 100, note, big }) {
  const [ref, seen] = useInView(0.3);
  const width = seen ? `${(pct / max) * 100}%` : "0%";
  return (
    <div className="fbs-bar" ref={ref}>
      <div className="fbs-bar-head">
        <span className="fbs-bar-label">
          {flag && <span className="fbs-flag">{flag}</span>}
          {label}
        </span>
        <span className="fbs-bar-pct">{pct}%</span>
      </div>
      <div className="fbs-bar-track">
        <div
          className={"fbs-bar-fill" + (big ? " fbs-bar-fill--big" : "")}
          style={{ width }}
        />
      </div>
      {note && <div className="fbs-bar-note">{note}</div>}
    </div>
  );
}

function Section({ id, eyebrow, title, lead, children, dark }) {
  const [ref, seen] = useInView(0.08);
  return (
    <section
      id={id}
      ref={ref}
      className={
        "fbs-section" +
        (dark ? " fbs-section--dark" : "") +
        (seen ? " fbs-in" : "")
      }
    >
      <div className="fbs-wrap">
        {eyebrow && <div className="fbs-eyebrow">{eyebrow}</div>}
        {title && <h2 className="fbs-h2">{title}</h2>}
        {lead && <p className="fbs-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

function Takeaway({ children }) {
  return (
    <div className="fbs-takeaway">
      <div className="fbs-takeaway-mark">Key takeaway</div>
      <p>{children}</p>
    </div>
  );
}

function StatCard({ value, label, suffix }) {
  return (
    <div className="fbs-stat">
      <div className="fbs-stat-num">
        <CountUp value={value} suffix={suffix} />
      </div>
      <div className="fbs-stat-label">{label}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   PAGE
---------------------------------------------------------------------------- */

export default function FBSPartnerReport() {
  return (
    <div className="fbs-root">
      <style>{CSS}</style>

      {/* NAV */}
      <header className="fbs-nav">
        <div className="fbs-wrap fbs-nav-inner">
          <a href="#top" className="fbs-brand">
            <span className="fbs-brand-dot" />
            Freedom Business Summit
          </a>
          <nav className="fbs-nav-links">
            <a href="#audience">Audience</a>
            <a href="#jurisdiction">Jurisdictions</a>
            <a href="#intent">Intent</a>
            <a href="#findings">Findings</a>
          </nav>
          <a href="mailto:denis@fsummit.net" className="fbs-btn fbs-btn--solid fbs-btn--sm">
            Partner with us
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="fbs-hero">
        <div className="fbs-hero-grid" aria-hidden="true" />
        <div className="fbs-wrap fbs-hero-inner">
          <div className="fbs-hero-eyebrow">
            Virtual Event · 28–29 June 2026 · Post-Event Analytics
          </div>
          <div className="fbs-hero-kicker">Freedom Business Summit 2026</div>
          <h1 className="fbs-h1">
            USA Edition <span className="fbs-flag-lg">🇺🇸</span>
          </h1>
          <p className="fbs-hero-sub">
            Partner intelligence from <strong>91 qualified submissions</strong> — real
            intent signals, budget readiness and jurisdiction demand from people
            actively planning their global mobility move. Built for immigration firms,
            CBI agents, structuring specialists and relocation partners.
          </p>
          <div className="fbs-hero-cta">
            <a href="#audience" className="fbs-btn fbs-btn--solid">
              Explore the report
            </a>
            <a href="mailto:denis@fsummit.net" className="fbs-btn fbs-btn--ghost">
              Partner with us →
            </a>
          </div>
          <div className="fbs-hero-stats">
            {HERO_STATS.map((s) => (
              <div className="fbs-hero-stat" key={s.label}>
                <div className="fbs-hero-stat-num">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="fbs-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="fbs-hero-foot">
            Data through 28 Jun 2026 · 91 records · Income &amp; channel figures carry the
            caveats noted in-report.
          </div>
        </div>
      </section>

      {/* SNAPSHOT */}
      <Section
        id="snapshot"
        eyebrow="📊 The 80/20 Snapshot"
        title="A concentrated, pre-qualified cohort"
        lead="The median registrant is a founder or owner from professional services, 9–12 months from moving, pulled in by one dominant promise — a second residency or passport. They're planning a budget, not writing a check, but the overwhelming majority want the playbooks afterward. A teach-me-first audience with a long fuse and high lifetime value."
      >
        <div className="fbs-stat-grid">
          {SNAPSHOT.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        <Takeaway>
          91 deep-intent submissions — concentrated demand, not raw traffic.{" "}
          <strong>82% are end-clients actively seeking trusted providers</strong>; only
          18% are supply. That ratio is the entire FBS Intelligence value proposition.
        </Takeaway>
      </Section>

      {/* LEAD QUALITY */}
      <Section
        id="quality"
        eyebrow="🎯 Lead Quality"
        title="Scored, tiered and ready to route"
        lead="Every submission carries a 0–73 lead score (mean 35, median 34). The distribution gives partners a clean priority rail — and 87% pre-committed to the post-summit content bundle, the strongest single consensus in the data."
        dark
      >
        <div className="fbs-tier-grid">
          {LEAD_TIERS.map((t) => (
            <div className="fbs-tier" key={t.tier}>
              <div className="fbs-tier-top">
                <span className="fbs-tier-name">{t.tier}</span>
                <span className="fbs-tier-range">{t.range}</span>
              </div>
              <div className="fbs-tier-pct">{t.pct}%</div>
              <div className="fbs-tier-note">{t.note}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>45% sit in the Hot + Warm tiers (49+ and 36–48)</strong> — engaged,
          budgeting and worth fast hand-off. The remainder is a maturing pipeline worth
          nurturing at volume.
        </Takeaway>
      </Section>

      {/* AUDIENCE PROFILE */}
      <Section
        id="audience"
        eyebrow="👥 Audience Profile"
        title="Outbound globalists, planting European flags"
        lead="74% are pointed outward — building second residencies, foreign structures and exit optionality. Jurisdiction interest is multi-select, as a share of all 91."
      >
        <div className="fbs-two">
          <div className="fbs-panel">
            <div className="fbs-panel-title">🏳️ Jurisdiction interest</div>
            {JURISDICTION_INTEREST.map((b) => (
              <Bar key={b.label} {...b} />
            ))}
          </div>
          <div className="fbs-panel">
            <div className="fbs-panel-title">📋 Demographics & status</div>
            {DEMOGRAPHICS.map((b) => (
              <Bar key={b.label} {...b} />
            ))}
          </div>
        </div>
        <div className="fbs-direction">
          <div className="fbs-direction-item">
            <div className="fbs-direction-num">74%</div>
            <div className="fbs-direction-label">🌍 Outbound / global mobility</div>
          </div>
          <div className="fbs-direction-divider" />
          <div className="fbs-direction-item">
            <div className="fbs-direction-num">26%</div>
            <div className="fbs-direction-label">🇺🇸 Inbound to the US (EB-5 / E-2)</div>
          </div>
        </div>
        <Takeaway>
          <strong>74% are outbound and 43% have no second residency yet.</strong> Malta
          (42%), Portugal (38%) and Greece (32%) are the top three — making European
          partners the highest-priority category.
        </Takeaway>
      </Section>

      {/* FINANCIAL */}
      <Section
        id="financial"
        eyebrow="💰 Financial Capacity"
        title="The money is intended, not deployed"
        lead="High-income operators with the runway to fund CBI and golden visas — but psychologically uncommitted. The financial-readiness field is the truer wealth signal here."
      >
        <div className="fbs-panel">
          {FINANCIAL_READINESS.map((b) => (
            <Bar key={b.label} {...b} note={b.sub} big />
          ))}
        </div>
        <div className="fbs-caveat">
          ⚠️ <strong>Income data is unusable.</strong> 81 of 91 (89%) selected the
          identical “$150K–$350K” band — that's the form's default, not a real
          distribution. Treat financial-readiness above as the truer signal, and fix the
          income question before the next cohort.
        </div>
        <Takeaway>
          Only <strong>13% are “ready to invest” or “capital allocated.”</strong> The
          capital is real but un-triggered — this audience needs budgeting frameworks and
          “what does it actually cost” content before any partner pitch lands.
        </Takeaway>
      </Section>

      {/* STRATEGY */}
      <Section
        id="strategy"
        eyebrow="🧭 Strategy & Intent"
        title="Two summits in one badge"
        lead="Self-description across all 91 — and the one split that should drive every email and ad you send."
        dark
      >
        <div className="fbs-panel fbs-panel--dark">
          {STRATEGY.map((b) => (
            <Bar key={b.label} {...b} />
          ))}
        </div>

        <div className="fbs-matrix">
          <div className="fbs-matrix-title">Citizenship × direction</div>
          <div className="fbs-matrix-grid">
            <div className="fbs-matrix-cell fbs-matrix-head" />
            <div className="fbs-matrix-cell fbs-matrix-head">Inbound to US</div>
            <div className="fbs-matrix-cell fbs-matrix-head">Outbound / global</div>

            <div className="fbs-matrix-cell fbs-matrix-row">🇺🇸 US citizens (40%)</div>
            <div className="fbs-matrix-cell">1</div>
            <div className="fbs-matrix-cell fbs-matrix-hot">35</div>

            <div className="fbs-matrix-cell fbs-matrix-row">🌍 Non-US (60%)</div>
            <div className="fbs-matrix-cell fbs-matrix-hot">23</div>
            <div className="fbs-matrix-cell">32</div>
          </div>
        </div>

        <Takeaway>
          <strong>35 of 36 Americans are looking OUT</strong> (diversify / exit).{" "}
          <strong>23 foreigners are looking IN</strong> (EB-5 / E-2). Same event,
          opposite vectors — segment every campaign on this single variable.
        </Takeaway>
      </Section>

      {/* TIMELINE */}
      <Section
        id="timeline"
        eyebrow="⏱️ Timeline Readiness"
        title="Two-thirds are a slow burn"
        lead="When this capital and talent will physically change coordinates — as a share of all 91. Cross-checked: 44% say “yes” to relocating within 12 months, 56% say “exploring.”"
      >
        <div className="fbs-panel">
          {TIMELINE.map((b) => (
            <Bar key={b.label} {...b} note={b.stage} />
          ))}
        </div>
        <div className="fbs-split-cards">
          <div className="fbs-split-card fbs-split-card--accent">
            <div className="fbs-split-num">31</div>
            <div className="fbs-split-label">Near-term &amp; committed (34%)</div>
            <div className="fbs-split-sub">3–9 months or fully mobile — your hot hand-off list.</div>
          </div>
          <div className="fbs-split-card">
            <div className="fbs-split-num">60</div>
            <div className="fbs-split-label">Long-fuse explorers (66%)</div>
            <div className="fbs-split-sub">9–12 months or not ready — the nurture engine.</div>
          </div>
        </div>
        <Takeaway>
          Don't sell them a closing; <strong>sell them a roadmap.</strong> Set partner
          expectations to “warm and educatable at volume,” with a reserved hot tier of ~31.
        </Takeaway>
      </Section>

      {/* INTENT */}
      <Section
        id="intent"
        eyebrow="💡 Core Intent"
        title="What actually pulls them in the door"
        lead="Priority needs, multi-select, as a share of all 91. The headline magnet is a second passport — but borderless-business help is right behind it and easy to underestimate."
      >
        <div className="fbs-panel">
          {PRIORITY_NEEDS.map((b) => (
            <Bar key={b.label} {...b} big />
          ))}
        </div>
        <Takeaway>
          <strong>58% want residency; 51% want borderless-business help.</strong> Pair
          every “get a passport” hook with a “structure your business” payoff — that
          intersection is exactly what FBS Intelligence is built to serve.
        </Takeaway>
      </Section>

      {/* JURISDICTION DEEP DIVE */}
      <Section
        id="jurisdiction"
        eyebrow="📍 Jurisdiction Demand"
        title="Three audiences, three messages"
        lead="Who, specifically, wants each flagship program — and how move-ready they are. Minimal overlap between the three clusters."
        dark
      >
        <div className="fbs-dive-grid">
          {DEEP_DIVES.map((d) => (
            <div className="fbs-dive" key={d.name}>
              <div className="fbs-dive-head">
                <span className="fbs-dive-flag">{d.flag}</span>
                <div>
                  <div className="fbs-dive-name">{d.name}</div>
                  <div className="fbs-dive-n">{d.n}</div>
                </div>
              </div>
              <div className="fbs-dive-meta">
                <span>{d.split}</span>
                <span>{d.outbound}</span>
                <span className="fbs-dive-ready">{d.ready}</span>
              </div>
              <p className="fbs-dive-play">{d.play}</p>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>Europe = outbound volume. Caribbean = US-citizen passport hedge. EB-5
          = foreign inbound.</strong> Build the mainstage around Europe; run Caribbean and
          EB-5 as two clearly separate satellite tracks.
        </Takeaway>
      </Section>

      {/* INCORPORATION */}
      <Section
        id="incorporation"
        eyebrow="🏢 Incorporation Preferences"
        title="A genuine four-way split"
        lead="Where attendees would structure a new company — share of all 91. No runaway winner, and that breadth is the opportunity."
      >
        <div className="fbs-panel">
          {INCORPORATION.map((b) => (
            <Bar key={b.label} {...b} note={b.note} />
          ))}
        </div>
        <div className="fbs-inline-stat">
          <strong>~21%</strong> carry a concrete US commercial agenda; <strong>13%</strong>{" "}
          explicitly want to put a company on US soil — small but high-value and underserved.
        </div>
        <Takeaway>
          “Where should I incorporate?” is a legitimate standalone session.{" "}
          <strong>Corporate-structuring vendors across Singapore, Estonia, Malta and the
          UAE all have a real audience here.</strong>
        </Takeaway>
      </Section>

      {/* ROLES */}
      <Section
        id="roles"
        eyebrow="👔 Roles & Decision Power"
        title="This is a buying audience"
        lead="Titles are free-text and messy; grouped by keyword into five buckets. Over half are owner/operator decision-makers who can say yes without a committee."
      >
        <div className="fbs-panel">
          {ROLES.map((b) => (
            <Bar key={b.label} {...b} note={b.note} />
          ))}
        </div>
        <Takeaway>
          <strong>55% are founders, owners or C-suite.</strong> They buy for themselves,
          so the pitch is personal freedom + business leverage — not enterprise
          procurement.
        </Takeaway>
      </Section>

      {/* INDUSTRY */}
      <Section
        id="industry"
        eyebrow="🏭 Industry Breakdown"
        title="Owner-level, advice-and-services, portable"
        lead="No single industry dominates. The common thread is people who run advice-and-services businesses from anywhere — and that portability is exactly why global mobility resonates."
        dark
      >
        <div className="fbs-panel fbs-panel--dark">
          {INDUSTRIES.map((b) => (
            <Bar key={b.label} {...b} note={b.note} />
          ))}
        </div>
        <Takeaway>
          Professional services (35%) leads on headcount; <strong>real estate (14%) is
          small in volume but high in deal-intent</strong> — mapping directly onto the
          Portugal / Greece property hooks.
        </Takeaway>
      </Section>

      {/* KEY FINDINGS */}
      <Section
        id="findings"
        eyebrow="🗝️ The Single-Page Verdict"
        title="Six findings for partners"
        lead="If you read nothing else, read these."
      >
        <div className="fbs-find-grid">
          {KEY_FINDINGS.map((f) => (
            <div className="fbs-find" key={f.n}>
              <div className="fbs-find-n">{f.n}</div>
              <div className="fbs-find-lead">{f.lead}</div>
              <div className="fbs-find-body">{f.body}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          The data is unambiguous: the #1 thing this audience wants is access to{" "}
          <strong>trusted providers (82%).</strong> FBS is the bridge — and partnering is
          how you get introduced.
        </Takeaway>
      </Section>

      {/* SUMMIT SERIES */}
      <Section
        id="series"
        eyebrow="🚀 Execution Layer"
        title="The Summit Series"
        lead="Each edition is built around one thing: maximizing outcomes in a specific region — residency pipelines, capital deployment, structuring and relocation execution."
        dark
      >
        <div className="fbs-summit-grid">
          {SUMMITS.map((s) => (
            <div className="fbs-summit" key={s.title}>
              <div className="fbs-summit-when">{s.when}</div>
              <div className="fbs-summit-title">{s.title}</div>
              <div className="fbs-summit-desc">{s.desc}</div>
              <a href="mailto:denis@fsummit.net" className="fbs-summit-link">
                Apply to join, speak or partner →
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="fbs-cta">
        <div className="fbs-wrap fbs-cta-inner">
          <div className="fbs-eyebrow fbs-eyebrow--center">Partnership opportunities</div>
          <h2 className="fbs-cta-title">
            Ready to partner with Freedom Business Summit?
          </h2>
          <p className="fbs-cta-sub">
            Get direct access to qualified, high-intent founders and investors actively
            planning their global mobility strategy right now.
          </p>
          <div className="fbs-cta-buttons">
            <a href="mailto:denis@fsummit.net" className="fbs-btn fbs-btn--solid">
              Partner with us →
            </a>
            <a href="mailto:denis@fsummit.net" className="fbs-btn fbs-btn--ghost-light">
              Request speaking access
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fbs-footer">
        <div className="fbs-wrap fbs-footer-inner">
          <div className="fbs-brand">
            <span className="fbs-brand-dot" />
            Freedom Business Summit
          </div>
          <div className="fbs-footer-links">
            <a href="https://fsummit.net" target="_blank" rel="noreferrer">fsummit.net ↗</a>
            <a href="mailto:denis@fsummit.net">Contact us</a>
          </div>
          <div className="fbs-footer-copy">
            © 2026 Freedom Business Summit. Prepared from 91 USA-edition submissions
            through 28 Jun 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   STYLES
---------------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.fbs-root{
  --ink:#0E1311;
  --ink-2:#19211D;
  --acid:#5CE64C;
  --acid-deep:#3FBF31;
  --paper:#F4F7F2;
  --card:#FFFFFF;
  --line:#E4EAE0;
  --muted:#5C6661;
  --muted-dark:#9AA8A1;
  font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  color:var(--ink);
  background:var(--paper);
  -webkit-font-smoothing:antialiased;
  line-height:1.5;
}
.fbs-root *{box-sizing:border-box;}
.fbs-wrap{width:100%;max-width:1080px;margin:0 auto;padding:0 24px;}

/* NAV */
.fbs-nav{position:sticky;top:0;z-index:50;background:rgba(14,19,17,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.06);}
.fbs-nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px;}
.fbs-brand{display:inline-flex;align-items:center;gap:9px;color:#fff;font-weight:800;font-size:15px;letter-spacing:-.01em;text-decoration:none;}
.fbs-brand-dot{width:11px;height:11px;border-radius:50%;background:var(--acid);box-shadow:0 0 12px rgba(92,230,76,.7);}
.fbs-nav-links{display:flex;gap:26px;}
.fbs-nav-links a{color:rgba(255,255,255,.66);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s;}
.fbs-nav-links a:hover{color:var(--acid);}

/* BUTTONS */
.fbs-btn{display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;text-decoration:none;border-radius:999px;padding:13px 26px;transition:transform .15s ease,background .2s,color .2s;white-space:nowrap;}
.fbs-btn:hover{transform:translateY(-2px);}
.fbs-btn--sm{padding:9px 18px;font-size:13.5px;}
.fbs-btn--solid{background:var(--acid);color:var(--ink);}
.fbs-btn--solid:hover{background:#6cf25c;}
.fbs-btn--ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.28);}
.fbs-btn--ghost:hover{border-color:var(--acid);color:var(--acid);}
.fbs-btn--ghost-light{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.3);}
.fbs-btn--ghost-light:hover{border-color:var(--acid);color:var(--acid);}

/* HERO */
.fbs-hero{position:relative;background:var(--ink);color:#fff;overflow:hidden;padding:96px 0 92px;}
.fbs-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(92,230,76,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(92,230,76,.06) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,#000 40%,transparent 100%);}
.fbs-hero-inner{position:relative;}
.fbs-hero-eyebrow{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--acid);border:1px solid rgba(92,230,76,.3);border-radius:999px;padding:7px 15px;margin-bottom:26px;}
.fbs-hero-kicker{font-size:15px;font-weight:600;color:var(--muted-dark);margin-bottom:8px;letter-spacing:.01em;}
.fbs-h1{font-size:clamp(46px,8vw,92px);font-weight:900;letter-spacing:-.04em;line-height:.96;margin:0 0 24px;}
.fbs-flag-lg{font-weight:400;}
.fbs-hero-sub{font-size:clamp(16px,2.2vw,20px);color:rgba(255,255,255,.74);max-width:640px;margin:0 0 34px;line-height:1.55;}
.fbs-hero-sub strong{color:#fff;}
.fbs-hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:56px;}
.fbs-hero-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;border-top:1px solid rgba(255,255,255,.1);padding-top:34px;}
.fbs-hero-stat-num{font-size:clamp(34px,5vw,52px);font-weight:900;letter-spacing:-.04em;color:var(--acid);line-height:1;}
.fbs-hero-stat-label{font-size:13.5px;color:rgba(255,255,255,.6);margin-top:8px;line-height:1.35;}
.fbs-hero-foot{margin-top:34px;font-size:12.5px;color:var(--muted-dark);}

/* SECTION */
.fbs-section{padding:84px 0;border-bottom:1px solid var(--line);opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;}
.fbs-section.fbs-in{opacity:1;transform:none;}
.fbs-section--dark{background:var(--ink);color:#fff;border-bottom:1px solid rgba(255,255,255,.06);}
.fbs-eyebrow{display:inline-block;font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--acid-deep);margin-bottom:16px;}
.fbs-section--dark .fbs-eyebrow{color:var(--acid);}
.fbs-eyebrow--center{display:block;text-align:center;}
.fbs-h2{font-size:clamp(28px,4.4vw,44px);font-weight:900;letter-spacing:-.035em;line-height:1.04;margin:0 0 18px;max-width:760px;}
.fbs-lead{font-size:clamp(15.5px,1.9vw,18px);color:var(--muted);max-width:720px;margin:0 0 40px;line-height:1.6;}
.fbs-section--dark .fbs-lead{color:rgba(255,255,255,.66);}

/* STAT GRID */
.fbs-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.fbs-stat{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px 24px;transition:transform .2s,box-shadow .2s,border-color .2s;}
.fbs-stat:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(14,19,17,.07);border-color:#cfe6c8;}
.fbs-stat-num{font-size:clamp(36px,5vw,52px);font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--ink);}
.fbs-stat-label{font-size:14px;color:var(--muted);margin-top:10px;line-height:1.4;}

/* TWO COLUMN PANELS */
.fbs-two{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.fbs-panel{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:28px 26px;}
.fbs-panel--dark{background:var(--ink-2);border-color:rgba(255,255,255,.08);}
.fbs-panel-title{font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}

/* BARS */
.fbs-bar{margin-bottom:18px;}
.fbs-bar:last-child{margin-bottom:0;}
.fbs-bar-head{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-bottom:7px;}
.fbs-bar-label{font-size:14.5px;font-weight:600;color:var(--ink);}
.fbs-section--dark .fbs-bar-label,.fbs-panel--dark .fbs-bar-label{color:#fff;}
.fbs-flag{margin-right:7px;}
.fbs-bar-pct{font-size:15px;font-weight:900;letter-spacing:-.02em;color:var(--acid-deep);font-variant-numeric:tabular-nums;}
.fbs-section--dark .fbs-bar-pct,.fbs-panel--dark .fbs-bar-pct{color:var(--acid);}
.fbs-bar-track{height:9px;background:var(--line);border-radius:999px;overflow:hidden;}
.fbs-panel--dark .fbs-bar-track,.fbs-section--dark .fbs-bar-track{background:rgba(255,255,255,.1);}
.fbs-bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--acid-deep),var(--acid));transition:width 1.1s cubic-bezier(.16,1,.3,1);}
.fbs-bar-fill--big{height:100%;}
.fbs-bar-track:has(.fbs-bar-fill--big){height:12px;}
.fbs-bar-note{font-size:12.5px;color:var(--muted);margin-top:6px;}
.fbs-section--dark .fbs-bar-note,.fbs-panel--dark .fbs-bar-note{color:var(--muted-dark);}

/* DIRECTION SPLIT */
.fbs-direction{display:flex;align-items:center;gap:24px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;margin-top:18px;}
.fbs-direction-item{flex:1;text-align:center;}
.fbs-direction-num{font-size:clamp(38px,6vw,58px);font-weight:900;letter-spacing:-.04em;color:var(--ink);line-height:1;}
.fbs-direction-label{font-size:14.5px;color:var(--muted);margin-top:8px;}
.fbs-direction-divider{width:1px;align-self:stretch;background:var(--line);}

/* LEAD TIERS */
.fbs-tier-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.fbs-tier{background:var(--ink-2);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:24px 22px;transition:transform .2s,border-color .2s;}
.fbs-tier:hover{transform:translateY(-3px);border-color:rgba(92,230,76,.4);}
.fbs-tier-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}
.fbs-tier-name{font-size:16px;font-weight:800;color:#fff;}
.fbs-tier-range{font-size:12.5px;color:var(--muted-dark);font-variant-numeric:tabular-nums;}
.fbs-tier-pct{font-size:40px;font-weight:900;letter-spacing:-.04em;color:var(--acid);line-height:1;}
.fbs-tier-note{font-size:13px;color:rgba(255,255,255,.62);margin-top:10px;line-height:1.4;}

/* CAVEAT */
.fbs-caveat{background:#FBF7E8;border:1px solid #EFE4BD;border-radius:16px;padding:20px 22px;margin-top:18px;font-size:14.5px;color:#6B5A1E;line-height:1.55;}
.fbs-caveat strong{color:#4A3E12;}

/* MATRIX */
.fbs-matrix{margin-top:24px;}
.fbs-matrix-title{font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-dark);margin-bottom:14px;}
.fbs-matrix-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:1px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;}
.fbs-matrix-cell{background:var(--ink-2);padding:16px 18px;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;font-variant-numeric:tabular-nums;}
.fbs-matrix-head{background:rgba(255,255,255,.04);color:var(--muted-dark);font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;}
.fbs-matrix-row{justify-content:flex-start;color:rgba(255,255,255,.85);font-size:14px;}
.fbs-matrix-hot{color:var(--ink);background:var(--acid);font-weight:900;font-size:18px;}

/* SPLIT CARDS */
.fbs-split-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px;}
.fbs-split-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;}
.fbs-split-card--accent{background:var(--ink);color:#fff;border-color:var(--ink);}
.fbs-split-num{font-size:48px;font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--ink);}
.fbs-split-card--accent .fbs-split-num{color:var(--acid);}
.fbs-split-label{font-size:16px;font-weight:800;margin-top:8px;}
.fbs-split-sub{font-size:13.5px;color:var(--muted);margin-top:6px;line-height:1.45;}
.fbs-split-card--accent .fbs-split-sub{color:rgba(255,255,255,.66);}

/* INLINE STAT */
.fbs-inline-stat{margin-top:18px;background:var(--card);border:1px solid var(--line);border-left:4px solid var(--acid);border-radius:14px;padding:18px 22px;font-size:15px;color:var(--muted);line-height:1.5;}
.fbs-inline-stat strong{color:var(--ink);}

/* DEEP DIVES */
.fbs-dive-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.fbs-dive{background:var(--ink-2);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:26px;transition:transform .2s,border-color .2s;}
.fbs-dive:hover{transform:translateY(-3px);border-color:rgba(92,230,76,.35);}
.fbs-dive-head{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.fbs-dive-flag{font-size:30px;}
.fbs-dive-name{font-size:19px;font-weight:800;color:#fff;}
.fbs-dive-n{font-size:13px;color:var(--acid);font-weight:700;margin-top:2px;}
.fbs-dive-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
.fbs-dive-meta span{font-size:12px;font-weight:600;color:rgba(255,255,255,.72);background:rgba(255,255,255,.06);border-radius:999px;padding:5px 11px;}
.fbs-dive-ready{color:var(--ink)!important;background:var(--acid)!important;}
.fbs-dive-play{font-size:14px;color:rgba(255,255,255,.7);line-height:1.55;margin:0;}

/* FINDINGS */
.fbs-find-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.fbs-find{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px;transition:transform .2s,box-shadow .2s;}
.fbs-find:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(14,19,17,.07);}
.fbs-find-n{font-size:14px;font-weight:900;color:var(--acid-deep);letter-spacing:.05em;margin-bottom:12px;}
.fbs-find-lead{font-size:18px;font-weight:800;letter-spacing:-.02em;line-height:1.25;margin-bottom:8px;}
.fbs-find-body{font-size:14.5px;color:var(--muted);line-height:1.55;}

/* SUMMIT SERIES */
.fbs-summit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.fbs-summit{background:var(--ink-2);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:26px;}
.fbs-summit-when{font-size:12.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--acid);margin-bottom:12px;}
.fbs-summit-title{font-size:20px;font-weight:800;color:#fff;margin-bottom:10px;}
.fbs-summit-desc{font-size:14px;color:rgba(255,255,255,.66);line-height:1.5;margin-bottom:18px;}
.fbs-summit-link{font-size:13.5px;font-weight:700;color:var(--acid);text-decoration:none;}
.fbs-summit-link:hover{text-decoration:underline;}

/* TAKEAWAY */
.fbs-takeaway{position:relative;margin-top:34px;background:linear-gradient(180deg,var(--ink),var(--ink-2));color:#fff;border-radius:20px;padding:30px 32px 30px;border:1px solid rgba(92,230,76,.18);}
.fbs-section--dark .fbs-takeaway{background:rgba(92,230,76,.08);border-color:rgba(92,230,76,.3);}
.fbs-takeaway-mark{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);background:var(--acid);border-radius:999px;padding:5px 13px;margin-bottom:14px;}
.fbs-takeaway p{font-size:clamp(15.5px,2vw,18.5px);line-height:1.55;margin:0;color:rgba(255,255,255,.92);}
.fbs-takeaway strong{color:var(--acid);font-weight:800;}

/* CTA */
.fbs-cta{background:var(--ink);color:#fff;padding:96px 0;text-align:center;}
.fbs-cta-title{font-size:clamp(30px,5vw,52px);font-weight:900;letter-spacing:-.035em;line-height:1.04;margin:0 auto 18px;max-width:760px;}
.fbs-cta-sub{font-size:clamp(15.5px,2vw,18px);color:rgba(255,255,255,.66);max-width:560px;margin:0 auto 34px;line-height:1.55;}
.fbs-cta-buttons{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}

/* FOOTER */
.fbs-footer{background:#080B0A;color:#fff;padding:44px 0;}
.fbs-footer-inner{display:flex;flex-direction:column;gap:18px;}
.fbs-footer-links{display:flex;gap:24px;}
.fbs-footer-links a{color:rgba(255,255,255,.66);text-decoration:none;font-size:14px;font-weight:600;}
.fbs-footer-links a:hover{color:var(--acid);}
.fbs-footer-copy{font-size:12.5px;color:var(--muted-dark);max-width:560px;line-height:1.5;}

/* RESPONSIVE */
@media(max-width:880px){
  .fbs-nav-links{display:none;}
  .fbs-hero-stats{grid-template-columns:repeat(2,1fr);gap:24px 16px;}
  .fbs-stat-grid{grid-template-columns:1fr 1fr;}
  .fbs-two,.fbs-dive-grid,.fbs-find-grid,.fbs-split-cards{grid-template-columns:1fr;}
  .fbs-tier-grid{grid-template-columns:1fr 1fr;}
  .fbs-summit-grid{grid-template-columns:1fr;}
}
@media(max-width:520px){
  .fbs-section{padding:62px 0;}
  .fbs-hero{padding:72px 0 64px;}
  .fbs-stat-grid,.fbs-tier-grid{grid-template-columns:1fr;}
  .fbs-direction{flex-direction:column;gap:18px;}
  .fbs-direction-divider{width:100%;height:1px;}
  .fbs-matrix-grid{font-size:12px;}
  .fbs-matrix-cell{padding:12px 10px;}
}
@media(prefers-reduced-motion:reduce){
  .fbs-section{transition:none;opacity:1;transform:none;}
  .fbs-bar-fill{transition:none;}
  .fbs-btn:hover,.fbs-stat:hover,.fbs-find:hover,.fbs-dive:hover,.fbs-tier:hover{transform:none;}
}
`;
