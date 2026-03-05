import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Audience {
  id: string;
  name: string;
  role: string;
  segment: string;
  description: string;
  painPoints: string[];
  goals: string[];
  keyMessages: string[];
  toneMode: string;
  preferredChannels: string[];
  avoidList: string[];
}

// ── Data ───────────────────────────────────────────────────────────────────

const AUDIENCES: Audience[] = [
  {
    id: 'content-manager',
    name: 'The Content Manager',
    role: 'Content Marketing Manager / Senior Content Strategist',
    segment: 'Primary',
    description:
      'Responsible for content calendars, writer management, and performance reporting. Juggling SEO, brand, and editorial quality across a high-volume output. Feels the pressure of AI disruption and wants a platform that makes their team faster — not one that replaces them.',
    painPoints: [
      'Managing 50+ pieces of content per month with a small team',
      'SEO strategy that\'s not keeping up with AI search changes',
      'Inconsistent brand voice across writers and formats',
      'No single view of what content is actually performing',
    ],
    goals: [
      'Ship more quality content in less time',
      'Prove content ROI to leadership',
      'Keep AI-generated content on-brand without heavy editing',
      'Build a scalable, repeatable content operation',
    ],
    keyMessages: [
      'AirOps handles the heavy lift — you keep creative control',
      'Brand Kits keep every output sounding like you, every time',
      'Grids give you one place to see, approve, and publish everything',
      'Content Engineering is the next level of what you already do',
    ],
    toneMode: 'Empowering',
    preferredChannels: ['Blog', 'Email newsletter', 'LinkedIn', 'Product demos'],
    avoidList: [
      'Framing AI as a replacement — always position as augmentation',
      'Technical jargon about workflows or APIs — lead with outcomes',
      'Complexity — they are already overwhelmed',
    ],
  },
  {
    id: 'seo-lead',
    name: 'The SEO Lead',
    role: 'SEO Manager / Director of SEO / VP Search',
    segment: 'Primary',
    description:
      'Data-obsessed, channel-native, and increasingly responsible for AI search visibility alongside traditional SEO. Tracks rankings, citations, and share of voice. Needs platforms that connect SEO signals to content action — and can prove ROI.',
    painPoints: [
      'Organic traffic flat or declining as AI search takes share',
      'No clear view of AI search performance or citation rates',
      'Content teams that don\'t act on SEO data fast enough',
      'Proving SEO ROI to leadership in a changing search landscape',
    ],
    goals: [
      'Grow citations in ChatGPT, Perplexity, and Google AI Overviews',
      'Surface high-ROI content gaps before competitors find them',
      'Connect SEO insight to content execution in one platform',
      'Build a defensible content moat in their niche',
    ],
    keyMessages: [
      'Page360 unifies SEO, AI search, and GA4 so nothing slips through',
      'Opportunity Scanner surfaces gaps your competitors haven\'t found yet',
      'AI Search Analytics shows exactly where you\'re cited and where you\'re not',
      'Turn every insight into a content action — no handoff required',
    ],
    toneMode: 'Functional + Data Driven',
    preferredChannels: ['Blog (deep-dive)', 'Email', 'LinkedIn', 'Webinars'],
    avoidList: [
      'Vague claims about "better rankings" without specific mechanisms',
      'Overselling AI capabilities — SEOs are skeptical by nature',
      'Ignoring traditional SEO — AI search is additive, not a replacement',
    ],
  },
  {
    id: 'marketing-leader',
    name: 'The Marketing Leader',
    role: 'CMO / VP Marketing / Head of Growth',
    segment: 'Economic Buyer',
    description:
      'Responsible for pipeline, brand, and marketing ROI. Evaluates platforms on business impact, team efficiency, and risk. Less hands-on with the product — cares deeply about the strategic narrative and what the category shift toward Content Engineering means for their organization.',
    painPoints: [
      'Marketing team not producing enough quality content at scale',
      'Unclear content ROI — hard to connect content spend to pipeline',
      'Risk of AI-generated content damaging brand reputation',
      'Team upskilling demands as AI reshapes content operations',
    ],
    goals: [
      'Scale content output without scaling headcount proportionally',
      'Build a defensible brand presence in AI search',
      'Create a culture of Content Engineering within the marketing team',
      'Prove marketing\'s ROI to the board',
    ],
    keyMessages: [
      'Content Engineering is the operating model for modern marketing teams',
      'AirOps gives your team precision — AI handles volume, humans handle quality',
      'Measurable ROI: connect content investments directly to pipeline',
      'Brand governance built in — your reputation stays protected at scale',
    ],
    toneMode: 'Aspirational',
    preferredChannels: ['Keynotes', 'Investor-facing content', 'Thought leadership', 'LinkedIn'],
    avoidList: [
      'Tactical feature detail — they want strategic outcomes',
      'AI fear framing — position as competitive advantage, not threat',
      'Dense product demos upfront — establish category before showing product',
    ],
  },
  {
    id: 'agency-partner',
    name: 'The Agency Partner',
    role: 'Agency Principal / Head of Content / SEO Agency Lead',
    segment: 'Partner',
    description:
      'Runs content and SEO programs for multiple clients simultaneously. Needs systems that scale across accounts, keep client brands separate, and deliver results fast. Evaluates platforms on multi-client support, white-label potential, and speed to value.',
    painPoints: [
      'Managing distinct brand voices across 10–30 clients',
      'Proving content value to clients who expect fast results',
      'Scaling execution without hiring proportionally',
      'AI tools that produce generic output that clients reject',
    ],
    goals: [
      'Deliver faster, higher-quality content for every client',
      'Stand out as an AI-forward agency in a crowded market',
      'Build repeatable systems that work across all client accounts',
      'Earn and protect client trust through consistent, on-brand output',
    ],
    keyMessages: [
      'One Brand Kit per client — every output stays in their voice',
      'Workflows that scale across accounts without chaos',
      'White-label ready: your process, your client relationship',
      'Be the agency that gets cited — not the one still doing manual audits',
    ],
    toneMode: 'Collaborative',
    preferredChannels: ['LinkedIn', 'Agency community events', 'Partner webinars', 'Email'],
    avoidList: [
      'Positioning AirOps as a replacement for agency expertise',
      'Ignoring the multi-client complexity — it\'s their core challenge',
      'Feature-first messaging — agency leads want client outcomes, not platform specs',
    ],
  },
  {
    id: 'content-engineer',
    name: 'The Content Engineer',
    role: 'Senior Content Strategist / Content Operations Lead / Marketing Systems Builder',
    segment: 'Power User',
    description:
      'Early adopter of AI content tooling. Builds workflows, manages Knowledge Bases, and acts as the internal champion for AirOps. Deeply technical by content standards — interested in Power Agents, API integrations, and pushing the platform to its limits.',
    painPoints: [
      'AI tools that don\'t preserve brand voice or use brand context',
      'No way to build reusable content systems that scale',
      'Being the only person at their company thinking about this',
      'Proving the ROI of content engineering investment internally',
    ],
    goals: [
      'Build a content machine that runs on brand-consistent AI automation',
      'Become the recognized Content Engineering expert at their organization',
      'Connect AirOps to their full martech stack via integrations',
      'Earn the Content Engineering Certification and lead cohort community',
    ],
    keyMessages: [
      'Power Agents give you full control — fork, customize, and deploy',
      'Integrations connect AirOps to your CMS, data sources, and owned LLMs',
      'The Certification is built for people like you — practitioners, not theorists',
      'Build the system once. Let it produce forever.',
    ],
    toneMode: 'Witty + Clever',
    preferredChannels: ['Product changelog', 'Community Slack', 'LinkedIn', 'Certification program'],
    avoidList: [
      'Dumbing down the product — they want to go deep',
      'Overselling ease of use — they want power and precision',
      'Skipping technical detail — they will notice if you hand-wave integrations',
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SegmentBadge({ segment }: { segment: string }) {
  const configs: Record<string, { bg: string; color: string; border: string }> = {
    Primary: {
      bg: 'var(--color-accent-label)',
      color: 'var(--color-near-black)',
      border: 'var(--color-stroke-green)',
    },
    'Economic Buyer': {
      bg: 'var(--color-green-200)',
      color: 'var(--primary)',
      border: 'var(--color-stroke-green)',
    },
    Partner: {
      bg: 'var(--muted)',
      color: 'var(--color-text-secondary)',
      border: 'var(--border)',
    },
    'Power User': {
      bg: 'var(--color-near-black)',
      color: '#ffffff',
      border: 'var(--color-near-black)',
    },
  };
  const cfg = configs[segment] ?? configs['Partner'];

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
        whiteSpace: 'nowrap' as const,
      }}
    >
      {segment}
    </span>
  );
}

