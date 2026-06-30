"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─────────────────────────── DATA ─────────────────────────── */

const HERO_STATS = [
  { value: 91, suffix: "", label: "Qualified Submissions" },
  { value: 82, suffix: "%", label: "Seeking Trusted Providers" },
  { value: 87, suffix: "%", label: "Want Playbooks After" },
  { value: 34, suffix: "%", label: "Near-Term / Move-Ready" },
];

const JURISDICTION_INTEREST = [
  { flag: "🇲🇹", label: "Malta — Residency & Citizenship", pct: 42 },
  { flag: "🇵🇹", label: "Portugal — Golden Visa", pct: 38 },
  { flag: "🇬🇷", label: "Greece — Real Estate & Residency", pct: 32 },
  { flag: "🏝", label: "Caribbean / Grenada — Citizenship", pct: 31 },
  { flag: "🇺🇸", label: "US Green Card (EB-5)", pct: 24 },
  { flag: "🇦🇪", label: "Dubai / UAE — Residency", pct: 22 },
];

const FINANCIAL_READINESS = [
  { label: "Planning a Budget", pct: 59, sub: "Liquid capital, active due diligence on allocation", dark: true },
  { label: "Exploring Options", pct: 27, sub: "Watching the macro, setting milestones first", dark: false },
  { label: "Ready to Invest", pct: 11, sub: "Trigger-ready, seeking the right framework", dark: false },
];

const INCOME_BRACKETS = [
  { label: "$150K – $300K", pct: 84, sub: "Dominant income segment — budget-ready for residency, incorporation and tax structuring", dark: true },
  { label: "$300K – $500K", pct: 10, sub: "Ultra-high income with appetite for European CBI programs and structured tax exits", dark: false },
  { label: "$500K – $1M+", pct: 6, sub: "Prime targets for Malta ENI, Grenada CBI, and premium citizenship-by-investment programs", dark: false },
];

const FINANCIAL_POWDER = [
  { pct: "2%", desc: "Capital fully allocated — escrow / structure prepared, immediate deployment" },
  { pct: "13%", desc: "Capital-ready (invested + allocated) — the direct deal-conversion segment for partners" },
  { pct: "87%", desc: "Pre-committed to the post-summit content bundle — the strongest consensus in the dataset" },
];

const LEAD_TIERS = [
  { tier: "Hot", range: "Score 49+", pct: 16, note: "Trigger-ready — route to partners immediately" },
  { tier: "Warm", range: "Score 36–48", pct: 29, note: "Engaged and actively budgeting" },
  { tier: "Qualified", range: "Score 25–35", pct: 33, note: "Real intent, longer decision fuse" },
  { tier: "Nurture", range: "Score <25", pct: 22, note: "Early-stage — feed the education engine" },
];

const PRIORITY_NEEDS = [
  { flag: "✈️", label: "Relocation / 2nd residency / citizenship", pct: 58 },
  { flag: "💻", label: "Building & scaling a borderless business", pct: 51 },
  { flag: "🧾", label: "Offshore strategies — legal tax minimization", pct: 35 },
  { flag: "💵", label: "Tax optimization & entity structuring", pct: 33 },
  { flag: "🏠", label: "Real estate investment — PT / GR / LATAM", pct: 29 },
  { flag: "🛡", label: "Health, mobility & family safety net", pct: 20 },
];

const TIMELINE = [
  { label: "Exploring options — 9 to 12 months", pct: 52, tag: "Top of funnel" },
  { label: "Not ready — still tracking the market", pct: 14, tag: "Top of funnel" },
  { label: "Planning — 6 to 9 months", pct: 12, tag: "Mid funnel" },
  { label: "Ready to move — 3 to 6 months", pct: 12, tag: "Bottom funnel" },
  { label: "Fully mobile / already in process", pct: 10, tag: "Bottom funnel" },
];

const DEEP_DIVES = [
  {
    flag: "🇲🇹", name: "Malta", n: "42%", split: "15 US · 23 non-US",
    outbound: "82% outbound", ready: "37% near-term ready",
    play: "Premium European track. More citizenship-serious than Portugal's real-estate browsers. Route the move-ready subset to partners immediately.",
  },
  {
    flag: "🇵🇹", name: "Portugal", n: "38%", split: "14 US · 21 non-US",
    outbound: "83% outbound", ready: "29% near-term ready",
    play: "The broad-appeal anchor. Widest top-of-funnel pull with longest decision fuse. Pair with real-estate ROI content.",
  },
  {
    flag: "🏝", name: "Caribbean / Grenada", n: "31%", split: "16 US · 12 non-US",
    outbound: "89% outbound", ready: "36% near-term ready",
    play: "The American passport-hedge — most US-skewed segment. Lead with speed-to-passport and the E-2 treaty route into the US.",
  },
  {
    flag: "🇺🇸", name: "US Residency (EB-5 / E-2)", n: "24%", split: "1 US · 21 non-US",
    outbound: "Inbound — 18 of 22", ready: "36% near-term ready",
    play: "The inbound engine — almost entirely foreign nationals. Requires a separate funnel, separate copy, and dedicated partners.",
  },
];

const INCORPORATION = [
  { flag: "🇸🇬", label: "Singapore", pct: 29, note: "Tier-1 reputation, territorial tax, strong banking" },
  { flag: "🇪🇪", label: "Estonia (e-Residency)", pct: 27, note: "Digital-first, 0% on undistributed profits" },
  { flag: "🇲🇹", label: "Malta", pct: 23, note: "EU access, effective 5% corporate rate via refunds" },
  { flag: "🇦🇪", label: "UAE", pct: 21, note: "0% personal income tax, MENA gateway" },
];

