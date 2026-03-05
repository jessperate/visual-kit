import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import coverSlide   from 'figma:asset/22020df812785a9bd6ff5152b3c4d7908837ac55.png';
import diagramSlide from 'figma:asset/b00257ec257f044d52083d7b68d8421dbd693a85.png';
import statsSlide   from 'figma:asset/5fd4bd783f34f6b0e9727c462a2ff3ab9413391a.png';

// ── Types ──────────────────────────────────────────────────────────────────

interface Annotation { label: string; note: string }

interface Slide {
  id: string;
  src: string;
  type: string;
  title: string;
  description: string;
  annotations: Annotation[];
}

interface RuleGroup {
  category: string;
  rules: string[];
}

// ── Slide data ─────────────────────────────────────────────────────────────

// ── Slide font fallback stacks ─────────────────────────────────────────────
export const SLIDE_FONT_FALLBACKS = [
  {
    brand: 'Serrif VF',
    variable: '--font-serif',
    role: 'Headlines / Display',
    fallback: "Georgia, 'Times New Roman', serif",
  },
  {
    brand: 'Saans',
    variable: '--font-sans',
    role: 'Body / Labels / UI',
    fallback: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },
  {
    brand: 'Saans Mono',
    variable: '--font-mono',
    role: 'Categories / Code / Tags',
    fallback: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  },
] as const;

export const SLIDES: Slide[] = [
  {
    id: 'cover',
    src: coverSlide,
    type: 'Cover Slide',
    title: 'Full-bleed Forest Dark background · editorial serif headline · centred lock-up',
    description:
      'Cover slides use Forest Dark (#002910) as the full-bleed background. Headline is Serrif VF weight 400 (fallback: Georgia, serif). No Saans on covers.',
    annotations: [
      { label: 'Category label',    note: 'Saans Mono · 11px · 0.12em tracking · uppercase · top-centre. Fallback: SF Mono, monospace.' },
      { label: 'Headline',          note: 'Serrif VF · 56–72px · 400 weight · –0.02em tracking · centred. Fallback: Georgia, serif. Never bold.' },
      { label: 'Vertical rule',     note: '1px hairline rgba(255,255,255,0.15). Always vertical, never horizontal.' },
      { label: 'Attribution',       note: '"with AirOps" Saans Regular 14px · bottom-centre. Fallback: Inter, sans-serif. Logo on back cover only.' },
      { label: 'Background token',  note: 'Forest Dark #002910 · --color-green-600. Never Near Black or White on covers.' },
    ],
  },
  {
    id: 'diagram',
    src: diagramSlide,
    type: 'Diagram / Process',
    title: 'System architecture on Green-50 field · structured column grid · persona anchors',
    description:
      'Diagram slides use Green 50 tint (#EEF5F1) as the field. Columns separated by --color-stroke-green rules. Persona photos always at column bottom.',
    annotations: [
      { label: 'Slide headline',    note: 'Serrif VF · 40–48px · 400 · flush-left · top-left. Fallback: Georgia, serif. Sentence case only.' },
      { label: 'Column headers',    note: 'Saans Regular · 16–18px · centred in each column. Fallback: Inter, sans-serif. No bold.' },
      { label: 'Column strokes',    note: '1px solid #D4E8DA (--color-stroke-green). Defines lanes without noise.' },
      { label: 'Body copy',         note: 'Saans Bold 13px for emphasis · Regular for support. Fallback: Inter, sans-serif. Max 2 sentences.' },
      { label: 'Persona row',       note: 'Greyscale photo + company logo tag. Always bottom of column.' },
      { label: 'Logo placement',    note: 'Bottom-left. Dark version on light bg. Minimum 56px width.' },
    ],
  },
  {
    id: 'stats',
    src: statsSlide,
    type: 'Stats / Impact',
    title: 'ROI data · branching call-out layout · secondary palette boxes · logo strip',
    description:
      'Stats slides use Green 50 as field with secondary palette tints for call-out boxes. Arrows connect thesis to outcomes. Max 3 outcome boxes.',
    annotations: [
      { label: 'Slide headline',    note: 'Serrif VF · 40px · 400 · flush-left. Fallback: Georgia, serif. Italic for product name emphasis only.' },
      { label: 'Thesis box',        note: 'Saans Bold 15px · Green 50 bg. Fallback: Inter Bold, sans-serif. States the compounding claim. Max 2 sentences.' },
      { label: 'Outcome boxes',     note: 'Olive 50, Teal 50, Magenta 50 tints — never primary green. One metric each.' },
      { label: 'Metric format',     note: 'Bold figure leads. "3–7x Growth in AI-search-driven" — number always first.' },
      { label: 'Connector arrows',  note: '--color-green-500 #2D8859 · 1.5px · open line ends, no filled arrowheads.' },
      { label: 'Logo bar',          note: 'Customer logos greyscale · single row bottom-anchored · equal spacing.' },
    ],
  },
];

