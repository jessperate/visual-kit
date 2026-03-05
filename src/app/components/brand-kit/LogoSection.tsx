import { useState, useCallback, useRef } from 'react';
import { Download, Copy, Check, Upload, Plus, Trash2, Edit2, X } from 'lucide-react';

// ── Inline AirOps SVG ──────────────────────────────────────────────────────

function AirOpsLogo({ fill, size = 100 }: { fill: string; size?: number }) {
  const scale = size / 100;
  return (
    <svg width={100 * scale} height={32 * scale} viewBox="0 0 100 32" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="AirOps logo" role="img">
      <path d="M14.2683 8.35377V11.2588C12.9587 9.16447 10.9253 7.88086 8.40935 7.88086C3.03288 7.88086 0 11.833 0 17.1364C0 22.4735 3.06735 26.5608 8.47828 26.5608C10.9942 26.5608 12.9931 25.2772 14.2683 23.1829V26.0879H18.473V8.35377H14.2683ZM9.30543 23.0478C6.23809 23.0478 4.48039 20.2441 4.48039 17.1364C4.48039 14.0963 6.20362 11.4277 9.37436 11.4277C11.9937 11.4277 14.2339 13.2856 14.2339 17.0688C14.2339 20.7846 12.0971 23.0478 9.30543 23.0478Z" fill={fill} />
      <path d="M22.0938 8.35547V26.0896H26.5741V8.35547H22.0938Z" fill={fill} />
      <path d="M34.832 12.7461V8.3548H30.3516V26.0889H34.832V15.9551C34.832 13.3541 36.6586 12.307 38.3818 12.307C39.3813 12.307 40.4152 12.5772 40.9666 12.7799V8.05078C38.0372 8.05078 35.6246 9.77353 34.832 12.7461Z" fill={fill} />
      <path d="M42.0625 13.7594C42.0625 19.2655 45.9225 23.1839 51.4713 23.1839C57.0546 23.1839 60.8804 19.2655 60.8804 13.7594C60.8804 8.35475 57.0546 4.50391 51.4713 4.50391C45.9225 4.50391 42.0625 8.35475 42.0625 13.7594ZM56.3998 13.7594C56.3998 17.2049 54.5042 19.6708 51.4713 19.6708C48.404 19.6708 46.5429 17.2049 46.5429 13.7594C46.5429 10.4491 48.404 8.05073 51.4713 8.05073C54.5042 8.05073 56.3998 10.4491 56.3998 13.7594Z" fill={fill} />
      <path d="M73.3738 7.88086C70.7545 7.88086 68.6177 9.40093 67.4804 11.833V8.35377H63V31.9993H67.4804V22.9127C68.7556 25.1083 71.1336 26.5608 73.6496 26.5608C78.5435 26.5608 81.9555 22.8113 81.9555 17.4404C81.9555 11.7993 78.4057 7.88086 73.3738 7.88086ZM72.5811 23.2505C69.5827 23.2505 67.4804 20.7846 67.4804 17.2715C67.4804 13.6571 69.5827 11.1237 72.5811 11.1237C75.4417 11.1237 77.4751 13.7247 77.4751 17.4066C77.4751 20.8521 75.4417 23.2505 72.5811 23.2505Z" fill={fill} />
      <path d="M83.3906 19.9401C83.3906 23.1491 86.2856 26.5608 92.0757 26.5608C97.9002 26.5608 100.003 23.2167 100.003 20.6157C100.003 16.6297 95.212 15.9203 92.0068 15.3123C89.8355 14.9407 88.4569 14.6367 88.4569 13.4207C88.4569 12.0357 90.0078 11.1575 91.6621 11.1575C93.9023 11.1575 94.7639 12.6775 94.8329 14.2989H99.3133C99.3133 11.6641 97.4177 7.88086 91.5587 7.88086C86.4924 7.88086 83.9765 10.6845 83.9765 13.6909C83.9765 17.9809 88.836 18.42 92.0412 19.028C93.9023 19.3658 95.5221 19.7712 95.5221 21.0886C95.5221 22.406 93.9368 23.2842 92.248 23.2842C90.6626 23.2842 87.871 22.406 87.871 19.9401H83.3906Z" fill={fill} />
      <path d="M24.4093 6.19288C22.5697 6.19288 21.25 4.89943 21.25 3.13563C21.25 1.37184 22.5697 0 24.4093 0C26.1688 0 27.5685 1.37184 27.5685 3.13563C27.5685 4.89943 26.1688 6.19288 24.4093 6.19288Z" fill={fill} />
    </svg>
  );
}