const ROLES = [
  { flag: "👑", label: "Founders, Owners & C-Suite", pct: 55, note: "CEO, Owner, Founder, Partner, MD, President" },
  { flag: "⚖️", label: "Advisors, Legal & Business Dev", pct: 15, note: "Attorney, Investment Advisor, BD" },
  { flag: "🏥", label: "Healthcare, Education & Specialists", pct: 11, note: "Medical Director, Professor, Therapist" },
  { flag: "💻", label: "Tech & Engineering", pct: 8, note: "Developer, SDET, Project Engineer, PM" },
  { flag: "🧩", label: "Other", pct: 11, note: "Manager, retired, reinventing" },
];

const INDUSTRIES = [
  { flag: "📊", label: "Professional Services, Legal & Finance", pct: 35, note: "Consulting, legal, finance, marketing" },
  { flag: "✈️", label: "Hospitality, Travel, Education & Creative", pct: 26, note: "Tourism, EdTech, events, journalism" },
  { flag: "💻", label: "Tech, Engineering & Software", pct: 19, note: "Software, IT, automation, crypto / AI" },
  { flag: "🏠", label: "Real Estate, Property & Construction", pct: 14, note: "Development, property, construction" },
  { flag: "🏥", label: "Healthcare & Wellness", pct: 5, note: "Medicine, mental health, wellness" },
];

const KEY_FINDINGS = [
  { n: "01", lead: "Lead with Europe — segment by mobility direction.", body: "Malta / Portugal / Greece are the gravity. 35 Americans are going out; 23 foreigners are coming in. That split is the line every campaign branches on." },
  { n: "02", lead: "Sell a roadmap, not a close.", body: "66% are 9 to 12 months out and budgeting. Nurture wins at volume; reserve a hot tier of ~31 respondents for immediate partner hand-off." },
  { n: "03", lead: "Pair passport with business structure.", body: "58% want residency. 51% want borderless-business help. The winning hook does both in one sentence." },
  { n: "04", lead: "Teach the cost before the pitch.", body: "Only 13% are capital-ready. This audience needs 'what does it actually cost' content before any partner offer lands." },
  { n: "05", lead: "The 82 / 18 ratio is the business model.", body: "82% are demand-side end-clients. 18% are supply. Capture that cleanly and route the 18% to the partner conversation — not the lead pool." },
  { n: "06", lead: "87% pre-committed to the content bundle.", body: "The strongest single consensus in the dataset — a clear green light for the post-summit playbook and intelligence product." },
];

const SUMMITS = [
  { when: "28–29 Jun 2026", title: "🇺🇸 USA Edition", desc: "This report. Outbound structuring, EB-5 flows, cross-border diversification." },
  { when: "Sep 2026", title: "🏝 Caribbean Edition", desc: "Citizenship-by-investment, E-2 treaty routes, fast-track second passports." },
  { when: "Q1 2027", title: "🇪🇺 Europe Edition", desc: "Golden visas, Malta / Portugal / Greece, jurisdictional arbitrage." },
];

/* ─────────────────────────── HOOKS ─────────────────────────── */

