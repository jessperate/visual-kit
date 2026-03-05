import exampleImage from 'figma:asset/dfee60ed5e2aaf647502a31bd196e384699f5237.png';
import { ChevronRight, ArrowUpRight, BookOpen, Layers, Users, Globe, Variable, FileType2 } from 'lucide-react';

const ABOUT_CONTENT = [
  "At AirOps, we help brands craft content that wins search. We power content strategy, creation, and performance so your brand gets seen, cited, and celebrated as search changes across Google and AI experiences.",
  "Search isn't clicking like it used to. AI is reshaping how people discover and connect with brands, and content quality, craft, and genuine information now play a bigger role in staying visible. We believe this is the moment for marketers to pair creativity and taste with systems design to increase impact.",
  "AirOps is where big ideas become real results, and where marketers become leaders in the new era of Content Engineering. We give you the data, tools, playbooks, and precision needed to engineer human-in-the-loop content that earns visibility and grows your audience.",
  "Our platform brings together two connected layers\u2014Insights and Action\u2014so teams can move from understanding what's working to producing content improvements without bouncing between tools. With Insights, you can see where to invest next to win citations and drive ROI by bringing together SEO, AI search, and analytics data in one place.",
  "Insights helps you examine the topics, prompts, and domains driving influence and visibility across AI and traditional search. It also helps you surface opportunities across your owned content, external sites, and even Reddit threads on a regular cadence. Page360 unifies SEO, AI search, and GA4 data to give you a complete view of content health and the opportunities to improve it.",
  "The Action layer turns opportunities into content that stands out. AirOps blends your brand knowledge, SEO signals, and AI insights with human input and agentic workflows so AI handles the heavy lift and humans focus on the parts that matter\u2014resulting in content audiences trust and AI rewards.",
  "To support execution at scale, we provide platform features built for end-to-end operations. Grids let teams manage every article, workflow, and update from one interface designed for collaboration. Workflows let you build precision content workflows using live data sources, brand-specific Knowledge Bases, and Human Review steps, with a growing library of Power Agents you can fork and extend.",
  "We also help teams operate with confidence through Brand Kits & Knowledge, where you can collect your tone, rules, references, and context in one home to keep content true to the brand every time. Integrations connect AirOps to your stack, including data sources and owned LLMs, and push results directly into your CMS with no manual handoffs.",
  "Beyond software, we invest in the next generation of operators through our Content Engineering Certification. We offer training designed to help marketers build systems, learn playbooks, and level up alongside other practitioners\u2014so learning pays off and teams are ready to lead what comes next.",
];

const QUICK_LINKS = [
  { label: 'Foundations',       description: 'Mission, voice & visual style', pct: 100, icon: BookOpen },
  { label: 'Product Lines',     description: '3 product categories',           pct: 60,  icon: Layers },
  { label: 'Content Types',     description: '8 content formats',              pct: 40,  icon: FileType2 },
  { label: 'Audiences',         description: 'Target personas defined',        pct: 25,  icon: Users },
  { label: 'Regions',           description: 'Geographic markets',             pct: 10,  icon: Globe },
  { label: 'Custom Variables',  description: 'Dynamic brand tokens',           pct: 0,   icon: Variable },
];

const HIGHLIGHTS = [
  { label: 'Brand Colors',    value: '8' },
  { label: 'Writing Rules',   value: '10' },
  { label: 'Font Families',   value: '3' },
  { label: 'Illustrations',   value: '3' },
];

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: 'var(--color-text-secondary)',
    }}>
      {children}
    </span>
  );
}

export function OverviewTab() {
  const overallPct = Math.round(
    QUICK_LINKS.reduce((sum, l) => sum + l.pct, 0) / QUICK_LINKS.length
  );

  return (
    <div style={{ minHeight: '100%', backgroundColor: 'var(--background)' }}>
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ height: '200px', backgroundColor: 'var(--color-green-600)' }}
      >
        <img
          src={exampleImage}
          alt="AirOps brand visual"
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.7, mixBlendMode: 'luminosity' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,41,16,0.85) 0%, rgba(0,140,68,0.4) 100%)' }}
        />
        <div className="absolute inset-0 flex items-end" style={{ padding: 'var(--space-8)' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '42px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: 'var(--space-1)',
            }}>
              AirOps 2026
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              airops.com
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {HIGHLIGHTS.map(h => (
              <div
                key={h.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '8px 14px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {h.value}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>
                  {h.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', padding: 'var(--space-8)', gap: 'var(--space-8)', alignItems: 'start' }}>

        {/* ── Left — About ──────────────────────────────────────────── */}
        <div>
          {/* Section label */}
          <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)' }} />
            <MonoLabel>About your brand</MonoLabel>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--space-8)' }}>
            {ABOUT_CONTENT.map((para, i) => (
              <p key={i} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: 1.75,
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* Brand values pills */}
          <div className="flex items-center gap-2 flex-wrap" style={{ paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)' }}>
            <MonoLabel>Brand values</MonoLabel>
            {['Expert', 'Optimistic', 'Empowering', 'Collaborative', 'Witty'].map(v => (
              <span
                key={v}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  backgroundColor: 'var(--color-green-50)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--primary)',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Overall completeness */}
          <div style={{ border: '1px solid var(--border)', padding: 'var(--space-4)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
              <MonoLabel>Kit Completeness</MonoLabel>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                color: overallPct >= 80 ? 'var(--primary)' : 'var(--foreground)',
                letterSpacing: '0.02em',
              }}>
                {overallPct}%
              </span>
            </div>
            {/* Progress track */}
            <div style={{ height: '3px', backgroundColor: 'var(--border)', marginBottom: 'var(--space-4)' }}>
              <div style={{
                height: '100%',
                width: `${overallPct}%`,
                backgroundColor: overallPct >= 80 ? 'var(--color-interaction)' : 'var(--primary)',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_LINKS.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--foreground)' }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div style={{ height: '2px', backgroundColor: 'var(--border)' }}>
                    <div style={{
                      height: '100%',
                      width: `${item.pct}%`,
                      backgroundColor: item.pct === 100 ? 'var(--primary)' : 'var(--color-interaction)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div style={{ border: '1px solid var(--border)', padding: 'var(--space-4)' }}>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <MonoLabel>Quick Access</MonoLabel>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {QUICK_LINKS.map(link => (
                <button
                  key={link.label}
                  className="w-full flex items-center justify-between transition-all hover:opacity-80"
                  style={{
                    padding: '8px 10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-green-50)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon size={12} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'var(--foreground)', lineHeight: 1.2 }}>
                        {link.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={11} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Upgrade prompt */}
          <div
            style={{
              border: '1px solid var(--color-stroke-green)',
              backgroundColor: 'rgba(0,140,68,0.03)',
              padding: 'var(--space-4)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
              Share this kit
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              Invite teammates to view and edit this brand kit together.
            </p>
            <button
              className="w-full flex items-center justify-center gap-2 py-2 transition-all hover:opacity-80"
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                color: '#ffffff',
              }}
            >
              <ArrowUpRight size={12} />
              Invite teammates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}