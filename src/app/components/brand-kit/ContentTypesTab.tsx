import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ContentRule {
  label: string;
  value: string;
}

interface ContentType {
  id: string;
  name: string;
  category: string;
  description: string;
  wordCount: string;
  toneMode: string;
  channel: string;
  cta: string;
  rules: ContentRule[];
  doList: string[];
  dontList: string[];
}

// ── Data ───────────────────────────────────────────────────────────────────

const CONTENT_TYPES: ContentType[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'Long-form',
    description:
      'In-depth articles targeting search intent. Structured for both human readability and AI citation. Always includes a TL;DR, H2/H3 outline, data-backed claims, and a clear CTA.',
    wordCount: '1,500 – 3,500',
    toneMode: 'Functional + Data Driven',
    channel: 'airops.com/blog',
    cta: 'Start free trial / Book a demo',
    rules: [
      { label: 'Structure', value: 'TL;DR → Problem → Solution → Evidence → CTA' },
      { label: 'Headings', value: 'H2 as questions, H3 as step labels' },
      { label: 'Attribution', value: 'Cite data sources inline, link to originals' },
      { label: 'SEO target', value: 'One primary keyword, 2–4 secondary terms' },
    ],
    doList: [
      'Lead with a bolded TL;DR (4–6 bullets)',
      'Use second-person throughout ("your team", "you can")',
      'Include real metrics, named platforms, and specific tools',
      'Add a step-by-step section for how-to content',
      'Close with a summary and single CTA',
    ],
    dontList: [
      'Start with "In today\'s world" or "In an era where"',
      'Use "delve into," "leverage," or "it\'s worth noting"',
      'Use em dashes as dramatic pauses',
      'End lists with "…and beyond!"',
    ],
  },
  {
    id: 'seo-landing',
    name: 'SEO Landing Page',
    category: 'Long-form',
    description:
      'High-intent pages optimized for search and AI citation. These pages are authoritative, structured, and designed to answer a specific query type. Schema markup is required.',
    wordCount: '800 – 2,000',
    toneMode: 'Functional + Data Driven',
    channel: 'airops.com',
    cta: 'Start free trial / See how it works',
    rules: [
      { label: 'Structure', value: 'Hero → Problem definition → Solution → Features → Social proof → FAQ → CTA' },
      { label: 'Schema', value: 'Article or WebPage schema required on all SEO pages' },
      { label: 'FAQ', value: 'Minimum 4 Q&A pairs targeting related search queries' },
      { label: 'Internal links', value: '3–5 contextual links to related pages' },
    ],
    doList: [
      'Answer the primary query in the first 100 words',
      'Use structured H2/H3 hierarchy with keyword-rich headings',
      'Include comparison tables or feature lists for scannability',
      'Add FAQ section targeting "People Also Ask" queries',
      'Use schema markup for rich result eligibility',
    ],
    dontList: [
      'Pad with filler paragraphs — every section must earn its place',
      'Use generic hero copy ("The #1 platform for…")',
      'Neglect mobile structure — test header hierarchy on mobile',
      'Skip the FAQ — it\'s critical for AI citation',
    ],
  },
  {
    id: 'case-study',
    name: 'Case Study',
    category: 'Social Proof',
    description:
      'Customer success stories that combine narrative with quantifiable outcomes. Case studies are co-authored with customers and go through a formal review process before publication.',
    wordCount: '800 – 1,500',
    toneMode: 'Empowering',
    channel: 'airops.com/customers',
    cta: 'See how [customer] did it / Talk to our team',
    rules: [
      { label: 'Structure', value: 'Customer overview → Challenge → AirOps solution → Measurable results → Quote' },
      { label: 'Metrics', value: 'Must include at least 2 specific, verifiable outcome metrics' },
      { label: 'Voice', value: 'Customer-first: their story, their words, their win' },
      { label: 'Approval', value: 'Customer legal and comms review required before publish' },
    ],
    doList: [
      'Open with the customer\'s challenge, not AirOps features',
      'Quantify results specifically: "3× more citations in 60 days"',
      'Include a direct customer quote with name, title, and company',
      'Show the before/after clearly in a callout or table',
      'Keep product mentions functional, not promotional',
    ],
    dontList: [
      'Lead with AirOps branding before establishing customer context',
      'Use vague outcomes: "significant improvement" or "better results"',
      'Include metrics that aren\'t approved by the customer',
      'Over-explain the product — let the outcomes speak',
    ],
  },
  {
    id: 'thought-leadership',
    name: 'Thought Leadership',
    category: 'Editorial',
    description:
      'Opinion pieces and editorial content that position AirOps as the definitive voice on Content Engineering and AI search. Written with a clear POV and supported by first-party data or direct observation.',
    wordCount: '900 – 2,000',
    toneMode: 'Aspirational',
    channel: 'airops.com/blog · LinkedIn · Guest publications',
    cta: 'Learn more about Content Engineering / Join the Certification',
    rules: [
      { label: 'POV', value: 'Must take a clear, defensible position — no "on the one hand, on the other"' },
      { label: 'Evidence', value: 'Back the argument with data, examples, or named cases' },
      { label: 'Byline', value: 'Attributed to a named AirOps voice or customer expert' },
      { label: 'Urgency', value: 'Frame around a real market moment — not a manufactured trend' },
    ],
    doList: [
      'Open with a bold, contestable claim',
      'Name specific tools, companies, or trends — be concrete',
      'Use first-person sparingly and only when adding genuine experience',
      'Build the argument, don\'t just assert it',
      'End with a call to action toward the Content Engineering movement',
    ],
    dontList: [
      'Use AI doomsday framing or fear-based positioning',
      'Be generic — "AI is changing everything" is not a point of view',
      'Write listicles disguised as thought leadership',
      'Promote AirOps features explicitly — let the ideas do the selling',
    ],
  },
  {
    id: 'social-linkedin',
    name: 'LinkedIn Post',
    category: 'Social',
    description:
      'Short-form content optimized for LinkedIn reach and engagement. Posts are first-person, story-driven, and end with a question or clear takeaway. Data hooks perform best.',
    wordCount: '80 – 250 words',
    toneMode: 'Witty + Clever',
    channel: 'LinkedIn',
    cta: 'Link in comments / Drop a comment below',
    rules: [
      { label: 'Hook', value: 'First line must stop the scroll — data point, bold claim, or surprising fact' },
      { label: 'Format', value: 'Short paragraphs (1–2 sentences). Use line breaks, not bullets' },
      { label: 'End', value: 'Close with a question, invitation, or takeaway — not a hard sell' },
      { label: 'Link', value: 'Put links in comments, not the post body' },
    ],
    doList: [
      'Start with a number, a name, or a contrarian statement',
      'Share genuine experience — not product announcements',
      'Use specific details: "14% lift in 6 weeks" beats "significant growth"',
      'Invite responses — "What\'s your take?" drives comments',
      'Keep it human — this is a person speaking, not a brand',
    ],
    dontList: [
      'Open with "Excited to share…" or "Thrilled to announce…"',
      'Use em dashes or corporate jargon',
      'Make it a thinly veiled product ad',
      'Write in third person about AirOps',
    ],
  },
  {
    id: 'email',
    name: 'Email Newsletter',
    category: 'Nurture',
    description:
      'Subscriber emails that educate, inform, and advance the AirOps relationship. Content-forward with minimal selling. Readers should leave with one useful idea or action item.',
    wordCount: '300 – 600 words',
    toneMode: 'Collaborative',
    channel: 'Email (HubSpot)',
    cta: 'Read the full piece / Watch the demo / Join the community',
    rules: [
      { label: 'Structure', value: 'One main idea per email — resist adding more' },
      { label: 'Subject line', value: 'Direct, specific, curiosity-forward. A/B test every send' },
      { label: 'Personalization', value: 'Use first name token. Reference segment when relevant' },
      { label: 'Frequency', value: 'Max two sends per week per subscriber per list' },
    ],
    doList: [
      'Write the subject line last, after the body is done',
      'Lead with the insight, not the announcement',
      'One CTA per email — not three "optional" ones',
      'Write as if to one person, not a list',
      'Test preview text as a continuation of the subject line',
    ],
    dontList: [
      'Open with "Hi [First Name], hope you\'re well!"',
      'Include more than one primary CTA',
      'Use "click here" as link text',
      'Send without a plain-text version',
    ],
  },
  {
    id: 'product-page',
    name: 'Product Page',
    category: 'Conversion',
    description:
      'Feature and product pages designed to convert informed visitors. These pages assume the reader knows the category and needs to understand what makes AirOps different.',
    wordCount: '400 – 1,200',
    toneMode: 'Empowering',
    channel: 'airops.com/product',
    cta: 'Start free trial · Book a demo',
    rules: [
      { label: 'Hero', value: 'Outcome-first headline: what the user gets, not what we built' },
      { label: 'Proof', value: 'Include a customer metric or logo within the first scroll' },
      { label: 'Features', value: 'Show features in context — screenshots or workflow diagrams' },
      { label: 'CTA', value: 'Two CTAs max: primary (trial) and secondary (demo)' },
    ],
    doList: [
      'Lead with the customer outcome, not the product capability',
      'Show the workflow — not just the UI',
      'Use social proof at the point of hesitation',
      'Be specific about what\'s included in each tier or plan',
      'Keep copy scannable — most visitors read 20% of the page',
    ],
    dontList: [
      'Lead with "Introducing…" or "Powered by AI"',
      'List features without connecting them to outcomes',
      'Use placeholder copy ("Lorem ipsum") in production',
      'Add more than two CTAs — pick a side',
    ],
  },
  {
    id: 'documentation',
    name: 'Help & Documentation',
    category: 'Support',
    description:
      'Technical and how-to documentation for AirOps platform users. Written for clarity and speed — the reader needs to complete a task or understand a concept as fast as possible.',
    wordCount: '200 – 1,000 (task-dependent)',
    toneMode: 'Functional + Data Driven',
    channel: 'help.airops.com',
    cta: 'Contact support / Watch tutorial',
    rules: [
      { label: 'Title', value: 'Always a task: "How to connect your CMS" not "CMS Connection"' },
      { label: 'Steps', value: 'Numbered list for every sequential process. No exceptions.' },
      { label: 'Screenshots', value: 'Include annotated screenshots for UI-based tasks' },
      { label: 'Notes', value: 'Use Note/Warning callouts for edge cases or common mistakes' },
    ],
    doList: [
      'Start with what the user needs — no preamble',
      'Use exact UI labels: "Click Save changes" not "click the save button"',
      'Number every step in a sequence',
      'Include expected outcomes: "You should see a green confirmation banner"',
      'Keep sentences short — max 20 words per instruction step',
    ],
    dontList: [
      'Open with background context before the task instructions',
      'Use "simply," "just," or "easily" — it\'s condescending',
      'Leave edge cases or error states undocumented',
      'Assume familiarity with AirOps terminology',
    ],
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(CONTENT_TYPES.map(c => c.category)))];