function useInView(threshold = 0.15) {
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

function CountUp({ value, suffix = "", duration = 1200 }) {
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
  const [ref, seen] = useInView(0.2);
  return (
    <div className="bar-row" ref={ref}>
      <div className="bar-top">
        <span className="bar-name">{flag && <span className="bar-flag">{flag}</span>}{label}</span>
        <span className="bar-pct">{pct}%</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: seen ? `${(pct / max) * 100}%` : "0%", transition: "width 1.1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {note && <div className="bar-note">{note}</div>}
    </div>
  );
}

function Takeaway({ children }) {
  return (
    <div className="kt">
      <div className="kt-icon">💡</div>
      <div>
        <div className="kt-label">Key Takeaway</div>
        <div className="kt-text">{children}</div>
      </div>
    </div>
  );
}

function Sec({ id, num, badge, title, lead, children, shaded }) {
  const [ref, seen] = useInView(0.05);
  return (
    <section id={id} ref={ref} className={"sec" + (shaded ? " sec--shaded" : "") + (seen ? " sec--in" : "")}>
      <div className="sec-inner">
        <div className="sec-meta">
          {num && <span className="sec-num">{num}</span>}
          {badge && <span className="sec-badge">{badge}</span>}
        </div>
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

      {/* ── HERO ── */}
      <div className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-badges">
            <span className="hero-badge green">
              <span className="hero-dot pulse" />
              Virtual Event · 28–29 June 2026
            </span>
            <span className="hero-badge">Post-Event Analytics Report</span>
          </div>
          <h3 className="hero-eyebrow">Freedom Business Summit 2026</h3>
          <h1>America Mobility Edition <span className="flag-lg">🇺🇸</span></h1>
          <h4 className="hero-tagline">Data-Driven Partner Intelligence</h4>
          <div className="hero-desc-wrap">
            <p className="hero-desc-1">Real audience data, intent signals, and partner opportunity summary from the June 2026 USA virtual summit.</p>
            <p className="hero-desc-2">Built for immigration firms, CBI agents, and relocation partners. Every data point reflects real engagement from people actively planning their global mobility move.</p>
          </div>
          <div className="hero-cta">
            <a href="mailto:denis@fsummit.net" className="btn-accent">Partner with us →</a>
            <a href="#summary" className="btn-primary">Explore the Report</a>
          </div>
          <div className="hero-stats">
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="hs-div" />}
                <div className="hs-item">
                  <span className="hs-num"><CountUp value={s.value} suffix={s.suffix} /></span>
                  <span className="hs-lbl">{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── 01 EXECUTIVE SUMMARY ── */}
      <Sec id="summary" num="01" badge="📊 Executive Summary"
        title="A Concentrated, Pre-Qualified Cohort — Not Raw Traffic"
        lead="91 deep-intent submissions from founders, owners and C-suite professionals actively planning a global mobility move. The median respondent is 9 to 12 months from action, building a budget, and pulled in by a single promise: a second residency or passport.">
        <div className="snapshot-grid">
          <div className="snap-card snap-card--dark">
            <div className="snap-num"><CountUp value={82} suffix="%" /></div>
            <div className="snap-lbl">End-clients actively seeking trusted providers</div>
            <div className="snap-sub">Only 18% are supply-side. That ratio is the FBS Intelligence value proposition.</div>
          </div>
          <div className="snap-card">
            <div className="snap-num c-green"><CountUp value={87} suffix="%" /></div>
            <div className="snap-lbl">Pre-committed to post-summit playbooks</div>
            <div className="snap-sub">Strongest single consensus in the dataset.</div>
          </div>
          <div className="snap-card">
            <div className="snap-num c-green"><CountUp value={55} suffix="%" /></div>
            <div className="snap-lbl">Founders, owners & C-suite</div>
            <div className="snap-sub">Direct buying authority — no procurement committee.</div>
          </div>
          <div className="snap-card">
            <div className="snap-num c-green"><CountUp value={74} suffix="%" /></div>
            <div className="snap-lbl">Outbound / global mobility focus</div>
            <div className="snap-sub">26% are inbound to the US via EB-5 / E-2.</div>
          </div>
          <div className="snap-card">
            <div className="snap-num c-green"><CountUp value={34} suffix="%" /></div>
            <div className="snap-lbl">Near-term or move-ready (3–9 months)</div>
            <div className="snap-sub">~31 respondents ready for immediate partner hand-off.</div>
          </div>
          <div className="snap-card">
            <div className="snap-num c-green"><CountUp value={58} suffix="%" /></div>
            <div className="snap-lbl">Top demand: second residency or citizenship</div>
            <div className="snap-sub">51% also want borderless-business help — the key combination.</div>
          </div>
        </div>
        <Takeaway>
          This is a pre-qualified, scored cohort — not raw registrations. <strong>82% are demand-side clients seeking service providers.</strong> Partners enter a curated pipeline, not a cold list.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 02 AUDIENCE PROFILE ── */}
      <Sec id="audience" num="02" badge="👥 Audience Profile" shaded
        title="Who Is the Audience?"
        lead="High-income, action-oriented globalists. Tax efficiency and additional mobility options while scaling internationally.">

        {/* Direction Split */}
        <div className="dir-cards">
          <div className="dir-card dir-card--main">
            <div className="dir-pct">74%</div>
            <div className="dir-title">🌍 Outbound / Global Mobility</div>
            <div className="dir-desc">US citizens and non-US nationals building second residencies, offshore structures, and exit optionality. Europe (Malta, Portugal, Greece) is the dominant destination cluster.</div>
            <div className="dir-breakdown">
              <div className="dir-row"><span>🇺🇸 US citizens going outbound</span><strong>97% of US respondents</strong></div>
              <div className="dir-row"><span>🌍 Non-US going outbound</span><strong>53% of non-US respondents</strong></div>
            </div>
          </div>
          <div className="dir-card">
            <div className="dir-pct c-muted">26%</div>
            <div className="dir-title">🇺🇸 Inbound to the US</div>
            <div className="dir-desc">Almost entirely foreign nationals pursuing EB-5 or E-2 treaty visas. Requires a separate funnel, separate messaging, and dedicated partners.</div>
            <div className="dir-breakdown">
              <div className="dir-row"><span>Non-US nationals seeking US entry</span><strong>21 of 22 respondents</strong></div>
              <div className="dir-row"><span>Primary track</span><strong>EB-5 / E-2 Treaty Investor</strong></div>
            </div>
          </div>
        </div>

        {/* Most Requested Jurisdictions */}
        <div className="panel-title" style={{marginTop:"32px",marginBottom:"16px"}}>🏳️ Most Requested Jurisdictions — Ranked by Demand</div>
        <div className="juris-ranked">
          {JURISDICTION_INTEREST.map((j, i) => (
            <div className="jr-row" key={j.label}>
              <span className="jr-rank">#{i + 1}</span>
              <span className="jr-flag">{j.flag}</span>
              <span className="jr-label">{j.label}</span>
              <span className="jr-pct">{j.pct}%</span>
              <div className="jr-bar-wrap">
                <Bar label="" pct={j.pct} />
              </div>
            </div>
          ))}
        </div>

        <Takeaway>
          <strong>74% are outbound and 43% have no second residency yet.</strong> Malta (42%), Portugal (38%) and Greece (32%) are the top three — making European partners the highest-priority partner category.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 03 FINANCIAL CAPACITY ── */}
      <Sec id="financial" num="03" badge="💰 Financial Capacity"
        title="A Buying Audience with Capital to Deploy"
        lead="High-income operators with the runway to fund CBI and golden visas — but psychologically uncommitted. Financial readiness is the truer signal than income bracket.">

        <div className="fin-top-grid">
          {FINANCIAL_READINESS.map((f) => (
            <div key={f.label} className={"fin-card" + (f.dark ? " fin-card--dark" : "")}>
              <div className="fin-pct">{f.pct}%</div>
              <div className="fin-lbl">{f.label}</div>
              <div className="fin-desc">{f.sub}</div>
            </div>
          ))}
        </div>

        <div className="fin-bottom-grid">
          {FINANCIAL_POWDER.map((p) => (
            <div key={p.pct} className="powder-card">
              <div className="powder-num">{p.pct}</div>
              <div className="powder-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="panel-title" style={{marginTop:"28px",marginBottom:"16px"}}>💵 Income Breakdown</div>
        <div className="fin-top-grid">
          {INCOME_BRACKETS.map((f) => (
            <div key={f.label} className={"fin-card" + (f.dark ? " fin-card--dark" : "")}>
              <div className="fin-pct">{f.pct}%</div>
              <div className="fin-lbl">{f.label}</div>
              <div className="fin-desc">{f.sub}</div>
            </div>
          ))}
        </div>

        <Takeaway>
          Only <strong>13% are capital-ready.</strong> The capital is real but un-triggered — this audience needs "what does it actually cost" content before any partner pitch lands.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 04 LEAD QUALITY ── */}
      <Sec id="quality" num="04" badge="🎯 Lead Quality" shaded
        title="A Scored, Tiered Pipeline Ready for Partner Routing"
        lead="Every submission carries a 0–73 lead score (mean 35, median 34). The distribution gives partners a clean priority rail — Hot to Nurture — with no guesswork.">
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
        <div className="pipeline-split">
          <div className="ps-card ps-card--hot">
            <div className="ps-num">45%</div>
            <div className="ps-lbl">Hot + Warm — fast-track to partners</div>
            <div className="ps-sub">Engaged, budgeting, and ready for an introduction.</div>
          </div>
          <div className="ps-card">
            <div className="ps-num">55%</div>
            <div className="ps-lbl">Qualified + Nurture — the long-game pipeline</div>
            <div className="ps-sub">Real intent, longer fuse. Volume nurture at low cost per touch.</div>
          </div>
        </div>
        <Takeaway>
          <strong>45% sit in the Hot + Warm tiers</strong> — engaged, budgeting, worth fast hand-off. The remaining 55% is a maturing pipeline that grows in value over the following two quarters.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 05 MOBILITY STRATEGY & TIMELINE ── */}
      <Sec id="strategy" num="05" badge="🧭 Mobility Strategy & Timeline"
        title="34% Are Immediately Actionable — 66% Require a Nurture Play"
        lead="Self-description across all 91 respondents. The critical variable: mobility direction. It determines messaging, partner type, and everything downstream.">

        <div className="strat-grid">
          <div className="strat-card strat-card--accent">
            <div className="strat-pct">45%</div>
            <div className="strat-lbl">🧑‍🤝‍🧑 Individual or family exploring relocation</div>
          </div>
          <div className="strat-card strat-card--accent">
            <div className="strat-pct">41%</div>
            <div className="strat-lbl">🏢 Business owner exploring expansion or structuring</div>
          </div>
          <div className="strat-card">
            <div className="strat-pct">9%</div>
            <div className="strat-lbl">🛰 Service provider in the industry</div>
          </div>
          <div className="strat-card">
            <div className="strat-pct">5%</div>
            <div className="strat-lbl">📈 Investor exploring internationally</div>
          </div>
        </div>

        <div className="panel-title" style={{marginTop:"32px", marginBottom:"16px"}}>⏱️ When This Capital Will Move</div>
        <div className="card" style={{marginBottom:"16px"}}>
          {TIMELINE.map((b) => <Bar key={b.label} label={b.label} pct={b.pct} note={b.tag} />)}
        </div>

        <div className="pipeline-split">
          <div className="ps-card ps-card--hot">
            <div className="ps-num">34%</div>
            <div className="ps-lbl">Near-term & committed</div>
            <div className="ps-sub">3–9 months out or fully mobile. Your hot hand-off list.</div>
          </div>
          <div className="ps-card">
            <div className="ps-num">66%</div>
            <div className="ps-lbl">Long-fuse explorers</div>
            <div className="ps-sub">9–12 months or not yet ready. The volume nurture engine.</div>
          </div>
        </div>

        <Takeaway>
          Don't sell them a closing. <strong>Sell them a roadmap.</strong> Set partner expectations to "warm and educatable at volume," with a reserved hot tier of 34% for immediate conversion.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 06 CORE INTENT ── */}
      <Sec id="intent" num="06" badge="💡 Core Intent" shaded
        title="What They Came to Find"
        lead="Priority needs are multi-select, as a share of all 91 respondents. The headline magnet is a second passport — but borderless-business help is right behind it and easy to underestimate.">
        <div className="intent-list">
          {PRIORITY_NEEDS.map((b, i) => (
            <div className="intent-row" key={b.label}>
              <div className="intent-rank">#{i + 1}</div>
              <div className="intent-pct">{b.pct}%</div>
              <div className="intent-lbl">{b.flag} {b.label}</div>
            </div>
          ))}
        </div>
        <Takeaway>
          <strong>58% want residency; 51% want borderless-business help.</strong> The winning positioning pairs every "get a passport" hook with a "structure your business globally" payoff. That intersection is exactly what FBS Intelligence is built to serve.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 07 JURISDICTION INTELLIGENCE ── */}
      <Sec id="jurisdiction" num="07" badge="📍 Jurisdiction Intelligence"
        title="Three Distinct Audiences Require Three Separate Playbooks"
        lead="Jurisdiction interest is multi-select. The four programs below represent meaningful, move-ready demand clusters — with minimal overlap between them.">
        <div className="juris-grid">
          {DEEP_DIVES.map((d) => (
            <div className="juris-card" key={d.name}>
              <div className="juris-head">
                <span className="juris-flag">{d.flag}</span>
                <div>
                  <div className="juris-name">{d.name}</div>
                  <div className="juris-n">{d.n}</div>
                </div>
              </div>
              <div className="juris-chips">
                <span>{d.split}</span>
                <span>{d.outbound}</span>
                <span className="chip--ready">{d.ready}</span>
              </div>
              <p className="juris-play">{d.play}</p>
            </div>
          ))}
        </div>

        <div className="panel-title" style={{marginTop:"32px",marginBottom:"16px"}}>🏢 Incorporation Preferences — Where They Would Structure a New Entity</div>
        <div className="card">
          {INCORPORATION.map((b) => <Bar key={b.label} flag={b.flag} label={b.label} pct={b.pct} note={b.note} />)}
        </div>

        <Takeaway>
          <strong>Europe = outbound volume. Caribbean = US passport-hedge. EB-5 = foreign inbound.</strong> Build the mainstage around Europe; run Caribbean and EB-5 as two clearly separate satellite tracks. Do not co-mingle messaging.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 08 DECISION MAKERS ── */}
      <Sec id="roles" num="08" badge="👔 Decision Makers" shaded
        title="This Is a Buying Audience — Not a Research Audience"
        lead="Over half are founder-level decision-makers who can say yes without a committee. The pitch is personal freedom plus business leverage, not enterprise procurement.">

        <div className="roles-banner">
          <div className="roles-big"><CountUp value={55} suffix="%" /></div>
          <div className="roles-text">Are founders, owners, and C-suite executives — the final decision-makers for residency, incorporation, tax structuring, and investment. They have the budget authority to act immediately.</div>
        </div>

        <div className="roles-grid">
          {ROLES.map((r) => (
            <div className="role-card" key={r.label}>
              <div className="role-pct">{r.pct}%</div>
              <div className="role-lbl">{r.flag} {r.label}</div>
              <div className="role-note">{r.note}</div>
            </div>
          ))}
        </div>

        <div className="panel-title" style={{marginTop:"32px",marginBottom:"16px"}}>🏭 Industry Breakdown</div>
        <div className="industry-list">
          {INDUSTRIES.map((b) => (
            <div className="ind-row" key={b.label}>
              <div className="ind-left">
                <span className="ind-emoji">{b.flag}</span>
                <span className="ind-name">{b.label}</span>
              </div>
              <div className="ind-right">
                <div className="ind-pct">{b.pct}%</div>
                <div className="ind-note">{b.note}</div>
              </div>
            </div>
          ))}
        </div>

        <Takeaway>
          <strong>55% are founders, owners or C-suite with direct buying authority.</strong> When a partner receives an FBS introduction, they are meeting the person who signs the engagement.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 09 KEY FINDINGS ── */}
      <Sec id="findings" num="09" badge="🗝️ Verdict"
        title="Six Findings Every Partner Should Internalize"
        lead="If you read nothing else, read these. They define the campaign strategy, messaging hierarchy, and partner routing logic for every program that follows.">
        <div className="findings-list">
          {KEY_FINDINGS.map((f) => (
            <div className="finding" key={f.n}>
              <div className="finding-n">{f.n}</div>
              <div className="finding-body">
                <div className="finding-lead">{f.lead}</div>
                <div className="finding-text">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
        <Takeaway>
          The data is unambiguous: the #1 thing this audience wants is access to <strong>trusted providers (82%).</strong> FBS is the bridge — and partnering is how you get introduced to 91 qualified prospects who are already planning their move.
        </Takeaway>
      </Sec>

      <div className="divider" />

      {/* ── 10 SUMMIT SERIES ── */}
      <Sec id="series" num="10" badge="🚀 Execution Layer" shaded
        title="The Summit Series — Built Around Outcomes, Not Content"
        lead="Each edition is structured around one goal: maximizing partner outcomes in a specific region — residency pipelines, capital deployment, structuring, and relocation execution.">
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
      </Sec>

      <div className="divider" />

      {/* ── CTA ── */}
      <section className="partner-cta" id="partner">
        <div className="partner-cta-inner">
          <div className="sec-badge-light">Partnership Opportunities</div>
          <h2>Ready to Partner with<br />Freedom Business Summit?</h2>
          <p>Get direct access to qualified, high-intent founders and investors actively planning their global mobility strategy right now.</p>
          <div className="cta-btns">
            <a href="mailto:denis@fsummit.net" className="btn-green-cta">Partner with us →</a>
            <a href="mailto:denis@fsummit.net" className="btn-white-cta">Request Speaking Access</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
  --green-deep:#14532d;
  --ink:#111827;
  --ink-2:#1f2937;
  --muted:#6b7280;
  --muted-2:#9ca3af;
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
nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);}
.nav-inner{max-width:1100px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:60px;}
.nav-logo{font-size:15px;font-weight:800;color:var(--ink);text-decoration:none;letter-spacing:-.01em;}
.btn-nav{font-size:13.5px;font-weight:700;color:var(--ink);border:1.5px solid var(--border);border-radius:999px;padding:7px 17px;text-decoration:none;transition:all .2s;}
.btn-nav:hover{background:var(--ink);color:#fff;border-color:var(--ink);}

/* HERO */
.hero{
  position:relative;overflow:hidden;
  background:#fff;border-bottom:1px solid var(--border);
  padding:80px 0 72px;
}
.hero-glow{
  position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 55% at 15% 50%, rgba(34,197,94,.07) 0%, transparent 65%),
    radial-gradient(ellipse 50% 40% at 85% 30%, rgba(59,130,246,.05) 0%, transparent 60%),
    radial-gradient(ellipse 40% 35% at 60% 80%, rgba(168,85,247,.04) 0%, transparent 60%);
  animation:glowPulse 10s ease-in-out infinite alternate;
}
@keyframes glowPulse{
  0%{opacity:.7;transform:scale(1);}
  100%{opacity:1;transform:scale(1.06);}
}
.hero-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 90% 80% at 50% 0%,#000 20%,transparent 100%);
}
.hero-inner{position:relative;max-width:1100px;margin:0 auto;padding:0 28px;}

