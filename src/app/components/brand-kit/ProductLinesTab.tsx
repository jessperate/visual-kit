import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Feature {
  name: string;
  description: string;
}

interface ProductLine {
  id: string;
  layer: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  features: Feature[];
  messagingPillars: string[];
  toneMode: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'insights',
    layer: 'Layer 01',
    name: 'Insights',
    tagline: 'See exactly where to invest next.',
    description:
      'Insights unifies SEO, AI search, and analytics data so content teams always know what to build, fix, or amplify. It surfaces opportunities across owned content, external sites, and community signals on a continuous cadence — so you stop guessing and start engineering.',
    audience: 'SEO leads, content strategists, marketing directors',
    features: [
      {
        name: 'Page360',
        description:
          'Unifies SEO, AI search, and GA4 data in a single view. Shows content health, citation likelihood, and revenue opportunity for every URL.',
      },
      {
        name: 'AI Search Analytics',
        description:
          'Tracks which of your pages appear in ChatGPT, Perplexity, and Gemini responses — and which competitors are getting cited instead.',
      },
      {
        name: 'Opportunity Scanner',
        description:
          'Identifies high-ROI content gaps by analyzing prompts, topics, and domains driving influence across AI and traditional search engines.',
      },
      {
        name: 'Reddit & Community Monitoring',
        description:
          'Surfaces brand mentions, competitor threads, and topic clusters in community spaces on a regular cadence — so you never miss a signal.',
      },
    ],
    messagingPillars: [
      'Unified visibility — one place for SEO, AI search, and GA4',
      'Continuous cadence — weekly surfaced opportunities, not quarterly audits',
      'Citation intelligence — know which AI systems are citing you and why',
      'ROI prioritization — rank every opportunity by revenue potential',
    ],
    toneMode: 'Functional + Data Driven',
  },
  {
    id: 'action',
    layer: 'Layer 02',
    name: 'Action',
    tagline: 'Turn every insight into content that earns.',
    description:
      'The Action layer converts opportunities into published content — fast. AirOps blends your brand knowledge, live SEO signals, and AI with human review steps so every output is both on-brand and search-optimized. Teams ship more, approve less, and trust every result.',
    audience: 'Content managers, writers, workflow architects, CMS editors',
    features: [
      {
        name: 'Grids',
        description:
          'A collaborative command center for every article, update, and workflow run. Teams manage briefs, drafts, review status, and publishing from one unified interface.',
      },
      {
        name: 'Workflows',
        description:
          'Build precision content workflows with live data sources, brand Knowledge Bases, and Human Review steps. Fork and extend a growing library of Power Agent templates.',
      },
      {
        name: 'Power Agents',
        description:
          'Pre-built agentic workflows for high-value content tasks — content refresh, gap analysis, SEO rewriting, schema generation, and more. Fork, customize, and deploy in minutes.',
      },
      {
        name: 'Human Review',
        description:
          'Structured approval steps that keep humans in the loop for tone, accuracy, and brand compliance — without slowing down the pipeline.',
      },
    ],
    messagingPillars: [
      'Human-in-the-loop — AI handles the lift, humans focus on what matters',
      'Brand-consistent output — Knowledge Bases keep every draft on-brand',
      'CMS-ready — push results directly with no manual handoffs',
      'Scalable execution — manage hundreds of content ops from one grid',
    ],
    toneMode: 'Empowering',
  },
  {
    id: 'brand-kits',
    layer: 'Platform',
    name: 'Brand Kits & Knowledge',
    tagline: 'Every piece of content, unmistakably yours.',
    description:
      'Brand Kits are the memory layer of AirOps. Collect your tone, rules, references, and visual context in one home. Every workflow, agent, and output draws from this knowledge so your brand stays consistent — whether you\'re publishing once a day or a thousand times a month.',
    audience: 'Brand managers, content leads, creative directors',
    features: [
      {
        name: 'Foundations',
        description:
          'Writing guidelines, voice & tone, author persona, and global rules stored as structured brand knowledge — always available to every AI workflow.',
      },
      {
        name: 'Visual Style',
        description:
          'Color tokens, typography scale, illustration references, and data viz standards defined and version-controlled in one place.',
      },
      {
        name: 'Knowledge Base',
        description:
          'Attach product docs, competitor research, past articles, and source material. AI workflows retrieve and cite from your knowledge library automatically.',
      },
      {
        name: 'Custom Variables',
        description:
          'Define dynamic tokens — audience segments, product names, regional terms — that inject live context into any workflow or content template.',
      },
    ],
    messagingPillars: [
      'Single source of brand truth — one home for all brand context',
      'Always-on consistency — every AI run uses the same knowledge layer',
      'Version-controlled — track changes to tone, rules, and visual style',
      'Portable — export your brand kit as Markdown, CSS, or JSON',
    ],
    toneMode: 'Collaborative',
  },
  {
    id: 'certification',
    layer: 'Program',
    name: 'Content Engineering Certification',
    tagline: 'Level up. Lead what comes next.',
    description:
      'The Content Engineering Certification trains marketers to build systems, not just content. Through structured curriculum, live cohorts, and a practitioner community, certified members gain the playbooks, frameworks, and confidence to lead content engineering at scale.',
    audience: 'Individual contributors, marketing managers, agency leads',
    features: [
      {
        name: 'Curriculum',
        description:
          'Six modules covering content strategy, AI integration, workflow design, SEO systems, measurement frameworks, and brand governance.',
      },
      {
        name: 'Live Cohorts',
        description:
          'Cohort-based learning with peer practitioners, live Q&As with AirOps experts, and workshop sessions on real-world content operations.',
      },
      {
        name: 'Practitioner Community',
        description:
          'A private network of certified Content Engineers sharing playbooks, discussing platform updates, and collaborating on shared challenges.',
      },
      {
        name: 'Credential',
        description:
          'A verifiable certification that demonstrates proficiency in content engineering — shareable on LinkedIn and valid for two years.',
      },
    ],
    messagingPillars: [
      'Career-defining — become a leader in the new era of Content Engineering',
      'Practical skills — real playbooks, not theory',
      'Community-powered — learn alongside other practitioners',
      'Recognized credential — shareable proof of expertise',
    ],
    toneMode: 'Aspirational',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function MonoPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        backgroundColor: 'var(--color-accent-label)',
        border: '1px solid var(--color-stroke-green)',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: 'var(--color-near-black)',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {children}
    </span>
  );
}

function GreenPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        backgroundColor: 'var(--color-green-200)',
        border: '1px solid var(--color-stroke-green)',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: 'var(--primary)',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {children}
    </span>
  );
}

function ProductCard({ product }: { product: ProductLine }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Card header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'start',
          padding: '24px 28px',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          backgroundColor: 'var(--background)',
        }}
      >
        <div>
          {/* Layer label */}
          <div style={{ marginBottom: '10px' }}>
            <MonoPill>{product.layer}</MonoPill>
          </div>

          {/* Name + tagline */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '4px',
            }}
          >
            {product.name}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--primary)',
              marginBottom: '12px',
            }}
          >
            {product.tagline}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '640px',
            }}
          >
            {product.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: '16px' }}>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--color-text-tertiary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Audience
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {product.audience}
              </span>
            </div>
            <span style={{ color: 'var(--border)', fontSize: '10px' }}>·</span>
            <GreenPill>{product.toneMode}</GreenPill>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            marginTop: '4px',
          }}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${product.name} details`}
        >
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? 'Less' : 'Details'}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 260px',
          }}
        >
          {/* Features */}
          <div style={{ padding: '24px 28px', borderRight: '1px solid var(--border)' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Key Capabilities
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {product.features.map(f => (
                <div
                  key={f.name}
                  style={{
                    padding: '14px 16px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      marginBottom: '4px',
                    }}
                  >
                    {f.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.65,
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Messaging pillars */}
          <div
            style={{
              padding: '24px 20px',
              backgroundColor: 'var(--muted)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              Messaging Pillars
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {product.messagingPillars.map((pillar, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      letterSpacing: '0.06em',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      lineHeight: 1.6,
                    }}
                  >
                    {pillar}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export function ProductLinesTab() {
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', maxWidth: '600px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Product Lines
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
          }}
        >
          AirOps is organized into two platform layers — Insights and Action — plus a certification
          program. Each has distinct audiences, messaging pillars, and tone requirements.
        </p>
      </div>

      {/* Product cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {PRODUCT_LINES.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