// ── Global slide rules (initial data) ─────────────────────────────────────

export const INITIAL_DESIGN_RULES: RuleGroup[] = [
  {
    category: 'Typography',
    rules: [
      'Headlines always Serrif VF weight 400. Never bold on covers or section dividers.',
      'Body, labels, bullets always Saans. Saans Mono only for categories and code.',
      'Minimum body copy 13px at 16:9 widescreen. Never smaller — unreadable when projected.',
      'Italic sparingly: product name or key term emphasis only. Never decorative.',
    ],
  },
  {
    category: 'Colour',
    rules: [
      'Cover slides: Forest Dark (#002910) only. White logo and white type.',
      'Content slides: Green 50 (#EEF5F1) as field. Near Black type. Green accent strokes.',
      'Call-out boxes: secondary palette tints (Olive / Teal / Magenta 50–100). Never primary green.',
      'Max 3 secondary hues on any single slide.',
    ],
  },
  {
    category: 'Layout',
    rules: [
      'Slide margin: 48px all edges. No content bleeds except on full-bleed covers.',
      'Column layouts: max 4 columns. Always separated by --color-stroke-green rules.',
      'Diagrams and arrows: #2D8859 · 1.5px · open line ends · no gradient fills.',
      'Logo always bottom-left at minimum 56px width on all content slides.',
    ],
  },
  {
    category: 'Content density',
    rules: [
      'One idea per slide. If a second idea is needed, make a second slide.',
      'Max 40 words of body copy. Stats slides: numbers only, no prose paragraphs.',
      'Persona photos (greyscale) anchor abstract system diagrams to real people.',
      'Customer logo bars: greyscale · single-row · bottom-anchored · never stacked.',
    ],
  },
];

// ── Progress bar hook ──────────────────────────────────────────────────────

function useProgress(durationMs: number, running: boolean) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);

  const reset = useCallback(() => {
    startRef.current = null;
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!running) { reset(); return; }
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      setProgress(Math.min(elapsed / durationMs, 1));
      if (elapsed < durationMs) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, durationMs, reset]);

  return { progress, reset };
}

// ── Editable rule row ──────────────────────────────────────────────────────

interface EditableRuleProps {
  rule: string;
  index: number;
  isLast: boolean;
  onSave: (value: string) => void;
  onDelete: () => void;
}