.hero-badges{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;}
.hero-badge{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;border:1.5px solid var(--border);border-radius:999px;padding:6px 14px;color:var(--muted);}
.hero-badge.green{border-color:#bbf7d0;color:#15803d;background:#f0fdf4;}
.hero-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;}
.hero-dot.pulse{animation:dotPulse 2.2s ease-in-out infinite;}
@keyframes dotPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4);}50%{opacity:.7;box-shadow:0 0 0 5px rgba(34,197,94,0);}}

.hero-eyebrow{font-size:15px;font-weight:600;color:var(--muted);margin-bottom:10px;letter-spacing:.01em;}
h1{font-size:clamp(42px,7.5vw,82px);font-weight:900;letter-spacing:-.04em;line-height:.95;margin-bottom:18px;color:var(--ink);}
.flag-lg{font-weight:400;}
.hero-tagline{font-size:clamp(17px,2.2vw,22px);font-weight:700;color:var(--green-dark);margin-bottom:24px;letter-spacing:-.01em;}
.hero-desc-wrap{max-width:680px;margin-bottom:36px;}
.hero-desc-1{font-size:clamp(15px,1.8vw,17px);color:var(--muted);margin-bottom:10px;line-height:1.65;}
.hero-desc-2{font-size:clamp(15px,1.8vw,17px);color:var(--muted);line-height:1.65;}