// ── Logo colourway configurations ──────────────────────────────────────────

const LOGO_BACKGROUNDS = [
  { id: 'on-white',       label: 'On White',              bg: '#ffffff', logoFill: '#0B0E16', labelColor: '#a5aab6',            border: true,  token: '--background'         },
  { id: 'on-forest',      label: 'On Forest Dark',        bg: '#002910', logoFill: '#ffffff', labelColor: 'rgba(255,255,255,0.38)', border: false, token: '--color-green-600'   },
  { id: 'on-near-black',  label: 'On Near Black',         bg: '#000d05', logoFill: '#ffffff', labelColor: 'rgba(255,255,255,0.38)', border: false, token: '--color-near-black'  },
  { id: 'on-interaction', label: 'On Interaction Green',  bg: '#00ff64', logoFill: '#0B0E16', labelColor: 'rgba(0,13,5,0.45)',  border: false, token: '--color-interaction'  },
];

// ── Default data (initial state) ───────────────────────────────────────────

interface SizeRow { id: string; label: string; width: number; usage: string }
interface UsageRule { id: string; type: 'do' | 'dont'; rule: string }
interface UploadedLogo { id: string; name: string; url: string }

const DEFAULT_SIZES: SizeRow[] = [
  { id: 's1', label: 'Large',   width: 140, usage: 'Hero, OG images, keynote slides' },
  { id: 's2', label: 'Medium',  width: 100, usage: 'Navigation, email headers, print' },
  { id: 's3', label: 'Small',   width: 72,  usage: 'App headers, favicons context, badges' },
  { id: 's4', label: 'Minimum', width: 56,  usage: 'Absolute minimum — do not use below this' },
];

const DEFAULT_RULES: UsageRule[] = [
  { id: 'd1', type: 'do',   rule: 'Use the dark logo (#0B0E16) on all white and light-tinted backgrounds.' },
  { id: 'd2', type: 'do',   rule: 'Use the white logo on Forest Dark, Near Black, and any other dark backgrounds.' },
  { id: 'd3', type: 'do',   rule: 'Use the dark logo on Interaction Green — it has sufficient contrast at this luminance.' },
  { id: 'd4', type: 'do',   rule: 'Maintain the minimum clear space of 1× the cap-height of the "a" letterform on all sides.' },
  { id: 'x1', type: 'dont', rule: 'Never recolour the logo in any colour other than #0B0E16 (dark) or #ffffff (white).' },
  { id: 'x2', type: 'dont', rule: 'Never place the logo on low-contrast mid-tone backgrounds like Green 200 or tertiary surfaces.' },
  { id: 'x3', type: 'dont', rule: 'Never stretch, rotate, or alter the proportions of the wordmark.' },
  { id: 'x4', type: 'dont', rule: 'Never add drop shadows, outlines, or effects to the logo SVG.' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function CopyTokenButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', color: copied ? 'var(--primary)' : 'var(--color-text-secondary)', backgroundColor: 'var(--muted)', border: `1px solid ${copied ? 'var(--color-stroke-green)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.12s ease' }}
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}{text}
    </button>
  );
}