function EditableRule({ rule, index, isLast, onSave, onDelete }: EditableRuleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(rule);
  const [hovered, setHovered] = useState(false);
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  // Sync draft if rule changes externally
  useEffect(() => { setDraft(rule); }, [rule]);

  const startEdit = () => {
    setDraft(rule);
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== rule) onSave(trimmed);
    else setDraft(rule);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(rule);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
    if (e.key === 'Escape') cancel();
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: editing ? 'flex-start' : 'flex-start',
        gap: '10px',
        padding: editing ? '10px 14px' : '10px 18px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        backgroundColor: editing ? 'var(--muted)' : hovered ? 'rgba(0,140,68,0.03)' : 'transparent',
        transition: 'background-color 0.12s ease',
        position: 'relative',
      }}
    >
      {/* Arrow / index */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: editing ? 'var(--primary)' : 'var(--primary)',
          marginTop: '3px',
          flexShrink: 0,
          minWidth: '10px',
        }}
      >
        →
      </span>

      {editing ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            style={{
              width: '100%',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--foreground)',
              lineHeight: 1.65,
              background: 'var(--background)',
              border: '1px solid var(--primary)',
              padding: '6px 8px',
              resize: 'none',
              outline: 'none',
              boxShadow: '0 0 0 2px rgba(0,140,68,0.12)',
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={commit}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500,
                color: 'var(--primary-foreground)', backgroundColor: 'var(--primary)',
                border: 'none', padding: '3px 8px', cursor: 'pointer',
              }}
            >
              <Check size={10} /> Save
            </button>
            <button
              onClick={cancel}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--font-sans)', fontSize: '10px',
                color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                border: '1px solid var(--border)', padding: '3px 8px', cursor: 'pointer',
              }}
            >
              <X size={10} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--foreground)',
              lineHeight: 1.65,
              flex: 1,
            }}
          >
            {rule}
          </p>

          {/* Action buttons — visible on hover */}
          <div
            style={{
              display: 'flex', gap: '4px', flexShrink: 0,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.12s ease',
              marginTop: '1px',
            }}
          >
            <button
              onClick={startEdit}
              title="Edit rule"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '22px', height: '22px',
                backgroundColor: 'var(--muted)', border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--foreground)',
              }}
            >
              <Edit2 size={10} />
            </button>
            <button
              onClick={onDelete}
              title="Delete rule"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '22px', height: '22px',
                backgroundColor: 'var(--muted)', border: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--color-text-secondary)',
              }}
            >
              <Trash2 size={10} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

const DURATION = 7000;