.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px;}
.btn-accent{display:inline-flex;align-items:center;background:var(--green);color:#fff;font-weight:700;font-size:15px;border-radius:999px;padding:13px 26px;text-decoration:none;transition:background .2s,transform .15s;}
.btn-accent:hover{background:var(--green-dark);transform:translateY(-2px);}
.btn-primary{display:inline-flex;align-items:center;background:var(--ink);color:#fff;font-weight:700;font-size:15px;border-radius:999px;padding:13px 26px;text-decoration:none;transition:background .2s,transform .15s;}
.btn-primary:hover{background:#374151;transform:translateY(-2px);}

.hero-stats{display:flex;align-items:center;flex-wrap:wrap;border-top:1px solid var(--border);padding-top:32px;gap:0;}
.hs-item{display:flex;flex-direction:column;gap:5px;padding:0 36px 0 0;}
.hs-item:first-child{padding-left:0;}
.hs-num{font-size:clamp(28px,4vw,40px);font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;}
.hs-lbl{font-size:13px;color:var(--muted);font-weight:500;line-height:1.3;}
.hs-div{width:1px;height:50px;background:var(--border);margin:0 36px 0 0;flex-shrink:0;}

/* SECTIONS */
.sec{padding:80px 0;opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease;}
.sec--in{opacity:1;transform:none;}
.sec--shaded{background:var(--bg-shaded);}
.sec-inner{max-width:1100px;margin:0 auto;padding:0 28px;}
.sec-meta{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.sec-num{font-size:12px;font-weight:900;letter-spacing:.12em;color:var(--muted-2);text-transform:uppercase;}
.sec-badge{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--green-dark);}
h2{font-size:clamp(26px,3.8vw,40px);font-weight:900;letter-spacing:-.03em;line-height:1.05;margin-bottom:16px;max-width:800px;}
.lead{font-size:clamp(15px,1.8vw,17px);color:var(--muted);max-width:760px;margin-bottom:36px;line-height:1.65;}
.panel-title{font-size:12.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);}
.divider{height:1px;background:var(--border);}

/* SNAPSHOT GRID */
.snapshot-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
.snap-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:26px 24px;transition:transform .2s,box-shadow .2s,border-color .2s;}
.snap-card:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.06);border-color:#86efac;}
.snap-card--dark{background:var(--ink-2);border-color:var(--ink-2);}
.snap-num{font-size:clamp(36px,5vw,50px);font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--muted);margin-bottom:10px;}
.snap-card--dark .snap-num{color:var(--green);}
.snap-num.c-green{color:var(--green-dark);}
.snap-lbl{font-size:14px;font-weight:700;color:var(--ink);line-height:1.35;margin-bottom:6px;}
.snap-card--dark .snap-lbl{color:#fff;}
.snap-sub{font-size:13px;color:var(--muted);line-height:1.4;}
.snap-card--dark .snap-sub{color:rgba(255,255,255,.55);}

/* DIRECTION CARDS */
.dir-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.dir-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:28px 26px;}
.dir-card--main{border-color:#86efac;background:#f0fdf4;}
.dir-pct{font-size:clamp(48px,7vw,70px);font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--green-dark);margin-bottom:10px;}
.dir-pct.c-muted{color:var(--ink);}
.dir-title{font-size:18px;font-weight:800;color:var(--ink);margin-bottom:10px;}
.dir-desc{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:18px;}
.dir-breakdown{border-top:1px solid rgba(0,0,0,.07);padding-top:14px;display:flex;flex-direction:column;gap:8px;}
.dir-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--muted);}
.dir-row strong{color:var(--ink);font-weight:700;}

