import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Region {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'expanding' | 'planned';
  languages: string[];
  primaryMarket: string;
  searchContext: string;
  localizationNotes: string[];
  toneAdjustments: string[];
  keyPlatforms: string[];
  avoidTerms: string[];
  localTerms: { global: string; local: string }[];
}

// ── Data ───────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    code: 'NA',
    status: 'active',
    languages: ['English (US)'],
    primaryMarket: 'United States',
    searchContext:
      'Dominant AI search adoption. ChatGPT, Perplexity, and Google AI Overviews are primary citation targets. High competition for AI-cited content in B2B SaaS, marketing, and tech verticals.',
    localizationNotes: [
      'Default voice and copy — all brand guidelines apply at full strength',
      'Use USD pricing and US-centric case study references by default',
      'Content Engineering as a term is native here — no explanation needed',
      'Marketing tech stack references: HubSpot, Salesforce, Google Search Console, Semrush',
    ],
    toneAdjustments: [
      'No adjustments — this is the primary reference market',
      'Second-person direct address is standard and expected',
      'Data-forward claims land well — cite specific metrics and percentages',
    ],
    keyPlatforms: ['Google Search', 'ChatGPT', 'Perplexity', 'LinkedIn', 'HubSpot'],
    avoidTerms: [],
    localTerms: [],
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    code: 'UK',
    status: 'active',
    languages: ['English (UK)'],
    primaryMarket: 'United Kingdom',
    searchContext:
      'Strong adoption of AI search, particularly Google AI Overviews and Bing Copilot. UK marketing teams are early adopters of content automation but more conservative on AI brand risk. GDPR compliance is always top of mind for decision-makers.',
    localizationNotes: [
      'Use British spelling: "optimise," "colour," "behaviour," "programme," "organisation"',
      'Reference UK-specific platforms: Google UK, LinkedIn, and Bing Copilot',
      'GDPR and data privacy resonates strongly — lean into AirOps governance features',
      'Use GBP pricing and UK customer references where available',
    ],
    toneAdjustments: [
      'Slightly more understated than the US voice — dial back superlatives',
      'Dry wit and self-awareness land well — lean into the Witty + Clever mode when appropriate',
      'Avoid "excited to announce" language — it reads as American corporate to UK audiences',
      'Direct is still valued — don\'t over-soften CTAs',
    ],
    keyPlatforms: ['Google UK', 'Bing Copilot', 'LinkedIn', 'Slack', 'Monday.com'],
    avoidTerms: ['gotten', 'color', 'optimize', 'program (as in programme)', 'learnings (use "lessons")'],
    localTerms: [
      { global: 'optimize', local: 'optimise' },
      { global: 'color', local: 'colour' },
      { global: 'organize', local: 'organise' },
      { global: 'program', local: 'programme' },
      { global: 'analyze', local: 'analyse' },
    ],
  },
  {
    id: 'australia-nz',
    name: 'Australia & New Zealand',
    code: 'ANZ',
    status: 'expanding',
    languages: ['English (AU/NZ)'],
    primaryMarket: 'Australia',
    searchContext:
      'AI search adoption is growing rapidly, led by Google AI Overviews. Smaller market with tighter content marketing communities — word of mouth and community proof matter more here than in NA or UK. Agency and consultancy segment is proportionally large.',
    localizationNotes: [
      'Use Australian English spelling (same as UK): "optimise," "colour," "organisation"',
      'Reference AUD pricing for AU-specific materials; NZD for NZ',
      'Strong agency market — agency partner messaging is especially relevant here',
      'Localise case studies with AU/NZ customer names where possible',
    ],
    toneAdjustments: [
      'Informal warmth is valued — Australians respond to directness without stuffiness',
      'Community and peer validation matter more here — lean into social proof',
      'Avoid over-formal corporate language — it alienates the AU market faster than most',
      'Humour can be more self-deprecating and casual than in NA copy',
    ],
    keyPlatforms: ['Google AU', 'LinkedIn', 'Slack', 'HubSpot', 'Canva'],
    avoidTerms: ['color', 'organize', 'optimize', 'gotten'],
    localTerms: [
      { global: 'optimize', local: 'optimise' },
      { global: 'color', local: 'colour' },
      { global: 'organize', local: 'organise' },
    ],
  },
  {
    id: 'europe',
    name: 'Europe (EMEA)',
    code: 'EMEA',
    status: 'planned',
    languages: ['English (EU)', 'German', 'French', 'Spanish'],
    primaryMarket: 'Germany, France, Netherlands',
    searchContext:
      'AI search adoption is slower than North America due to regulation and user skepticism. Google dominates. AI tools face stronger scrutiny from legal and compliance teams. Content must acknowledge data governance explicitly when relevant.',
    localizationNotes: [
      'All primary content in English (EU); translated assets needed for DE, FR, ES markets',
      'GDPR compliance language must appear in any data-processing context',
      'Privacy-first positioning — AirOps governance features are a strong differentiator here',
      'Avoid US-centric platform references; use region-appropriate CMS and analytics tools',
    ],
    toneAdjustments: [
      'More formal register than NA — particularly in German-language content',
      'Avoid casual colloquialisms that don\'t translate culturally',
      'Precision over enthusiasm — European B2B audiences expect specific, detailed claims',
      'Build trust through credential and social proof — certifications resonate here',
    ],
    keyPlatforms: ['Google EU', 'LinkedIn', 'XING (DE)', 'Sistrix', 'Matomo'],
    avoidTerms: [
      'Casual Americanisms that don\'t translate',
      'Unverified data claims — EU audiences are more skeptical of statistics',
    ],
    localTerms: [
      { global: 'zip code', local: 'postal code' },
      { global: 'cell phone', local: 'mobile' },
      { global: 'fall (season)', local: 'autumn' },
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:     { label: 'Active',     bg: 'var(--color-green-200)', color: 'var(--primary)', border: 'var(--color-stroke-green)' },
  expanding:  { label: 'Expanding',  bg: 'var(--color-accent-label)', color: 'var(--color-near-black)', border: 'var(--color-stroke-green)' },
  planned:    { label: 'Planned',    bg: 'var(--muted)', color: 'var(--color-text-secondary)', border: 'var(--border)' },
};

function StatusBadge({ status }: { status: Region['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}

function RegionCard({ region }: { region: Region }) {
  const [tab, setTab] = useState<'notes' | 'tone' | 'terms'>('notes');

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Left */}
        <div style={{ padding: '22px 28px', borderRight: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '10px' }}>
            {/* Region code box */}
            <div
              style={{
                width: '36px',
                height: '28px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '0.06em',
                }}
              >
                {region.code}
              </span>
            </div>
            <StatusBadge status={region.status} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '4px',
            }}
          >
            {region.name}
          </h2>

          <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '14px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              {region.primaryMarket}
            </span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
              }}
            >
              {region.languages.join(', ')}
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {region.searchContext}
          </p>
        </div>

        {/* Right: platforms */}
        <div style={{ padding: '22px 24px', backgroundColor: 'var(--muted)' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 500,
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Key Platforms
          </p>
          <div className="flex flex-wrap gap-1.5">
            {region.keyPlatforms.map(p => (
              <span
                key={p}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 500,
                  color: 'var(--foreground)',
                  letterSpacing: '0.04em',
                  padding: '4px 10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab area */}
      <div>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
          }}
        >
          {(
            [
              { key: 'notes' as const, label: 'Localization Notes' },
              { key: 'tone' as const, label: 'Tone Adjustments' },
              { key: 'terms' as const, label: 'Terminology' },
            ] as const
          ).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: tab === t.key ? 'var(--foreground)' : 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 28px' }}>
          {tab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {region.localizationNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      marginTop: '2px',
                      flexShrink: 0,
                      minWidth: '20px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      lineHeight: 1.65,
                    }}
                  >
                    {note}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === 'tone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {region.toneAdjustments.map((adj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '1px',
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      lineHeight: 1.65,
                    }}
                  >
                    {adj}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === 'terms' && (
            region.localTerms.length > 0 ? (
              <div>
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '6px',
                    marginBottom: '2px',
                  }}
                >
                  {['Global (US)', region.name].map(h => (
                    <span
                      key={h}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        fontWeight: 500,
                        color: 'var(--color-text-tertiary)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '0 8px',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {region.localTerms.map(t => (
                  <div
                    key={t.global}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px',
                        borderRight: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--color-text-secondary)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {t.global}
                      </span>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--primary)',
                          fontWeight: 500,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {t.local}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                  fontStyle: 'italic',
                }}
              >
                No terminology substitutions — {region.name} uses standard global (US) English.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export function RegionsTab() {
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}
      >
        <div style={{ maxWidth: '580px' }}>
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
            Regions
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
            }}
          >
            Localization guidelines for each geographic market — including search context, tone
            adjustments, and terminology substitutions. Apply these on top of the global brand
            guidelines in Foundations.
          </p>
        </div>

        {/* Status legend */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {(Object.entries(STATUS_CONFIG) as [Region['status'], typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(
            ([status, cfg]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {cfg.label}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Region cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {REGIONS.map(region => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
}