export function SlideDesignSection() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [prevIndex,   setPrevIndex]     = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection]       = useState<'next' | 'prev'>('next');
  const [isPlaying, setIsPlaying]       = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Upload state
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);

  // Editable rules state
  const [designRules, setDesignRules] = useState<RuleGroup[]>(INITIAL_DESIGN_RULES);
  // Track which group is adding a new rule
  const [addingIn, setAddingIn] = useState<number | null>(null);
  const [newRuleDraft, setNewRuleDraft] = useState('');
  const newRuleInputRef = useRef<HTMLInputElement>(null);

  const { progress, reset: resetProgress } = useProgress(DURATION, isPlaying);

  // ── Navigation ────────────────────────────────────────────────────────────

  const navigate = useCallback((targetIndex: number, dir: 'next' | 'prev') => {
    if (transitioning || targetIndex === activeIndex) return;
    setDirection(dir);
    setPrevIndex(activeIndex);
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(targetIndex);
      setPrevIndex(null);
      setTransitioning(false);
    }, 340);
  }, [transitioning, activeIndex]);

  const goNext = useCallback(() => navigate((activeIndex + 1) % SLIDES.length, 'next'), [activeIndex, navigate]);
  const goPrev = useCallback(() => navigate((activeIndex - 1 + SLIDES.length) % SLIDES.length, 'prev'), [activeIndex, navigate]);
  const goTo   = useCallback((i: number) => navigate(i, i > activeIndex ? 'next' : 'prev'), [activeIndex, navigate]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % SLIDES.length);
      resetProgress();
    }, DURATION);
  }, [resetProgress]);

  useEffect(() => {
    if (isPlaying) startTimer();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, startTimer]);

  const handleManualNav = useCallback((fn: () => void) => {
    fn();
    resetProgress();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % SLIDES.length);
      resetProgress();
    }, DURATION);
  }, [resetProgress]);

  // ── Upload handler ────────────────────────────────────────────────────────

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploaded(true);
      setTimeout(() => setUploaded(false), 3000);
    }
    e.target.value = '';
  };

  // ── Rule editing helpers ──────────────────────────────────────────────────

  const saveRule = (gi: number, ri: number, value: string) => {
    setDesignRules(prev => prev.map((g, i) =>
      i !== gi ? g : { ...g, rules: g.rules.map((r, j) => j === ri ? value : r) }
    ));
  };

  const deleteRule = (gi: number, ri: number) => {
    setDesignRules(prev => prev.map((g, i) =>
      i !== gi ? g : { ...g, rules: g.rules.filter((_, j) => j !== ri) }
    ));
  };

  const startAddRule = (gi: number) => {
    setAddingIn(gi);
    setNewRuleDraft('');
    setTimeout(() => newRuleInputRef.current?.focus(), 0);
  };

  const commitNewRule = (gi: number) => {
    const trimmed = newRuleDraft.trim();
    if (trimmed) {
      setDesignRules(prev => prev.map((g, i) =>
        i !== gi ? g : { ...g, rules: [...g.rules, trimmed] }
      ));
    }
    setAddingIn(null);
    setNewRuleDraft('');
  };

  const cancelAdd = () => {
    setAddingIn(null);
    setNewRuleDraft('');
  };

  const slide = SLIDES[activeIndex];

  return (
    <section aria-labelledby="slides-heading">

      {/* ── Section header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2
            id="slides-heading"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '4px',
            }}
          >
            Presentation slide design
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            On-brand deck guidelines — typography, colour, layout, and content density.
          </p>
        </div>

        {/* Upload Slides CTA */}
        <div style={{ flexShrink: 0, marginLeft: '24px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            {uploaded ? <Check size={12} /> : <Upload size={12} />}
            {uploaded ? 'Uploaded' : 'Upload slides'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.ppt,.key,.pdf"
            multiple
            style={{ display: 'none' }}
            aria-label="Upload slide files"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* STAGE                                                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          backgroundColor: 'var(--color-near-black)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* ── App chrome bar ───────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            height: '36px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            backgroundColor: 'rgba(255,255,255,0.025)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
                <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: c, opacity: 0.55 }} />
              ))}
            </div>
            <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', transition: 'color 0.2s ease' }}>
              {slide.type}
            </span>
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
            1920 × 1080 · 16:9
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.08em' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => setIsPlaying(p => !p)}
              aria-label={isPlaying ? 'Pause auto-advance' : 'Resume auto-advance'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0 0 0 8px', display: 'flex', alignItems: 'center', gap: '4px',
                color: isPlaying ? 'rgba(0,255,100,0.55)' : 'rgba(255,255,255,0.25)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {isPlaying ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1.5" y="1" width="2.5" height="8" rx="0.5"/><rect x="6" y="1" width="2.5" height="8" rx="0.5"/></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1.5L9 5L2 8.5V1.5Z"/></svg>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {isPlaying ? 'Auto' : 'Paused'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Slide viewport + side navs ──────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'stretch', padding: '24px', gap: '0' }}>

          {/* Prev arrow */}
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '14px' }}>
            <button
              onClick={() => handleManualNav(goPrev)}
              aria-label="Previous slide"
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', flexShrink: 0, transition: 'background-color 0.12s ease, color 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <ChevronLeft size={14} />
            </button>
          </div>

          {/* ── 16:9 Slide frame ─────────────────────────────────── */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <img
                key={activeIndex}
                src={slide.src}
                alt={slide.title}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? `translateX(${direction === 'next' ? '-24px' : '24px'})` : 'translateX(0)',
                  transition: 'opacity 0.34s ease, transform 0.34s ease',
                  display: 'block',
                }}
                draggable={false}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: `${progress * 100}%`, backgroundColor: 'var(--color-interaction)', opacity: isPlaying ? 0.8 : 0, transition: 'opacity 0.3s ease', zIndex: 2, pointerEvents: 'none' }} />
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { goTo(i); handleManualNav(() => goTo(i)); }}
                  aria-label={`Go to ${s.type}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  style={{ height: '3px', width: i === activeIndex ? '28px' : '10px', backgroundColor: i === activeIndex ? 'var(--color-interaction)' : 'rgba(255,255,255,0.20)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.28s ease, background-color 0.28s ease' }}
                />
              ))}
            </div>
          </div>

          {/* Next arrow */}
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '14px' }}>
            <button
              onClick={() => handleManualNav(goNext)}
              aria-label="Next slide"
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', flexShrink: 0, transition: 'background-color 0.12s ease, color 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Slide type selector tabs ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--border)', borderTop: 'none', marginBottom: '1px' }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleManualNav(() => goTo(i))}
            style={{
              padding: '14px 18px', textAlign: 'left',
              backgroundColor: activeIndex === i ? 'var(--muted)' : 'var(--background)',
              borderRight: i < SLIDES.length - 1 ? '1px solid var(--border)' : 'none',
              borderTop: activeIndex === i ? '2px solid var(--primary)' : '2px solid transparent',
              borderBottom: 'none', borderLeft: 'none',
              cursor: 'pointer', transition: 'background-color 0.12s ease',
            }}
          >
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: activeIndex === i ? 'var(--primary)' : 'var(--color-text-tertiary)', marginBottom: '4px' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: activeIndex === i ? 600 : 400, color: activeIndex === i ? 'var(--foreground)' : 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {s.type}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
              {s.description}
            </span>
          </button>
        ))}
      </div>

      {/* ── Annotations ───────────────────────────────────────────────── */}
      <div style={{ border: '1px solid var(--border)', borderTop: 'none', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
            Design annotations — {slide.type}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-tertiary)', letterSpacing: '0.06em' }}>
            {slide.annotations.length} notes
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {slide.annotations.map((ann, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const totalRows = Math.ceil(slide.annotations.length / 3);
            const isLastRow = row === totalRows - 1;
            const isRightEdge = col === 2;
            return (
              <div key={i} style={{ padding: '16px 18px', borderRight: isRightEdge ? 'none' : '1px solid var(--border)', borderBottom: isLastRow ? 'none' : '1px solid var(--border)', opacity: transitioning ? 0.4 : 1, transition: 'opacity 0.20s ease' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.06em', flexShrink: 0, backgroundColor: 'rgba(0,140,68,0.10)', padding: '1px 5px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--foreground)' }}>
                    {ann.label}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {ann.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Global slide rules ─────────────────────────────────────────── */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Global slide rules
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)' }}>
          {designRules.map((group, gi) => {
            const isRight   = gi % 2 === 1;
            const isLastRow = gi >= designRules.length - 2;
            const isAdding  = addingIn === gi;

            return (
              <div
                key={group.category}
                style={{
                  borderRight: isRight ? 'none' : '1px solid var(--border)',
                  borderBottom: isLastRow ? 'none' : '1px solid var(--border)',
                }}
              >
                {/* Category header */}
                <div style={{ padding: '9px 18px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--foreground)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    {group.category}
                  </span>
                  <button
                    onClick={() => startAddRule(gi)}
                    title="Add rule"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500,
                      color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                      border: 'none', cursor: 'pointer', padding: '2px 4px',
                      letterSpacing: '0.06em',
                      opacity: 0.7,
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'}
                  >
                    <Plus size={9} /> Add
                  </button>
                </div>

                {/* Rule rows */}
                {group.rules.map((rule, ri) => (
                  <EditableRule
                    key={ri}
                    rule={rule}
                    index={ri}
                    isLast={ri === group.rules.length - 1 && !isAdding}
                    onSave={(val) => saveRule(gi, ri, val)}
                    onDelete={() => deleteRule(gi, ri)}
                  />
                ))}

                {/* New rule input */}
                {isAdding && (
                  <div style={{ padding: '10px 14px', borderTop: group.rules.length > 0 ? '1px solid var(--border)' : 'none', backgroundColor: 'var(--muted)' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--primary)', marginTop: '9px', flexShrink: 0 }}>→</span>
                      <input
                        ref={newRuleInputRef}
                        value={newRuleDraft}
                        onChange={e => setNewRuleDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitNewRule(gi);
                          if (e.key === 'Escape') cancelAdd();
                        }}
                        placeholder="Type a new rule…"
                        style={{
                          flex: 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)',
                          color: 'var(--foreground)', background: 'var(--background)',
                          border: '1px solid var(--primary)', padding: '5px 8px', outline: 'none',
                          boxShadow: '0 0 0 2px rgba(0,140,68,0.12)',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', paddingLeft: '17px' }}>
                      <button
                        onClick={() => commitNewRule(gi)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, color: 'var(--primary-foreground)', backgroundColor: 'var(--primary)', border: 'none', padding: '3px 8px', cursor: 'pointer' }}
                      >
                        <Check size={10} /> Add rule
                      </button>
                      <button
                        onClick={cancelAdd}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--border)', padding: '3px 8px', cursor: 'pointer' }}
                      >
                        <X size={10} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {group.rules.length === 0 && !isAdding && (
                  <div style={{ padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      No rules yet. Click + Add to create one.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}