/* JURISDICTION RANKED */
.juris-ranked{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:24px 26px;margin-bottom:16px;}
.jr-row{display:grid;grid-template-columns:28px 28px 1fr 48px 200px;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);}
.jr-row:last-child{border-bottom:none;}
.jr-rank{font-size:12px;font-weight:800;color:var(--muted-2);}
.jr-flag{font-size:18px;}
.jr-label{font-size:14px;font-weight:600;color:var(--ink);}
.jr-pct{font-size:15px;font-weight:900;color:var(--green-dark);font-variant-numeric:tabular-nums;text-align:right;}
.jr-bar-wrap .bar-row{margin-bottom:0;}
.jr-bar-wrap .bar-top{display:none;}
.jr-bar-wrap .bar-track{height:8px;}

/* FINANCIAL */
.fin-top-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px;}
.fin-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:28px 24px;transition:transform .2s,border-color .2s;}
.fin-card:hover{transform:translateY(-3px);border-color:#86efac;}
.fin-card--dark{background:var(--ink-2);border-color:var(--ink-2);}
.fin-pct{font-size:clamp(40px,6vw,58px);font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--green-dark);margin-bottom:10px;}
.fin-card--dark .fin-pct{color:var(--green);}
.fin-lbl{font-size:16px;font-weight:800;color:var(--ink);margin-bottom:8px;}
.fin-card--dark .fin-lbl{color:#fff;}
.fin-desc{font-size:13.5px;color:var(--muted);line-height:1.5;}
.fin-card--dark .fin-desc{color:rgba(255,255,255,.55);}

.fin-bottom-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px;}
.powder-card{background:var(--bg-shaded);border:1.5px solid var(--border);border-radius:16px;padding:22px 20px;}
.powder-num{font-size:30px;font-weight:900;letter-spacing:-.03em;color:var(--ink);margin-bottom:8px;}
.powder-desc{font-size:13px;color:var(--muted);line-height:1.5;}

