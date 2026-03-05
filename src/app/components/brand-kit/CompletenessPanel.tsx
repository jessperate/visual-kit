import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Sparkles } from 'lucide-react';

export interface FoundationsCompleteness {
  aboutBrand:        { filled: boolean; wordCount: number };
  voiceTone:         { filled: boolean; wordCount: number };
  authorPersona:     { filled: boolean; wordCount: number };
  writingRules:      { count: number };
  brandColors:       { configured: boolean };
  typography:        { configured: boolean };
  illustrations:     { count: number };
  modelPermissions:  { enabledCount: number };
  slideDesign:       { configured: boolean };
}

type Status = 'complete' | 'partial' | 'empty';

// ── Section IDs that match elements in FoundationsTab ──────────────────────

const SECTION_IDS = [
  'section-about',
  'section-voice',
  'section-persona',
  'section-rules',
  'section-fonts',
  'section-colors',
  'section-illustrations',
  'section-ai-models',
  'section-slides',
] as const;

type SectionId = typeof SECTION_IDS[number];

// ── Nav row ────────────────────────────────────────────────────────────────

function NavRow({
  label,
  status,
  detail,
  sectionId,
  isActive,
  isLast,
  onClick,
}: {
  label: string;
  status: Status;
  detail: string;
  sectionId: SectionId;
  isActive: boolean;
  isLast?: boolean;
  onClick: (id: SectionId) => void;
}) {
  const statusColors: Record<Status, string> = {
    complete: 'var(--primary)',
    partial:  '#9a7500',
    empty:    'var(--color-text-tertiary)',
  };

  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onClick(sectionId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? 'location' : undefined}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        width: '100%',
        padding: '7px 0 7px 8px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        borderLeft: isActive
          ? '2px solid var(--primary)'
          : '2px solid transparent',
        backgroundColor: isActive
          ? 'rgba(0,140,68,0.05)'
          : hovered
          ? 'rgba(0,140,68,0.02)'
          : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.12s ease, border-color 0.12s ease',
        marginLeft: '-1px',
      }}
    >
      {/* Status icon */}
      <div style={{ marginTop: '2px', flexShrink: 0 }}>
        {status === 'complete' ? (
          <CheckCircle2 size={12} style={{ color: statusColors.complete }} />
        ) : status === 'partial' ? (
          <AlertCircle  size={12} style={{ color: statusColors.partial }} />
        ) : (
          <Circle       size={12} style={{ color: statusColors.empty }} />
        )}
      </div>

      {/* Label + detail */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '11px',
          color: isActive
            ? 'var(--foreground)'
            : status === 'empty'
            ? 'var(--color-text-secondary)'
            : 'var(--foreground)',
          fontWeight: isActive ? 600 : status === 'complete' ? 500 : 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '1px',
          transition: 'color 0.12s ease, font-weight 0.12s ease',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.04em',
          color: isActive
            ? 'var(--primary)'
            : status === 'complete'
            ? 'var(--primary)'
            : status === 'partial'
            ? statusColors.partial
            : 'var(--color-text-tertiary)',
          transition: 'color 0.12s ease',
        }}>
          {detail}
        </p>
      </div>

      {/* Arrow indicator when active */}
      <div style={{
        flexShrink: 0,
        marginTop: '3px',
        marginRight: '4px',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateX(0)' : 'translateX(-4px)',
        transition: 'opacity 0.15s ease, transform 0.15s ease',
      }}>
        <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
          <path d="M1 1L4 4L1 7" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      fontWeight: 500,
      color: 'var(--color-text-tertiary)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
      padding: '10px 0 4px',
    }}>
      {label}
    </p>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function CompletenessPanel({
  completeness,
  scrollContainerRef,
}: {
  completeness: FoundationsCompleteness;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) {
  const [activeSection, setActiveSection] = useState<SectionId | null>('section-about');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ── Scroll-spy via IntersectionObserver ──────────────────────────────────
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    // Disconnect any existing observer
    observerRef.current?.disconnect();

    const sectionElements = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    // Track which sections are currently intersecting + their top offsets
    const intersecting = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersecting.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            intersecting.delete(entry.target.id);
          }
        });

        if (intersecting.size > 0) {
          // Pick the section whose top is closest to (but still within) the top zone
          const sorted = Array.from(intersecting.entries()).sort((a, b) => a[1] - b[1]);
          const topmost = sorted[0][0] as SectionId;
          setActiveSection(topmost);
        }
      },
      {
        root,
        // Section enters the "active zone" when its top half is visible
        rootMargin: '0px 0px -55% 0px',
        threshold: 0,
      }
    );

    sectionElements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [scrollContainerRef]);

  // ── Click-to-scroll ───────────────────────────────────────────────────────
  const scrollToSection = (sectionId: SectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const container = scrollContainerRef.current;
    if (!container) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const containerTop  = container.getBoundingClientRect().top;
    const elTop         = el.getBoundingClientRect().top;
    const offset        = elTop - containerTop + container.scrollTop - 32; // 32px breathing room

    container.scrollTo({ top: offset, behavior: 'smooth' });
    // Optimistically set active immediately for snappy feel
    setActiveSection(sectionId);
  };

  // ── Derive step data ──────────────────────────────────────────────────────
  const writingSteps: { label: string; status: Status; detail: string; sectionId: SectionId }[] = [
    {
      label: 'About your brand',
      sectionId: 'section-about',
      status: completeness.aboutBrand.filled ? 'complete' : 'empty',
      detail: completeness.aboutBrand.filled
        ? `${completeness.aboutBrand.wordCount.toLocaleString()} words`
        : 'Not started',
    },
    {
      label: 'Voice & tone',
      sectionId: 'section-voice',
      status: completeness.voiceTone.filled ? 'complete' : 'empty',
      detail: completeness.voiceTone.filled
        ? `${completeness.voiceTone.wordCount.toLocaleString()} words`
        : 'Not started',
    },
    {
      label: 'Author persona',
      sectionId: 'section-persona',
      status: completeness.authorPersona.filled ? 'complete' : 'empty',
      detail: completeness.authorPersona.filled
        ? `${completeness.authorPersona.wordCount.toLocaleString()} words`
        : 'Not started',
    },
    {
      label: 'Writing rules',
      sectionId: 'section-rules',
      status: completeness.writingRules.count >= 5
        ? 'complete'
        : completeness.writingRules.count > 0
        ? 'partial'
        : 'empty',
      detail: `${completeness.writingRules.count} rule${completeness.writingRules.count !== 1 ? 's' : ''}`,
    },
  ];

  const visualSteps: { label: string; status: Status; detail: string; sectionId: SectionId }[] = [
    {
      label: 'Brand colors',
      sectionId: 'section-colors',
      status: completeness.brandColors.configured ? 'complete' : 'partial',
      detail: '8 colours configured',
    },
    {
      label: 'Typography',
      sectionId: 'section-fonts',
      status: completeness.typography.configured ? 'complete' : 'partial',
      detail: '3 fonts configured',
    },
    {
      label: 'Illustration refs',
      sectionId: 'section-illustrations',
      status: completeness.illustrations.count >= 3
        ? 'complete'
        : completeness.illustrations.count > 0
        ? 'partial'
        : 'empty',
      detail: `${completeness.illustrations.count} reference${completeness.illustrations.count !== 1 ? 's' : ''}`,
    },
    {
      label: 'AI permissions',
      sectionId: 'section-ai-models',
      status: completeness.modelPermissions.enabledCount > 0 ? 'complete' : 'empty',
      detail: `${completeness.modelPermissions.enabledCount} model${completeness.modelPermissions.enabledCount !== 1 ? 's' : ''} enabled`,
    },
    {
      label: 'Slide design',
      sectionId: 'section-slides',
      status: completeness.slideDesign.configured ? 'complete' : 'empty',
      detail: completeness.slideDesign.configured ? 'Rules configured' : 'Not started',
    },
  ];

  const allSteps = [...writingSteps, ...visualSteps];
  const complete = allSteps.filter(s => s.status === 'complete').length;
  const partial  = allSteps.filter(s => s.status === 'partial').length;
  const total    = allSteps.length;
  const pct      = Math.round(((complete + partial * 0.5) / total) * 100);
  const isStrong = pct >= 80;

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{
        width: '200px',
        height: '100%',
        borderLeft: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
        overflow: 'hidden',
      }}
      aria-label="Foundations navigation and completeness"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-between"
        style={{ padding: '0 14px', borderBottom: '1px solid var(--border)', height: '44px' }}
      >
        <div>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
            color: 'var(--foreground)', marginBottom: '1px',
          }}>
            Sections
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            color: 'var(--color-text-tertiary)', letterSpacing: '0.05em',
          }}>
            Foundations
          </p>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: 600,
          color: isStrong ? 'var(--primary)' : 'var(--foreground)',
          letterSpacing: '0.02em',
        }}>
          {pct}%
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────── */}
      <div className="flex-shrink-0" style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ height: '2px', backgroundColor: 'var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: isStrong ? 'var(--color-interaction)' : 'var(--primary)',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          color: 'var(--color-text-tertiary)', letterSpacing: '0.04em',
          marginTop: '5px',
        }}>
          {complete}/{total} complete
        </p>
      </div>

      {/* ── Nav + completeness list ──────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'none', padding: '0 14px' }}
      >
        <GroupLabel label="Writing" />

        {writingSteps.map((step, i) => (
          <NavRow
            key={step.sectionId}
            label={step.label}
            status={step.status}
            detail={step.detail}
            sectionId={step.sectionId}
            isActive={activeSection === step.sectionId}
            isLast={i === writingSteps.length - 1}
            onClick={scrollToSection}
          />
        ))}

        <GroupLabel label="Visual" />

        {visualSteps.map((step, i) => (
          <NavRow
            key={step.sectionId}
            label={step.label}
            status={step.status}
            detail={step.detail}
            sectionId={step.sectionId}
            isActive={activeSection === step.sectionId}
            isLast={i === visualSteps.length - 1}
            onClick={scrollToSection}
          />
        ))}

        {/* ── Tip ─────────────────────────────────────────────────── */}
        <div
          style={{
            margin: '14px 0 20px',
            border: '1px solid var(--color-stroke-green)',
            backgroundColor: 'rgba(0,140,68,0.04)',
            padding: '10px',
          }}
        >
          <div className="flex items-center gap-1.5" style={{ marginBottom: '4px' }}>
            <Sparkles size={10} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
              color: 'var(--primary)',
            }}>
              {pct >= 90 ? 'Kit complete!' : `${total - complete} to go`}
            </p>
          </div>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--color-text-secondary)', lineHeight: 1.55,
          }}>
            {pct >= 90
              ? 'Fully configured — AI will use all brand context.'
              : 'A complete kit improves AI content quality.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
