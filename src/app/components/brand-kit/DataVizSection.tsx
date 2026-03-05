import React, { useState, useRef } from 'react';
import { Upload, Check, X, Plus, Trash2, Edit2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// ── Data viz palette (spec values, not main brand tokens) ─────────────────
export const DV_PALETTE = [
  { hex: '#ccffe0', label: 'primary bar / fill (light)' },
  { hex: '#009b32', label: 'primary green / line' },
  { hex: '#eeff8c', label: 'highlight / accent bar' },
  { hex: '#001408', label: 'near black / text' },
  { hex: '#f8fffb', label: 'background (light)' },
  { hex: '#00250e', label: 'background (dark)' },
  { hex: '#a9a9a9', label: 'axes / grid lines' },
];

// ── Data viz typography spec ──────────────────────────────────────────────
export const DV_TYPE = [
  { role: 'Headline',           spec: 'Serrif VF / Georgia, 40–56px, tracking −0.02em' },
  { role: 'Subhead / subtitle', spec: 'DM Mono Medium, 18–24px, tracking −0.02em' },
  { role: 'Axis labels',        spec: 'DM Mono Regular, 14–18px, #a9a9a9' },
  { role: 'Value callouts',     spec: 'Saans / DM Mono Medium, 16–20px, #002910' },
  { role: 'Legend',             spec: 'Saans Medium, 14px' },
  { role: 'Footnote',           spec: 'DM Mono Medium, 14–18px, 80% opacity' },
];

// ── Local editable types ──────────────────────────────────────────────────
type DvPaletteRow = { id: string; hex: string; label: string };
type DvTypeRow    = { id: string; role: string; spec: string };

function uid() { return `dv-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }

// ── Chart 1: Table infographic rows ──────────────────────────────────────
type TextPart = { text: string; bold: boolean };

const TABLE_ROWS: { num: string; label: string; parts: TextPart[] }[] = [
  {
    num: '1',
    label: 'Keep Content Fresh',
    parts: [
      { text: '3×', bold: true },
      { text: ' more likely to be cited. Regular refresh prevents stale content penalty.', bold: false },
    ],
  },
  {
    num: '2',
    label: 'Add Structured Schema',
    parts: [
      { text: 'Rich markup increases citation likelihood by ', bold: false },
      { text: '13%', bold: true },
      { text: ' across AI and Google.', bold: false },
    ],
  },
  {
    num: '3',
    label: 'Use Sequential Headings',
    parts: [
      { text: 'Properly ordered H2–H4 tags ', bold: false },
      { text: '2×', bold: true },
      { text: ' your chance of being cited.', bold: false },
    ],
  },
];

// ── Chart 2: Numbered list rows ───────────────────────────────────────────
const LIST_ROWS = [
  { num: '1', text: 'Use clear, descriptive anchors' },
  { num: '2', text: 'Place links early when they matter' },
  { num: '3', text: 'Link between content-rich pages' },
  { num: '4', text: 'Keep link volume intentional' },
];

// ── Chart 3: Line chart data ──────────────────────────────────────────────
const LINE_DATA = [
  { x: '2023', chatgpt: 1.0,  google: 0.38 },
  { x: '2024', chatgpt: 1.85, google: 0.48 },
  { x: '2025', chatgpt: 2.75, google: 0.54, chatgptP: 2.75 },
  { x: '→',   chatgptP: 3.25 },
];

// ── Types ─────────────────────────────────────────────────────────────────
type ImportedExample = {
  id: string;
  name: string;
  url: string;
  editingName: boolean;
};

// ── Sub-components ────────────────────────────────────────────────────────

function AirOpsWordmark({ color = '#0B0E16' }: { color?: string }) {
  return (
    <svg
      width="72"
      height="23"
      viewBox="0 0 100 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AirOps"
      role="img"
    >
      <path d="M14.2683 8.35377V11.2588C12.9587 9.16447 10.9253 7.88086 8.40935 7.88086C3.03288 7.88086 0 11.833 0 17.1364C0 22.4735 3.06735 26.5608 8.47828 26.5608C10.9942 26.5608 12.9931 25.2772 14.2683 23.1829V26.0879H18.473V8.35377H14.2683ZM9.30543 23.0478C6.23809 23.0478 4.48039 20.2441 4.48039 17.1364C4.48039 14.0963 6.20362 11.4277 9.37436 11.4277C11.9937 11.4277 14.2339 13.2856 14.2339 17.0688C14.2339 20.7846 12.0971 23.0478 9.30543 23.0478Z" fill={color}/>
      <path d="M22.0938 8.35547V26.0896H26.5741V8.35547H22.0938Z" fill={color}/>
      <path d="M34.832 12.7461V8.3548H30.3516V26.0889H34.832V15.9551C34.832 13.3541 36.6586 12.307 38.3818 12.307C39.3813 12.307 40.4152 12.5772 40.9666 12.7799V8.05078C38.0372 8.05078 35.6246 9.77353 34.832 12.7461Z" fill={color}/>
      <path d="M42.0625 13.7594C42.0625 19.2655 45.9225 23.1839 51.4713 23.1839C57.0546 23.1839 60.8804 19.2655 60.8804 13.7594C60.8804 8.35475 57.0546 4.50391 51.4713 4.50391C45.9225 4.50391 42.0625 8.35475 42.0625 13.7594ZM56.3998 13.7594C56.3998 17.2049 54.5042 19.6708 51.4713 19.6708C48.404 19.6708 46.5429 17.2049 46.5429 13.7594C46.5429 10.4491 48.404 8.05073 51.4713 8.05073C54.5042 8.05073 56.3998 10.4491 56.3998 13.7594Z" fill={color}/>
      <path d="M73.3738 7.88086C70.7545 7.88086 68.6177 9.40093 67.4804 11.833V8.35377H63V31.9993H67.4804V22.9127C68.7556 25.1083 71.1336 26.5608 73.6496 26.5608C78.5435 26.5608 81.9555 22.8113 81.9555 17.4404C81.9555 11.7993 78.4057 7.88086 73.3738 7.88086ZM72.5811 23.2505C69.5827 23.2505 67.4804 20.7846 67.4804 17.2715C67.4804 13.6571 69.5827 11.1237 72.5811 11.1237C75.4417 11.1237 77.4751 13.7247 77.4751 17.4066C77.4751 20.8521 75.4417 23.2505 72.5811 23.2505Z" fill={color}/>
      <path d="M83.3906 19.9401C83.3906 23.1491 86.2856 26.5608 92.0757 26.5608C97.9002 26.5608 100.003 23.2167 100.003 20.6157C100.003 16.6297 95.212 15.9203 92.0068 15.3123C89.8355 14.9407 88.4569 14.6367 88.4569 13.4207C88.4569 12.0357 90.0078 11.1575 91.6621 11.1575C93.9023 11.1575 94.7639 12.6775 94.8329 14.2989H99.3133C99.3133 11.6641 97.4177 7.88086 91.5587 7.88086C86.4924 7.88086 83.9765 10.6845 83.9765 13.6909C83.9765 17.9809 88.836 18.42 92.0412 19.028C93.9023 19.3658 95.5221 19.7712 95.5221 21.0886C95.5221 22.406 93.9368 23.2842 92.248 23.2842C90.6626 23.2842 87.871 22.406 87.871 19.9401H83.3906Z" fill={color}/>
      <path d="M24.4093 6.19288C22.5697 6.19288 21.25 4.89943 21.25 3.13563C21.25 1.37184 22.5697 0 24.4093 0C26.1688 0 27.5685 1.37184 27.5685 3.13563C27.5685 4.89943 26.1688 6.19288 24.4093 6.19288Z" fill={color}/>
    </svg>
  );
}

function ChartCaption({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--color-text-secondary)',
        marginTop: '6px',
        letterSpacing: '0.03em',
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  );
}

function ChartExampleLabel({ index, title }: { index: number; title: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}
    >
      {index}. {title}
    </p>
  );
}

// ── Editable palette & typography rows ────────────────────────────────────

function DvTypeEditRow({ row, isLast, onRoleChange, onSpecChange, onDelete }: {
  row: DvTypeRow;
  isLast: boolean;
  onRoleChange: (v: string) => void;
  onSpecChange: (v: string) => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={row.role}
          onChange={e => onRoleChange(e.target.value)}
          style={{
            width: '100px',
            border: 'none',
            borderBottom: '1px solid var(--primary)',
            outline: 'none',
            padding: '0 0 2px',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground)',
          }}
          aria-label="Edit type role"
        />
        <input
          type="text"
          value={row.spec}
          onChange={e => onSpecChange(e.target.value)}
          style={{
            width: '200px',
            border: 'none',
            borderBottom: '1px solid var(--primary)',
            outline: 'none',
            padding: '0 0 2px',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground)',
          }}
          aria-label="Edit type spec"
        />
      </div>
      <button
        onClick={onDelete}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
      >
        <Trash2 size={9} />
      </button>
    </div>
  );
}

function DvPaletteEditRow({ row, isLast, isVeryLight, colorInputRef, onHexChange, onLabelChange, onDelete, onSwatchClick }: {
  row: DvPaletteRow;
  isLast: boolean;
  isVeryLight: boolean;
  colorInputRef: (el: HTMLInputElement | null) => void;
  onHexChange: (v: string) => void;
  onLabelChange: (v: string) => void;
  onDelete: () => void;
  onSwatchClick: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        <div
          style={{
            width: '44px',
            height: '20px',
            backgroundColor: row.hex,
            border: isVeryLight ? '1px solid var(--border)' : '1px solid transparent',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={onSwatchClick}
        />
        <input
          type="text"
          value={row.hex}
          onChange={e => onHexChange(e.target.value)}
          ref={colorInputRef}
          style={{
            width: '100px',
            border: 'none',
            borderBottom: '1px solid var(--primary)',
            outline: 'none',
            padding: '0 0 2px',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground)',
          }}
          aria-label="Edit palette hex"
        />
        <input
          type="text"
          value={row.label}
          onChange={e => onLabelChange(e.target.value)}
          style={{
            width: '200px',
            border: 'none',
            borderBottom: '1px solid var(--primary)',
            outline: 'none',
            padding: '0 0 2px',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground)',
          }}
          aria-label="Edit palette label"
        />
      </div>
      <button
        onClick={onDelete}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
      >
        <Trash2 size={9} />
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export function DataVizSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imported, setImported] = useState<ImportedExample[]>([]);
  const [justImported, setJustImported] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  // ── Editable palette & typography state ──────────────────────────────────
  const [dvPalette, setDvPalette] = useState<DvPaletteRow[]>(
    DV_PALETTE.map((p, i) => ({ id: `p${i}`, ...p }))
  );
  const [dvType, setDvType] = useState<DvTypeRow[]>(
    DV_TYPE.map((t, i) => ({ id: `t${i}`, ...t }))
  );
  const colorInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // palette helpers
  const updatePaletteHex   = (id: string, hex: string) => setDvPalette(prev => prev.map(p => p.id === id ? { ...p, hex } : p));
  const updatePaletteLabel = (id: string, label: string) => setDvPalette(prev => prev.map(p => p.id === id ? { ...p, label } : p));
  const removePaletteRow   = (id: string) => setDvPalette(prev => prev.filter(p => p.id !== id));
  const addPaletteRow      = () => setDvPalette(prev => [...prev, { id: uid(), hex: '#008c44', label: 'new colour' }]);

  // type helpers
  const updateTypeRole   = (id: string, role: string) => setDvType(prev => prev.map(t => t.id === id ? { ...t, role } : t));
  const updateTypeSpec   = (id: string, spec: string) => setDvType(prev => prev.map(t => t.id === id ? { ...t, spec } : t));
  const removeTypeRow    = (id: string) => setDvType(prev => prev.filter(t => t.id !== id));
  const addTypeRow       = () => setDvType(prev => [...prev, { id: uid(), role: 'New role', spec: 'Font, size, weight' }]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const readers = files.map(
      file =>
        new Promise<ImportedExample>(resolve => {
          const reader = new FileReader();
          reader.onload = ev => {
            resolve({
              id: `dvex-${Date.now()}-${Math.random()}`,
              name: file.name.replace(/\.[^.]+$/, ''),
              url: ev.target?.result as string,
              editingName: false,
            });
          };
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then(newItems => {
      setImported(prev => [...prev, ...newItems]);
      setJustImported(true);
      setTimeout(() => setJustImported(false), 2000);
    });

    // reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const removeExample = (id: string) =>
    setImported(prev => prev.filter(ex => ex.id !== id));

  const startRename = (id: string, currentName: string) => {
    setNameDraft(currentName);
    setImported(prev =>
      prev.map(ex => ({ ...ex, editingName: ex.id === id })),
    );
  };

  const commitRename = (id: string) => {
    setImported(prev =>
      prev.map(ex =>
        ex.id === id
          ? { ...ex, name: nameDraft.trim() || ex.name, editingName: false }
          : ex,
      ),
    );
  };

  return (
    <section aria-labelledby="dataviz-heading" style={{ marginBottom: '48px' }}>

      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2
            id="dataviz-heading"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '4px',
            }}
          >
            Data viz
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              lineHeight: 1.65,
            }}
          >
            AirOps data visualizations use a strict palette and typographic system. Sharp corners only.
            Georgia or Serrif VF for headlines. DM Mono for all axis labels, value callouts, and pill
            tags. Green spectrum palette with #eeff8c as the highlight accent.
          </p>
        </div>

        {/* ── Import examples CTA ──────────────────────────────────── */}
        <div style={{ flexShrink: 0, marginLeft: '24px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
              color: justImported ? 'var(--primary)' : 'var(--foreground)',
              backgroundColor: justImported ? 'rgba(0,255,100,0.06)' : 'transparent',
              border: justImported
                ? '1px solid rgba(0,255,100,0.3)'
                : '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            aria-label="Import chart examples"
          >
            {justImported ? <Check size={12} /> : <Upload size={12} />}
            {justImported
              ? `${imported.length} example${imported.length === 1 ? '' : 's'} added`
              : 'Import examples'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg,.pdf,.gif,.webp"
            multiple
            onChange={handleImport}
            style={{ display: 'none' }}
            aria-label="Upload chart examples"
          />
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.04em',
              marginTop: '5px',
              textAlign: 'right',
            }}
          >
            PNG, JPG, SVG, PDF
          </p>
        </div>
      </div>

      {/* ── Global tokens: Typography + Palette ──────────────────────── */}
      <div className="mb-10">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '10px' }}>
          Global Tokens — All Chart Types
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)' }}>

          {/* Left: Typography */}
          <div style={{ borderRight: '1px solid var(--border)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Typography</p>
              <button onClick={addTypeRow} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', padding: 0 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
              ><Plus size={9} /> Add</button>
            </div>
            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dvType.map((t, i) => (
                <DvTypeEditRow key={t.id} row={t} isLast={i === dvType.length - 1}
                  onRoleChange={v => updateTypeRole(t.id, v)}
                  onSpecChange={v => updateTypeSpec(t.id, v)}
                  onDelete={() => removeTypeRow(t.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: Palette */}
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Palette</p>
              <button onClick={addPaletteRow} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', padding: 0 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
              ><Plus size={9} /> Add</button>
            </div>
            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dvPalette.map((p, i) => {
                const isVeryLight = p.hex === '#f8fffb' || p.hex === '#ffffff';
                return (
                  <DvPaletteEditRow key={p.id} row={p} isLast={i === dvPalette.length - 1} isVeryLight={isVeryLight}
                    colorInputRef={el => { colorInputRefs.current[p.id] = el; }}
                    onHexChange={v => updatePaletteHex(p.id, v)}
                    onLabelChange={v => updatePaletteLabel(p.id, v)}
                    onDelete={() => removePaletteRow(p.id)}
                    onSwatchClick={() => colorInputRefs.current[p.id]?.click()}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart examples grid ───────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* ── Chart 1: Table infographic ──────────────────────────────── */}
        <div>
          <ChartExampleLabel index={1} title="Table Infographic — Numbered List Format" />

          <div
            style={{
              border: '1.6px solid #009b32',
              backgroundColor: '#f8fffb',
              padding: '24px 24px 16px',
            }}
          >
            {/* Chart headline */}
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#001408',
                lineHeight: 1.2,
                marginBottom: '6px',
              }}
            >
              15 Ways to Get Cited
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                color: '#001408',
                marginBottom: '18px',
                lineHeight: 1.5,
              }}
            >
              Pages updated within 3 months are 3× more likely to appear.
            </p>

            {/* Table */}
            <div style={{ border: '1px solid #009b32' }}>
              {/* Header row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  backgroundColor: '#009b32',
                }}
              >
                {['WHAT IS IT', 'DESCRIPTION'].map(h => (
                  <div key={h} style={{ padding: '7px 12px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        fontWeight: 500,
                        color: '#ffffff',
                        letterSpacing: '0.10em',
                      }}
                    >
                      {h}
                    </span>
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {TABLE_ROWS.map((row, i) => (
                <div
                  key={row.num}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                    backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fffb',
                    borderTop: '1px solid #009b32',
                  }}
                >
                  <div
                    style={{
                      padding: '9px 12px',
                      borderRight: '1px solid #009b32',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#009b32',
                      }}
                    >
                      {row.num}. {row.label}
                    </span>
                  </div>
                  <div style={{ padding: '9px 12px' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        color: '#001408',
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {row.parts.map((part, pi) => (
                        <span
                          key={pi}
                          style={{
                            fontWeight: part.bold ? 700 : 400,
                            color: part.bold ? '#009b32' : '#001408',
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <AirOpsWordmark />
            </div>
          </div>

          <ChartCaption>
            bg #f8fffb · outer border 1.6px #009b32 · col header bg #009b32 · rows alternate #fff /
            #f8fffb · numbered items in bold #009b32 · stats bolded #009b32 in description
          </ChartCaption>
        </div>

        {/* ── Chart 2: Numbered list ───────────────────────────────────── */}
        <div>
          <ChartExampleLabel
            index={2}
            title="Numbered List — Simple Two-Column with Large Number"
          />

          <div
            style={{
              border: '1px solid #009b32',
              backgroundColor: '#ffffff',
              padding: '24px 24px 16px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: '#001408',
                lineHeight: 1.2,
                marginBottom: '20px',
              }}
            >
              Internal Linking<br />Best Practices
            </p>

            <div style={{ border: '1px solid #009b32' }}>
              {LIST_ROWS.map((row, i) => (
                <div
                  key={row.num}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '68px 1fr',
                    backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fffb',
                    borderBottom:
                      i < LIST_ROWS.length - 1 ? '1px solid #009b32' : 'none',
                  }}
                >
                  <div
                    style={{
                      padding: '16px 12px',
                      borderRight: '1px solid #009b32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '30px',
                        fontWeight: 400,
                        color: '#009b32',
                        lineHeight: 1,
                      }}
                    >
                      {row.num}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '16px 14px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: '#001408',
                        lineHeight: 1.5,
                      }}
                    >
                      {row.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <AirOpsWordmark />
            </div>
          </div>

          <ChartCaption>
            number col: serif large, green · rows alternate white/#f8fffb · outer + dividers 1px #009b32
          </ChartCaption>
        </div>
      </div>

      {/* ── Chart 3: Line chart (full-width) ─────────────────────────── */}
      <div className="mt-10">
        <ChartExampleLabel index={3} title="Line Chart — Time Series with Projection" />

        <div
          style={{
            border: '1px solid #009b32',
            backgroundColor: '#ffffff',
            padding: '24px 24px 16px',
            maxWidth: '560px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#001408',
              marginBottom: '18px',
            }}
          >
            ChatGPT vs Google Traffic
          </p>

          <div
            style={{
              border: '1px solid #009b32',
              paddingTop: '12px',
              paddingRight: '12px',
              marginBottom: '14px',
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={LINE_DATA}
                margin={{ top: 4, right: 36, bottom: 4, left: 0 }}
              >
                <CartesianGrid
                  stroke="#a9a9a9"
                  strokeWidth={0.5}
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="x"
                  tick={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fill: '#a9a9a9',
                  }}
                  axisLine={{ stroke: '#a9a9a9', strokeWidth: 0.5 }}
                  tickLine={false}
                  tickMargin={6}
                />
                <YAxis
                  tick={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fill: '#a9a9a9',
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => (v === 0 ? '0' : `${v}B`)}
                  width={28}
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                />
                <Line
                  dataKey="chatgpt"
                  stroke="#009b32"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  label={false as unknown as undefined}
                />
                <Line
                  dataKey="google"
                  stroke="#eeff8c"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  dataKey="chatgptP"
                  stroke="#009b32"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  strokeOpacity={0.6}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-6 mb-3">
            <div className="flex items-center gap-2">
              <div style={{ width: '22px', height: '2px', backgroundColor: '#009b32' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#001408' }}>ChatGPT</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '22px', height: '2px', backgroundColor: '#eeff8c', border: '0.5px solid #ccc' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#001408' }}>Google</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="22" height="4" style={{ overflow: 'visible' }}>
                <line x1="0" y1="2" x2="22" y2="2" stroke="#009b32" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.6" />
              </svg>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#001408' }}>Projection</span>
            </div>
          </div>

          <div className="flex justify-end">
            <AirOpsWordmark />
          </div>
        </div>

        <ChartCaption>
          chart area: white bg, 1px #009b32 border · lines: #009b32 (data), #eeff8c (comparison) ·
          axes: DM Mono 9px #a9a9a9 · projections: dashed stroke, 0.6 opacity
        </ChartCaption>
      </div>

      {/* ── Imported examples ─────────────────────────────────────────── */}
      {imported.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          {/* Sub-section label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
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
              }}
            >
              Imported Examples — {imported.length} file{imported.length === 1 ? '' : 's'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
              aria-label="Add more examples"
            >
              <Upload size={9} /> Add more
            </button>
          </div>

          {/* Gallery grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {imported.map((ex, idx) => (
              <div
                key={ex.id}
                style={{
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--muted)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeExample(ex.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    zIndex: 1,
                    padding: 0,
                    color: 'var(--color-text-secondary)',
                  }}
                  aria-label={`Remove ${ex.name}`}
                >
                  <X size={10} />
                </button>

                {/* Example index badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '2px 6px',
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '8px',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {idx + 4}
                  </span>
                </div>

                {/* Image preview */}
                <div
                  style={{
                    height: '160px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--background)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {ex.url.startsWith('data:image') ? (
                    <img
                      src={ex.url}
                      alt={ex.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    /* PDF or unsupported — show filename icon */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '44px',
                          border: '1.5px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'var(--muted)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            fontWeight: 500,
                            color: 'var(--color-text-secondary)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          PDF
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Name label — click to rename */}
                <div style={{ padding: '8px 10px' }}>
                  {ex.editingName ? (
                    <input
                      autoFocus
                      value={nameDraft}
                      onChange={e => setNameDraft(e.target.value)}
                      onBlur={() => commitRename(ex.id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitRename(ex.id);
                        if (e.key === 'Escape')
                          setImported(prev =>
                            prev.map(x => ({ ...x, editingName: false })),
                          );
                      }}
                      style={{
                        width: '100%',
                        border: 'none',
                        borderBottom: '1px solid var(--primary)',
                        outline: 'none',
                        padding: '0 0 2px',
                        backgroundColor: 'transparent',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--foreground)',
                      }}
                      aria-label="Rename example"
                    />
                  ) : (
                    <span
                      onClick={() => startRename(ex.id, ex.name)}
                      title="Click to rename"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--foreground)',
                        cursor: 'text',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ex.name}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.04em',
                      marginTop: '2px',
                      display: 'block',
                    }}
                  >
                    Click name to rename
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty-state drop hint (only shown when no imports yet) */}
      {imported.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
          style={{
            marginTop: '32px',
            border: '1px dashed var(--border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          aria-label="Import chart examples drop zone"
        >
          <Upload size={16} color="var(--color-text-tertiary)" />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Import your own chart examples
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            PNG · JPG · SVG · PDF · up to multiple files
          </p>
        </div>
      )}

    </section>
  );
}