function downloadSVG(fill: string, filename: string) {
  const p = (d: string) => `<path d="${d}" fill="${fill}"/>`;
  const svgContent = `<svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">${p('M14.2683 8.35377V11.2588C12.9587 9.16447 10.9253 7.88086 8.40935 7.88086C3.03288 7.88086 0 11.833 0 17.1364C0 22.4735 3.06735 26.5608 8.47828 26.5608C10.9942 26.5608 12.9931 25.2772 14.2683 23.1829V26.0879H18.473V8.35377H14.2683ZM9.30543 23.0478C6.23809 23.0478 4.48039 20.2441 4.48039 17.1364C4.48039 14.0963 6.20362 11.4277 9.37436 11.4277C11.9937 11.4277 14.2339 13.2856 14.2339 17.0688C14.2339 20.7846 12.0971 23.0478 9.30543 23.0478Z')}${p('M22.0938 8.35547V26.0896H26.5741V8.35547H22.0938Z')}${p('M34.832 12.7461V8.3548H30.3516V26.0889H34.832V15.9551C34.832 13.3541 36.6586 12.307 38.3818 12.307C39.3813 12.307 40.4152 12.5772 40.9666 12.7799V8.05078C38.0372 8.05078 35.6246 9.77353 34.832 12.7461Z')}${p('M42.0625 13.7594C42.0625 19.2655 45.9225 23.1839 51.4713 23.1839C57.0546 23.1839 60.8804 19.2655 60.8804 13.7594C60.8804 8.35475 57.0546 4.50391 51.4713 4.50391C45.9225 4.50391 42.0625 8.35475 42.0625 13.7594ZM56.3998 13.7594C56.3998 17.2049 54.5042 19.6708 51.4713 19.6708C48.404 19.6708 46.5429 17.2049 46.5429 13.7594C46.5429 10.4491 48.404 8.05073 51.4713 8.05073C54.5042 8.05073 56.3998 10.4491 56.3998 13.7594Z')}${p('M73.3738 7.88086C70.7545 7.88086 68.6177 9.40093 67.4804 11.833V8.35377H63V31.9993H67.4804V22.9127C68.7556 25.1083 71.1336 26.5608 73.6496 26.5608C78.5435 26.5608 81.9555 22.8113 81.9555 17.4404C81.9555 11.7993 78.4057 7.88086 73.3738 7.88086ZM72.5811 23.2505C69.5827 23.2505 67.4804 20.7846 67.4804 17.2715C67.4804 13.6571 69.5827 11.1237 72.5811 11.1237C75.4417 11.1237 77.4751 13.7247 77.4751 17.4066C77.4751 20.8521 75.4417 23.2505 72.5811 23.2505Z')}${p('M83.3906 19.9401C83.3906 23.1491 86.2856 26.5608 92.0757 26.5608C97.9002 26.5608 100.003 23.2167 100.003 20.6157C100.003 16.6297 95.212 15.9203 92.0068 15.3123C89.8355 14.9407 88.4569 14.6367 88.4569 13.4207C88.4569 12.0357 90.0078 11.1575 91.6621 11.1575C93.9023 11.1575 94.7639 12.6775 94.8329 14.2989H99.3133C99.3133 11.6641 97.4177 7.88086 91.5587 7.88086C86.4924 7.88086 83.9765 10.6845 83.9765 13.6909C83.9765 17.9809 88.836 18.42 92.0412 19.028C93.9023 19.3658 95.5221 19.7712 95.5221 21.0886C95.5221 22.406 93.9368 23.2842 92.248 23.2842C90.6626 23.2842 87.871 22.406 87.871 19.9401H83.3906Z')}${p('M24.4093 6.19288C22.5697 6.19288 21.25 4.89943 21.25 3.13563C21.25 1.37184 22.5697 0 24.4093 0C26.1688 0 27.5685 1.37184 27.5685 3.13563C27.5685 4.89943 26.1688 6.19288 24.4093 6.19288Z')}</svg>`;
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Inline text edit cell ──────────────────────────────────────────────────

function InlineEdit({
  value, onSave, mono = false, placeholder = '', style = {},
}: {
  value: string; onSave: (v: string) => void; mono?: boolean; placeholder?: string; style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = () => { setDraft(value); setEditing(true); setTimeout(() => inputRef.current?.select(), 0); };
  const commit = () => { const t = draft.trim(); if (t) onSave(t); else setDraft(value); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <input ref={inputRef} value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
        placeholder={placeholder}
        style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 'inherit', color: 'var(--foreground)', background: 'var(--background)', border: '1px solid var(--primary)', padding: '2px 5px', outline: 'none', width: '100%', boxSizing: 'border-box', ...style }}
      />
    );
  }
  return (
    <span onClick={start} title="Click to edit"
      style={{ cursor: 'text', textDecoration: 'none', borderBottom: '1px dashed transparent', transition: 'border-color 0.12s ease', ...style }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--border)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
    >
      {value}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function LogoSection() {
  const [downloading, setDownloading]     = useState<string | null>(null);
  const [sizes, setSizes]                 = useState<SizeRow[]>(DEFAULT_SIZES);
  const [rules, setRules]                 = useState<UsageRule[]>(DEFAULT_RULES);
  const [uploads, setUploads]             = useState<UploadedLogo[]>([]);
  const [uploadFlash, setUploadFlash]     = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // ── Upload handlers ────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    Promise.all(files.map(f => new Promise<UploadedLogo>(res => {
      const reader = new FileReader();
      reader.onload = ev => res({ id: uid(), name: f.name.replace(/\.[^.]+$/, ''), url: ev.target!.result as string });
      reader.readAsDataURL(f);
    }))).then(items => {
      setUploads(prev => [...prev, ...items]);
      setUploadFlash(true);
      setTimeout(() => setUploadFlash(false), 2000);
    });
    e.target.value = '';
  };

  const handleDownload = (fill: string, filename: string, id: string) => {
    downloadSVG(fill, filename);
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1400);
  };

  // ── Size scale helpers ─────────────────────────────────────────────────
  const updateSize = (id: string, field: keyof SizeRow, value: string | number) =>
    setSizes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const deleteSize = (id: string) => setSizes(prev => prev.filter(s => s.id !== id));
  const addSize = () => setSizes(prev => [...prev, { id: uid(), label: 'New', width: 48, usage: 'Custom use' }]);

  // ── Usage rule helpers ─────────────────────────────────────────────────
  const updateRule = (id: string, rule: string) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, rule } : r));
  const deleteRule = (id: string) => setRules(prev => prev.filter(r => r.id !== id));
  const addRule = (type: 'do' | 'dont') =>
    setRules(prev => [...prev, { id: uid(), type, rule: 'New rule — click to edit' }]);

  const doRules   = rules.filter(r => r.type === 'do');
  const dontRules = rules.filter(r => r.type === 'dont');

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: 'var(--foreground)',
    background: 'var(--background)',
    border: '1px solid var(--primary)',
    padding: '2px 5px',
    outline: 'none',
    width: '52px',
  };

  return (
    <section aria-labelledby="logo-heading" style={{ marginBottom: '64px' }}>

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 id="logo-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--foreground)', marginBottom: '4px' }}>
            Logo & lockups
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            The AirOps wordmark — approved colourways and usage rules.
          </p>
        </div>

        {/* Upload logo CTA */}
        <div style={{ flexShrink: 0, marginLeft: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <button onClick={() => logoFileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500, color: uploadFlash ? 'var(--primary)' : 'var(--foreground)', backgroundColor: uploadFlash ? 'rgba(0,140,68,0.04)' : 'transparent', border: `1px solid ${uploadFlash ? 'var(--color-stroke-green)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            {uploadFlash ? <Check size={12} /> : <Upload size={12} />}
            {uploadFlash ? `${uploads.length} file${uploads.length !== 1 ? 's' : ''} uploaded` : 'Upload logo files'}
          </button>
          <input ref={logoFileInputRef} type="file" accept=".svg,.png,.jpg,.pdf" multiple style={{ display: 'none' }} aria-label="Upload logo files" onChange={handleLogoUpload} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>SVG, PNG, PDF</span>
        </div>
      </div>

      {/* ── Uploaded logo gallery ─────────────────────────────────────────── */}
      {uploads.length > 0 && (
        <div style={{ marginBottom: '24px', border: '1px solid var(--border)', padding: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Uploaded Files — {uploads.length}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {uploads.map(u => (
              <div key={u.id} style={{ position: 'relative', border: '1px solid var(--border)', backgroundColor: 'var(--muted)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '200px' }}>
                {u.url.startsWith('data:image') && (
                  <img src={u.url} alt={u.name} style={{ height: '28px', objectFit: 'contain', maxWidth: '60px' }} />
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>{u.name}</span>
                <button onClick={() => setUploads(prev => prev.filter(x => x.id !== u.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                  aria-label={`Remove ${u.name}`}><X size={11} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 2×2 background grid ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)', marginBottom: '1px' }}>
        {LOGO_BACKGROUNDS.map((variant, i) => {
          const isRightCol = i % 2 === 1;
          const isBottomRow = i >= 2;
          const filename = `airops-logo-${variant.id}.svg`;
          return (
            <div key={variant.id} className="group" style={{ position: 'relative', backgroundColor: variant.bg, borderRight: isRightCol ? 'none' : '1px solid var(--border)', borderBottom: isBottomRow ? 'none' : '1px solid var(--border)', outline: variant.border ? '1px solid var(--border)' : 'none', outlineOffset: variant.border ? '-1px' : '0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px 36px', minHeight: '160px' }}>
                <AirOpsLogo fill={variant.logoFill} size={128} />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: variant.labelColor, marginTop: '20px' }}>{variant.label}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', color: variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'var(--color-text-secondary)', padding: '2px 7px', backgroundColor: variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', border: `1px solid ${variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'var(--border)'}` }}>{variant.token}</span>
                <button onClick={() => handleDownload(variant.logoFill, filename, variant.id)} title={`Download ${variant.label} SVG`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: variant.logoFill === '#ffffff' ? '#ffffff' : 'var(--foreground)', backgroundColor: variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'var(--background)', border: `1px solid ${variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`, cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.12s ease' }}>
                  {downloading === variant.id ? <Check size={9} /> : <Download size={9} />}SVG
                </button>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: variant.logoFill, border: `1px solid ${variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.06em', color: variant.logoFill === '#ffffff' ? 'rgba(255,255,255,0.55)' : 'var(--color-text-secondary)' }}>{variant.logoFill.toUpperCase()} · logo fill</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Colour tokens row ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid var(--border)', borderTop: 'none', marginBottom: '32px' }}>
        {LOGO_BACKGROUNDS.map((variant, i) => (
          <div key={variant.id} style={{ padding: '12px 14px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: variant.bg, border: '1px solid var(--border)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground)', letterSpacing: '0.04em', fontWeight: 500 }}>{variant.bg.toUpperCase()}</span>
            </div>
            <CopyTokenButton text={variant.token} />
          </div>
        ))}
      </div>

      {/* ── Size scale (editable) ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Size Scale
          </p>
          <button onClick={addSize} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.06em', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
          ><Plus size={10} /> Add size</button>
        </div>

        <div style={{ border: '1px solid var(--border)' }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 32px', backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            {['Size · px', 'Preview', 'Usage', ''].map(h => (
              <div key={h} style={{ padding: '7px 14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</span>
              </div>
            ))}
          </div>

          {sizes.map((s, i) => {
            const isLast = i === sizes.length - 1;
            return (
              <div key={s.id} className="group" style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 32px', alignItems: 'center', borderBottom: isLast ? 'none' : '1px solid var(--border)', minHeight: '56px' }}>
                {/* Label + width editable */}
                <div style={{ padding: '10px 14px', borderRight: '1px solid var(--border)' }}>
                  <InlineEdit value={s.label} onSave={v => updateSize(s.id, 'label', v)} mono
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}
                  />
                  <SizeWidthEdit size={s} onChange={(w) => updateSize(s.id, 'width', w)} />
                </div>

                {/* Logo preview */}
                <div style={{ padding: '14px 20px', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                  <AirOpsLogo fill="#0B0E16" size={Math.min(s.width, 140)} />
                </div>

                {/* Usage editable */}
                <div style={{ padding: '14px 16px' }}>
                  <InlineEdit value={s.usage} onSave={v => updateSize(s.id, 'usage', v)}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}
                  />
                </div>

                {/* Delete */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => deleteSize(s.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    aria-label={`Delete ${s.label} size`}
                  ><Trash2 size={11} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Usage rules (editable) ────────────────────────────────────────── */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Usage Rules
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--border)' }}>

          {/* Do column */}
          <div style={{ borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Do</span>
              <button onClick={() => addRule('do')} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', padding: 0 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
              ><Plus size={9} /> Add</button>
            </div>
            {doRules.map((r, i) => (
              <EditableRuleRow key={r.id} rule={r} isLast={i === doRules.length - 1} accent="var(--primary)" glyph="✓" onSave={v => updateRule(r.id, v)} onDelete={() => deleteRule(r.id)} />
            ))}
          </div>

          {/* Don't column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Don't</span>
              <button onClick={() => addRule('dont')} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.06em', padding: 0 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
              ><Plus size={9} /> Add</button>
            </div>
            {dontRules.map((r, i) => (
              <EditableRuleRow key={r.id} rule={r} isLast={i === dontRules.length - 1} accent="var(--color-text-secondary)" glyph="✕" onSave={v => updateRule(r.id, v)} onDelete={() => deleteRule(r.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Editable size width cell ───────────────────────────────────────────────

function SizeWidthEdit({ size, onChange }: { size: SizeRow; onChange: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(size.width));

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n > 0) onChange(n);
    else setDraft(String(size.width));
    setEditing(false);
  };

  if (editing) {
    return (
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(String(size.width)); setEditing(false); } }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--foreground)', background: 'var(--background)', border: '1px solid var(--primary)', padding: '2px 5px', outline: 'none', width: '48px', letterSpacing: '0.04em' }}
      />
    );
  }
  return (
    <span onClick={() => { setDraft(String(size.width)); setEditing(true); }} title="Click to edit width"
      style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-tertiary)', letterSpacing: '0.04em', cursor: 'text', borderBottom: '1px dashed transparent', transition: 'border-color 0.12s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--border)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
    >{size.width}px</span>
  );
}

// ── Editable rule row ──────────────────────────────────────────────────────

function EditableRuleRow({ rule, isLast, accent, glyph, onSave, onDelete }: {
  rule: UsageRule; isLast: boolean; accent: string; glyph: string;
  onSave: (v: string) => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rule.rule);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const start = () => { setDraft(rule.rule); setEditing(true); setTimeout(() => textareaRef.current?.focus(), 0); };
  const commit = () => { const t = draft.trim(); if (t) onSave(t); else setDraft(rule.rule); setEditing(false); };
  const cancel = () => { setDraft(rule.rule); setEditing(false); };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: editing ? '10px 14px' : '11px 16px', borderBottom: isLast ? 'none' : '1px solid var(--border)', backgroundColor: editing ? 'var(--muted)' : hovered ? 'rgba(0,140,68,0.02)' : 'transparent', transition: 'background-color 0.12s ease', position: 'relative' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: accent, marginTop: '2px', flexShrink: 0 }}>{glyph}</span>

      {editing ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <textarea ref={textareaRef} value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); } if (e.key === 'Escape') cancel(); }}
            rows={2}
            style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--foreground)', lineHeight: 1.65, background: 'var(--background)', border: '1px solid var(--primary)', padding: '6px 8px', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={commit} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, color: 'var(--primary-foreground)', backgroundColor: 'var(--primary)', border: 'none', padding: '3px 8px', cursor: 'pointer' }}><Check size={10} /> Save</button>
            <button onClick={cancel} style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--border)', padding: '3px 8px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: rule.type === 'do' ? 'var(--foreground)' : 'var(--color-text-secondary)', lineHeight: 1.65 }}>{rule.rule}</p>
          <div style={{ display: 'flex', gap: '3px', flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.12s ease', marginTop: '1px' }}>
            <button onClick={start} title="Edit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', backgroundColor: 'var(--muted)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--foreground)' }}><Edit2 size={9} /></button>
            <button onClick={onDelete} title="Delete" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', backgroundColor: 'var(--muted)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><Trash2 size={9} /></button>
          </div>
        </>
      )}
    </div>
  );
}