/* CAVEAT */
.caveat{background:#fefce8;border:1.5px solid #fde047;border-radius:14px;padding:16px 20px;margin-bottom:16px;font-size:13.5px;color:#713f12;line-height:1.55;}
.caveat strong{color:#431407;}

/* LEAD TIERS */
.tier-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px;}
.tier-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:22px 20px;transition:transform .2s,border-color .2s;}
.tier-card:hover{transform:translateY(-3px);border-color:#86efac;}
.tier-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;}
.tier-name{font-size:15px;font-weight:800;color:var(--ink);}
.tier-range{font-size:11.5px;color:var(--muted);font-weight:600;}
.tier-pct{font-size:36px;font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;margin-bottom:8px;}
.tier-note{font-size:13px;color:var(--muted);line-height:1.4;}

/* PIPELINE SPLIT */
.pipeline-split{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.ps-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:24px;}
.ps-card--hot{background:var(--ink);border-color:var(--ink);}
.ps-num{font-size:42px;font-weight:900;letter-spacing:-.04em;line-height:1;color:var(--ink);margin-bottom:8px;}
.ps-card--hot .ps-num{color:var(--green);}
.ps-lbl{font-size:15px;font-weight:800;color:var(--ink);margin-bottom:5px;}
.ps-card--hot .ps-lbl{color:#fff;}
.ps-sub{font-size:13px;color:var(--muted);line-height:1.4;}
.ps-card--hot .ps-sub{color:rgba(255,255,255,.55);}

/* STRATEGY */
.strat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px;}
.strat-card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:22px 20px;transition:transform .2s;}
.strat-card:hover{transform:translateY(-3px);}
.strat-card--accent{border-color:#86efac;background:#f0fdf4;}
.strat-pct{font-size:34px;font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;margin-bottom:10px;}
.strat-card:not(.strat-card--accent) .strat-pct{color:var(--muted);}
.strat-lbl{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.4;}

/* INTENT */
.intent-list{margin-bottom:16px;}
.intent-row{display:grid;grid-template-columns:28px 64px 1fr;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--border);}
.intent-row:first-child{border-top:1px solid var(--border);}
.intent-rank{font-size:12px;font-weight:800;color:var(--muted-2);}
.intent-pct{font-size:22px;font-weight:900;letter-spacing:-.03em;color:var(--green-dark);font-variant-numeric:tabular-nums;}
.intent-lbl{font-size:15px;color:var(--ink);line-height:1.4;}

/* JURISDICTION CARDS */
.juris-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.juris-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:26px;transition:transform .2s,border-color .2s;}
.juris-card:hover{transform:translateY(-3px);border-color:#86efac;}
.juris-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
.juris-flag{font-size:30px;}
.juris-name{font-size:18px;font-weight:800;color:var(--ink);}
.juris-n{font-size:13px;color:var(--green-dark);font-weight:700;margin-top:3px;}
.juris-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;}
.juris-chips span{font-size:12px;font-weight:600;color:var(--muted);background:var(--bg-shaded);border-radius:999px;padding:4px 11px;border:1px solid var(--border);}
.chip--ready{color:#15803d!important;background:#f0fdf4!important;border-color:#bbf7d0!important;}
.juris-play{font-size:14px;color:var(--muted);line-height:1.6;margin:0;}

/* CARDS / BARS */
.card{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:26px;margin-bottom:16px;}
.bar-row{margin-bottom:16px;}
.bar-row:last-child{margin-bottom:0;}
.bar-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:7px;}
.bar-name{font-size:14px;font-weight:600;color:var(--ink);}
.bar-flag{margin-right:6px;}
.bar-pct{font-size:14px;font-weight:900;color:var(--green-dark);white-space:nowrap;font-variant-numeric:tabular-nums;}
.bar-track{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden;}
.bar-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green-dark),var(--green));}
.bar-note{font-size:12px;color:var(--muted);margin-top:5px;}

