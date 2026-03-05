import { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import type { FoundationsCompleteness } from './CompletenessPanel';
import { Plus, MoreHorizontal, Copy, Check, Edit2, Download, Upload, ExternalLink, X, Database } from 'lucide-react';
import { DataVizSection, DV_PALETTE, DV_TYPE } from './DataVizSection';
import { LogoSection } from './LogoSection';
import { SlideDesignSection, INITIAL_DESIGN_RULES, SLIDES, SLIDE_FONT_FALLBACKS } from './SlideDesignSection';
import illustrationGreen   from 'figma:asset/fdeeaedb293805cf5b2fedf3c2831427714b1591.png';
import illustrationBooks   from 'figma:asset/db37ff4173b16b5dae9577d9847cb97330d3f737.png';
import illustrationPublish from 'figma:asset/a66e7ca54415fbdc17a57e73627d7c5f63a740c3.png';

// ─── Types ────────────────────────────────────────────────────────────────

interface WritingRule {
  id: string;
  rule: string;
  appliesTo: string;
}

// ─── Brand data ───────────────────────────────────────────────────────────

const ABOUT_PARAGRAPHS = [
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

const VOICE_AND_TONE = "Voice stays constant; tone flexes by context. Our voice is expert, optimistic, and empowering. We write with authority from building first-of-their-kind products, but stay warm and human. We lead with clarity, empathy, and subtle wit. We use direct, instructional language that stays businesslike but readable, favoring second-person (\"your brand,\" \"you need\") and short paragraphs. Structure is scannable: bolded TL;DR sections, H2/H3 headings framed as questions, step-by-step sequences. We back claims with concrete data, metrics, and named platforms. Tone flexes across five modes: (1) Functional + Data Driven for docs, release notes, research, UI copy, sales decks; (2) Empowering for product announcements, demos, customer stories, thought leadership, social; (3) Collaborative for support, onboarding, nurture sequences; (4) Aspirational for website copy, keynotes, investor decks, blog posts; (5) Witty + Clever for LinkedIn, social, ad copy, event invites. We avoid heavy jargon, doomsday AI language, and corporate stiffness. We celebrate community wins and frame AI as a catalyst for creativity, not a threat.";

const AUTHOR_PERSONA = "Think of AirOps as your easy-going, intelligent, and animated friend who shows up early with coffee, eager to explore the day's adventures. When you spend time with them, you feel comfortable and intrigued with what topic they'll bring next. They flow smoothly from deep, complicated subjects to lighthearted stories that leave you laughing. They're social, friendly, and don't believe in hoarding useful knowledge. They share what they know so everyone around them is more independent and capable. They live with a growth mindset, and that spirit is contagious. Your success is their success. If life and career is a game, they play it like professionals, not amateurs. We speak like experienced and friendly coaches - inclusive, welcoming, and respectful when talking tech. We treat every partner and project seriously, educating without patronizing or confusing. Using conversational voice and playful humor, we bring joy to their work, preferring the subtle over the noisy.";

const INITIAL_RULES: WritingRule[] = [
  { id: '1', rule: 'Open with a bolded "TL;DR" section that summarizes the piece in 4–6 bullet points.', appliesTo: 'Global' },
  { id: '2', rule: 'Use a skimmable outline built from H2/H3 headings, including step-based sections ("Step 1," "Step 2," etc.) or numbered strategy lists for process content.', appliesTo: 'Global' },
  { id: '3', rule: 'Address the reader directly with second-person language and keep paragraphs short (1–3 sentences), using bullet lists for examples, criteria, and definitions.', appliesTo: 'Global' },
  { id: '4', rule: 'Never use em dashes as dramatic pauses. If a sentence needs one to hold together, rewrite it. Use a period instead. "AirOps is more than a platform. It\'s a movement."', appliesTo: 'Global' },
  { id: '5', rule: 'Never start sentences with "In today\'s world," "In an era where," or similar scene-setting clichés. Get to the point directly.', appliesTo: 'Global' },
  { id: '6', rule: 'Never use "delve into," "it\'s worth noting that," or "leveraging." Use specific verbs: explore, use, tap, apply, connect, build.', appliesTo: 'Global' },
  { id: '7', rule: 'Avoid the "If X, then Y" construction. Replace with plain, direct language. Not "If you want to grow visibility, then you need great content." Say "Great content is how you grow visibility."', appliesTo: 'Global' },
  { id: '8', rule: 'Never use hollow affirmations like "Great question!" or "Absolutely!" or "Certainly!" at the start of responses. They\'re filler and an AI tell.', appliesTo: 'Global' },
  { id: '9', rule: 'Avoid overly formal transitions like "Furthermore," "Moreover," and "Additionally." Use connective tissue or just start a new sentence.', appliesTo: 'Global' },
  { id: '10', rule: 'Don\'t end lists with "and beyond!" (e.g. "content, SEO, and beyond!"). It\'s vague. Name the actual thing or cut the list.', appliesTo: 'Global' },
];

// ─── AirOps Brand Colors ─────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: 'Near Black',    hex: '#000d05', variable: '--color-near-black',   usage: 'Primary text, key UI' },
  { name: 'Green 500',     hex: '#008c44', variable: '--color-green-500',    usage: 'Primary CTAs, brand' },
  { name: 'Green 600',     hex: '#002910', variable: '--color-green-600',    usage: 'Hero backgrounds' },
  { name: 'Interaction',   hex: '#00ff64', variable: '--color-interaction',  usage: 'Hover, active states' },
  { name: 'Green 200',     hex: '#CCFFE0', variable: '--color-green-200',    usage: 'Highlight tints' },
  { name: 'Stroke Green',  hex: '#d4e8da', variable: '--color-stroke-green', usage: 'Borders, dividers' },
  { name: 'Accent Label',  hex: '#EEFF8C', variable: '--color-accent-label', usage: 'Pill / tag fills' },
  { name: 'White',         hex: '#ffffff', variable: '--background',         usage: 'Page backgrounds' },
];

const TEXT_COLORS = [
  { name: 'Text Primary',   hex: '#000d05', variable: '--color-text-primary',   usage: 'Body copy' },
  { name: 'Text Secondary', hex: '#676c79', variable: '--color-text-secondary', usage: 'Captions, meta' },
  { name: 'Text Tertiary',  hex: '#a5aab6', variable: '--color-text-tertiary',  usage: 'Disabled, placeholder' },
];

// ─── Type scale ───────────────────────────────────────────────────────────

const TYPE_SCALE_DEFAULT = [
  { name: 'Display',        font: 'var(--font-serif)', size: '56px',  weight: 400, tracking: '-0.02em', lh: 1.1,  usage: 'Hero headlines' },
  { name: 'H3',             font: 'var(--font-serif)', size: '32px',  weight: 400, tracking: '-0.02em', lh: 1.2,  usage: 'Section headings' },
  { name: 'H4 / UI Title',  font: 'var(--font-sans)',  size: '20px',  weight: 600, tracking: '-0.01em', lh: 1.3,  usage: 'UI titles, labels' },
  { name: 'Body',           font: 'var(--font-sans)',  size: '16px',  weight: 400, tracking: '0',       lh: 1.6,  usage: 'Running text' },
  { name: 'Caption',        font: 'var(--font-sans)',  size: '14px',  weight: 400, tracking: '0',       lh: 1.5,  usage: 'Metadata, captions' },
  { name: 'Label / Pill',   font: 'var(--font-mono)',  size: '11px',  weight: 500, tracking: '0.08em',  lh: 1,    usage: 'Tags, axis values' },
];

export type TsRow = {
  id: string; name: string; font: string;
  size: string; weight: number; tracking: string; lh: number; usage: string;
};

const FONT_OPTIONS = [
  { label: 'Serrif VF',  value: 'var(--font-serif)' },
  { label: 'Saans',      value: 'var(--font-sans)'  },
  { label: 'Saans Mono', value: 'var(--font-mono)'  },
];

// ─── Secondary Palette ────────────────────────────────────────────────────
// 7 hue families × 4 shade levels — rendered as a 7-col grid, rows = tiers

const SEC_HUES = ['Green', 'Olive', 'Teal', 'Navy', 'Purple', 'Magenta', 'Brown'];

const SECONDARY_PALETTE: { hex: string; hue: string; tier: string }[] = [
  // Tier 1 — lightest
  { hex: '#EEF5F1', hue: 'Green',   tier: '50'  },
  { hex: '#F5F5E8', hue: 'Olive',   tier: '50'  },
  { hex: '#E8EEF5', hue: 'Teal',    tier: '50'  },
  { hex: '#E8E8F8', hue: 'Navy',    tier: '50'  },
  { hex: '#EEE8F8', hue: 'Purple',  tier: '50'  },
  { hex: '#F8E8F0', hue: 'Magenta', tier: '50'  },
  { hex: '#F8EEE8', hue: 'Brown',   tier: '50'  },
  // Tier 2 — light
  { hex: '#D4E8DA', hue: 'Green',   tier: '100' },
  { hex: '#F4FFB8', hue: 'Olive',   tier: '100' },
  { hex: '#B8D8F0', hue: 'Teal',    tier: '100' },
  { hex: '#C8C8FF', hue: 'Navy',    tier: '100' },
  { hex: '#D8C8F0', hue: 'Purple',  tier: '100' },
  { hex: '#F0C8D8', hue: 'Magenta', tier: '100' },
  { hex: '#F0D0C8', hue: 'Brown',   tier: '100' },
  // Tier 3 — saturated
  { hex: '#2D8859', hue: 'Green',   tier: '500' },
  { hex: '#88882D', hue: 'Olive',   tier: '500' },
  { hex: '#2D6B7A', hue: 'Teal',    tier: '500' },
  { hex: '#0000CC', hue: 'Navy',    tier: '500' },
  { hex: '#6B3D8B', hue: 'Purple',  tier: '500' },
  { hex: '#83428B', hue: 'Magenta', tier: '500' },
  { hex: '#8B4D42', hue: 'Brown',   tier: '500' },
  // Tier 4 — dark
  { hex: '#003D26', hue: 'Green',   tier: '900' },
  { hex: '#3D3D0D', hue: 'Olive',   tier: '900' },
  { hex: '#0D2D3D', hue: 'Teal',    tier: '900' },
  { hex: '#00004D', hue: 'Navy',    tier: '900' },
  { hex: '#2D1A3D', hue: 'Purple',  tier: '900' },
  { hex: '#4D1A3D', hue: 'Magenta', tier: '900' },
  { hex: '#3D1D1A', hue: 'Brown',   tier: '900' },
];

// ─── Font specs (used for MD export) ────────────────────────────────────

const FONT_SPECS = [
  { name: 'Serrif VF',  variable: '--font-serif', role: 'Heading',      usage: 'Large editorial headlines only. Never for body copy or UI elements.' },
  { name: 'Saans',      variable: '--font-sans',  role: 'Body / UI',    usage: 'All UI text, body copy, H4 and below, inputs, buttons, captions.' },
  { name: 'Saans Mono', variable: '--font-mono',  role: 'Label / Code', usage: 'Tags, pills, axis values, timestamps, code. Always uppercase for labels.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

function hexLuminance(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0,2),16)/255;
  const g = parseInt(c.slice(2,4),16)/255;
  const b = parseInt(c.slice(4,6),16)/255;
  return 0.299*r + 0.587*g + 0.114*b;
}
const isLight = (hex: string) => hexLuminance(hex) > 0.55;

// ─── Illustration style — AI model list ──────────────────────────────────

const AI_MODELS: { id: string; label: string; description: string }[] = [
  { id: 'nanoBanana', label: 'Nano Banana 2',  description: 'AirOps native model · fastest style transfer, optimised for brand consistency' },
  { id: 'flux',       label: 'Flux',           description: 'Black Forest Labs · high-fidelity generation with LoRA style adapters' },
  { id: 'openai',     label: 'OpenAI',         description: 'DALL·E 3 via GPT-4 vision · photorealistic and artistic styles' },
  { id: 'ideogram',   label: 'Ideogram',       description: 'Ideogram 2.0 · typography-aware with strong brand-colour fidelity' },
];

type ModelKey = 'nanoBanana' | 'flux' | 'openai' | 'ideogram';

// ─── Model toggle ─────────────────────────────────────────────────────────

function ModelToggle({
  model,
  checked,
  onChange,
  isLast,
}: {
  model: { id: string; label: string; description: string };
  checked: boolean;
  onChange: (v: boolean) => void;
  isLast: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}
    >
      <div style={{ flex: 1, paddingRight: '24px' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--foreground)', marginBottom: '2px' }}>
          {model.label}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          {model.description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={`${checked ? 'Disable' : 'Enable'} ${model.label} for illustration generation`}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: '40px',
          height: '22px',
          flexShrink: 0,
          border: `1px solid ${checked ? 'var(--color-interaction)' : 'var(--border)'}`,
          backgroundColor: checked ? 'var(--color-interaction)' : 'var(--muted)',
          borderRadius: 0,
          cursor: 'pointer',
          outline: 'none',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '21px' : '3px',
            width: '14px',
            height: '14px',
            backgroundColor: checked ? 'var(--color-near-black)' : 'var(--color-text-secondary)',
            borderRadius: 0,
            transition: 'left 0.15s ease, background-color 0.15s ease',
          }}
        />
      </button>
    </div>
  );
}