// ── Sub-components ─────────────────────────────────────────────────────────

function MetaTag({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          fontWeight: 500,
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '2px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          color: accent ? 'var(--primary)' : 'var(--foreground)',
          fontWeight: accent ? 500 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ContentCard({ type }: { type: ContentType }) {
  const [tab, setTab] = useState<'rules' | 'dos'>('rules');

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Top row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Left: title + description */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '2px 7px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--muted)',
              }}
            >
              {type.category}
            </span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '8px',
            }}
          >
            {type.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
            }}
          >
            {type.description}
          </p>
        </div>

        {/* Right: meta */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: 'var(--muted)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            alignContent: 'start',
          }}
        >
          <MetaTag label="Word count" value={type.wordCount} />
          <MetaTag label="Tone mode" value={type.toneMode} accent />
          <MetaTag label="Channel" value={type.channel} />
          <MetaTag label="Primary CTA" value={type.cta} />
        </div>
      </div>

      {/* Bottom: rules / dos & don'ts */}
      <div>
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
          }}
        >
          {(
            [
              { key: 'rules' as const, label: 'Format Rules' },
              { key: 'dos' as const, label: "Do's & Don'ts" },
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

        {tab === 'rules' && (
          <div style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {type.rules.map(r => (
                <div key={r.label} className="flex items-start gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      minWidth: '72px',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {r.label}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--foreground)',
                      lineHeight: 1.6,
                    }}
                  >
                    {r.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'dos' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderTop: '1px solid var(--border)',
            }}
          >
            {/* Do */}
            <div style={{ padding: '16px 24px', borderRight: '1px solid var(--border)' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Do
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {type.doList.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--primary)',
                        marginTop: '3px',
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--foreground)',
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Don't */}
            <div style={{ padding: '16px 24px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Don't
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {type.dontList.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: 'var(--color-text-secondary)',
                        marginTop: '3px',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export function ContentTypesTab() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? CONTENT_TYPES
      : CONTENT_TYPES.filter(c => c.category === activeCategory);

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
        <div style={{ maxWidth: '560px' }}>
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
            Content Types
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
            }}
          >
            Format guidelines, tone modes, and do's & don'ts for every content format AirOps
            produces. These rules apply in addition to the global writing guidelines in Foundations.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:
                  activeCategory === cat ? 'var(--background)' : 'var(--color-text-secondary)',
                backgroundColor:
                  activeCategory === cat ? 'var(--primary)' : 'transparent',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        {filtered.length} format{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {filtered.map(type => (
          <ContentCard key={type.id} type={type} />
        ))}
      </div>
    </div>
  );
}