function AudienceCard({ audience }: { audience: Audience }) {
  const [activeCol, setActiveCol] = useState<'pain' | 'goals' | 'messages'>('pain');

  const colOptions = [
    { key: 'pain' as const, label: 'Pain Points' },
    { key: 'goals' as const, label: 'Goals' },
    { key: 'messages' as const, label: 'Key Messages' },
  ];

  const activeItems =
    activeCol === 'pain'
      ? audience.painPoints
      : activeCol === 'goals'
      ? audience.goals
      : audience.keyMessages;

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Left */}
        <div style={{ padding: '22px 28px', borderRight: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
            <SegmentBadge segment={audience.segment} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '3px',
            }}
          >
            {audience.name}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.02em',
              marginBottom: '14px',
            }}
          >
            {audience.role}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
            }}
          >
            {audience.description}
          </p>
        </div>

        {/* Right: meta */}
        <div
          style={{
            padding: '22px 20px',
            backgroundColor: 'var(--muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              Tone Mode
            </p>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--primary)',
              }}
            >
              {audience.toneMode}
            </span>
          </div>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              Preferred Channels
            </p>
            <div className="flex flex-wrap gap-1">
              {audience.preferredChannels.map(ch => (
                <span
                  key={ch}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--foreground)',
                    letterSpacing: '0.04em',
                    padding: '2px 7px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              Avoid with this audience
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {audience.avoidList.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '2px',
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.55,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tabs */}
      <div>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
          }}
        >
          {colOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setActiveCol(opt.key)}
              style={{
                padding: '8px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:
                  activeCol === opt.key ? 'var(--foreground)' : 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom:
                  activeCol === opt.key ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: activeCol === 'messages' ? 'var(--primary)' : 'var(--color-text-tertiary)',
                    letterSpacing: '0.06em',
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
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export function AudiencesTab() {
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
          Audiences
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
          }}
        >
          Five distinct audience personas — each with their own pain points, goals, key messages,
          and tone requirements. Use these to calibrate every piece of content before you write.
        </p>
      </div>

      {/* Segment legend */}
      <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '24px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Segment
        </span>
        {['Primary', 'Economic Buyer', 'Partner', 'Power User'].map(s => (
          <SegmentBadge key={s} segment={s} />
        ))}
      </div>

      {/* Audience cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {AUDIENCES.map(audience => (
          <AudienceCard key={audience.id} audience={audience} />
        ))}
      </div>
    </div>
  );
}