/* ROLES */
.roles-banner{display:flex;align-items:center;gap:24px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:18px;padding:28px;margin-bottom:16px;}
.roles-big{font-size:clamp(52px,7vw,72px);font-weight:900;letter-spacing:-.04em;color:var(--green-dark);line-height:1;flex-shrink:0;}
.roles-text{font-size:15px;color:#15803d;line-height:1.6;}
.roles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
.role-card{background:#fff;border:1.5px solid var(--border);border-radius:14px;padding:20px 18px;transition:border-color .2s;}
.role-card:hover{border-color:#86efac;}
.role-pct{font-size:26px;font-weight:900;letter-spacing:-.03em;color:var(--green-dark);margin-bottom:5px;}
.role-lbl{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:4px;}
.role-note{font-size:12px;color:var(--muted);line-height:1.35;}

/* INDUSTRY */
.industry-list{background:#fff;border:1.5px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:16px;}
.ind-row{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid var(--border);gap:16px;}
.ind-row:last-child{border-bottom:none;}
.ind-left{display:flex;align-items:center;gap:12px;}
.ind-emoji{font-size:20px;}
.ind-name{font-size:14.5px;font-weight:700;color:var(--ink);}
.ind-right{text-align:right;flex-shrink:0;}
.ind-pct{font-size:20px;font-weight:900;color:var(--green-dark);letter-spacing:-.03em;}
.ind-note{font-size:12px;color:var(--muted);margin-top:2px;}

/* FINDINGS */
.findings-list{margin-bottom:16px;}
.finding{display:flex;gap:20px;padding:22px 0;border-bottom:1px solid var(--border);}
.finding:first-child{border-top:1px solid var(--border);}
.finding-n{font-size:13px;font-weight:900;color:var(--green-dark);letter-spacing:.06em;min-width:28px;padding-top:3px;}
.finding-body{flex:1;}
.finding-lead{font-size:16px;font-weight:800;color:var(--ink);letter-spacing:-.01em;line-height:1.3;margin-bottom:6px;}
.finding-text{font-size:14.5px;color:var(--muted);line-height:1.6;}

/* EDITIONS */
.editions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.edition-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:28px 24px;transition:transform .2s,border-color .2s;}
.edition-card:hover{transform:translateY(-3px);border-color:#86efac;}
.edition-when{font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--green-dark);margin-bottom:10px;}
.edition-title{font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px;}
.edition-desc{font-size:14px;color:var(--muted);line-height:1.55;margin-bottom:18px;}
.edition-link{font-size:13.5px;font-weight:700;color:var(--green-dark);text-decoration:none;}
.edition-link:hover{text-decoration:underline;}

/* TAKEAWAY */
.kt{display:flex;align-items:flex-start;gap:14px;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:22px;margin-top:16px;}
.kt-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.kt-label{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--green-dark);margin-bottom:6px;}
.kt-text{font-size:15px;color:var(--green-deep);line-height:1.6;}
.kt-text strong{color:var(--green-deep);font-weight:800;}

/* CTA */
.partner-cta{background:var(--ink);color:#fff;padding:96px 0;text-align:center;}
.partner-cta-inner{max-width:640px;margin:0 auto;padding:0 28px;}
.sec-badge-light{display:block;text-align:center;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#86efac;margin-bottom:16px;}
.partner-cta h2{color:#fff;max-width:none;margin:0 auto 16px;font-size:clamp(28px,4vw,42px);}
.partner-cta p{font-size:17px;color:rgba(255,255,255,.66);margin-bottom:36px;line-height:1.65;}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-green-cta{display:inline-flex;align-items:center;background:var(--green);color:#fff;font-weight:700;font-size:15px;border-radius:999px;padding:13px 28px;text-decoration:none;transition:background .2s,transform .15s;}
.btn-green-cta:hover{background:var(--green-dark);transform:translateY(-2px);}
.btn-white-cta{display:inline-flex;align-items:center;background:transparent;color:#fff;font-weight:700;font-size:15px;border:1.5px solid rgba(255,255,255,.3);border-radius:999px;padding:13px 28px;text-decoration:none;transition:border-color .2s,transform .15s;}
.btn-white-cta:hover{border-color:#fff;transform:translateY(-2px);}

/* FOOTER */
footer{background:#030712;color:#fff;padding:44px 0;}
.footer-inner{max-width:1100px;margin:0 auto;padding:0 28px;display:flex;flex-direction:column;gap:14px;}
.flogo{font-size:15px;font-weight:800;color:#fff;}
footer p{font-size:13px;color:rgba(255,255,255,.35);}
.footer-links{display:flex;gap:22px;}
.footer-links a{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.5);text-decoration:none;}
.footer-links a:hover{color:var(--green);}

/* RESPONSIVE */
@media(max-width:880px){
  .snapshot-grid,.fin-top-grid,.fin-bottom-grid{grid-template-columns:1fr 1fr;}
  .dir-cards,.juris-grid,.pipeline-split{grid-template-columns:1fr;}
  .tier-grid,.strat-grid{grid-template-columns:1fr 1fr;}
  .roles-grid{grid-template-columns:1fr 1fr;}
  .editions-grid{grid-template-columns:1fr;}
  .hero-stats{flex-direction:column;gap:22px;}
  .hs-div{width:100%;height:1px;margin:0;}
  .hs-item{padding:0;}
  .jr-row{grid-template-columns:28px 28px 1fr 48px;gap:8px;}
  .jr-bar-wrap{display:none;}
  .jr-row .bar-row{margin-bottom:0;}
}
@media(max-width:560px){
  .sec{padding:56px 0;}
  .hero{padding:56px 0 48px;}
  .snapshot-grid,.fin-top-grid,.fin-bottom-grid,.tier-grid,.strat-grid,.roles-grid{grid-template-columns:1fr;}
  .intent-row{grid-template-columns:28px 50px 1fr;gap:10px;}
  .roles-banner{flex-direction:column;text-align:center;}
  .ind-note{display:none;}
}
@media(prefers-reduced-motion:reduce){
  .sec{transition:none;opacity:1;transform:none;}
  .bar-fill{transition:none;}
  .hero-glow{animation:none;}
  .hero-dot.pulse{animation:none;}
}
`;