// ─── Pill component ──────────────────────────────────────────────────────

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px',
      backgroundColor: 'var(--color-accent-label)',
      border: '1px solid var(--color-stroke-green)',
      borderRadius: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: '10px', fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      color: 'var(--color-near-black)',
    }}>
      {children}
    </span>
  );
}

// ─── Section divider ─────────────────────────────────────────────────────

function SectionDivider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '48px 0' }} />;
}

function GroupHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4" style={{ margin: '40px 0 32px' }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
    </div>
  );
}

// ─── Font meta inline edit ────────────────────────────────────────────────

function FontMetaField({ label, value, onSave, multiline = false, displayStyle, inputStyle }: {
  label: string | null; value: string; onSave: (v: string) => void;
  multiline?: boolean; displayStyle?: React.CSSProperties; inputStyle?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  const start = () => { setDraft(value); setEditing(true); setTimeout(() => ref.current?.select(), 0); };
  const commit = () => { const t = draft.trim(); if (t) onSave(t); else setDraft(value); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  const baseInput: React.CSSProperties = { background: 'var(--background)', border: 'none', borderBottom: '1px solid var(--primary)', outline: 'none', padding: '0 0 2px', width: '100%', boxSizing: 'border-box' as const, ...inputStyle };

  if (editing) {
    return multiline ? (
      <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} value={draft} rows={3}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
        style={{ ...baseInput, resize: 'none' }}
      />
    ) : (
      <input ref={ref as React.RefObject<HTMLInputElement>} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
        style={baseInput}
      />
    );
  }

  return (
    <span onClick={start} title="Click to edit"
      style={{ cursor: 'text', display: 'block', borderBottom: '1px dashed transparent', transition: 'border-color 0.12s', ...displayStyle }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--border)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
    >{value}</span>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────

function ColorSwatch({ color, edited, onChange }: {
  color: { name: string; hex: string; variable: string; usage: string };
  edited: Record<string,string>;
  onChange: (v: string, h: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const hex = edited[color.variable] ?? color.hex;
  const light = isLight(hex);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group flex flex-col" style={{ border: '1px solid var(--border)' }}>
      <label
        className="relative block cursor-pointer"
        style={{ height: '64px', backgroundColor: hex }}
        aria-label={`Edit ${color.name} colour, current value ${hex}`}
      >
        <input
          type="color"
          value={hex}
          onChange={e => onChange(color.variable, e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`${color.name} colour picker`}
        />
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-1.5 py-0.5"
          style={{ backgroundColor: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)' }}>
          <Edit2 size={9} style={{ color: light ? '#000' : '#fff' }} />
        </div>
      </label>
      <div className="px-2.5 py-2" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex items-center justify-between mb-0.5">
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, color: 'var(--foreground)' }}>{color.name}</span>
          <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-secondary)' }}
            aria-label={copied ? 'Copied' : `Copy ${color.name} hex value`}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </button>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block' }}>{hex}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>{color.usage}</span>
      </div>
    </div>
  );
}

// ─── Secondary color swatch (compact, click-to-edit + copy) ──────────────

function SecondaryColorSwatch({
  hex,
  hue,
  tier,
  editedHex,
  onChange,
}: {
  hex: string;
  hue: string;
  tier: string;
  editedHex: string;
  onChange: (h: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const displayHex = editedHex || hex;
  const light = isLight(displayHex);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group flex flex-col" style={{ border: '1px solid var(--border)' }}>
      <label
        className="relative block cursor-pointer"
        style={{ height: '56px', backgroundColor: displayHex }}
        title={`${hue} ${tier} · ${displayHex}`}
        aria-label={`Edit ${hue} ${tier} colour, current value ${displayHex}`}
      >
        <input
          type="color"
          value={displayHex}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`${hue} ${tier} colour picker`}
        />
        {/* Edit indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)' }}
        >
          <Edit2 size={10} style={{ color: light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }} />
        </div>
      </label>
      <div
        className="px-1.5 py-1.5"
        style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }}
      >
        <button
          onClick={handleCopy}
          className="w-full text-left"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Click to copy hex"
          aria-label={copied ? 'Copied' : `Copy ${hue} ${tier} hex value`}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: copied ? 'var(--primary)' : 'var(--foreground)',
            letterSpacing: '0.02em',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {copied ? 'Copied!' : displayHex.toUpperCase()}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Editable prose block — view/edit dual mode ───────────────────────────
//
// View mode: renders copy as real <p> elements — always visible in any env.
// Edit mode: switches to a full auto-sizing <textarea>.

function EditableBlock({
  value,
  onChange,
  ariaLabel,
  dataKey,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  dataKey?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  // Keep draft in sync when value changes externally
  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  // Auto-size textarea whenever draft changes
  useLayoutEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [draft, editing]);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      const len = textareaRef.current?.value.length ?? 0;
      textareaRef.current?.setSelectionRange(len, len);
    }, 0);
  };

  const commit = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  // Split by blank lines → visible paragraphs in view mode
  const paragraphs = value.split(/\n\n+/).filter(p => p.trim());

  if (editing) {
    return (
      <div style={{ flex: 1 }}>
        <textarea
          ref={textareaRef}
          value={draft}
          rows={4}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') cancel(); }}
          spellCheck
          aria-label={ariaLabel}
          data-editable={dataKey}
          style={{
            display: 'block', width: '100%',
            border: '1px solid var(--color-interaction)', outline: 'none',
            resize: 'none', overflow: 'hidden',
            backgroundColor: 'var(--background)', padding: '12px 14px', margin: 0,
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
            color: 'var(--foreground)', lineHeight: 1.75,
            boxShadow: '0 0 0 2px rgba(0,255,100,0.10)',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button onClick={commit} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--primary-foreground)', backgroundColor: 'var(--primary)', border: 'none', padding: '5px 12px', cursor: 'pointer' }}>
            <Check size={11} /> Save
          </button>
          <button onClick={cancel} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--border)', padding: '5px 12px', cursor: 'pointer' }}>
            <X size={11} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ flex: 1, cursor: 'text' }}
      onClick={startEdit}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startEdit(); }}
      aria-label={`${ariaLabel} — click to edit`}
    >
      {paragraphs.length > 0 ? (
        paragraphs.map((p, i) => (
          <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.75, marginBottom: i < paragraphs.length - 1 ? '16px' : 0 }}>
            {p.trim()}
          </p>
        ))
      ) : (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
          Click to add content…
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────

interface FoundationsTabProps {
  onCompletenessUpdate: (c: FoundationsCompleteness) => void;
}

export function FoundationsTab({ onCompletenessUpdate }: FoundationsTabProps) {
  const [brandName,   setBrandName]   = useState('AirOps 2026');
  const [brandDomain, setBrandDomain] = useState('airops.com');

  const [rules, setRules]               = useState<WritingRule[]>(INITIAL_RULES);
  const [editedColors, setEditedColors] = useState<Record<string,string>>({});
  const [editedSecondary, setEditedSecondary] = useState<Record<number,string>>({});
  const [copiedCSS, setCopiedCSS]       = useState(false);
  const [mdUploaded, setMdUploaded]     = useState(false);
  const mdFileInputRef                  = useRef<HTMLInputElement>(null);
  const fontFileInputRef                = useRef<HTMLInputElement>(null);
  const [voiceText, setVoiceText]   = useState(VOICE_AND_TONE);
  const [personaText, setPersonaText] = useState(AUTHOR_PERSONA);
  const [aboutText, setAboutText]   = useState(ABOUT_PARAGRAPHS.join('\n\n'));

  // ── Writing Guidelines import state ──────────────────────────────────
  const guidelinesFileInputRef                      = useRef<HTMLInputElement>(null);
  const [guidelinesUploaded, setGuidelinesUploaded] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput]             = useState(false);
  const [docUrl, setDocUrl]                         = useState('');
  const [docUrlSaved, setDocUrlSaved]               = useState<string | null>(null);
  const [docUrlError, setDocUrlError]               = useState('');
  const docUrlInputRef                              = useRef<HTMLInputElement>(null);

  const handleGuidelinesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGuidelinesUploaded(file.name);
    setTimeout(() => setGuidelinesUploaded(null), 4000);
    e.target.value = '';
  };

  const handleDocUrlSubmit = () => {
    const trimmed = docUrl.trim();
    if (!trimmed) { setDocUrlError('Please paste a URL first.'); return; }
    const isUrl = /^https?:\/\/.+/i.test(trimmed);
    if (!isUrl) { setDocUrlError('Must start with https://'); return; }
    setDocUrlError('');
    setDocUrlSaved(trimmed);
    setDocUrl('');
    setShowUrlInput(false);
  };

  // ── Type Scale state ─────────────────────────────────────────────────
  const [typeScale, setTypeScale] = useState<TsRow[]>(() =>
    TYPE_SCALE_DEFAULT.map((t, i) => ({ ...t, id: `ts-${i}` }))
  );
  const [tsEditCell, setTsEditCell] = useState<{ id: string; field: string } | null>(null);
  const [tsDraft, setTsDraft]       = useState('');

  const startTsEdit = (id: string, field: string, current: string) => {
    setTsEditCell({ id, field });
    setTsDraft(current);
  };

  const commitTsEdit = () => {
    if (!tsEditCell) return;
    const { id, field } = tsEditCell;
    let val: string | number = tsDraft.trim();
    if (field === 'size') {
      const num = parseFloat(val as string);
      val = isNaN(num) ? '16px' : `${num}px`;
    } else if (field === 'weight') {
      val = parseInt(val as string) || 400;
    } else if (field === 'lh') {
      val = parseFloat(val as string) || 1.4;
    }
    setTypeScale(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
    setTsEditCell(null);
  };

  const addTsRow = () => {
    const id = `ts-${Date.now()}`;
    setTypeScale(prev => [...prev, {
      id, name: 'New Style', font: 'var(--font-sans)',
      size: '14px', weight: 400, tracking: '0', lh: 1.5, usage: 'Custom',
    }]);
    setTimeout(() => startTsEdit(id, 'name', 'New Style'), 50);
  };

  const deleteTsRow = (id: string) =>
    setTypeScale(prev => prev.filter(r => r.id !== id));

  // ── Illustration style state ─────────────────────────────────────────
  const [illustrations, setIllustrations] = useState<{ id: string; src: string; name: string }[]>([
    { id: 'ill-1', src: illustrationGreen,   name: 'Green Blocks' },
    { id: 'ill-2', src: illustrationBooks,   name: 'Books & Knowledge' },
    { id: 'ill-3', src: illustrationPublish, name: 'Publish' },
  ]);
  const illFileInputRef = useRef<HTMLInputElement>(null);
  const [illustrationPrompt, setIllustrationPrompt] = useState(
    'Flat geometric shapes in brand green (#008c44), halftone dot texture on off-white backgrounds, bold primary forms with negative space. Painterly brush stroke fills with slight roughness. No gradients.'
  );
  const [modelToggles, setModelToggles] = useState<Record<ModelKey, boolean>>({
    nanoBanana: true,
    flux:       true,
    openai:     false,
    ideogram:   false,
  });
  const [damConnected, setDamConnected] = useState(false);

  // ── Editable font spec state ──────────────────────────────────────────
  const [fontSpecs, setFontSpecs] = useState([
    { family: 'var(--font-serif)', name: 'Serrif VF', variable: '--font-serif', role: 'Heading',
      weights: [{ label: 'Variable', value: 400 }], range: '100–900 variable',
      fallback: 'Georgia, serif', usage: 'Large editorial headlines only. Never for body copy or UI elements.',
      specimenSize: '52px', tracking: '-0.02em' },
    { family: 'var(--font-sans)', name: 'Saans', variable: '--font-sans', role: 'Body / UI',
      weights: [{ label: 'Regular', value: 400 }, { label: 'Medium', value: 500 }, { label: 'Bold', value: 700 }],
      range: '400 · 500 · 700', fallback: 'DM Sans, Helvetica Neue, sans-serif',
      usage: 'All UI text, body copy, H4 and below, inputs, buttons, captions.',
      specimenSize: '40px', tracking: '0' },
    { family: 'var(--font-mono)', name: 'Saans Mono', variable: '--font-mono', role: 'Label / Code',
      weights: [{ label: 'Medium', value: 500 }], range: '500',
      fallback: 'DM Mono, monospace', usage: 'Tags, pills, axis values, timestamps, code. Always uppercase for labels.',
      specimenSize: '28px', tracking: '0.08em' },
  ]);

  const updateFontSpec = (idx: number, field: string, value: string) =>
    setFontSpecs(prev => prev.map((f, i) => i !== idx ? f : { ...f, [field]: value }));

  // ── Extra brand colors (user-added swatches) ──────────────────────────
  const [extraBrandColors, setExtraBrandColors] = useState<{ name: string; hex: string; variable: string; usage: string }[]>([]);

  const addBrandColor = () => {
    const idx = BRAND_COLORS.length + extraBrandColors.length + 1;
    const newColor = { name: `Custom ${idx}`, hex: '#008c44', variable: `--color-custom-${idx}`, usage: 'Custom use' };
    setExtraBrandColors(prev => [...prev, newColor]);
  };

  const removeExtraBrandColor = (variable: string) =>
    setExtraBrandColors(prev => prev.filter(c => c.variable !== variable));

  const handleColorChange = useCallback((variable: string, hex: string) => {
    setEditedColors(prev => ({ ...prev, [variable]: hex }));
    document.documentElement.style.setProperty(variable, hex);
  }, []);

  const addRule = () => {
    const id = Date.now().toString();
    setRules(prev => [...prev, { id, rule: 'New writing rule — click to edit', appliesTo: 'Global' }]);
  };

  const removeRule = (id: string) => setRules(prev => prev.filter(r => r.id !== id));

  const removeIllustration = (id: string) =>
    setIllustrations(prev => prev.filter(i => i.id !== id));

  const handleIllustrationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setIllustrations(prev => [...prev, {
          id: `ill-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          src: reader.result as string,
          name: file.name.replace(/\.[^/.]+$/, ''),
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleExportCSS = () => {
    const allColors = [...BRAND_COLORS, ...TEXT_COLORS];
    const lines = allColors.map(c => `  ${c.variable}: ${editedColors[c.variable] ?? c.hex};`);
    navigator.clipboard.writeText(`:root {\n${lines.join('\n')}\n}`);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleExportMD = () => {
    // ── helpers ──────────────────────────────────────────────────────────
    const row  = (...cols: string[]) => `| ${cols.join(' | ')} |`;
    const rule = (cols: string[])    => `|${cols.map(() => '---').join('|')}|`;
    const h2   = (t: string)         => `\n## ${t}\n`;
    const h3   = (t: string)         => `\n### ${t}\n`;
    const mono = (s: string)         => `\`${s}\``;

    // ── 1. Logo & Lockups ─────────────────────────────────────────────
    const logoBlock = [
      h2('Logo & Lockups'),
      '- **Primary lockup:** AirOps wordmark horizontal. Minimum width 72px digital / 20mm print.',
      '- **Clear space:** Equal to the cap-height of the wordmark on all four sides.',
      '- **Colour modes:** Near Black (#000d05) on light backgrounds · White on dark/Forest Dark backgrounds.',
      '- **Misuse:** Never stretch, rotate, recolour, add drop shadows, or place on busy photographs without a clear-space block.',
    ].join('\n');

    // ── 2. Fonts ──────────────────────────────────────────────────────
    const fontFamilyHeader = [row('Font', 'CSS Variable', 'Role', 'Usage'), rule(['Font', 'CSS Variable', 'Role', 'Usage'])];
    const fontFamilyRows   = FONT_SPECS.map(f => row(f.name, mono(f.variable), f.role, f.usage));

    const typeScaleHeader = [row('Style', 'Font', 'Size', 'Weight', 'Tracking', 'Line Height', 'Usage'), rule(['Style', 'Font', 'Size', 'Weight', 'Tracking', 'Line Height', 'Usage'])];
    const fontLabelMap: Record<string, string> = {
      'var(--font-serif)': 'Serrif VF',
      'var(--font-sans)':  'Saans',
      'var(--font-mono)':  'Saans Mono',
    };
    const typeScaleRows = typeScale.map(t =>
      row(t.name, fontLabelMap[t.font] ?? t.font, t.size, String(t.weight), t.tracking, String(t.lh), t.usage)
    );

    const fontsBlock = [
      h2('Fonts'),
      h3('Font Families'),
      ...fontFamilyHeader,
      ...fontFamilyRows,
      h3('Type Scale'),
      ...typeScaleHeader,
      ...typeScaleRows,
    ].join('\n');

    // ── 3. Color Palette ──────────────────────────────────────────────
    const colorHeader = [row('Name', 'CSS Variable', 'Hex', 'Usage'), rule(['Name', 'CSS Variable', 'Hex', 'Usage'])];

    const brandColorRows = BRAND_COLORS.map(c =>
      row(c.name, mono(c.variable), mono(editedColors[c.variable] ?? c.hex), c.usage)
    );
    const textColorRows = TEXT_COLORS.map(c =>
      row(c.name, mono(c.variable), mono(editedColors[c.variable] ?? c.hex), c.usage)
    );

    // Secondary palette — list by hue
    const secByHue = SEC_HUES.map(hue => {
      const swatches = SECONDARY_PALETTE.filter(s => s.hue === hue);
      const cells = swatches.map(s => `${s.tier}: ${mono(editedSecondary[SECONDARY_PALETTE.indexOf(s)] ?? s.hex)}`).join(' · ');
      return `- **${hue}** — ${cells}`;
    });

    const colorsBlock = [
      h2('Color Palette'),
      h3('Brand Palette'),
      ...colorHeader, ...brandColorRows,
      h3('Text Colors'),
      ...colorHeader, ...textColorRows,
      h3('Secondary Palette'),
      '> 7 hue families × 4 shade tiers (50 · 100 · 500 · 900)',
      '',
      ...secByHue,
    ].join('\n');

    // ── 4. Shape & Spacing ────────────────────────────────────────────
    const shapeBlock = [
      h2('Shape & Spacing'),
      h3('Shape'),
      '- `--radius: 0px` — sharp corners on every component. No softening anywhere.',
      '- Applies to: buttons, cards, inputs, pills, modals, tooltips, dropdowns.',
      h3('Spacing Scale'),
      '- Base unit: **4px**',
      '- Scale: `4` · `8` · `12` · `16` · `24` · `32` · `48` · `64`',
      '- Never use arbitrary values outside the scale.',
    ].join('\n');

    // ── 5. Data Visualization ─────────────────────────────────────────
    const dvPaletteRows   = DV_PALETTE.map(p => `- ${mono(p.hex)} — ${p.label}`);
    const dvTypoRows      = DV_TYPE.map(t => `- **${t.role}:** ${t.spec}`);

    const dataVizBlock = [
      h2('Data Visualization'),
      '> Sharp corners only. No gradients. Wordmark always bottom-right.',
      h3('Palette'),
      ...dvPaletteRows,
      h3('Typography'),
      ...dvTypoRows,
      h3('Chart Rules'),
      '- Outer border: 1–1.6px `#009b32`.',
      '- Background: `#f8fffb` (light) or `#00250e` (dark).',
      '- Alternating row fills: `#ffffff` / `#f8fffb`.',
      '- Grid lines: `#a9a9a9` at 0.5px — horizontal only.',
      '- Projection lines: dashed `4 3`, 60% opacity.',
      '- Highlight / accent bar: `#eeff8c`.',
    ].join('\n');

    // ── 6. Illustration Style ─────────────────────────────────────────
    const enabledModels = AI_MODELS.filter(m => modelToggles[m.id as ModelKey]).map(m => `${m.label} (${m.description})`);
    const illNames      = illustrations.map((ill, i) => `${i + 1}. ${ill.name}`);

    const illustrationBlock = [
      h2('Illustration Style'),
      h3('Style Reference Prompt'),
      `> ${illustrationPrompt}`,
      h3('Approved AI Models'),
      ...(enabledModels.length ? enabledModels.map(m => `- ${m}`) : ['- None enabled']),
      h3('Reference Images'),
      ...(illNames.length ? illNames : ['- No reference images uploaded']),
    ].join('\n');

    // ── 7. Presentation Slide Design ──────────────────────────────────
    const fallbackHeader = [
      row('Brand Font', 'CSS Variable', 'Role', 'Fallback Stack'),
      rule(['Brand Font', 'CSS Variable', 'Role', 'Fallback Stack']),
    ];
    const fallbackRows = SLIDE_FONT_FALLBACKS.map(f =>
      row(f.brand, mono(f.variable), f.role, mono(f.fallback))
    );

    const slideTypesBlock = SLIDES.map((s, i) => [
      `**${i + 1}. ${s.type}** — ${s.description}`,
      ...s.annotations.map(a => `  - *${a.label}:* ${a.note}`),
    ].join('\n')).join('\n\n');

    const slideRulesBlock = INITIAL_DESIGN_RULES.map(g => [
      `**${g.category}**`,
      ...g.rules.map(r => `- ${r}`),
    ].join('\n')).join('\n\n');

    const slidesBlock = [
      h2('Presentation Slide Design'),
      '> Brand fonts require installation in PowerPoint / Keynote. Use the fallback stacks below when distributing decks externally.',
      h3('Font Fallbacks for Presentations'),
      ...fallbackHeader,
      ...fallbackRows,
      h3('Slide Types'),
      slideTypesBlock,
      h3('Global Rules'),
      slideRulesBlock,
    ].join('\n');

    // ── Assemble ──────────────────────────────────────────────────────
    const timestamp = new Date().toISOString().slice(0, 10);
    const md = [
      `# AirOps Visual Guidelines`,
      `> Exported ${timestamp} from ${brandName} Brand Kit · ${brandDomain}`,
      '',
      logoBlock,
      fontsBlock,
      colorsBlock,
      shapeBlock,
      dataVizBlock,
      illustrationBlock,
      slidesBlock,
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `airops-visual-guidelines-${timestamp}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleMdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMdUploaded(true);
      setTimeout(() => setMdUploaded(false), 2500);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Completeness reporting ───────────────────────────────────────────
  useEffect(() => {
    const wc = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
    onCompletenessUpdate({
      aboutBrand:       { filled: aboutText.trim().length > 50,   wordCount: wc(aboutText) },
      voiceTone:        { filled: voiceText.trim().length > 50,   wordCount: wc(voiceText) },
      authorPersona:    { filled: personaText.trim().length > 50, wordCount: wc(personaText) },
      writingRules:     { count: rules.length },
      brandColors:      { configured: true },
      typography:       { configured: true },
      illustrations:    { count: illustrations.length },
      modelPermissions: { enabledCount: Object.values(modelToggles).filter(Boolean).length },
      slideDesign:      { configured: true },
    });
  }, [aboutText, voiceText, personaText, rules, illustrations, modelToggles, onCompletenessUpdate]);

  return (
    <div className="px-8 py-8">

      {/* ── Brand Identity — editable ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6 mb-2" style={{ maxWidth: '520px' }}>
        <div>
          <label
            htmlFor="brand-name"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}
          >
            Brand Name
          </label>
          <input
            id="brand-name"
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              padding: '8px 10px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--foreground)',
              backgroundColor: 'var(--background)',
              outline: 'none',
              borderRadius: 0,
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-interaction)'; }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>
        <div>
          <label
            htmlFor="brand-domain"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}
          >
            Brand Domain
          </label>
          <input
            id="brand-domain"
            type="text"
            value={brandDomain}
            onChange={e => setBrandDomain(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              padding: '8px 10px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--background)',
              outline: 'none',
              borderRadius: 0,
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-interaction)'; }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>
      </div>

      {/* ════ Writing Guidelines ════════════════════════════════════ */}

      {/* Section header row */}
      <div style={{ margin: '40px 0 0' }}>
        {/* Rule + label */}
        <div className="flex items-center gap-4" style={{ marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Writing Guidelines
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        {/* Import banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '14px 20px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
            marginBottom: '36px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left — label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', backgroundColor: 'var(--background)', flexShrink: 0 }}>
              <Database size={12} style={{ color: 'var(--color-text-secondary)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1px' }}>
                Import brand guidelines
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Upload a file or paste a doc URL — we'll read and populate the fields below.
              </p>
            </div>
          </div>

          {/* Right — CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Upload file */}
            <button
              onClick={() => guidelinesFileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500,
                color: guidelinesUploaded ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: 'var(--background)',
                border: `1px solid ${guidelinesUploaded ? 'var(--primary)' : 'var(--border)'}`,
                padding: '7px 14px', cursor: 'pointer',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
            >
              {guidelinesUploaded ? <Check size={12} /> : <Upload size={12} />}
              {guidelinesUploaded ? 'Uploaded' : 'Upload guidelines'}
            </button>
            <input
              ref={guidelinesFileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              style={{ display: 'none' }}
              aria-label="Upload brand guidelines file"
              onChange={handleGuidelinesUpload}
            />

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)' }} />

            {/* Paste URL */}
            <button
              onClick={() => {
                setShowUrlInput(v => !v);
                setDocUrlError('');
                if (!showUrlInput) setTimeout(() => docUrlInputRef.current?.focus(), 80);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500,
                color: docUrlSaved ? 'var(--primary)' : showUrlInput ? 'var(--foreground)' : 'var(--foreground)',
                backgroundColor: showUrlInput ? 'var(--foreground)' : 'transparent',
                border: `1px solid ${docUrlSaved ? 'var(--primary)' : 'var(--border)'}`,
                padding: '7px 14px', cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              <ExternalLink size={12} style={{ color: showUrlInput ? 'var(--background)' : docUrlSaved ? 'var(--primary)' : 'inherit' }} />
              <span style={{ color: showUrlInput ? 'var(--background)' : 'inherit' }}>
                {docUrlSaved ? 'URL saved' : 'Paste doc URL'}
              </span>
            </button>
          </div>
        </div>

        {/* Uploaded file pill */}
        {guidelinesUploaded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-24px', marginBottom: '20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'rgba(0,140,68,0.08)', border: '1px solid var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.04em' }}>
              <Check size={10} /> {guidelinesUploaded}
            </span>
          </div>
        )}

        {/* URL input panel */}
        {showUrlInput && (
          <div
            style={{
              marginTop: '-20px',
              marginBottom: '28px',
              border: '1px solid var(--border)',
              borderTop: 'none',
              padding: '16px 20px',
              backgroundColor: 'var(--background)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
              Google Doc · Notion · Confluence · Dropbox Paper
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  ref={docUrlInputRef}
                  type="url"
                  value={docUrl}
                  onChange={e => { setDocUrl(e.target.value); setDocUrlError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleDocUrlSubmit(); if (e.key === 'Escape') { setShowUrlInput(false); setDocUrl(''); setDocUrlError(''); } }}
                  placeholder="https://docs.google.com/document/d/…"
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)',
                    color: 'var(--foreground)', backgroundColor: 'var(--background)',
                    border: `1px solid ${docUrlError ? '#cc3333' : 'var(--border)'}`,
                    padding: '8px 12px', outline: 'none',
                  }}
                  aria-label="Paste document URL"
                />
                {docUrlError && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#cc3333', marginTop: '4px' }}>
                    {docUrlError}
                  </p>
                )}
              </div>
              <button
                onClick={handleDocUrlSubmit}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500,
                  color: 'var(--primary-foreground)', backgroundColor: 'var(--primary)',
                  border: 'none', padding: '8px 16px', cursor: 'pointer',
                }}
              >
                <Check size={12} /> Import
              </button>
              <button
                onClick={() => { setShowUrlInput(false); setDocUrl(''); setDocUrlError(''); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  width: '34px', height: '34px',
                  color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                  border: '1px solid var(--border)', cursor: 'pointer',
                }}
                aria-label="Close URL input"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Saved URL pill */}
        {docUrlSaved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-20px', marginBottom: '20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', maxWidth: '480px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '4px 10px', backgroundColor: 'rgba(0,140,68,0.08)', border: '1px solid var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary)', letterSpacing: '0.04em' }}>
              <ExternalLink size={10} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{docUrlSaved}</span>
            </span>
            <button
              onClick={() => setDocUrlSaved(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 0, display: 'flex', alignItems: 'center' }}
              aria-label="Remove saved URL"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      {/* About your brand */}
      <section id="section-about" aria-labelledby="about-heading">
        <h2 id="about-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
          About your brand
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Describe your company, who you help, and what makes you different.
        </p>
        <div style={{ border: '1px solid var(--border)' }}>
          <div className="px-6 py-5">
            <EditableBlock
              value={aboutText}
              onChange={setAboutText}
              ariaLabel="About your brand description"
              dataKey="about"
            />
          </div>
          <div className="px-6 py-3" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Click any paragraph to edit
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Brand Voice & Tone ─────────────────────────────────────── */}
      <section id="section-voice" aria-labelledby="voice-heading">
        <h2 id="voice-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
          Brand voice & tone
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Define how your brand sounds when it communicates.
        </p>
        <div style={{ border: '1px solid var(--border)' }}>
          <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <EditableBlock value={voiceText} onChange={setVoiceText} ariaLabel="Brand voice and tone description" dataKey="voice" />
          </div>
          <div className="flex flex-wrap gap-2 px-6 py-4" style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            {['Functional + Data Driven', 'Empowering', 'Collaborative', 'Aspirational', 'Witty + Clever'].map(mode => (
              <Pill key={mode}>{mode}</Pill>
            ))}
          </div>
          <div className="px-6 py-3" style={{ backgroundColor: 'var(--muted)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Click to edit · five tone modes shown above
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Author Persona ─────────────────────────────────────────── */}
      <section id="section-persona" aria-labelledby="persona-heading">
        <h2 id="persona-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
          Author persona
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Imagine you have an AI ghost writer at your disposal. Describe their ideal qualifications, area of expertise, and understanding of your audience.
        </p>
        <div style={{ border: '1px solid var(--border)' }}>
          <div className="px-6 py-5">
            <EditableBlock value={personaText} onChange={setPersonaText} ariaLabel="Author persona description" dataKey="persona" />
          </div>
          <div className="px-6 py-3" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              Click to edit
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Global Writing Rules ───────────────────────────────────── */}
      <section id="section-rules" className="mb-16" aria-labelledby="rules-heading">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 id="rules-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
              Global writing rules
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Add guidelines you'd like to apply to all content. Use one rule per line.
            </p>
          </div>
          <button onClick={addRule} className="flex items-center gap-1.5 px-3 py-2 transition-all hover:opacity-80" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'var(--foreground)', color: 'var(--background)', border: 'none', cursor: 'pointer' }}>
            <Plus size={12} />
            Add Rule
          </button>
        </div>
        <div style={{ border: '1px solid var(--border)' }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 100px 40px', backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            {['Rule', 'Applies to', ''].map((h, i) => (
              <div key={i} className="px-4 py-3">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
              </div>
            ))}
          </div>
          {rules.map((rule, i) => (
            <div key={rule.id} className="grid group items-start" style={{ gridTemplateColumns: '1fr 100px 40px', borderBottom: i < rules.length - 1 ? '1px solid var(--border)' : 'none', minHeight: '52px' }}>
              <div className="px-4 py-3"><p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: 1.6 }}>{rule.rule}</p></div>
              <div className="px-4 py-3 flex items-start"><Pill>{rule.appliesTo}</Pill></div>
              <div className="px-2 py-3 flex items-start justify-center">
                <button onClick={() => removeRule(rule.id)} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-60" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }} aria-label={`Remove rule: ${rule.rule.slice(0, 50)}…`}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ Visual Guidelines ══════════════════════════════════════ */}
      <div className="flex items-center gap-4" style={{ margin: '40px 0 32px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500,
          color: 'var(--color-text-secondary)', letterSpacing: '0.12em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          Visual Guidelines
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        {/* Upload MD / Export MD — scoped to the whole Visual Guidelines group */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <button
            onClick={() => mdFileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer' }}
          >
            {mdUploaded ? <Check size={12} /> : <Upload size={12} />}
            {mdUploaded ? 'Uploaded' : 'Upload MD'}
          </button>
          <input ref={mdFileInputRef} type="file" accept=".md,.markdown" onChange={handleMdUpload} style={{ display: 'none' }} aria-label="Upload Markdown file" />
          <button
            onClick={handleExportMD}
            className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'var(--foreground)', color: 'var(--background)', border: 'none', cursor: 'pointer' }}
          >
            {copiedCSS ? <Check size={12} /> : <Download size={12} />}
            {copiedCSS ? 'Exported' : 'Export MD'}
          </button>
        </div>
      </div>

      {/* ── Logo & Lockups ─────────────────────────────────────────── */}
      <LogoSection />

      <SectionDivider />

      {/* ── Fonts ───────────────────────────────────────────────────── */}
      <section id="section-fonts" aria-labelledby="fonts-heading">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              id="fonts-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}
            >
              Fonts
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Three type families define the AirOps voice — a variable serif for editorial impact, a geometric sans for UI and body, and a mono for data labels and code.
            </p>
          </div>
          <div style={{ flexShrink: 0, marginLeft: '24px' }}>
            <button
              onClick={() => fontFileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <Upload size={12} />
              Upload font
            </button>
            <input
              ref={fontFileInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              multiple
              style={{ display: 'none' }}
              aria-label="Upload font file"
            />
          </div>
        </div>

        {/* Font specimens */}
        <div style={{ border: '1px solid var(--border)', marginTop: '0' }}>
          {fontSpecs.map((f, fi) => (
            <div key={f.variable} style={{ borderBottom: fi < fontSpecs.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px' }}>
                <div className="px-8 py-8" style={{ borderRight: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: f.family, fontSize: f.specimenSize, fontWeight: f.role === 'Heading' ? 400 : f.role === 'Label / Code' ? 500 : 400, color: 'var(--foreground)', letterSpacing: f.tracking, lineHeight: 1.1, marginBottom: '20px' }}>
                    Aa Bb Cc Dd
                  </p>
                  {f.weights.length > 1 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                      {f.weights.map(w => (
                        <div key={w.label} className="flex items-baseline gap-4">
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: '52px' }}>{w.label}</span>
                          <span style={{ fontFamily: f.family, fontSize: '15px', fontWeight: w.value, color: 'var(--foreground)', letterSpacing: f.tracking }}>The quick brown fox jumps over the lazy dog</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: f.family, fontSize: '14px', fontWeight: f.weights[0].value, color: 'var(--secondary-foreground)', letterSpacing: f.tracking, lineHeight: 1.6, marginBottom: '16px' }}>
                      The quick brown fox jumps over the lazy dog. 0123456789
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <p style={{ fontFamily: f.family, fontSize: '12px', fontWeight: f.weights[0].value, color: 'var(--color-text-secondary)', letterSpacing: f.role === 'Label / Code' ? '0.1em' : '0.04em' }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                    {f.role !== 'Label / Code' && (
                      <p style={{ fontFamily: f.family, fontSize: '12px', fontWeight: f.weights[0].value, color: 'var(--color-text-secondary)', letterSpacing: '0.02em' }}>abcdefghijklmnopqrstuvwxyz 0123456789 !?&@#%</p>
                    )}
                  </div>
                </div>
                {/* ── Editable metadata panel ── */}
                <div className="px-6 py-8" style={{ backgroundColor: 'var(--color-green-50)' }}>
                  <Pill>{f.role}</Pill>
                  {/* Editable font name */}
                  <FontMetaField label={null} value={f.name} onSave={v => updateFontSpec(fi, 'name', v)}
                    inputStyle={{ fontFamily: 'var(--font-serif)', fontSize: '22px', letterSpacing: '-0.02em', color: 'var(--foreground)', marginTop: '12px', marginBottom: '16px', display: 'block' }}
                    displayStyle={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginTop: '12px', marginBottom: '16px', display: 'block' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Weights — editable */}
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Weights</p>
                      <FontMetaField label={null} value={f.range} onSave={v => updateFontSpec(fi, 'range', v)}
                        displayStyle={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--foreground)' }}
                        inputStyle={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--foreground)' }}
                      />
                    </div>
                    {/* CSS Variable — read-only */}
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>CSS Variable</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--foreground)' }}>{f.variable}</p>
                    </div>
                    {/* Fallback — editable */}
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Fallback</p>
                      <FontMetaField label={null} value={f.fallback} onSave={v => updateFontSpec(fi, 'fallback', v)}
                        displayStyle={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--secondary-foreground)' }}
                        inputStyle={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--foreground)' }}
                      />
                    </div>
                    {/* Use for — editable */}
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Use for</p>
                      <FontMetaField label={null} value={f.usage} onSave={v => updateFontSpec(fi, 'usage', v)} multiline
                        displayStyle={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--secondary-foreground)', lineHeight: 1.5 }}
                        inputStyle={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--foreground)', lineHeight: 1.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Type Scale — editable */}
        <div className="mt-8">
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Type Scale
            </p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-tertiary)', letterSpacing: '0.06em' }}>
              Click any cell to edit
            </span>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid var(--border)' }}>

            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '130px 108px 1fr 56px 52px 1fr 32px', backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              {['Style', 'Font', 'Sample', 'Size', 'Wt', 'Use', ''].map(h => (
                <div key={h} style={{ padding: '8px 12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {typeScale.map((row, i) => {
              const isLast = i === typeScale.length - 1;
              const isEditing = (field: string) => tsEditCell?.id === row.id && tsEditCell?.field === field;

              /* Shared style for editable text cells */
              const cellInputStyle: React.CSSProperties = {
                width: '100%', border: 'none', outline: 'none', padding: '0',
                background: 'transparent',
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--foreground)',
              };

              return (
                <div
                  key={row.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px 108px 1fr 56px 52px 1fr 32px',
                    borderBottom: isLast ? 'none' : '1px solid var(--border)',
                    minHeight: '52px',
                    alignItems: 'center',
                  }}
                >
                  {/* ── Style name ── */}
                  <div
                    style={{ padding: '6px 12px', cursor: 'text' }}
                    onClick={() => !isEditing('name') && startTsEdit(row.id, 'name', row.name)}
                  >
                    {isEditing('name') ? (
                      <input
                        autoFocus
                        value={tsDraft}
                        onChange={e => setTsDraft(e.target.value)}
                        onBlur={commitTsEdit}
                        onKeyDown={e => { if (e.key === 'Enter') commitTsEdit(); if (e.key === 'Escape') setTsEditCell(null); }}
                        style={{ ...cellInputStyle, fontWeight: 500, letterSpacing: '0.04em' }}
                        aria-label="Style name"
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.04em', display: 'block' }}>
                        {row.name}
                      </span>
                    )}
                  </div>

                  {/* ── Font family dropdown ── */}
                  <div style={{ padding: '6px 12px' }}>
                    <select
                      value={row.font}
                      onChange={e => setTypeScale(prev => prev.map(r => r.id === row.id ? { ...r, font: e.target.value } : r))}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        color: 'var(--foreground)', backgroundColor: 'transparent',
                        border: '1px solid transparent', padding: '2px 4px',
                        cursor: 'pointer', outline: 'none', width: '100%',
                        letterSpacing: '0.04em',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'var(--border)'; }}
                      onBlur={e => { e.target.style.borderColor = 'transparent'; }}
                      aria-label="Font family"
                    >
                      {FONT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* ── Live sample ── */}
                  <div style={{ padding: '6px 12px', overflow: 'hidden' }}>
                    <span style={{
                      fontFamily: row.font,
                      fontSize: row.size,
                      fontWeight: row.weight,
                      letterSpacing: row.tracking,
                      lineHeight: row.lh,
                      color: 'var(--foreground)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    }}>
                      The quick brown fox
                    </span>
                  </div>

                  {/* ── Size ── */}
                  <div
                    style={{ padding: '6px 12px', cursor: 'text' }}
                    onClick={() => !isEditing('size') && startTsEdit(row.id, 'size', row.size.replace('px', ''))}
                  >
                    {isEditing('size') ? (
                      <input
                        autoFocus
                        value={tsDraft}
                        onChange={e => setTsDraft(e.target.value)}
                        onBlur={commitTsEdit}
                        onKeyDown={e => { if (e.key === 'Enter') commitTsEdit(); if (e.key === 'Escape') setTsEditCell(null); }}
                        style={{ ...cellInputStyle, width: '40px' }}
                        aria-label="Font size"
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>{row.size}</span>
                    )}
                  </div>

                  {/* ── Weight ── */}
                  <div
                    style={{ padding: '6px 12px', cursor: 'text' }}
                    onClick={() => !isEditing('weight') && startTsEdit(row.id, 'weight', String(row.weight))}
                  >
                    {isEditing('weight') ? (
                      <input
                        autoFocus
                        value={tsDraft}
                        onChange={e => setTsDraft(e.target.value)}
                        onBlur={commitTsEdit}
                        onKeyDown={e => { if (e.key === 'Enter') commitTsEdit(); if (e.key === 'Escape') setTsEditCell(null); }}
                        style={{ ...cellInputStyle, width: '36px' }}
                        aria-label="Font weight"
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>{row.weight}</span>
                    )}
                  </div>

                  {/* ── Usage ── */}
                  <div
                    style={{ padding: '6px 12px', cursor: 'text' }}
                    onClick={() => !isEditing('usage') && startTsEdit(row.id, 'usage', row.usage)}
                  >
                    {isEditing('usage') ? (
                      <input
                        autoFocus
                        value={tsDraft}
                        onChange={e => setTsDraft(e.target.value)}
                        onBlur={commitTsEdit}
                        onKeyDown={e => { if (e.key === 'Enter') commitTsEdit(); if (e.key === 'Escape') setTsEditCell(null); }}
                        style={{ ...cellInputStyle, width: '100%' }}
                        aria-label="Usage description"
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>{row.usage}</span>
                    )}
                  </div>

                  {/* ── Delete ── */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      onClick={() => deleteTsRow(row.id)}
                      disabled={typeScale.length <= 1}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '20px', height: '20px',
                        background: 'none', border: 'none', cursor: typeScale.length <= 1 ? 'not-allowed' : 'pointer',
                        color: typeScale.length <= 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
                        opacity: typeScale.length <= 1 ? 0.3 : 0.6,
                        padding: 0,
                      }}
                      aria-label={`Delete ${row.name} row`}
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add row footer */}
            <div style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
              <button
                onClick={addTsRow}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  width: '100%', padding: '8px 12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500,
                  color: 'var(--color-text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
                aria-label="Add type style"
              >
                <Plus size={10} /> Add style
              </button>
            </div>
          </div>
        </div>

      </section>

      <SectionDivider />

      {/* ── Visual Style ─────────────────────────────────────────────── */}
      <section id="section-colors" aria-labelledby="visual-style-heading">
        <div className="mb-6">
          <h2 id="visual-style-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
            Color palette
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Brand colors and shape tokens. Click any swatch to edit — changes apply live.
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-8 px-4 py-2.5" style={{ backgroundColor: 'rgba(0,255,100,0.06)', border: '1px solid rgba(0,255,100,0.2)' }}>
          <div className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: 'var(--accent)', borderRadius: '50%' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live editing</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>· Click any swatch to open the color picker</span>
        </div>

        {/* 02a — Color System */}
        <div className="mb-10">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Brand Palette
          </p>
          <div className="grid grid-cols-8 gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}>
            {BRAND_COLORS.map(c => (
              <ColorSwatch key={c.variable} color={c} edited={editedColors} onChange={handleColorChange} />
            ))}
            {extraBrandColors.map(c => (
              <div key={c.variable} style={{ position: 'relative' }}>
                <ColorSwatch color={c} edited={editedColors} onChange={handleColorChange} />
                <button onClick={() => removeExtraBrandColor(c.variable)}
                  style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', color: '#fff', padding: 0, borderRadius: 0 }}
                  aria-label={`Remove ${c.name}`}><X size={9} /></button>
              </div>
            ))}
            {/* Add swatch button */}
            <button onClick={addBrandColor}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '72px', border: '1px dashed var(--border)', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-text-tertiary)', transition: 'border-color 0.12s ease, color 0.12s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-text-tertiary)'; }}
              aria-label="Add colour swatch"
            >
              <Plus size={14} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Add</span>
            </button>
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px', marginTop: '16px' }}>
            Text Colors
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {TEXT_COLORS.map(c => (
              <ColorSwatch key={c.variable} color={c} edited={editedColors} onChange={handleColorChange} />
            ))}
          </div>

          {/* Gradient bar */}
          <div style={{ border: '1px solid var(--border)' }}>
            <div style={{ height: '36px', background: `linear-gradient(90deg, #002910, #008c44, #00ff64, #EEFF8C)` }} />
            <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: 'var(--background)' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>Brand gradient · Deep Green → Primary → Interaction → Label</span>
              <Pill>Green Spectrum</Pill>
            </div>
          </div>

          {/* Secondary Palette */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Secondary Palette
              </p>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                Click swatch to edit · click hex to copy
              </span>
            </div>

            {/* Hue column headers */}
            <div className="grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {SEC_HUES.map(hue => (
                <div key={hue} className="text-center">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {hue}
                  </span>
                </div>
              ))}
            </div>

            {/* Shade tier rows */}
            {(['50', '100', '500', '900'] as const).map((tier, rowIdx) => (
              <div key={tier} className="grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {SECONDARY_PALETTE
                  .filter(c => c.tier === tier)
                  .map((color, colIdx) => {
                    const flatIdx = rowIdx * 7 + colIdx;
                    return (
                      <SecondaryColorSwatch
                        key={`${tier}-${color.hue}`}
                        hex={color.hex}
                        hue={color.hue}
                        tier={color.tier}
                        editedHex={editedSecondary[flatIdx] ?? ''}
                        onChange={h => setEditedSecondary(prev => ({ ...prev, [flatIdx]: h }))}
                      />
                    );
                  })}
              </div>
            ))}

            {/* Shade tier legend */}
            <div className="flex items-center gap-6 mt-3">
              {[
                { tier: '50', label: 'Tint 50 — near white' },
                { tier: '100', label: 'Tint 100 — light pastel' },
                { tier: '500', label: '500 — saturated' },
                { tier: '900', label: '900 — deep dark' },
              ].map(t => (
                <div key={t.tier} className="flex items-center gap-1.5">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--primary)', letterSpacing: '0.04em' }}>{t.tier}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)' }}>{t.label.split('—')[1].trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 02d — Shape + Spacing */}
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Shape & Spacing
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Shape */}
            <div style={{ border: '1px solid var(--border)', padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>Sharp Corners</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>border-radius: 0 — no softening on any component</p>
              <div className="flex gap-3 items-center">
                {[
                  { label: 'Button', w: '80px', h: '32px' },
                  { label: 'Card', w: '56px', h: '56px' },
                  { label: 'Pill', w: '64px', h: '24px' },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-1.5">
                    <div style={{ width: s.w, height: s.h, backgroundColor: 'var(--primary)', borderRadius: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-secondary)', letterSpacing: '0.06em' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div style={{ border: '1px solid var(--border)', padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '4px' }}>Spacing Scale</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Base unit 4px — multiples of 4</p>
              <div className="flex items-end gap-3">
                {[
                  { label: '4', size: 4 }, { label: '8', size: 8 }, { label: '12', size: 12 },
                  { label: '16', size: 16 }, { label: '24', size: 24 }, { label: '32', size: 32 },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <div style={{ width: '8px', height: `${s.size}px`, backgroundColor: 'var(--primary)', opacity: 0.7 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-secondary)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Data Viz ──────────────────────────────────────────────────── */}
      <div className="mb-0">
        <DataVizSection />
      </div>

      <SectionDivider />

      {/* ── 06 Illustration Style ─────────────────────────────────────── */}
      <section id="section-illustrations" className="mb-16" aria-labelledby="illustration-heading">

        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              id="illustration-heading"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}
            >
              Illustration style
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Upload reference illustrations to define your visual language. AI models use these as style anchors when generating on-brand imagery.
            </p>
          </div>
          <div className="flex items-center gap-2" style={{ flexShrink: 0, marginLeft: '24px' }}>
            <button
              onClick={() => illFileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <Upload size={12} />
              Upload
            </button>
            <input
              ref={illFileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              aria-label="Upload illustration images"
              onChange={handleIllustrationUpload}
            />
            <button
              onClick={() => setDamConnected(v => !v)}
              className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: damConnected ? 'var(--color-interaction)' : 'transparent',
                color: damConnected ? 'var(--color-near-black)' : 'var(--foreground)',
                border: `1px solid ${damConnected ? 'var(--color-interaction)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-pressed={damConnected}
            >
              <Database size={12} />
              {damConnected ? 'DAM Connected' : 'Connect DAM'}
            </button>
          </div>
        </div>

        {/* Gallery grid */}
        <div
          className="grid gap-3 mb-8"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {illustrations.map(ill => (
            <div
              key={ill.id}
              className="group relative"
              style={{ border: '1px solid var(--border)' }}
            >
              {/* Image */}
              <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: 'var(--color-green-50)', position: 'relative' }}>
                <img
                  src={ill.src}
                  alt={ill.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2"
                  style={{ backgroundColor: 'rgba(0,13,5,0.4)' }}
                >
                  <button
                    onClick={() => removeIllustration(ill.id)}
                    style={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--foreground)',
                      borderRadius: 0,
                    }}
                    aria-label={`Remove ${ill.name}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
              {/* Label */}
              <div className="px-2.5 py-2" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '1px' }}>
                  {ill.name}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Reference
                </p>
              </div>
            </div>
          ))}

          {/* Upload placeholder slot */}
          <button
            onClick={() => illFileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 transition-all hover:opacity-60"
            style={{
              border: '1px dashed var(--border)',
              aspectRatio: '1 / 1',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              width: '100%',
              color: 'var(--color-text-secondary)',
              borderRadius: 0,
            }}
            aria-label="Upload new illustration"
          >
            <Upload size={18} style={{ color: 'var(--color-stroke-green)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Add image
            </span>
          </button>
        </div>

        {/* Style reference prompt */}
        <div className="mb-8" style={{ border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Style reference prompt
            </p>
          </div>
          <div className="px-5 py-4">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
              Describe your illustration style so AI models know what to produce when generating on-brand imagery.
            </p>
            <textarea
              value={illustrationPrompt}
              onChange={e => setIllustrationPrompt(e.target.value)}
              rows={3}
              aria-label="Illustration style reference prompt"
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                padding: '10px 12px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--foreground)',
                backgroundColor: 'var(--background)',
                resize: 'vertical',
                outline: 'none',
                borderRadius: 0,
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* AI model permissions */}
        <div id="section-ai-models" style={{ border: '1px solid var(--border)' }}>
          {/* Panel header */}
          <div className="px-6 py-4" style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                  AI model permissions
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Allow these models to generate on-brand imagery using your illustration style as reference.
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-near-black)',
                backgroundColor: 'var(--color-interaction)',
                padding: '3px 8px',
                border: '1px solid var(--color-stroke-green)',
              }}>
                {Object.values(modelToggles).filter(Boolean).length} enabled
              </span>
            </div>
          </div>

          {/* Toggle rows */}
          <div className="px-6">
            {AI_MODELS.map((model, i) => (
              <ModelToggle
                key={model.id}
                model={model}
                checked={modelToggles[model.id as ModelKey]}
                onChange={v => setModelToggles(prev => ({ ...prev, [model.id]: v }))}
                isLast={i === AI_MODELS.length - 1}
              />
            ))}
          </div>
        </div>

      </section>

      <SectionDivider />

      {/* ── Presentation Slide Design ──────────────────────────────── */}
      <section id="section-slides" aria-labelledby="slide-design-heading">
        <SlideDesignSection />
      </section>

    </div>
  );
}