"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────── DATA ─────────────────────────── */

const HERO_STATS = [
  { value: 91, suffix: "", label: "Qualified Submissions" },
  { value: 82, suffix: "%", label: "Seeking Trusted Providers" },
  { value: 87, suffix: "%", label: "Want Playbooks After" },
  { value: 34, suffix: "%", label: "Near-Term / Move-Ready" },
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
    flag: "🇲🇹", name: "Malta", n: "n = 38 · 42%", split: "15 US · 23 non-US",
    outbound: "82% outbound", ready: "37% near-term ready",
    play: "Your premium European track. More residency/citizenship-serious than Portugal's real-estate browsers — route the move-ready subset to partners faster.",
  },
  {
    flag: "🇵🇹", name: "Portugal", n: "n = 35 · 38%", split: "14 US · 21 non-US",
    outbound: "83% outbound", ready: "29% near-term ready",
    play: "The broad-appeal anchor. Widest top-of-funnel pull, longest fuse. Pair with real-estate ROI content — Portugal is the obvious vehicle.",
  },
  {
    flag: "🏝", name: "Grenada / Caribbean", n: "n = 28 · 31%", split: "16 US · 12 non-US",
    outbound: "89% outbound", ready: "36% near-term ready",
    play: "The American passport-hedge — most US-skewed segment in the set. Lead with speed-to-passport and the E-2 treaty route into the US.",
  },
  {
    flag: "🇺🇸", name: "US Residency (EB-5 / E-2)", n: "n = 22 · 24%", split: "1 US · 21 non-US",
    outbound: "18 inbound", ready: "36% near-term ready",
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

/* ─────────────────────────── HOOKS ─────────────────────────── */

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
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
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(value); return; }
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Bar({ flag, label, pct, max = 100, note }) {
  const [ref, seen] = useInView(0.3);
  const width = seen ? `${(pct / max) * 100}%` : "0%";
  return (
    <div className="bar-row" ref={ref}>
      <div className="bar-top">
        <span className="bar-name">{flag && <span className="bar-flag">{flag}</span>}{label}</span>
        <span className="bar-pct">{pct}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width, transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {note && <div className="bar-note">{note}</div>}
    </div>
  );
}

function Takeaway({ children }) {
  return (
    <div className="key-takeaway">
      <div className="kt-icon">💡</div>
      <div>
        <div className="kt-label">Key Takeaway</div>
        <div className="kt-text">{children}</div>
      </div>
    </div>
  );
}

function SectionBadge({ children }) {
  return <div className="section-badge">{children}</div>;
}

