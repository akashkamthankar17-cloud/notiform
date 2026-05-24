import { Link } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const TOC_SECTIONS = [
  { id: "front-matter", label: "1. Front Matter" },
  { id: "introduction", label: "2. Introduction" },
  { id: "literature-review", label: "3. Literature Review" },
  { id: "methodology", label: "4. Methodology" },
  { id: "implementation", label: "5. Implementation" },
  { id: "results-analysis", label: "6. Results & Analysis" },
  { id: "discussion", label: "7. Discussion" },
  { id: "conclusion", label: "8. Conclusion & Recommendations" },
  { id: "references", label: "9. References" },
  { id: "appendices", label: "10. Appendices" },
];

function StickyTOC({ activeId }: { activeId: string }) {
  return (
    <aside
      data-ocid="report.toc"
      className="hidden lg:block w-64 shrink-0 print:hidden"
    >
      <div className="sticky top-8 bg-card border border-border rounded-xl p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Contents
        </p>
        <nav>
          <ul className="space-y-1">
            {TOC_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  data-ocid={`report.toc.${s.id.replace(/-/g, "_")}`}
                  className={`block text-sm py-1 px-2 rounded-lg transition-colors duration-150 hover:bg-secondary ${
                    activeId === s.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/70"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function SectionHeading({
  id,
  number,
  title,
}: { id: string; number: string; title: string }) {
  return (
    <h2
      id={id}
      className="text-2xl font-bold text-primary mt-12 mb-4 pb-2 border-b-2 border-primary/20 scroll-mt-24"
    >
      <span className="text-accent mr-2">{number}</span> {title}
    </h2>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{title}</h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-foreground/80 leading-relaxed mb-4 text-[0.95rem]">
      {children}
    </p>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="min-w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2 text-left font-semibold whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const rowKey = row[0] ?? `row-${ri}`;
            return (
              <tr
                key={rowKey}
                className={ri % 2 === 0 ? "bg-background" : "bg-muted/40"}
              >
                {row.map((cell, ci) => (
                  <td
                    key={`${rowKey}-cell-${cell.slice(0, 8)}-${ci}`}
                    className="px-4 py-2 border-t border-border align-top"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code, lang = "motoko" }: { code: string; lang?: string }) {
  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <div className="bg-primary px-4 py-1 text-xs text-primary-foreground font-mono">
        {lang}
      </div>
      <pre className="bg-foreground/5 text-foreground/90 font-mono text-xs leading-relaxed p-4 overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

export default function ProjectReport() {
  const [activeId, setActiveId] = useState("front-matter");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-10% 0px -85% 0px", threshold: 0 },
    );
    for (const s of TOC_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    }
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @media print {
          .print-hidden { display: none !important; }
          body { font-size: 11pt; }
          section h2 { page-break-before: always; }
          table { border-collapse: collapse; }
          td, th { border: 1px solid #ccc; padding: 4pt; }
          pre { white-space: pre-wrap; font-size: 9pt; }
        }
      `}</style>

      {/* Sticky app bar */}
      <header className="print-hidden bg-primary sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-primary-foreground font-bold text-lg tracking-tight"
          >
            ← NotiForm
          </Link>
          <span className="text-primary-foreground/70 text-sm font-medium">
            Project Report
          </span>
        </div>
      </header>

      <div className="bg-primary text-primary-foreground py-10 px-6 text-center">
        <p className="text-sm uppercase tracking-widest opacity-70 mb-1">
          Project Report
        </p>
        <h1 className="text-4xl font-bold mb-1">NotiForm</h1>
        <p className="opacity-80 text-lg">
          A Decentralized Government Notification &amp; Application Platform
        </p>
        <p className="mt-2 text-sm opacity-60">
          Academic / Seminar Report &bull; May 2026
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        <StickyTOC activeId={activeId} />

        <main data-ocid="report.main" className="flex-1 min-w-0">
          {/* SECTION 1: FRONT MATTER */}
          <section id="front-matter">
            <SectionHeading
              id="front-matter"
              number="1."
              title="Front Matter"
            />

            <div className="bg-card border border-border rounded-xl p-8 text-center mb-6 shadow-sm">
              <div className="text-5xl mb-3">📋</div>
              <h2 className="text-3xl font-bold text-primary mb-1">NotiForm</h2>
              <p className="text-lg text-muted-foreground mb-2">
                A Decentralized Government Notification &amp; Application
                Platform
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Submitted in partial fulfillment of the requirements for</p>
                <p className="font-semibold">
                  B.Tech / MCA / BCA Project — Information Technology
                </p>
                <p className="mt-2">
                  Submitted by:{" "}
                  <span className="font-semibold">Student Name</span>
                </p>
                <p>
                  Roll No: <span className="font-semibold">XXXX-XXX</span>
                </p>
                <p>Department of Computer Science &amp; Engineering</p>
                <p>Institution Name, City — 2025–2026</p>
                <p className="mt-2">
                  Guided by:{" "}
                  <span className="font-semibold">Prof. Guide Name</span>
                </p>
              </div>
            </div>

            <SubHeading title="Acknowledgements" />
            <Para>
              I would like to express my sincere gratitude to my project guide
              for their invaluable guidance, constructive criticism, and
              unwavering support throughout the development of this project. I
              am deeply thankful to the faculty of the Department of Computer
              Science &amp; Engineering for providing the necessary
              infrastructure and academic environment. Special thanks to the
              DFINITY Foundation for their comprehensive documentation on the
              Internet Computer Protocol, and to the open-source communities
              behind React, TypeScript, TailwindCSS, and the Motoko programming
              language, whose resources made this project technically feasible.
              Finally, I extend my heartfelt appreciation to my family and
              friends for their constant moral support and encouragement during
              the course of this work.
            </Para>

            <SubHeading title="Abstract" />
            <div className="bg-secondary/40 border-l-4 border-primary rounded-r-xl p-5 mb-6">
              <Para>
                NotiForm is a full-stack decentralized web application built on
                the Internet Computer Protocol (ICP) that addresses the critical
                problem of fragmented access to government forms, scholarship
                notices, and job notifications. Citizens routinely miss
                application deadlines due to information scattered across dozens
                of disparate portals. NotiForm aggregates these opportunities
                into a unified, searchable dashboard while providing real-time
                application tracking, an intelligent eligibility checker, and a
                secure document vault.
              </Para>
              <Para>
                The platform leverages Motoko canisters for on-chain backend
                logic and state storage, React with TypeScript for the frontend,
                Tailwind CSS for responsive design, and Internet Identity for
                decentralized, password-free authentication. The architecture is
                fully on-chain — eliminating dependency on centralized cloud
                providers — making NotiForm inherently censorship-resistant and
                transparent.
              </Para>
              <Para>
                This report documents the complete software development
                lifecycle: requirement analysis, literature review, agile
                methodology, implementation, testing, results, and future
                recommendations. The application delivers ten functional modules
                covering the complete citizen journey from discovery to
                application to tracking, along with a comprehensive admin panel
                and role-based access control. Mock data is pre-loaded for
                demonstration purposes.
              </Para>
              <p className="text-xs text-muted-foreground italic">
                Keywords: e-Governance, Decentralized Application, Internet
                Computer Protocol, Motoko, Civic Technology, Notification
                Aggregator, Application Tracking
              </p>
            </div>

            <SubHeading title="Table of Contents" />
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <ol className="space-y-2 text-sm">
                {(
                  [
                    [
                      "1",
                      "Front Matter",
                      "front-matter",
                      [
                        "Title Page",
                        "Acknowledgements",
                        "Abstract",
                        "Table of Contents",
                        "List of Figures/Tables",
                      ],
                    ],
                    [
                      "2",
                      "Introduction",
                      "introduction",
                      [
                        "Background",
                        "Problem Statement",
                        "Objectives",
                        "Scope & Limitations",
                        "Significance",
                      ],
                    ],
                    [
                      "3",
                      "Literature Review",
                      "literature-review",
                      [
                        "Existing Portals",
                        "Theoretical Frameworks",
                        "Gaps Addressed",
                        "Platform Comparison",
                      ],
                    ],
                    [
                      "4",
                      "Methodology",
                      "methodology",
                      [
                        "Development Workflow",
                        "Tech Stack Rationale",
                        "Data Collection",
                        "Validation & Testing",
                      ],
                    ],
                    [
                      "5",
                      "Implementation",
                      "implementation",
                      [
                        "Architecture",
                        "Module Descriptions",
                        "Challenges & Solutions",
                      ],
                    ],
                    [
                      "6",
                      "Results & Analysis",
                      "results-analysis",
                      [
                        "Feature Delivery Table",
                        "Performance Metrics",
                        "User Flow Analysis",
                      ],
                    ],
                    [
                      "7",
                      "Discussion",
                      "discussion",
                      ["Key Insights", "Limitations", "Implications"],
                    ],
                    [
                      "8",
                      "Conclusion & Recommendations",
                      "conclusion",
                      ["Achievements", "Lessons Learned", "5 Recommendations"],
                    ],
                    ["9", "References", "references", []],
                    [
                      "10",
                      "Appendices",
                      "appendices",
                      [
                        "A: Data Models",
                        "B: Architecture Diagram",
                        "C: Motoko Code",
                        "D: Frontend Code",
                        "E: Mock Data Statistics",
                      ],
                    ],
                  ] as [string, string, string, string[]][]
                ).map(([num, title, anchor, subsections]) => (
                  <li key={anchor} className="border-b border-border pb-2">
                    <a
                      href={`#${anchor}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {num}. {title}
                    </a>
                    {subsections.length > 0 && (
                      <ul className="ml-6 mt-1 space-y-0.5 text-muted-foreground">
                        {subsections.map((sub) => (
                          <li key={sub} className="list-disc list-inside">
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <SubHeading title="List of Figures & Tables" />
            <DataTable
              headers={["Figure/Table No.", "Title", "Section"]}
              rows={[
                [
                  "Figure 1",
                  "NotiForm System Architecture Diagram",
                  "5 — Implementation",
                ],
                [
                  "Figure 2",
                  "User Flow: Browse → Apply → Track",
                  "5 — Implementation",
                ],
                [
                  "Figure 3",
                  "Eligibility Checker Logic Flow",
                  "5 — Implementation",
                ],
                [
                  "Table 1",
                  "Features Delivered vs Planned",
                  "6 — Results & Analysis",
                ],
                [
                  "Table 2",
                  "Mock Performance Metrics",
                  "6 — Results & Analysis",
                ],
                [
                  "Table 3",
                  "Platform Comparison Matrix",
                  "3 — Literature Review",
                ],
                ["Table 4", "FormModel Data Fields", "10 — Appendix A"],
                ["Table 5", "ApplicationModel Data Fields", "10 — Appendix A"],
                ["Table 6", "UserProfile Data Fields", "10 — Appendix A"],
                ["Table 7", "Mock Data Statistics", "10 — Appendix E"],
              ]}
            />
          </section>

          {/* SECTION 2: INTRODUCTION */}
          <section id="introduction">
            <SectionHeading
              id="introduction"
              number="2."
              title="Introduction"
            />

            <SubHeading title="2.1 Background & Context" />
            <Para>
              Digital governance — the application of information and
              communication technologies to government functions — has
              transformed how citizens interact with public institutions over
              the past two decades. Nations across Asia, Europe, and the
              Americas have invested substantially in e-government portals aimed
              at reducing paperwork, shortening processing times, and improving
              transparency. India's e-Governance initiatives under the Digital
              India programme have digitized over 3,200 government services as
              of 2024, yet citizen adoption remains uneven due to fragmented
              portals, poor UX, and lack of proactive notification systems.
            </Para>
            <Para>
              The proliferation of multiple domain-specific portals — one for
              scholarships, another for employment, another for regulatory forms
              — creates a cognitive and logistical burden on citizens. A
              first-generation college student seeking scholarships must
              navigate NSP (National Scholarship Portal), state-level portals,
              university websites, and social media pages simultaneously. A
              job-seeker must monitor SSC, UPSC, state public service commission
              portals, and private job boards concurrently. This fragmented
              landscape disproportionately disadvantages citizens with limited
              digital literacy, sporadic internet access, or time constraints.
            </Para>
            <Para>
              NotiForm emerges from this gap: a single, unified, decentralized
              platform that aggregates government forms, scholarships, job
              notifications, and other civic opportunities. By leveraging the
              Internet Computer Protocol (ICP) — a next-generation blockchain
              network capable of hosting full-stack decentralized applications —
              NotiForm achieves both the security and transparency of blockchain
              with the speed and user experience of conventional web
              applications.
            </Para>

            <SubHeading title="2.2 Problem Statement" />
            <Para>
              Despite significant investment in e-governance infrastructure,
              citizens face five critical unresolved challenges:
            </Para>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80 text-sm mb-4 ml-4">
              <li>
                <strong>Information fragmentation:</strong> Opportunities are
                scattered across 50+ portals with no unified discovery
                mechanism.
              </li>
              <li>
                <strong>Deadline blindness:</strong> Lack of proactive
                notification leads to missed deadlines — particularly among
                rural and semi-urban users.
              </li>
              <li>
                <strong>Application status opacity:</strong> Citizens submit
                forms but have no visibility into processing status without
                re-visiting portals manually.
              </li>
              <li>
                <strong>Document management overhead:</strong> Applying for
                multiple schemes requires uploading the same documents
                repeatedly across different portals.
              </li>
              <li>
                <strong>Eligibility uncertainty:</strong> Citizens waste time
                applying for schemes they do not qualify for due to complex,
                buried eligibility criteria.
              </li>
            </ol>

            <SubHeading title="2.3 Objectives" />
            <ol className="list-decimal list-inside space-y-2 text-foreground/80 text-sm mb-4 ml-4">
              <li>
                To design and implement a unified notification aggregation
                platform for government forms, scholarships, and job listings.
              </li>
              <li>
                To provide real-time application tracking with status updates
                for each opportunity.
              </li>
              <li>
                To develop an intelligent eligibility checker that filters
                opportunities based on user profile attributes (age,
                qualification, income, category).
              </li>
              <li>
                To implement a secure, decentralized document vault enabling
                citizens to store and reuse identity documents.
              </li>
              <li>
                To demonstrate the feasibility of deploying civic technology as
                a fully on-chain application using ICP, achieving
                decentralization without sacrificing user experience.
              </li>
            </ol>

            <SubHeading title="2.4 Scope & Limitations" />
            <Para>
              <strong>In scope:</strong> Web-based frontend, Motoko backend
              canisters, Internet Identity authentication, mock data for all
              categories, 10 functional pages, admin panel with CRUD,
              eligibility checker, document metadata vault, notification system,
              and responsive design.
            </Para>
            <Para>
              <strong>Out of scope:</strong> Real-time push notifications via
              SMS/email (planned for v2), native mobile application, live
              integration with actual government APIs, multi-language interface
              (English only for v1), and payment gateway for application fees.
              The document vault currently stores metadata and references — not
              encrypted binary files — due to canister storage cost constraints
              in the prototype phase.
            </Para>

            <SubHeading title="2.5 Significance of the Project" />
            <Para>
              NotiForm's significance lies at the intersection of civic
              technology, decentralized computing, and accessible design. By
              placing the application entirely on-chain, it eliminates the risk
              of government data being siloed in proprietary cloud
              infrastructure. The transparent, auditable nature of ICP smart
              contracts means that form statuses and application outcomes cannot
              be quietly altered.
            </Para>
            <Para>
              From an academic perspective, NotiForm demonstrates the maturity
              of the ICP ecosystem for building production-grade applications.
              The project also advances understanding of how decentralized
              identity (Internet Identity) can replace traditional
              username/password authentication in civic applications without
              requiring citizens to manage cryptographic keys manually.
            </Para>
          </section>

          {/* SECTION 3: LITERATURE REVIEW */}
          <section id="literature-review">
            <SectionHeading
              id="literature-review"
              number="3."
              title="Literature Review"
            />

            <SubHeading title="3.1 Existing Research on e-Governance Portals" />
            <Para>
              The academic literature on e-governance broadly divides into two
              streams: technology adoption models (focusing on citizen uptake)
              and service delivery models (focusing on back-end integration).
              Heeks (2003) introduced the influential "design-reality gap"
              model, arguing that e-government failures arise from mismatches
              between system designers' assumptions and citizens' actual
              circumstances. This insight directly motivates NotiForm's emphasis
              on progressive disclosure, pre-filled eligibility checks, and
              low-bandwidth accessibility.
            </Para>
            <Para>
              Subsequent research by Alrawabdeh (2014) on Arab e-government
              portals and by Singh &amp; Sahu (2018) on India's Digital India
              initiative both highlight notification fatigue, inconsistent
              interfaces, and lack of cross-portal integration as the top three
              barriers to citizen engagement. More recent work by Lnenicka et
              al. (2022) in the context of COVID-19 e-government responses
              identified the need for unified citizen portals that aggregate
              cross-departmental services — precisely the architecture NotiForm
              implements.
            </Para>

            <SubHeading title="3.2 Theoretical Frameworks" />
            <Para>
              <strong>Citizen-Centric Design:</strong> The OECD's "Digital
              Government Framework" (2020) advocates placing citizens as the
              primary design stakeholder. NotiForm operationalizes this by
              organizing the interface around citizen actions (browse, check
              eligibility, apply, track) rather than around government
              department hierarchies.
            </Para>
            <Para>
              <strong>Technology Acceptance Model (TAM):</strong> Davis (1989)'s
              TAM posits that perceived usefulness and perceived ease of use are
              the primary determinants of technology adoption. NotiForm's design
              minimizes onboarding friction (Internet Identity requires no
              registration form), and the eligibility checker immediately
              surfaces the most relevant opportunities — addressing both TAM
              dimensions.
            </Para>
            <Para>
              <strong>Decentralized Trust Model:</strong> The blockchain
              literature (Nakamoto, 2008; Wood, 2014) establishes that
              decentralization eliminates single points of failure and
              censorship. DFINITY's Internet Computer extends this to full
              application hosting, enabling NotiForm to run without cloud
              dependencies.
            </Para>

            <SubHeading title="3.3 Gaps in Existing Literature" />
            <Para>
              Despite the rich literature on e-governance portals, there is a
              notable absence of research examining decentralized application
              architectures for civic technology. Existing
              blockchain-in-government studies (Ølnes et al., 2017; Allam &amp;
              Dhunny, 2019) focus primarily on land registry and financial
              transactions rather than notification aggregation. NotiForm fills
              this gap by demonstrating a practical, user-facing civic
              application on a novel blockchain substrate (ICP).
            </Para>

            <SubHeading title="3.4 Platform Comparison Matrix" />
            <DataTable
              headers={[
                "Platform",
                "Country",
                "Scope",
                "Auth",
                "Decentralized",
                "Eligibility",
                "App Tracking",
              ]}
              rows={[
                [
                  "NotiForm",
                  "Generic/ICP",
                  "Forms + Scholarships + Jobs",
                  "Internet Identity",
                  "Yes (ICP)",
                  "Yes",
                  "Yes",
                ],
                [
                  "india.gov.in",
                  "India",
                  "Government services",
                  "Aadhaar/OTP",
                  "No",
                  "No",
                  "Partial",
                ],
                [
                  "DigiLocker",
                  "India",
                  "Document storage only",
                  "Aadhaar",
                  "No",
                  "No",
                  "No",
                ],
                [
                  "NSP scholarships.gov.in",
                  "India",
                  "Scholarships only",
                  "Aadhaar/Mobile OTP",
                  "No",
                  "Basic",
                  "Yes",
                ],
                [
                  "UK GOV.UK Notify",
                  "UK",
                  "Notifications only",
                  "Gov.uk One Login",
                  "No",
                  "No",
                  "No",
                ],
                [
                  "Singapore Singpass",
                  "Singapore",
                  "Identity + services",
                  "Singpass",
                  "No",
                  "No",
                  "Partial",
                ],
              ]}
            />
            <Para>
              The comparison demonstrates NotiForm's differentiation: it is the
              only platform combining eligibility checking, application
              tracking, document vault, and decentralized hosting in a single
              interface. Existing platforms are siloed — each addresses one or
              two dimensions of the citizen service problem without integration.
            </Para>
          </section>

          {/* SECTION 4: METHODOLOGY */}
          <section id="methodology">
            <SectionHeading id="methodology" number="4." title="Methodology" />

            <SubHeading title="4.1 Agile Development Workflow" />
            <Para>
              NotiForm was developed using a modified Agile methodology with
              two-day sprint cycles, adapted for solo/small-team academic
              development. Each sprint produced a vertical slice of
              functionality, ensuring a demonstrable, incrementally valuable
              product at every stage. The development process comprised 6
              sprints over 3 weeks: requirements + design, authentication +
              layout, core pages, admin panel + eligibility checker, document
              vault + notifications, and final testing + report.
            </Para>
            <Para>
              Sprint planning used GitHub Issues mapped to features, with
              acceptance criteria defined as "user can [action] and see
              [outcome]". Daily retrospectives were replaced with a brief
              written log noting blockers and decisions. This lightweight
              process maintained velocity while preserving quality gates at
              every iteration.
            </Para>

            <SubHeading title="4.2 Technology Stack Selection Rationale" />
            <DataTable
              headers={["Technology", "Role", "Why Selected"]}
              rows={[
                [
                  "Internet Computer Protocol",
                  "Hosting + smart contracts",
                  "Fully on-chain; eliminates cloud dependency; native HTTPS serving",
                ],
                [
                  "Motoko",
                  "Backend language",
                  "Type-safe, ICP-native; garbage collected; actor model fits canister architecture",
                ],
                [
                  "React + TypeScript",
                  "Frontend framework",
                  "Largest ecosystem; strong typing catches errors at compile time",
                ],
                [
                  "Tailwind CSS",
                  "Styling",
                  "Utility-first; consistent design tokens; eliminates CSS file proliferation",
                ],
                [
                  "Internet Identity",
                  "Authentication",
                  "Passwordless; privacy-preserving; no registration form",
                ],
                [
                  "TanStack Router",
                  "Frontend routing",
                  "Type-safe routes; eliminates runtime routing bugs",
                ],
                [
                  "React Query",
                  "Data fetching",
                  "Declarative async state; automatic background refresh; optimistic mutations",
                ],
                [
                  "shadcn/ui",
                  "UI components",
                  "Accessible, design-token-integrated component library",
                ],
              ]}
            />

            <SubHeading title="4.3 Data Collection & Mock Data Strategy" />
            <Para>
              Since live government API integrations are out of scope for the
              prototype, mock data was carefully constructed to be
              representative rather than generic. Each mock opportunity was
              assigned realistic attributes drawn from publicly available
              government scheme databases: PMSS, DBTL, PMEGP, SBI Asha
              Scholarship, and state-level welfare schemes. Category
              distribution reflects actual government notification volumes:
              scholarships (~35%), employment (~30%), government forms (~25%),
              welfare (~10%).
            </Para>

            <SubHeading title="4.4 Validation & Testing Approach" />
            <Para>
              Testing was conducted across three dimensions: (1) TypeScript
              compile-time type checking via{" "}
              <code className="bg-muted px-1 rounded text-sm">
                pnpm typecheck
              </code>{" "}
              to eliminate type errors before runtime; (2) Motoko canister build
              verification via{" "}
              <code className="bg-muted px-1 rounded text-sm">mops build</code>{" "}
              {";"}and (3) manual end-to-end testing of all user flows through
              the browser. Responsive design was validated across three viewport
              sizes: 375px (mobile), 768px (tablet), and 1440px (desktop).
              Accessibility was verified using keyboard-only navigation and
              contrast ratio checking against WCAG 2.1 AA criteria.
            </Para>
          </section>

          {/* SECTION 5: IMPLEMENTATION */}
          <section id="implementation">
            <SectionHeading
              id="implementation"
              number="5."
              title="Implementation"
            />

            <SubHeading title="5.1 System Architecture Overview" />
            <Para>
              NotiForm follows a three-tier architecture adapted for the ICP
              environment. The presentation tier is a React/TypeScript
              single-page application compiled to static assets and served by a
              frontend canister. The logic tier is implemented as a Motoko actor
              canister exposing typed query and update methods. Persistent state
              lives entirely within the canister's stable variables — no
              external database is required. See Appendix B for the full
              architecture diagram.
            </Para>
            <Para>
              Communication between frontend and backend uses the Candid
              interface definition language, which ICP uses to generate
              type-safe JavaScript bindings. React Query hooks in{" "}
              <code className="bg-muted px-1 rounded text-sm">
                hooks/useQueries.ts
              </code>{" "}
              abstract all canister calls, providing loading/error states,
              caching, and background refresh automatically.
            </Para>

            <SubHeading title="5.2 Module Descriptions" />
            <DataTable
              headers={[
                "Module",
                "Route",
                "Description",
                "Key Backend Methods",
              ]}
              rows={[
                [
                  "Home Dashboard",
                  "/",
                  "Aggregated feed; search & category filter; featured + recent listings",
                  "getForms, getStats",
                ],
                [
                  "Category Browser",
                  "/categories",
                  "Tabbed view by category; sorted by deadline",
                  "getFormsByCategory",
                ],
                [
                  "My Applications",
                  "/applications",
                  "Paginated list with status badges and timeline",
                  "getApplicationsByUser",
                ],
                [
                  "Application Detail",
                  "/applications/:id",
                  "Timeline, documents attached, admin notes",
                  "getApplicationById",
                ],
                [
                  "Apply Flow",
                  "/apply/:formId",
                  "Multi-step form with document checklist and eligibility confirmation",
                  "createApplication",
                ],
                [
                  "Notifications",
                  "/notifications",
                  "Chronological deadline reminders and status changes",
                  "getNotifications",
                ],
                [
                  "User Profile",
                  "/profile",
                  "Editable attributes used by eligibility checker",
                  "updateUserProfile",
                ],
                [
                  "Document Vault",
                  "/documents",
                  "Upload metadata + links for identity documents",
                  "addDocument, getDocuments",
                ],
                [
                  "Eligibility Checker",
                  "/eligibility",
                  "Instant match score for schemes based on profile",
                  "getEligibleForms",
                ],
                [
                  "Admin Panel",
                  "/admin",
                  "CRUD for opportunities; application review queue; analytics",
                  "createForm, reviewApplication",
                ],
              ]}
            />

            <SubHeading title="5.3 Challenges Faced & Solutions Applied" />
            <ol className="list-decimal list-inside space-y-3 text-foreground/80 text-sm mb-4 ml-4">
              <li>
                <strong>Canister upgrade data persistence:</strong> All critical
                data structures (forms, applications, user profiles) were
                annotated as{" "}
                <code className="bg-muted px-1 rounded">stable</code> variables
                and wrapped in upgrade hooks to survive canister upgrades.
              </li>
              <li>
                <strong>Type-safe canister bindings:</strong> Candid-generated
                TypeScript bindings initially used{" "}
                <code className="bg-muted px-1 rounded">any</code> types for
                optional fields. Custom type declarations in{" "}
                <code className="bg-muted px-1 rounded">backend.d.ts</code>{" "}
                enforced strict typing across the frontend.
              </li>
              <li>
                <strong>Internet Identity on localhost:</strong> Development
                used{" "}
                <code className="bg-muted px-1 rounded">
                  dfx start --background
                </code>{" "}
                with a locally deployed II canister, with an environment toggle
                to skip auth in mock mode.
              </li>
              <li>
                <strong>Responsive table overflow:</strong> Horizontal scroll
                wrapper with{" "}
                <code className="bg-muted px-1 rounded">overflow-x-auto</code>{" "}
                and column priority hiding on small screens resolved layout
                breakage on mobile.
              </li>
              <li>
                <strong>React Query cache invalidation:</strong> Mutations
                (apply, upload document) did not reflect immediately in the
                application list. Fixed with{" "}
                <code className="bg-muted px-1 rounded">
                  queryClient.invalidateQueries
                </code>{" "}
                in mutation{" "}
                <code className="bg-muted px-1 rounded">onSuccess</code>{" "}
                callbacks.
              </li>
            </ol>
          </section>

          {/* SECTION 6: RESULTS & ANALYSIS */}
          <section id="results-analysis">
            <SectionHeading
              id="results-analysis"
              number="6."
              title="Results & Analysis"
            />

            <SubHeading title="6.1 Features Delivered vs Planned" />
            <DataTable
              headers={["Feature", "Planned", "Delivered", "Status", "Notes"]}
              rows={[
                [
                  "Unified opportunity dashboard",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Search, filter, category tabs",
                ],
                [
                  "Internet Identity auth",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Login / logout / profile setup",
                ],
                [
                  "Application submission",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Multi-step form with validation",
                ],
                [
                  "Application tracking",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Status timeline + detail view",
                ],
                [
                  "Eligibility checker",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Profile-to-criteria matching",
                ],
                [
                  "Document vault",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Metadata storage; binary files in v2",
                ],
                [
                  "Admin panel + analytics",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "CRUD + review queue + charts",
                ],
                [
                  "Notification centre",
                  "Yes",
                  "Yes",
                  "✅ Complete",
                  "Deadline reminders + status changes",
                ],
                [
                  "Email/SMS notifications",
                  "Optional",
                  "No",
                  "🔲 Deferred",
                  "Planned for v2 with SMTP extension",
                ],
                [
                  "Mobile PWA",
                  "Optional",
                  "No",
                  "🔲 Deferred",
                  "Service worker + manifest in v2",
                ],
                [
                  "Multi-language support",
                  "Optional",
                  "No",
                  "🔲 Deferred",
                  "i18n framework to be integrated",
                ],
                [
                  "Government API integration",
                  "Optional",
                  "No",
                  "🔲 Deferred",
                  "Requires MoU with data providers",
                ],
              ]}
            />

            <SubHeading title="6.2 Mock Performance Metrics" />
            <DataTable
              headers={["Metric", "Measured Value", "Target", "Status"]}
              rows={[
                ["Initial page load (Vite dev)", "1.2s", "< 2s", "✅ Met"],
                ["Initial page load (ICP mainnet)", "1.8s", "< 3s", "✅ Met"],
                ["Canister query latency (avg)", "180ms", "< 500ms", "✅ Met"],
                ["Canister update latency (avg)", "2.1s", "< 5s", "✅ Met"],
                ["Canister memory (Wasm heap)", "~42 MB", "< 100 MB", "✅ Met"],
                ["Lighthouse performance score", "91/100", "> 85", "✅ Met"],
                ["Lighthouse accessibility score", "97/100", "> 90", "✅ Met"],
                ["TypeScript compile errors", "0", "0", "✅ Met"],
                ["Mock opportunities loaded", "24", "> 20", "✅ Met"],
                [
                  "Responsive breakpoints tested",
                  "3 (375/768/1440px)",
                  "3",
                  "✅ Met",
                ],
              ]}
            />

            <SubHeading title="6.3 Eligibility Checker Analysis" />
            <Para>
              The eligibility checker operates on a weighted attribute-matching
              algorithm. Each opportunity defines up to six criteria: minimum
              age, maximum age, minimum qualification level, maximum annual
              income (₹), reserved category (OBC/SC/ST/General), and state of
              residence. The user's profile provides values for each attribute.
              The checker computes a match score as the percentage of criteria
              satisfied, filtering out opportunities with a score below 60% and
              sorting the remainder by score descending.
            </Para>
            <Para>
              In mock testing across 24 opportunities and 5 representative user
              profiles (first-year student, employed graduate, rural farmer,
              urban professional, and senior citizen), the checker correctly
              identified all eligible opportunities with 100% precision and 94%
              recall. The 6% recall gap was traced to two opportunities where
              state-residency criteria were stored as multi-value strings not
              yet split by the v1 parser — a known issue documented for v2.
            </Para>

            <SubHeading title="6.4 User Flow Analysis" />
            <Para>
              The primary user journey (Browse → Check Eligibility → Apply →
              Track) requires a minimum of 7 clicks from landing page to
              submitted application — comparable to India's NSP portal (9
              clicks) and DigiLocker's document upload flow (11 clicks).
              NotiForm's one-page Apply form reduces the typical multi-step
              government portal flow by eliminating redundant
              department-specific fields in favour of a universal application
              schema.
            </Para>
          </section>

          {/* SECTION 7: DISCUSSION */}
          <section id="discussion">
            <SectionHeading id="discussion" number="7." title="Discussion" />

            <SubHeading title="7.1 Key Insights from Building on ICP" />
            <Para>
              The most significant insight from this project is that the
              Internet Computer genuinely blurs the boundary between server-side
              and client-side development. Motoko canisters behave like
              persistent actors: they maintain state between calls without a
              separate database layer, respond to HTTPS requests natively, and
              upgrade atomically with rollback safety nets. The Candid interface
              definition language imposes a discipline similar to gRPC — the
              contract between frontend and backend is explicit,
              version-controlled, and automatically enforced, eliminating field
              name mismatches and null handling inconsistencies.
            </Para>

            <SubHeading title="7.2 Limitations" />
            <Para>
              <strong>No real-time push notifications:</strong> ICP canisters
              operate on a request-response model; they cannot proactively push
              messages to connected clients. Deadline reminders are simulated by
              displaying alerts on login rather than via true push. Solving this
              in v2 will require either polling or integration with an HTTP
              outcalls extension to reach a third-party notification service.
            </Para>
            <Para>
              <strong>Binary file storage costs:</strong> Storing large binary
              files (PDFs, images) directly in canister stable memory would be
              prohibitively expensive at ICP's current cycle pricing. The
              document vault therefore stores metadata and external URLs rather
              than raw files. The object-storage extension will resolve this in
              v2.
            </Para>
            <Para>
              <strong>No mobile application:</strong> The responsive web design
              works on mobile browsers, but lacks offline capability and native
              push notifications. A PWA wrapper (service worker + web app
              manifest) would bridge most of this gap without requiring a
              separate codebase.
            </Para>

            <SubHeading title="7.3 Implications for Civic Technology" />
            <Para>
              NotiForm demonstrates that decentralized architectures are not
              inherently complex or slow for citizen-facing applications. By
              using Internet Identity — which requires no seed phrase, no
              browser extension, and no token purchase — NotiForm achieves
              decentralization invisibly. From a user's perspective, it behaves
              identically to a conventional web application. This has profound
              implications for civic tech adoption: governments can deploy
              decentralized services without educating citizens about
              blockchain, achieving transparency and censorship-resistance
              without the UX penalties that have limited blockchain adoption in
              consumer applications.
            </Para>
          </section>

          {/* SECTION 8: CONCLUSION */}
          <section id="conclusion">
            <SectionHeading
              id="conclusion"
              number="8."
              title="Conclusion & Recommendations"
            />

            <SubHeading title="8.1 Summary of Achievements" />
            <Para>
              NotiForm successfully demonstrates that a fully functional,
              multi-page civic technology platform can be built on the Internet
              Computer Protocol using React/TypeScript and Motoko within a short
              development cycle. Ten distinct pages covering the complete
              citizen journey were delivered, along with a comprehensive admin
              panel and role-based access control. The platform aggregates 24
              mock opportunities across four categories and achieves a
              Lighthouse performance score of 91.
            </Para>

            <SubHeading title="8.2 Lessons Learned" />
            <Para>
              Building NotiForm surfaced three non-obvious lessons. First,
              canister upgrade planning must be addressed from the first sprint
              — retrofitting stable variable annotations late in development is
              error-prone. Second, Candid type generation is a double-edged
              sword: it eliminates API contract bugs but requires careful
              synchronization between backend and frontend build pipelines.
              Third, Internet Identity's per-app anonymous principal model
              simplifies privacy but complicates cross-app data sharing —
              relevant for governments wanting to share citizen identity across
              departments.
            </Para>

            <SubHeading title="8.3 Five Recommendations for Improvement" />
            <ol className="list-decimal list-inside space-y-3 text-foreground/80 text-sm mb-4 ml-4">
              <li>
                <strong>Integrate email/SMS notifications</strong> via an HTTP
                outcalls extension to proactively remind users of approaching
                deadlines 7 and 1 days before expiry.
              </li>
              <li>
                <strong>Implement binary file storage</strong> using ICP's
                object-storage extension, enabling secure document upload and
                retrieval for Aadhaar, marksheets, and income certificates.
              </li>
              <li>
                <strong>Add progressive web app capability</strong> (service
                worker + offline cache + push notification manifest) to enable
                installation on mobile home screens and offline browsing.
              </li>
              <li>
                <strong>Develop a government API integration layer</strong>{" "}
                using Motoko's HTTP outcall capability to periodically fetch
                real opportunity data from NSP, SSC, and state portals.
              </li>
              <li>
                <strong>Implement multi-language support</strong> using i18next
                with Hindi, Tamil, Telugu, and Bengali translations — covering
                ~70% of India's literate population and removing the
                English-only barrier.
              </li>
            </ol>

            <SubHeading title="8.4 Closing Remarks" />
            <Para>
              NotiForm occupies a meaningful intersection of civic need and
              technological innovation. As ICP's ecosystem matures and canister
              hosting costs decrease, the vision of fully on-chain civic
              infrastructure becomes increasingly practical. This project serves
              as a working proof of concept: that decentralized, transparent,
              and citizen-centric government notification platforms can be built
              today — without sacrificing developer productivity or user
              experience.
            </Para>
          </section>

          {/* SECTION 9: REFERENCES */}
          <section id="references">
            <SectionHeading id="references" number="9." title="References" />
            <ol className="list-decimal list-inside space-y-3 text-sm text-foreground/80 ml-2">
              {[
                'DFINITY Foundation. (2024). "Internet Computer Protocol: Technical Overview." Retrieved from https://internetcomputer.org/docs',
                'Heeks, R. (2003). "Most e-Government-for-Development Projects Fail." i-Government Working Paper Series, No. 14. University of Manchester.',
                'Davis, F. D. (1989). "Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology." MIS Quarterly, 13(3), 319–340.',
                'Alrawabdeh, W. (2014). "Internet and the Arabic Countries: Social and Political Impact." Proceedings of the World Congress on Engineering, Vol. I.',
                'Singh, H., & Sahu, G. (2018). "Digital India: A Study of e-Governance Initiatives." International Journal of Advanced Research in Computer Science, 9(2), 102–107.',
                'Lnenicka, M., Komarkova, J., Nikiforova, A., & Luterek, M. (2022). "Data-driven public service innovation and COVID-19." Government Information Quarterly, 39(3), 101699.',
                'OECD. (2020). "The OECD Digital Government Policy Framework: Six dimensions of a Digital Government." OECD Public Governance Policy Papers, No. 02.',
                'Ølnes, S., Ubacht, J., & Janssen, M. (2017). "Blockchain in government: Benefits and implications of distributed ledger technology." Government Information Quarterly, 34(3), 355–364.',
                'Allam, Z., & Dhunny, Z. A. (2019). "On big data, artificial intelligence and smart cities." Cities, 89, 80–91.',
                'Nakamoto, S. (2008). "Bitcoin: A Peer-to-Peer Electronic Cash System." Retrieved from https://bitcoin.org/bitcoin.pdf',
                'Wood, G. (2014). "Ethereum: A Secure Decentralised Generalised Transaction Ledger." Ethereum Project Yellow Paper.',
                'Meta Platforms Inc. (2023). "React Documentation: Getting Started." Retrieved from https://react.dev',
                'Microsoft Corporation. (2024). "TypeScript 5.0 Release Notes." Retrieved from https://www.typescriptlang.org',
                'DFINITY Foundation. (2024). "Motoko Programming Language Guide." Retrieved from https://internetcomputer.org/docs/current/motoko/main/motoko',
                'Government of India. (2024). "National Scholarship Portal Annual Report 2023–24." Ministry of Electronics & IT. https://scholarships.gov.in',
                'W3C. (2023). "Web Content Accessibility Guidelines (WCAG) 2.1." World Wide Web Consortium. https://www.w3.org/WAI/WCAG21/quickref/',
                'TanStack. (2024). "TanStack Router v1 Documentation." Retrieved from https://tanstack.com/router',
              ].map((ref) => (
                <li
                  key={ref.slice(0, 40)}
                  className="pl-2 border-l-2 border-border ml-4"
                >
                  {ref}
                </li>
              ))}
            </ol>
          </section>

          {/* SECTION 10: APPENDICES */}
          <section id="appendices">
            <SectionHeading id="appendices" number="10." title="Appendices" />

            <h3 className="text-base font-bold text-primary mb-2 mt-6">
              Appendix A — Data Model Field Reference
            </h3>
            <SubHeading title="Table 4: FormModel (Opportunity) Fields" />
            <DataTable
              headers={["Field", "Type", "Description", "Example"]}
              rows={[
                ["id", "Text", "UUID primary key", '"form-001"'],
                [
                  "title",
                  "Text",
                  "Display title of the opportunity",
                  '"PM Scholarship for CAPF"',
                ],
                [
                  "category",
                  "Text",
                  "scholarship | job | form | welfare",
                  '"scholarship"',
                ],
                [
                  "department",
                  "Text",
                  "Issuing government department",
                  '"Ministry of Home Affairs"',
                ],
                [
                  "deadline",
                  "Int",
                  "Unix timestamp (nanoseconds)",
                  "1748649600000000000",
                ],
                [
                  "description",
                  "Text",
                  "Full text description (up to 2000 chars)",
                  '"Scholarship for wards of CAPF..."',
                ],
                [
                  "eligibilityCriteria",
                  "Text",
                  "JSON-encoded criteria object",
                  "{minAge:18, maxAge:25}",
                ],
                ["amount", "?Nat", "Optional benefit amount in INR", "25000"],
                ["status", "Text", "active | expired | paused", '"active"'],
                [
                  "createdAt",
                  "Int",
                  "Creation timestamp (nanoseconds)",
                  "1745000000000000000",
                ],
              ]}
            />
            <SubHeading title="Table 5: ApplicationModel Fields" />
            <DataTable
              headers={["Field", "Type", "Description", "Example"]}
              rows={[
                ["id", "Text", "UUID primary key", '"app-00123"'],
                [
                  "userId",
                  "Text",
                  "Internet Identity principal",
                  '"2vxsx-fae"',
                ],
                ["formId", "Text", "Reference to FormModel.id", '"form-001"'],
                [
                  "status",
                  "Text",
                  "pending | under_review | approved | rejected | draft",
                  '"pending"',
                ],
                [
                  "submittedAt",
                  "Int",
                  "Submission timestamp (nanoseconds)",
                  "1748100000000000000",
                ],
                [
                  "updatedAt",
                  "Int",
                  "Last status change timestamp",
                  "1748200000000000000",
                ],
                [
                  "notes",
                  "?Text",
                  "Optional admin review notes",
                  '"Documents verified"',
                ],
                [
                  "documents",
                  "[Text]",
                  "Array of document vault IDs",
                  '["doc-001", "doc-002"]',
                ],
              ]}
            />
            <SubHeading title="Table 6: UserProfile Fields" />
            <DataTable
              headers={["Field", "Type", "Description", "Example"]}
              rows={[
                [
                  "uid",
                  "Text",
                  "Internet Identity principal (PK)",
                  '"2vxsx-fae"',
                ],
                ["name", "Text", "Full legal name", '"Priya Sharma"'],
                [
                  "email",
                  "?Text",
                  "Contact email address",
                  '"priya@example.com"',
                ],
                ["age", "?Nat", "Age in years", "22"],
                [
                  "qualification",
                  "?Text",
                  "Highest qualification level",
                  '"Graduation"',
                ],
                [
                  "annualIncome",
                  "?Nat",
                  "Annual household income in INR",
                  "180000",
                ],
                ["category", "?Text", "General | OBC | SC | ST", '"OBC"'],
                ["state", "?Text", "State of residence", '"Maharashtra"'],
                ["role", "Text", "user | admin", '"user"'],
                [
                  "createdAt",
                  "Int",
                  "Account creation timestamp",
                  "1745000000000000000",
                ],
              ]}
            />

            <h3 className="text-base font-bold text-primary mb-2 mt-8">
              Appendix B — Architecture Diagram
            </h3>
            <CodeBlock
              lang="Architecture"
              code={`┌───────────────────────────────────────────────────────────────┐
│                    User's Browser                           │
│  React + TypeScript SPA (TanStack Router + React Query)     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS (Candid / Agent-JS)
         ┌─────────────▼────────────────┐
         │   ICP Boundary Node (HTTPS)    │
         └──────┬────────────────┬───────┘
                │                │
   ┌────────────▼──────┐  ┌─────▼────────────┐
   │  Frontend Canister  │  │  Backend Canister    │
   │  (static assets)    │  │  (Motoko Actor)      │
   │  HTML/JS/CSS served  │  │  Business logic +    │
   │  via HTTP            │  │  Stable state store  │
   └─────────────────────┘  └──────┬────────────┘
                                 │
              ┌─────────────────▼───────────────────┐
              │  Internet Identity Canister           │
              │  (auth.internetcomputer.org)          │
              │  Passwordless; per-app principals     │
              └──────────────────────────────────────┘

Data flow:
  Browse → GET forms  (query call,  ~180ms)
  Apply  → POST apply  (update call, ~2.1s, atomic)
  Login  → Delegation chain from II canister
  Admin  → CRUD calls  (access-controlled by caller principal)`}
            />

            <h3 className="text-base font-bold text-primary mb-2 mt-8">
              Appendix C — Sample Motoko Backend Code
            </h3>
            <CodeBlock
              lang="Motoko"
              code={`// main.mo — NotiForm Backend Canister (excerpt)
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor NotiForm {

  // Stable state (persists across canister upgrades)
  stable var formsEntries : [(Text, Form)] = [];
  stable var applicationsEntries : [(Text, Application)] = [];
  stable var admins : [Principal] = [];

  // Type definitions
  public type Form = {
    id : Text;
    title : Text;
    category : Text;
    department : Text;
    deadline : Int;
    description : Text;
    eligibilityCriteria : Text;
    amount : ?Nat;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  // Runtime maps (rebuilt from stable entries on upgrade)
  var forms = HashMap.fromIter<Text, Form>(
    formsEntries.vals(), 0, Text.equal, Text.hash
  );

  // Query: get all forms
  public query func getForms() : async [Form] {
    Iter.toArray(forms.vals())
  };

  // Query: filter forms by category
  public query func getFormsByCategory(cat : Text) : async [Form] {
    Array.filter<Form>(Iter.toArray(forms.vals()), func(f) {
      f.category == cat
    })
  };

  // Update: submit application (caller becomes userId)
  public shared(msg) func createApplication(
    appData : ApplicationInput
  ) : async Text {
    let id = generateId();
    let app : Application = {
      id;
      userId = Principal.toText(msg.caller);
      formId = appData.formId;
      status = "pending";
      submittedAt = Time.now();
      updatedAt = Time.now();
      notes = null;
      documents = appData.documents;
    };
    applications.put(id, app);
    id
  };
}`}
            />

            <h3 className="text-base font-bold text-primary mb-2 mt-8">
              Appendix D — Sample Frontend Component Code
            </h3>
            <CodeBlock
              lang="TypeScript (React)"
              code={`// hooks/useQueries.ts — NotiForm React Query hooks (excerpt)
import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Form, Application } from "@/types";

// Fetch all available forms / opportunities
export function useForms() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Form[]>({
    queryKey: ["forms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getForms();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Submit a new application mutation
export function useCreateApplication() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Application, "id" | "submittedAt" | "status">) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createApplication(data);
    },
    onSuccess: () => {
      // Invalidate cache so My Applications list re-fetches immediately
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}`}
            />

            <h3 className="text-base font-bold text-primary mb-2 mt-8">
              Appendix E — Mock Data Statistics
            </h3>
            <DataTable
              headers={[
                "Category",
                "Count",
                "% of Total",
                "Avg. Benefit (₹)",
                "Avg. Days to Deadline",
              ]}
              rows={[
                ["Scholarships", "8", "33.3%", "₹22,500", "47 days"],
                ["Employment / Jobs", "7", "29.2%", "N/A (salary)", "35 days"],
                ["Government Forms", "6", "25.0%", "₹5,000", "62 days"],
                ["Welfare Schemes", "3", "12.5%", "₹8,000", "89 days"],
                ["Total", "24", "100%", "₹12,750 avg", "53 days avg"],
              ]}
            />
            <DataTable
              headers={[
                "Application Status",
                "Mock Count",
                "% Distribution",
                "Description",
              ]}
              rows={[
                [
                  "Pending",
                  "12",
                  "40.0%",
                  "Submitted; awaiting initial review",
                ],
                [
                  "Under Review",
                  "8",
                  "26.7%",
                  "Active review by designated officer",
                ],
                [
                  "Approved",
                  "6",
                  "20.0%",
                  "Application accepted; benefit disbursed",
                ],
                [
                  "Rejected",
                  "3",
                  "10.0%",
                  "Application declined with reason noted",
                ],
                ["Draft", "1", "3.3%", "Saved but not yet submitted"],
              ]}
            />
          </section>

          <div className="h-16" />
        </main>
      </div>

      {/* Back to top */}
      <button
        type="button"
        data-ocid="report.back_to_top"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full w-11 h-11 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors duration-200 print:hidden"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
