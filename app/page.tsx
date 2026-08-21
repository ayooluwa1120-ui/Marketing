"use client"
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Sun, Moon, Check, X, ArrowRight, ArrowUpRight, Circle } from "lucide-react";


const PLANS = [
  {
    id: "starter",
    name: "Starter",
    blurb: "For teams closing the books alone.",
    monthly: 49,
    annual: 39,
    invoiceCap: "2,000 invoices / mo",
    features: ["2,000 invoices / mo", "3 team seats", "Email support", "90-day audit log"],
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "For finance teams past the spreadsheet stage.",
    monthly: 149,
    annual: 119,
    invoiceCap: "10,000 invoices / mo",
    features: ["10,000 invoices / mo", "15 team seats", "API access", "Priority support", "1-year audit log"],
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "For multi-entity finance orgs.",
    monthly: 399,
    annual: 319,
    invoiceCap: "Unlimited invoices",
    features: ["Unlimited invoices", "Unlimited seats", "SSO / SAML", "Dedicated CSM", "7-year audit log"],
  },
];

const COMPARE_ROWS = [
  { label: "Invoices included", values: ["2,000 / mo", "10,000 / mo", "Unlimited"] },
  { label: "Team seats", values: ["3", "15", "Unlimited"] },
  { label: "Auto-match accuracy target", values: ["97%", "99%", "99.5%"] },
  { label: "Exception review queue", values: [true, true, true] },
  { label: "Custom matching rules", values: [false, true, true] },
  { label: "API access", values: [false, true, true] },
  { label: "SSO / SAML", values: [false, false, true] },
  { label: "Dedicated CSM", values: [false, false, true] },
  { label: "Audit log retention", values: ["90 days", "1 year", "7 years"] },
  { label: "Support", values: ["Email", "Priority", "24/7 + Slack"] },
];

const LOGOS = ["Northwind Supply", "Vantage Freight", "Ampera Energy", "Solstice Retail", "Brightloom"];

const MANUAL_MIN_PER_INVOICE = 4;
const AUTOMATED_MIN_PER_INVOICE = 0.33;
const LOADED_HOURLY_RATE = 35;

