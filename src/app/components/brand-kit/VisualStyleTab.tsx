import { useState, useRef, useCallback } from 'react';
import { Copy, Check, Download, Shuffle, Edit2 } from 'lucide-react';
import { FontUploader, FontAssignments } from './FontUploader';

// ─── Data ──────────────────────────────────────────────────────────────────

const BRAND_COLORS = [
  { name: 'Primary', variable: '--primary', hex: '#2F2F37', usage: 'Buttons, links, key UI elements' },
  { name: 'Accent', variable: '--accent', hex: '#B35DE1', usage: 'Highlights, badges, active states' },
  { name: 'Background', variable: '--background', hex: '#FFFFFF', usage: 'Page & surface background' },
];

const NEUTRAL_COLORS = [
  { name: 'Foreground', variable: '--foreground', hex: '#09090B', usage: 'Primary text' },
  { name: 'Secondary FG', variable: '--secondary-foreground', hex: '#676C79', usage: 'Secondary text' },
  { name: 'Muted FG', variable: '--muted-foreground', hex: '#808593', usage: 'Placeholder, disabled' },
  { name: 'Muted', variable: '--muted', hex: '#ECEDEF', usage: 'Subtle backgrounds' },
  { name: 'Border', variable: '--border', hex: '#E8E8EA', usage: 'Dividers, outlines' },
];

const SEMANTIC_COLORS = [
  { name: 'Success', variable: '--chart-3', hex: '#31C467', usage: 'Positive states' },
  { name: 'Warning', variable: '--chart-4', hex: '#FEC84B', usage: 'Caution states' },
  { name: 'Error', variable: '--destructive', hex: '#F04438', usage: 'Error, delete actions' },
  { name: 'Info', variable: '--chart-2', hex: '#00A3FF', usage: 'Informational states' },
];

const TYPE_SCALE = [
  { name: '2xl', variable: '--text-2xl', px: '32px', weight: '700', tag: 'h1', usage: 'Page titles, hero headings', sample: 'The quick brown fox' },
  { name: 'xl', variable: '--text-xl', px: '24px', weight: '600', tag: 'h2', usage: 'Section headings', sample: 'The quick brown fox jumps' },
  { name: 'lg', variable: '--text-lg', px: '18px', weight: '600', tag: 'h3', usage: 'Subsection headings', sample: 'The quick brown fox jumps over the' },
  { name: 'base', variable: '--text-base', px: '16px', weight: '400', tag: 'p', usage: 'Body text, descriptions', sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'sm', variable: '--text-sm', px: '14px', weight: '400', tag: 'span', usage: 'UI elements, metadata', sample: 'The quick brown fox jumps over the lazy dog and more' },
  { name: 'xs', variable: '--text-xs', px: '13px', weight: '400', tag: 'label', usage: 'Labels, captions, timestamps', sample: 'The quick brown fox jumps over the lazy dog and even more text here' },
];

const RADIUS_STEPS = [
  { name: 'None', value: 0, label: '0px' },
  { name: 'SM', value: 4, label: '4px' },
  { name: 'MD', value: 6, label: '6px' },
  { name: 'LG', value: 8, label: '8px' },
  { name: 'XL', value: 12, label: '12px' },
  { name: 'Full', value: 9999, label: '∞' },
];

const ELEVATIONS = [
  { name: 'Flat', description: 'No shadow · Base surface', shadow: 'none' },
  { name: 'SM', description: 'Cards, inline elements', shadow: '0 1px 2px 0 rgba(0,0,0,0.05)' },
  { name: 'MD', description: 'Dropdowns, tooltips', shadow: '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)' },
  { name: 'LG', description: 'Modals, floating panels', shadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)' },
];

const PERSONALITY_AXES = [
  { label: 'Bold', opposite: 'Subtle', value: 30 },
  { label: 'Modern', opposite: 'Classic', value: 75 },
  { label: 'Playful', opposite: 'Serious', value: 20 },
  { label: 'Warm', opposite: 'Cool', value: 45 },
  { label: 'Loud', opposite: 'Quiet', value: 35 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function hexToLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isLight(hex: string) {
  return hexToLuminance(hex) > 0.6;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 mb-6">
      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)', fontFamily: 'Inter, sans-serif', fontWeight: 400, paddingTop: '3px', minWidth: '20px' }}>{number}</div>
      <div>
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '4px' }}>{title}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>{description}</p>
      </div>
    </div>
  );
}