function Section({ id, badge, title, lead, children, shaded }) {
  const [ref, seen] = useInView(0.06);
  return (
    <section id={id} ref={ref} className={"sec" + (shaded ? " sec--shaded" : "") + (seen ? " sec--in" : "")}>
      <div className="sec-inner">
        {badge && <SectionBadge>{badge}</SectionBadge>}
        {title && <h2>{title}</h2>}
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function FBSPartnerReport() {
  return (
    <div className="root">
      <style>{CSS}</style>

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a href="#top" className="nav-logo">Freedom Business Summit</a>
          <a href="mailto:denis@fsummit.net" className="btn-nav">Partner with us</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-badges">
            <span className="hero-badge green">
              <span className="hero-dot pulse" />
              Virtual Event · 28–29 June 2026
            </span>
            <span className="hero-badge">Post-Event Analytics Report</span>
          </div>
          <h3 className="hero-eyebrow">Freedom Business Summit 2026</h3>
          <h1>USA Edition <span className="flag-lg">🇺🇸</span></h1>
          <h4 className="hero-tagline">Data-Driven Partner Intelligence</h4>
          <div className="hero-desc-wrap">
            <p className="hero-desc-1">
              Real audience data, intent signals, and partner opportunity summary from the June 2026 USA virtual summit.
            </p>
            <p className="hero-desc-2">
              Built for immigration firms, CBI agents, structuring specialists and relocation partners. Every data point reflects real engagement from <strong>91 qualified submissions</strong> — people actively planning their global mobility move.
            </p>
          </div>
          <div className="hero-cta">
            <a href="mailto:denis@fsummit.net" className="btn-accent">Partner with us →</a>
            <a href="#snapshot" className="btn-primary">Explore the Report</a>
          </div>
          <div className="hero-stats">
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="hero-stat-divider" />}
                <div className="hero-stat-item">
                  <span className="hero-stat-num"><CountUp value={s.value} suffix={s.suffix} /></span>
                  <span className="hero-stat-lbl">{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* SNAPSHOT */}
      <Section id="snapshot" badge="📊 The 80/20 Snapshot" title="A concentrated, pre-qualified cohort"
        lead="The median registrant is a founder or owner from professional services, 9–12 months from moving, pulled in by one dominant promise — a second residency or passport. They're planning a budget, not writing a check, but the overwhelming majority want the playbooks afterward.">
        <div className="stat-grid">
          {SNAPSHOT.map((s) => (
            <div className="metric-card" key={s.label}>
              <div className="metric-num hi"><CountUp value={s.value} suffix={s.suffix} /></div>
              <div className="metric-lbl">{s.label}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          91 deep-intent submissions — concentrated demand, not raw traffic. <strong>82% are end-clients actively seeking trusted providers</strong>; only 18% are supply. That ratio is the entire FBS Intelligence value proposition.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* LEAD QUALITY */}
      <Section id="quality" badge="🎯 Lead Quality" title="Scored, tiered and ready to route"
        lead="Every submission carries a 0–73 lead score (mean 35, median 34). The distribution gives partners a clean priority rail — and 87% pre-committed to the post-summit content bundle, the strongest single consensus in the data." shaded>
        <div className="tier-grid">
          {LEAD_TIERS.map((t) => (
            <div className="tier-card" key={t.tier}>
              <div className="tier-top">
                <span className="tier-name">{t.tier}</span>
                <span className="tier-range">{t.range}</span>
              </div>
              <div className="tier-pct">{t.pct}%</div>
              <div className="tier-note">{t.note}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>45% sit in the Hot + Warm tiers (49+ and 36–48)</strong> — engaged, budgeting and worth fast hand-off. The remainder is a maturing pipeline worth nurturing at volume.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* AUDIENCE */}
      <Section id="audience" badge="👥 Audience Profile" title="Outbound globalists, planting European flags"
        lead="74% are pointed outward — building second residencies, foreign structures and exit optionality. Jurisdiction interest is multi-select, as a share of all 91.">
        <div className="two-col">
          <div className="card">
            <div className="card-title">🏳️ Jurisdiction Interest</div>
            {JURISDICTION_INTEREST.map((b) => <Bar key={b.label} {...b} />)}
          </div>
          <div className="card">
            <div className="card-title">📋 Demographics & Status</div>
            {DEMOGRAPHICS.map((b) => <Bar key={b.label} {...b} />)}
          </div>
        </div>
        <div className="direction-split">
          <div className="direction-item">
            <div className="direction-num">74%</div>
            <div className="direction-lbl">🌍 Outbound / global mobility</div>
          </div>
          <div className="direction-div" />
          <div className="direction-item">
            <div className="direction-num">26%</div>
            <div className="direction-lbl">🇺🇸 Inbound to the US (EB-5 / E-2)</div>
          </div>
        </div>
        <Takeaway>
          <strong>74% are outbound and 43% have no second residency yet.</strong> Malta (42%), Portugal (38%) and Greece (32%) are the top three — making European partners the highest-priority category.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* FINANCIAL */}
      <Section id="financial" badge="💰 Financial Capacity" title="The money is intended, not deployed"
        lead="High-income operators with the runway to fund CBI and golden visas — but psychologically uncommitted. The financial-readiness field is the truer wealth signal here." shaded>
        <div className="card">
          {FINANCIAL_READINESS.map((b) => <Bar key={b.label} {...b} note={b.sub} />)}
        </div>
        <div className="caveat">
          ⚠️ <strong>Income data is unusable.</strong> 81 of 91 (89%) selected the identical "$150K–$350K" band — that's the form's default, not a real distribution. Treat financial-readiness above as the truer signal.
        </div>
        <Takeaway>
          Only <strong>13% are "ready to invest" or "capital allocated."</strong> The capital is real but un-triggered — this audience needs budgeting frameworks and "what does it actually cost" content before any partner pitch lands.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* STRATEGY */}
      <Section id="strategy" badge="🧭 Mobility Strategy" title="Two summits in one badge"
        lead="Self-description across all 91 — and the one split that should drive every email and ad you send.">
        <div className="card">
          {STRATEGY.map((b) => <Bar key={b.label} {...b} />)}
        </div>
        <div className="matrix">
          <div className="matrix-title">Citizenship × direction</div>
          <div className="matrix-grid">
            <div className="mc mh" />
            <div className="mc mh">Inbound to US</div>
            <div className="mc mh">Outbound / global</div>
            <div className="mc mr">🇺🇸 US citizens (40%)</div>
            <div className="mc">1</div>
            <div className="mc mhot">35</div>
            <div className="mc mr">🌍 Non-US (60%)</div>
            <div className="mc mhot">23</div>
            <div className="mc">32</div>
          </div>
        </div>
        <Takeaway>
          <strong>35 of 36 Americans are looking OUT</strong> (diversify / exit). <strong>23 foreigners are looking IN</strong> (EB-5 / E-2). Same event, opposite vectors — segment every campaign on this single variable.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* TIMELINE */}
      <Section id="timeline" badge="⏱️ Timeline Readiness" title="Two-thirds are a slow burn"
        lead="When this capital and talent will physically change coordinates — as a share of all 91. 44% say yes to relocating within 12 months, 56% say exploring." shaded>
        <div className="card">
          {TIMELINE.map((b) => <Bar key={b.label} {...b} note={b.stage} />)}
        </div>
        <div className="split-cards">
          <div className="split-card split-card--accent">
            <div className="split-num">31</div>
            <div className="split-label">Near-term & committed (34%)</div>
            <div className="split-sub">3–9 months or fully mobile — your hot hand-off list.</div>
          </div>
          <div className="split-card">
            <div className="split-num">60</div>
            <div className="split-label">Long-fuse explorers (66%)</div>
            <div className="split-sub">9–12 months or not ready — the nurture engine.</div>
          </div>
        </div>
        <Takeaway>
          Don't sell them a closing; <strong>sell them a roadmap.</strong> Set partner expectations to "warm and educatable at volume," with a reserved hot tier of ~31.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* INTENT */}
      <Section id="intent" badge="💡 Core Intent" title="What actually pulls them in the door"
        lead="Priority needs, multi-select, as a share of all 91. The headline magnet is a second passport — but borderless-business help is right behind it.">
        <div className="intent-grid">
          {PRIORITY_NEEDS.map((b) => (
            <div className="intent-row" key={b.label}>
              <div className="intent-pct">{b.pct}%</div>
              <div className="intent-lbl">{b.flag} {b.label}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>58% want residency; 51% want borderless-business help.</strong> Pair every "get a passport" hook with a "structure your business" payoff — that intersection is exactly what FBS Intelligence is built to serve.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* JURISDICTION DEEP DIVE */}
      <Section id="jurisdiction" badge="📍 Jurisdiction Demand" title="Three audiences, three messages"
        lead="Who, specifically, wants each flagship program — and how move-ready they are. Minimal overlap between the three clusters." shaded>
        <div className="juris-grid">
          {DEEP_DIVES.map((d) => (
            <div className="juris-card" key={d.name}>
              <div className="juris-head">
                <span className="juris-flag">{d.flag}</span>
                <div>
                  <div className="juris-h">{d.name}</div>
                  <div className="juris-n">{d.n}</div>
                </div>
              </div>
              <div className="juris-meta">
                <span>{d.split}</span>
                <span>{d.outbound}</span>
                <span className="juris-ready">{d.ready}</span>
              </div>
              <p className="juris-play">{d.play}</p>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>Europe = outbound volume. Caribbean = US-citizen passport hedge. EB-5 = foreign inbound.</strong> Build the mainstage around Europe; run Caribbean and EB-5 as two clearly separate satellite tracks.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* INCORPORATION */}
      <Section id="incorporation" badge="🏢 Incorporation Preferences" title="A genuine four-way split"
        lead="Where attendees would structure a new company — share of all 91. No runaway winner, and that breadth is the opportunity.">
        <div className="card">
          {INCORPORATION.map((b) => <Bar key={b.label} {...b} note={b.note} />)}
        </div>
        <Takeaway>
          "Where should I incorporate?" is a legitimate standalone session. <strong>Corporate-structuring vendors across Singapore, Estonia, Malta and the UAE all have a real audience here.</strong>
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* ROLES */}
      <Section id="roles" badge="👔 Roles & Decision Power" title="This is a buying audience"
        lead="Titles are free-text and messy; grouped by keyword into five buckets. Over half are owner/operator decision-makers who can say yes without a committee." shaded>
        <div className="roles-banner">
          <div className="roles-big">55%</div>
          <div className="roles-text">Are founders, owners and C-suite — the final decision-makers for residency, incorporation, tax structuring, and investment deals. They have the budget and authority to act immediately.</div>
        </div>
        <div className="roles-grid">
          {ROLES.map((r) => (
            <div className="role-card" key={r.label}>
              <div className="role-pct">{r.pct}%</div>
              <div className="role-lbl">{r.flag} {r.label}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>55% are founders, owners or C-suite.</strong> They buy for themselves, so the pitch is personal freedom + business leverage — not enterprise procurement.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* INDUSTRY */}
      <Section id="industry" badge="🏭 Industry Breakdown" title="Owner-level, advice-and-services, portable"
        lead="No single industry dominates. The common thread is people who run advice-and-services businesses from anywhere — and that portability is exactly why global mobility resonates.">
        <div className="industry-items">
          {INDUSTRIES.map((b) => (
            <div className="ind-item" key={b.label}>
              <div className="ind-left">
                <span className="ind-emoji">{b.flag}</span>
                <span className="ind-name">{b.label}</span>
              </div>
              <div className="ind-right">
                <div className="ind-pct">{b.pct}%</div>
                <div className="ind-tag">{b.note}</div>
              </div>
            </div>
          ))}
        </div>
        <Takeaway>
          Professional services (35%) leads on headcount; <strong>real estate (14%) is small in volume but high in deal-intent</strong> — mapping directly onto the Portugal / Greece property hooks.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* KEY FINDINGS */}
      <Section id="findings" badge="🗝️ The Single-Page Verdict" title="Six findings for partners"
        lead="If you read nothing else, read these." shaded>
        <div className="insights-list">
          {KEY_FINDINGS.map((f) => (
            <div className="insight" key={f.n}>
              <div className="insight-num">{f.n}</div>
              <div className="insight-text"><strong>{f.lead}</strong> {f.body}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          The data is unambiguous: the #1 thing this audience wants is access to <strong>trusted providers (82%).</strong> FBS is the bridge — and partnering is how you get introduced.
        </Takeaway>
      </Section>

      <div className="divider" />

      {/* SUMMIT SERIES */}
      <Section id="series" badge="🚀 Execution Layer" title="The Summit Series"
        lead="Each edition is built around one thing: maximizing outcomes in a specific region — residency pipelines, capital deployment, structuring and relocation execution.">
        <div className="editions-grid">
          {SUMMITS.map((s) => (
            <div className="edition-card" key={s.title}>
              <div className="edition-when">{s.when}</div>
              <div className="edition-title">{s.title}</div>
              <div className="edition-desc">{s.desc}</div>
              <a href="mailto:denis@fsummit.net" className="edition-link">Apply to join, speak or partner →</a>
            </div>
          ))}
        </div>
      </Section>

      <div className="divider" />

      {/* PARTNER CTA */}
      <section className="partner-cta" id="partner">
        <div className="partner-cta-inner">
          <SectionBadge>Partnership Opportunities</SectionBadge>
          <h2>Ready to Partner with<br />Freedom Business Summit?</h2>
          <p>Get direct access to qualified, high-intent founders and investors actively planning their global mobility strategy right now.</p>
          <div className="cta-btns">
            <a href="mailto:denis@fsummit.net" className="btn-green-cta">Partner with us →</a>
            <a href="mailto:denis@fsummit.net" className="btn-white-cta">Request Speaking Access</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="flogo">Freedom Business Summit</div>
          <p>© 2026 Freedom Business Summit. Prepared from 91 USA-edition submissions through 28 Jun 2026.</p>
          <div className="footer-links">
            <a href="https://fsummit.net" target="_blank" rel="noreferrer">fsummit.net ↗</a>
            <a href="mailto:denis@fsummit.net">Contact us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────── CSS ─────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
.root{
  --green:#22c55e;
  --green-dark:#16a34a;
  --ink:#111827;
  --muted:#6b7280;
  --border:#e5e7eb;
  --bg:#ffffff;
  --bg-shaded:#f9fafb;
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  color:var(--ink);
  background:var(--bg);
  -webkit-font-smoothing:antialiased;
  line-height:1.5;
}

/* NAV */
nav{
  position:sticky;top:0;z-index:50;
  background:rgba(255,255,255,0.95);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border);
}
.nav-inner{
  max-width:1080px;margin:0 auto;padding:0 24px;
  display:flex;align-items:center;justify-content:space-between;height:64px;
}
.nav-logo{
  font-size:16px;font-weight:800;color:var(--ink);text-decoration:none;letter-spacing:-.01em;
}
.btn-nav{
  font-size:14px;font-weight:700;color:var(--ink);
  border:1.5px solid var(--border);border-radius:999px;
  padding:8px 18px;text-decoration:none;transition:border-color .2s,background .2s;
}
.btn-nav:hover{background:var(--ink);color:#fff;border-color:var(--ink);}

/* HERO */
.hero{
  background:#fff;
  border-bottom:1px solid var(--border);
  padding:72px 0 64px;
}
.hero-inner{max-width:1080px;margin:0 auto;padding:0 24px;}

.hero-badges{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;}
.hero-badge{
  display:inline-flex;align-items:center;gap:7px;
  font-size:13px;font-weight:600;
  border:1.5px solid var(--border);border-radius:999px;
  padding:6px 14px;color:var(--muted);
}
.hero-badge.green{border-color:#bbf7d0;color:#15803d;background:#f0fdf4;}
.hero-dot{
  width:8px;height:8px;border-radius:50%;background:var(--green);flex-shrink:0;
}
.hero-dot.pulse{animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(1.3);}}

.hero-eyebrow{font-size:15px;font-weight:600;color:var(--muted);margin-bottom:8px;}
h1{
  font-size:clamp(44px,8vw,86px);font-weight:900;
  letter-spacing:-.04em;line-height:.96;margin-bottom:16px;
  color:var(--ink);
}
.flag-lg{font-weight:400;}
.hero-tagline{font-size:clamp(16px,2vw,20px);font-weight:600;color:var(--green-dark);margin-bottom:24px;}

.hero-desc-wrap{max-width:680px;margin-bottom:36px;}
.hero-desc-1{font-size:clamp(15px,1.8vw,17px);color:var(--muted);margin-bottom:12px;line-height:1.6;}
.hero-desc-2{font-size:clamp(15px,1.8vw,17px);color:var(--muted);line-height:1.6;}
.hero-desc-2 strong{color:var(--ink);}

.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px;}
.btn-accent{
  display:inline-flex;align-items:center;
  background:var(--green);color:#fff;font-weight:700;font-size:15px;
  border-radius:999px;padding:13px 26px;text-decoration:none;
  transition:background .2s,transform .15s;
}
.btn-accent:hover{background:var(--green-dark);transform:translateY(-2px);}
.btn-primary{
  display:inline-flex;align-items:center;
  background:var(--ink);color:#fff;font-weight:700;font-size:15px;
  border-radius:999px;padding:13px 26px;text-decoration:none;
  transition:background .2s,transform .15s;
}
.btn-primary:hover{background:#374151;transform:translateY(-2px);}

.hero-stats{
  display:flex;align-items:center;flex-wrap:wrap;gap:0;
  border-top:1px solid var(--border);padding-top:32px;
}
.hero-stat-item{display:flex;flex-direction:column;padding:0 32px 0 0;gap:4px;}
.hero-stat-item:first-child{padding-left:0;}
.hero-stat-num{font-size:clamp(30px,4vw,42px);font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;}
.hero-stat-lbl{font-size:13px;color:var(--muted);font-weight:500;}
.hero-stat-divider{width:1px;height:52px;background:var(--border);margin:0 32px 0 0;flex-shrink:0;}

/* SECTIONS */
.sec{padding:72px 0;opacity:0;transform:translateY(18px);transition:opacity .65s ease,transform .65s ease;}
.sec--in{opacity:1;transform:none;}
.sec--shaded{background:var(--bg-shaded);}
.sec-inner{max-width:1080px;margin:0 auto;padding:0 24px;}
.section-badge{
  display:inline-block;font-size:12px;font-weight:800;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--green-dark);margin-bottom:14px;
}
h2{
  font-size:clamp(26px,4vw,40px);font-weight:900;
  letter-spacing:-.03em;line-height:1.05;margin-bottom:16px;
  max-width:760px;
}
.lead{font-size:clamp(15px,1.8vw,17px);color:var(--muted);max-width:720px;margin-bottom:36px;line-height:1.6;}

.divider{height:1px;background:var(--border);}

/* METRIC CARDS */
.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}
.metric-card{
  background:#fff;border:1.5px solid var(--border);border-radius:16px;
  padding:24px 22px;transition:transform .2s,box-shadow .2s,border-color .2s;
}
.metric-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.06);border-color:#86efac;}
.metric-num{font-size:clamp(32px,4.5vw,46px);font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--muted);}
.metric-num.hi{color:var(--green-dark);}
.metric-lbl{font-size:13.5px;color:var(--muted);margin-top:8px;line-height:1.4;}

/* TIER CARDS */
.tier-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.tier-card{
  background:#fff;border:1.5px solid var(--border);border-radius:16px;
  padding:22px 20px;transition:transform .2s,border-color .2s;
}
.tier-card:hover{transform:translateY(-3px);border-color:#86efac;}
.tier-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;}
.tier-name{font-size:15px;font-weight:800;color:var(--ink);}
.tier-range{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;}
.tier-pct{font-size:38px;font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;}
.tier-note{font-size:13px;color:var(--muted);margin-top:8px;line-height:1.4;}

/* CARDS */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.card{
  background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:26px 24px;
  margin-bottom:16px;
}
.sec--shaded .card{background:#fff;}
.card-title{font-size:12.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:18px;}

/* BARS */
.bar-row{margin-bottom:16px;}
.bar-row:last-child{margin-bottom:0;}
.bar-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:6px;}
.bar-name{font-size:14px;font-weight:600;color:var(--ink);}
.bar-flag{margin-right:6px;}
.bar-pct{font-size:14px;font-weight:900;color:var(--green-dark);font-variant-numeric:tabular-nums;white-space:nowrap;}
.bar-track{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden;}
.bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green-dark),var(--green));}
.bar-note{font-size:12px;color:var(--muted);margin-top:5px;}

/* DIRECTION SPLIT */
.direction-split{
  display:flex;align-items:center;gap:0;
  background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:28px;
  margin-bottom:16px;
}
.direction-item{flex:1;text-align:center;}
.direction-num{font-size:clamp(36px,5vw,52px);font-weight:900;letter-spacing:-.04em;color:var(--ink);line-height:1;}
.direction-lbl{font-size:14px;color:var(--muted);margin-top:6px;}
.direction-div{width:1px;align-self:stretch;background:var(--border);margin:0 28px;}

/* CAVEAT */
.caveat{
  background:#fefce8;border:1.5px solid #fde047;border-radius:14px;
  padding:18px 20px;margin-bottom:16px;font-size:14px;color:#713f12;line-height:1.55;
}
.caveat strong{color:#431407;}

/* MATRIX */
.matrix{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px;}
.matrix-title{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
.matrix-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
.mc{background:#fff;padding:14px 16px;font-size:14.5px;font-weight:700;display:flex;align-items:center;justify-content:center;color:var(--ink);font-variant-numeric:tabular-nums;}
.mh{background:#f9fafb;color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;}
.mr{justify-content:flex-start;color:var(--ink);font-size:13.5px;}
.mhot{color:#fff;background:var(--green);font-weight:900;font-size:18px;}

/* SPLIT CARDS */
.split-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.split-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:24px;}
.split-card--accent{background:var(--ink);border-color:var(--ink);}
.split-num{font-size:46px;font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--ink);}
.split-card--accent .split-num{color:var(--green);}
.split-label{font-size:15px;font-weight:800;margin-top:8px;color:var(--ink);}
.split-card--accent .split-label{color:#fff;}
.split-sub{font-size:13px;color:var(--muted);margin-top:5px;line-height:1.4;}
.split-card--accent .split-sub{color:rgba(255,255,255,.66);}

/* INTENT */
.intent-grid{margin-bottom:16px;}
.intent-row{display:flex;align-items:baseline;gap:18px;padding:16px 0;border-bottom:1px solid var(--border);}
.intent-row:first-child{border-top:1px solid var(--border);}
.intent-pct{font-size:24px;font-weight:900;letter-spacing:-.03em;color:var(--green-dark);min-width:60px;font-variant-numeric:tabular-nums;}
.intent-lbl{font-size:15px;color:var(--ink);line-height:1.4;}

/* JURISDICTION */
.juris-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.juris-card{
  background:#fff;border:1.5px solid var(--border);border-radius:16px;
  padding:24px;transition:transform .2s,border-color .2s;
}
.juris-card:hover{transform:translateY(-3px);border-color:#86efac;}
.juris-head{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.juris-flag{font-size:28px;}
.juris-h{font-size:17px;font-weight:800;color:var(--ink);}
.juris-n{font-size:13px;color:var(--green-dark);font-weight:700;margin-top:2px;}
.juris-meta{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px;}
.juris-meta span{font-size:12px;font-weight:600;color:var(--muted);background:var(--bg-shaded);border-radius:999px;padding:4px 10px;border:1px solid var(--border);}
.juris-ready{color:#15803d!important;background:#f0fdf4!important;border-color:#bbf7d0!important;}
.juris-play{font-size:13.5px;color:var(--muted);line-height:1.55;margin:0;}

/* ROLES */
.roles-banner{
  display:flex;align-items:center;gap:24px;
  background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:16px;
  padding:28px;margin-bottom:16px;
}
.roles-big{font-size:clamp(48px,7vw,72px);font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;flex-shrink:0;}
.roles-text{font-size:15px;color:#15803d;line-height:1.55;}
.roles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;}
.role-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:20px 18px;}
.role-pct{font-size:26px;font-weight:900;letter-spacing:-.03em;color:var(--green-dark);}
.role-lbl{font-size:13px;color:var(--muted);margin-top:6px;line-height:1.4;}

/* INDUSTRY */
.industry-items{margin-bottom:16px;}
.ind-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 0;border-bottom:1px solid var(--border);gap:16px;
}
.ind-item:first-child{border-top:1px solid var(--border);}
.ind-left{display:flex;align-items:center;gap:12px;}
.ind-emoji{font-size:22px;}
.ind-name{font-size:15px;font-weight:700;color:var(--ink);}
.ind-right{text-align:right;flex-shrink:0;}
.ind-pct{font-size:22px;font-weight:900;color:var(--green-dark);letter-spacing:-.03em;}
.ind-tag{font-size:12px;color:var(--muted);margin-top:3px;max-width:260px;text-align:right;}

/* INSIGHTS */
.insights-list{margin-bottom:16px;}
.insight{display:flex;gap:20px;padding:20px 0;border-bottom:1px solid var(--border);}
.insight:first-child{border-top:1px solid var(--border);}
.insight-num{font-size:13px;font-weight:900;color:var(--green-dark);letter-spacing:.05em;min-width:28px;padding-top:2px;}
.insight-text{font-size:15px;color:var(--ink);line-height:1.55;}
.insight-text strong{color:var(--ink);font-weight:800;}

/* EDITIONS */
.editions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.edition-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:26px;transition:transform .2s,border-color .2s;}
.edition-card:hover{transform:translateY(-3px);border-color:#86efac;}
.edition-when{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--green-dark);margin-bottom:10px;}
.edition-title{font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px;}
.edition-desc{font-size:14px;color:var(--muted);line-height:1.5;margin-bottom:16px;}
.edition-link{font-size:13.5px;font-weight:700;color:var(--green-dark);text-decoration:none;}
.edition-link:hover{text-decoration:underline;}

/* KEY TAKEAWAY */
.key-takeaway{
  display:flex;align-items:flex-start;gap:14px;
  background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;
  padding:22px;margin-top:16px;
}
.kt-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.kt-label{font-size:11.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--green-dark);margin-bottom:6px;}
.kt-text{font-size:15px;color:#14532d;line-height:1.55;}
.kt-text strong{color:#14532d;font-weight:800;}

/* PARTNER CTA */
.partner-cta{background:var(--ink);color:#fff;padding:88px 0;text-align:center;}
.partner-cta-inner{max-width:640px;margin:0 auto;padding:0 24px;}
.partner-cta .section-badge{color:#86efac;display:block;text-align:center;}
.partner-cta h2{color:#fff;max-width:none;margin:0 auto 16px;}
.partner-cta p{font-size:17px;color:rgba(255,255,255,.7);margin-bottom:36px;line-height:1.6;}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-green-cta{
  display:inline-flex;align-items:center;
  background:var(--green);color:#fff;font-weight:700;font-size:15px;
  border-radius:999px;padding:13px 28px;text-decoration:none;
  transition:background .2s,transform .15s;
}
.btn-green-cta:hover{background:var(--green-dark);transform:translateY(-2px);}
.btn-white-cta{
  display:inline-flex;align-items:center;
  background:transparent;color:#fff;font-weight:700;font-size:15px;
  border:1.5px solid rgba(255,255,255,.3);border-radius:999px;padding:13px 28px;text-decoration:none;
  transition:border-color .2s,transform .15s;
}
.btn-white-cta:hover{border-color:#fff;transform:translateY(-2px);}

/* FOOTER */
footer{background:#030712;color:#fff;padding:40px 0;}
.footer-inner{max-width:1080px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:14px;}
.flogo{font-size:16px;font-weight:800;color:#fff;}
footer p{font-size:13px;color:rgba(255,255,255,.45);}
.footer-links{display:flex;gap:22px;}
.footer-links a{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.55);text-decoration:none;}
.footer-links a:hover{color:var(--green);}

/* RESPONSIVE */
@media(max-width:860px){
  .hero-stats{flex-direction:column;gap:24px;}
  .hero-stat-divider{width:100%;height:1px;margin:0;}
  .hero-stat-item{padding:0;}
  .stat-grid{grid-template-columns:1fr 1fr;}
  .two-col,.juris-grid,.split-cards{grid-template-columns:1fr;}
  .tier-grid{grid-template-columns:1fr 1fr;}
  .editions-grid{grid-template-columns:1fr;}
  .roles-grid{grid-template-columns:1fr 1fr;}
  .direction-split{flex-direction:column;gap:20px;}
  .direction-div{width:100%;height:1px;margin:0;}
}
@media(max-width:520px){
  .sec{padding:52px 0;}
  .hero{padding:52px 0 44px;}
  .stat-grid,.tier-grid,.roles-grid{grid-template-columns:1fr;}
  .matrix-grid{font-size:12px;}
  .mc{padding:11px 9px;}
  .ind-tag{display:none;}
  .roles-banner{flex-direction:column;text-align:center;}
}
@media(prefers-reduced-motion:reduce){
  .sec{transition:none;opacity:1;transform:none;}
  .bar-fill{transition:none;}
}
`;