function formatUSD(n, opts = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(n);
}
function formatNum(n) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export default function ReconLanding() {
  const [theme, setTheme] = useState("light");
  const [billing, setBilling] = useState("monthly");
  const [invoices, setInvoices] = useState(5000);
  const [modalOpen, setModalOpen] = useState(false);

  const isAnnual = billing === "annual";

  const roi = useMemo(() => {
    const manualHours = (invoices * MANUAL_MIN_PER_INVOICE) / 60;
    const automatedHours = (invoices * AUTOMATED_MIN_PER_INVOICE) / 60;
    const hoursSaved = Math.max(manualHours - automatedHours, 0);
    const dollarsSaved = hoursSaved * LOADED_HOURLY_RATE;
    const growthCost = isAnnual ? PLANS[1].annual : PLANS[1].monthly;
    const paybackWeeks = dollarsSaved > 0 ? (growthCost / dollarsSaved) * 4.33 : 0;
    return {
      manualHours,
      automatedHours,
      hoursSaved,
      dollarsSaved,
      paybackWeeks: Math.max(paybackWeeks, 0.5),
    };
  }, [invoices, isAnnual]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  return (
    <div data-theme={theme} className="rc-root">
      

      {/* NAV */}
      <header className="rc-nav">
        <div className="rc-shell rc-nav-inner">
          <div className="rc-brand">
            <span className="rc-brand-mark" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="rc-brand-name">Recon</span>
          </div>
          <nav className="rc-nav-links" aria-label="Primary">
            <a href="#roi">Product</a>
            <a href="#pricing">Pricing</a>
            <a href="#logos">Customers</a>
          </nav>
          <div className="rc-nav-actions">
            <button
              className="rc-icon-btn"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="rc-btn rc-btn-primary rc-btn-sm">Start free trial</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="rc-shell rc-hero">
        <div className="rc-hero-copy">
          <p className="rc-eyebrow">LEDGER LINE 001 — RECONCILIATION</p>
          <h1 className="rc-h1">Reconciliation that closes itself.</h1>
          <p className="rc-sub">
            Recon matches invoices to ledger entries automatically, flags only the exceptions
            that need a human, and gets your books closed days faster — no spreadsheet required.
          </p>
          <div className="rc-hero-ctas">
            <button className="rc-btn rc-btn-primary">
              Start free trial <ArrowRight size={16} />
            </button>
            <a href="#roi" className="rc-btn rc-btn-ghost">
              Watch it reconcile <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="rc-stat-row">
            <div className="rc-stat-chip">
              <span className="rc-mono rc-stat-num">99.2%</span>
              <span>match rate</span>
            </div>
            <div className="rc-stat-chip">
              <span className="rc-mono rc-stat-num">4.1 days</span>
              <span>faster close</span>
            </div>
            <div className="rc-stat-chip">
              <span className="rc-mono rc-stat-num">0</span>
              <span>spreadsheets</span>
            </div>
          </div>
        </div>

        <div className="rc-ledger-card" role="group" aria-label="Live reconciliation feed">
          <div className="rc-ledger-card-head">
            <span className="rc-live-dot" aria-hidden="true">
              <Circle size={8} fill="currentColor" />
            </span>
            Live ledger feed
          </div>
          <div className="rc-ledger-rows">
            {[
              ["INV-88214", "Northwind Supply", "$4,210.00", "Matched"],
              ["INV-88215", "Ampera Energy", "$918.44", "Matched"],
              ["INV-88216", "Brightloom", "$12,004.10", "Exception"],
              ["INV-88217", "Vantage Freight", "$3,350.00", "Matched"],
            ].map(([id, vendor, amt, status]) => (
              <div className="rc-ledger-row" key={id}>
                <span className="rc-mono rc-ledger-id">{id}</span>
                <span className="rc-ledger-vendor">{vendor}</span>
                <span className="rc-mono rc-ledger-amt">{amt}</span>
                <span className={`rc-tag ${status === "Matched" ? "rc-tag-ok" : "rc-tag-warn"}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="rc-ledger-card-foot">
            <span className="rc-mono">{formatUSD(128402.17)}</span> reconciled in the last 24 hours
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section id="logos" className="rc-shell rc-logos">
        <p className="rc-logos-label">Trusted by finance teams at</p>
        <div className="rc-logos-row">
          {LOGOS.map((l) => (
            <span key={l} className="rc-logo-word">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="roi" className="rc-shell rc-section">
        <div className="rc-section-head">
          <p className="rc-eyebrow">LEDGER LINE 002 — THE MATH</p>
          <h2 className="rc-h2">Do the math before you buy.</h2>
          <p className="rc-sub">Drag the slider to your monthly invoice volume.</p>
        </div>

        <div className="rc-roi-panel">
          <div className="rc-roi-slider-block">
            <div className="rc-roi-slider-label">
              <span>Invoices processed / month</span>
              <span className="rc-mono rc-roi-slider-value" key={`inv-${invoices}`}>
                {formatNum(invoices)}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={20000}
              step={100}
              value={invoices}
              onChange={(e) => setInvoices(Number(e.target.value))}
              className="rc-slider"
              aria-label="Invoices processed per month"
            />
            <div className="rc-roi-slider-ticks">
              <span>200</span>
              <span>20,000</span>
            </div>
          </div>

          <div className="rc-roi-stats">
            <div className="rc-roi-stat">
              <span className="rc-roi-stat-label">Hours saved / month</span>
              <span className="rc-mono rc-roi-stat-num" key={`h-${invoices}`}>
                {formatNum(roi.hoursSaved)}
              </span>
            </div>
            <div className="rc-roi-stat rc-roi-stat-accent">
              <span className="rc-roi-stat-label">Saved / month</span>
              <span className="rc-mono rc-roi-stat-num" key={`d-${invoices}-${billing}`}>
                {formatUSD(roi.dollarsSaved)}
              </span>
            </div>
            <div className="rc-roi-stat">
              <span className="rc-roi-stat-label">Payback period</span>
              <span className="rc-mono rc-roi-stat-num" key={`p-${invoices}-${billing}`}>
                {roi.paybackWeeks < 1 ? "< 1 wk" : `${formatNum(roi.paybackWeeks)} wks`}
              </span>
            </div>
          </div>

          <div className="rc-roi-breakdown">
            <div className="rc-roi-breakdown-row rc-roi-breakdown-head">
              <span>Line item</span>
              <span>DR — time cost</span>
              <span>CR — with Recon</span>
            </div>
            <div className="rc-roi-breakdown-row">
              <span>Minutes / invoice</span>
              <span className="rc-mono">{MANUAL_MIN_PER_INVOICE.toFixed(2)}</span>
              <span className="rc-mono">{AUTOMATED_MIN_PER_INVOICE.toFixed(2)}</span>
            </div>
            <div className="rc-roi-breakdown-row">
              <span>Hours / month</span>
              <span className="rc-mono">{formatNum(roi.manualHours)}</span>
              <span className="rc-mono">{formatNum(roi.automatedHours)}</span>
            </div>
          </div>
          <p className="rc-roi-footnote">
            Based on a {formatUSD(LOADED_HOURLY_RATE)}/hr loaded ops rate. Payback period is calculated
            against the Growth plan {isAnnual ? "annual" : "monthly"} price.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="rc-shell rc-section">
        <div className="rc-section-head">
          <p className="rc-eyebrow">LEDGER LINE 003 — PRICING</p>
          <h2 className="rc-h2">Plans that scale with your ledger.</h2>
          <div className="rc-billing-toggle" role="group" aria-label="Billing period">
            <button
              className={`rc-billing-opt ${!isAnnual ? "rc-billing-opt-active" : ""}`}
              onClick={() => setBilling("monthly")}
              aria-pressed={!isAnnual}
            >
              Monthly
            </button>
            <button
              className={`rc-billing-opt ${isAnnual ? "rc-billing-opt-active" : ""}`}
              onClick={() => setBilling("annual")}
              aria-pressed={isAnnual}
            >
              Annual
            </button>
            {isAnnual && (
              <span className="rc-stamp" key="stamp" aria-hidden="true">
                SAVE 20%
              </span>
            )}
          </div>
        </div>

        <div className="rc-plans">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`rc-plan-card ${plan.featured ? "rc-plan-card-featured" : ""}`}>
              {plan.featured && <span className="rc-plan-badge">Most teams</span>}
              <h3 className="rc-plan-name">{plan.name}</h3>
              <p className="rc-plan-blurb">{plan.blurb}</p>
              <div className="rc-plan-price-row">
                <span className="rc-mono rc-plan-price" key={`${plan.id}-${billing}`}>
                  {formatUSD(isAnnual ? plan.annual : plan.monthly)}
                </span>
                <span className="rc-plan-price-suffix">/ mo</span>
              </div>
              <span className="rc-plan-billed-tag">
                {isAnnual ? "billed annually" : "billed monthly"}
              </span>
              <ul className="rc-plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={14} className="rc-plan-check" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`rc-btn ${plan.featured ? "rc-btn-primary" : "rc-btn-outline"} rc-btn-full`}>
                Start free trial
              </button>
            </div>
          ))}
        </div>

        <button className="rc-compare-link" onClick={() => setModalOpen(true)}>
          Compare all features <ArrowRight size={15} />
        </button>
      </section>

      <footer className="rc-footer">
        <div className="rc-shell rc-footer-inner">
          <div className="rc-brand">
            <span className="rc-brand-mark" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="rc-brand-name">Recon</span>
          </div>
          <p className="rc-footer-tag">Reconciliation that closes itself.</p>
          <p className="rc-footer-copy">© 2026 Recon, Inc. — prototype for demonstration only.</p>
        </div>
      </footer>

      {/* COMPARISON MODAL */}
      {modalOpen && (
        <div className="rc-modal-overlay" onClick={closeModal}>
          <div
            className="rc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rc-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rc-modal-head">
              <h3 id="rc-modal-title">Compare plans</h3>
              <button className="rc-icon-btn" onClick={closeModal} aria-label="Close comparison">
                <X size={18} />
              </button>
            </div>
            <div className="rc-modal-body">
              <table className="rc-compare-table">
                <thead>
                  <tr>
                    <th></th>
                    {PLANS.map((p) => (
                      <th key={p.id}>
                        {p.name}
                        {p.featured && <span className="rc-plan-badge rc-plan-badge-sm">Most teams</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((v, i) =>
                        typeof v === "boolean" ? (
                          <td key={i}>
                            {v ? (
                              <Check size={16} className="rc-compare-yes" />
                            ) : (
                              <X size={16} className="rc-compare-no" />
                            )}
                          </td>
                        ) : (
                          <td key={i} className="rc-mono">
                            {v}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