function CopyButton({ text, size = 'sm' }: { text: string; size?: 'sm' | 'xs' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const iconSize = size === 'xs' ? 10 : 12;
  return (
    <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--muted-foreground)', cursor: 'pointer', background: 'none', border: 'none', padding: '2px' }}>
      {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
    </button>
  );
}

function ColorSwatch({ color, editedColors, onColorChange }: {
  color: { name: string; variable: string; hex: string; usage: string };
  editedColors: Record<string, string>;
  onColorChange: (variable: string, hex: string) => void;
}) {
  const currentHex = editedColors[color.variable] ?? color.hex;
  const light = isLight(currentHex);

  return (
    <div className="group flex flex-col rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      <label className="relative cursor-pointer block" style={{ height: '80px', backgroundColor: currentHex }}>
        <input
          type="color"
          value={currentHex}
          onChange={(e) => onColorChange(color.variable, e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          style={{ border: 'none', padding: 0 }}
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ backgroundColor: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)' }}>
            <Edit2 size={10} style={{ color: light ? '#000' : '#fff' }} />
            <span style={{ fontSize: '10px', color: light ? '#000' : '#fff', fontFamily: 'Inter, sans-serif' }}>Edit</span>
          </div>
        </div>
      </label>
      <div className="px-3 py-2.5 flex flex-col gap-0.5" style={{ backgroundColor: 'var(--background)' }}>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{color.name}</span>
          <div className="flex items-center gap-1 group/copy">
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted-foreground)' }}>{currentHex}</span>
            <CopyButton text={currentHex} size="xs" />
          </div>
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--muted-foreground)' }}>{color.variable}</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{color.usage}</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function VisualStyleTab() {
  const [editedColors, setEditedColors] = useState<Record<string, string>>({});
  const [radius, setRadius] = useState(6);
  const [personalities, setPersonalities] = useState(PERSONALITY_AXES.map(a => a.value));
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [fontAssignments, setFontAssignments] = useState<FontAssignments>({
    heading: 'Inter',
    body: 'Inter',
    mono: 'monospace',
  });

  const handleColorChange = useCallback((variable: string, hex: string) => {
    setEditedColors(prev => ({ ...prev, [variable]: hex }));
    document.documentElement.style.setProperty(variable, hex);
  }, []);

  const handleRadiusChange = (val: number) => {
    setRadius(val);
    document.documentElement.style.setProperty('--radius', `${val}px`);
  };

  const handleExportCSS = () => {
    const allColors = [...BRAND_COLORS, ...NEUTRAL_COLORS, ...SEMANTIC_COLORS];
    const lines = allColors.map(c => {
      const val = editedColors[c.variable] ?? c.hex;
      return `  ${c.variable}: ${val};`;
    });
    lines.push(`  --radius: ${radius}px;`);
    const css = `:root {\n${lines.join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--foreground)', marginBottom: '6px' }}>Visual Style</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
            Define the visual language that makes your brand recognizable. Changes apply live across your brand kit.
          </p>
        </div>
        <button
          onClick={handleExportCSS}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius)' }}
        >
          {copiedCSS ? <Check size={14} /> : <Download size={14} />}
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            {copiedCSS ? 'Copied!' : 'Export CSS'}
          </span>
        </button>
      </div>

      {/* Live editing notice */}
      <div className="flex items-center gap-2 mb-10 px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(179,93,225,0.06)', border: '1px solid rgba(179,93,225,0.18)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-weight-medium)' }}>
          Live editing enabled
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
          · Click any color swatch to edit it. Changes update your design system in real time.
        </span>
      </div>

      {/* ── 01 Color System ─────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionHeader
          number="01"
          title="Color System"
          description="Your brand's color palette — organized by role and purpose."
        />

        <div className="space-y-6">
          {/* Brand Colors */}
          <div>
            <p className="mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Brand Colors</p>
            <div className="grid grid-cols-3 gap-3">
              {BRAND_COLORS.map(c => (
                <ColorSwatch key={c.variable} color={c} editedColors={editedColors} onColorChange={handleColorChange} />
              ))}
            </div>
          </div>

          {/* Neutral Scale */}
          <div>
            <p className="mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Neutral Scale</p>
            <div className="grid grid-cols-5 gap-3">
              {NEUTRAL_COLORS.map(c => (
                <ColorSwatch key={c.variable} color={c} editedColors={editedColors} onColorChange={handleColorChange} />
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <p className="mb-3" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Semantic Colors</p>
            <div className="grid grid-cols-4 gap-3">
              {SEMANTIC_COLORS.map(c => (
                <ColorSwatch key={c.variable} color={c} editedColors={editedColors} onColorChange={handleColorChange} />
              ))}
            </div>
          </div>

          {/* Gradient preview */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div
              className="h-16 w-full"
              style={{
                background: `linear-gradient(135deg, ${editedColors['--primary'] ?? '#2F2F37'}, ${editedColors['--accent'] ?? '#B35DE1'}, ${editedColors['--chart-2'] ?? '#00A3FF'})`
              }}
            />
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--background)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Brand Gradient · Primary → Accent → Info</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted-foreground)' }}>
                linear-gradient(135deg, {editedColors['--primary'] ?? '#2F2F37'}, {editedColors['--accent'] ?? '#B35DE1'}, {editedColors['--chart-2'] ?? '#00A3FF'})
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 Typography ───────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionHeader
          number="02"
          title="Typography"
          description="Upload custom brand fonts, assign them to roles, and preview your full type scale."
        />

        {/* Font Uploader */}
        <div className="mb-6">
          <FontUploader
            assignments={fontAssignments}
            onAssignmentsChange={setFontAssignments}
          />
        </div>

        {/* Type Scale */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="grid" style={{ gridTemplateColumns: '100px 1fr 60px 60px 140px' }}>
            {/* Header row */}
            {['Scale', 'Sample', 'Size', 'Weight', 'Usage'].map(h => (
              <div key={h} className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              </div>
            ))}
            {/* Scale rows */}
            {TYPE_SCALE.map((t, i) => {
              // Pick font family based on tag role
              const isHeading = ['h1', 'h2', 'h3', 'h4'].includes(t.tag);
              const isMono = t.tag === 'code';
              const sampleFont = isHeading
                ? `${fontAssignments.heading}, Inter, sans-serif`
                : isMono
                ? `${fontAssignments.mono}, monospace`
                : `${fontAssignments.body}, Inter, sans-serif`;

              return (
                <>
                  <div key={`tag-${t.name}`} className="px-4 flex items-center" style={{ borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid var(--border)' : 'none', minHeight: '56px' }}>
                    <div className="flex flex-col gap-0.5">
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{t.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted-foreground)' }}>{`<${t.tag}>`}</span>
                    </div>
                  </div>
                  <div key={`sample-${t.name}`} className="px-4 flex items-center overflow-hidden" style={{ borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: sampleFont, fontSize: t.px, fontWeight: parseInt(t.weight), color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {t.sample}
                    </span>
                  </div>
                  <div key={`size-${t.name}`} className="px-4 flex items-center" style={{ borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{t.px}</span>
                  </div>
                  <div key={`weight-${t.name}`} className="px-4 flex items-center" style={{ borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{t.weight}</span>
                  </div>
                  <div key={`usage-${t.name}`} className="px-4 flex items-center" style={{ borderBottom: i < TYPE_SCALE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>{t.usage}</span>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 03 Shape Language ───────────────────────────────────────── */}
      <section className="mb-14">
        <SectionHeader
          number="03"
          title="Shape Language"
          description="Border radius defines the roundness and personality of your UI components."
        />

        <div className="p-6 rounded-lg" style={{ border: '1px solid var(--border)' }}>
          {/* Slider */}
          <div className="flex items-center gap-4 mb-8">
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '70px' }}>Base radius</span>
            <input
              type="range"
              min={0}
              max={16}
              step={1}
              value={radius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 'var(--font-weight-medium)', minWidth: '32px' }}>{radius}px</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted-foreground)' }}>--radius</span>
            </div>
          </div>

          {/* Radius previews */}
          <div className="grid grid-cols-6 gap-4">
            {RADIUS_STEPS.map(step => {
              const r = step.value === 9999 ? 9999 : step.value === 0 ? 0 : radius + (step.value - 6);
              const finalRadius = Math.max(0, r);
              return (
                <div key={step.name} className="flex flex-col items-center gap-3">
                  <div
                    className="w-16 h-16 transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--accent)',
                      borderRadius: step.value === 9999 ? '9999px' : step.value === 0 ? '0px' : `${finalRadius}px`,
                      opacity: 0.85,
                    }}
                  />
                  <div className="text-center">
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>{step.name}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted-foreground)' }}>
                      {step.value === 9999 ? '∞' : step.value === 0 ? '0px' : `${finalRadius}px`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 Elevation ────────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionHeader
          number="04"
          title="Elevation"
          description="Shadow levels establish depth and visual hierarchy across your interface."
        />

        <div className="grid grid-cols-4 gap-4">
          {ELEVATIONS.map(e => (
            <div key={e.name} className="flex flex-col gap-4 items-center p-6" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div
                className="w-full h-20 transition-all"
                style={{
                  backgroundColor: 'var(--background)',
                  boxShadow: e.shadow,
                  borderRadius: 'var(--radius)',
                  border: e.shadow === 'none' ? '1px solid var(--border)' : 'none',
                }}
              />
              <div className="text-center">
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '2px' }}>{e.name}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--muted-foreground)' }}>{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 Imagery Style ────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionHeader
          number="05"
          title="Imagery Style"
          description="Photography and illustration direction that shapes your brand's visual tone."
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Photo style card */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1704775988639-e9fe3b7d94fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Brand photography style"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded text-white" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                  Photography
                </span>
              </div>
            </div>
            <div className="p-4">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '6px' }}>Editorial Realism</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '10px' }}>Natural light, authentic moments, minimal post-processing. Avoid heavy filters or staged compositions.</p>
              <div className="flex flex-wrap gap-1.5">
                {['Natural light', 'Candid', 'High contrast', 'Clean backgrounds'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-sm)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Illustration style card */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1612072254406-ba7813ff5c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Brand illustration style"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded text-white" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                  Illustration & Texture
                </span>
              </div>
            </div>
            <div className="p-4">
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', marginBottom: '6px' }}>Abstract & Layered</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', marginBottom: '10px' }}>Bold color fields, soft gradients, and textural depth. Inspired by editorial and art direction.</p>
              <div className="flex flex-wrap gap-1.5">
                {['Gradients', 'Texture', 'Geometric', 'Layered depth'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-sm)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 Brand Personality ────────────────────────────────────── */}
      <section className="mb-6">
        <SectionHeader
          number="06"
          title="Brand Personality"
          description="Position your brand on each spectrum to define its visual and tonal character."
        />

        <div className="p-6 rounded-lg space-y-5" style={{ border: '1px solid var(--border)' }}>
          {PERSONALITY_AXES.map((axis, i) => (
            <div key={axis.label} className="flex items-center gap-4">
              <span className="text-right" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)', minWidth: '56px' }}>{axis.label}</span>
              <div className="flex-1 relative">
                <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: 'var(--muted)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${personalities[i]}%`, backgroundColor: 'var(--accent)' }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={personalities[i]}
                  onChange={(e) => {
                    const updated = [...personalities];
                    updated[i] = Number(e.target.value);
                    setPersonalities(updated);
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  style={{ margin: 0 }}
                />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', minWidth: '56px' }}>{axis.opposite}</span>
            </div>
          ))}

          <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>Drag each axis to position your brand's personality</p>
            <button
              onClick={() => setPersonalities(PERSONALITY_AXES.map(() => Math.floor(Math.random() * 80) + 10))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all hover:opacity-70"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-xs)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
            >
              <Shuffle size={11} />
              Randomize
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}