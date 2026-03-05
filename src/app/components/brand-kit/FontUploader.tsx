import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Type, ChevronDown, Check, AlertCircle, FileType, Loader } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────

export type FontRole = 'heading' | 'body' | 'mono';

export interface CustomFont {
  id: string;
  name: string;       // CSS font-family name (used with FontFace API)
  displayName: string;// Human-readable name
  fileName: string;
  format: string;     // woff2, ttf, otf, woff
  url: string;        // blob URL
  size: string;       // formatted file size
  assignedRole: FontRole | null;
  status: 'loading' | 'ready' | 'error';
}

export interface FontAssignments {
  heading: string;
  body: string;
  mono: string;
}

interface FontUploaderProps {
  assignments: FontAssignments;
  onAssignmentsChange: (a: FontAssignments) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const ACCEPTED = ['.ttf', '.otf', '.woff', '.woff2'];
const ROLE_LABELS: Record<FontRole, string> = { heading: 'Heading', body: 'Body', mono: 'Mono' };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fontNameFromFile(fileName: string): string {
  return fileName
    .replace(/\.[^/.]+$/, '')         // remove extension
    .replace(/[-_]/g, ' ')            // dashes/underscores → spaces
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → spaces
    .trim();
}

// Sanitise into a valid CSS font-family name (no spaces, unique per font)
function cssFontName(displayName: string, id: string): string {
  return `BrandFont_${displayName.replace(/\s+/g, '_')}_${id.slice(0, 6)}`;
}

async function loadFontFace(name: string, url: string): Promise<void> {
  const face = new FontFace(name, `url(${url})`);
  const loaded = await face.load();
  document.fonts.add(loaded);
}

// ─── Role Selector Dropdown ─────────────────────────────────────────────────

function RoleDropdown({
  fontId,
  current,
  onChange,
}: {
  fontId: string;
  current: FontRole | null;
  onChange: (role: FontRole | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options: Array<{ value: FontRole | null; label: string }> = [
    { value: null, label: 'No role' },
    { value: 'heading', label: 'Heading' },
    { value: 'body', label: 'Body' },
    { value: 'mono', label: 'Mono' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all hover:opacity-80"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-weight-medium)',
          border: '1px solid var(--border)',
          backgroundColor: current ? 'var(--primary)' : 'var(--background)',
          color: current ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {current ? ROLE_LABELS[current] : 'Assign role'}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 py-1 z-50 min-w-32"
          style={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          }}
        >
          {options.map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 transition-all hover:opacity-70"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {opt.label}
              {current === opt.value && <Check size={11} style={{ color: 'var(--primary)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Font Card ──────────────────────────────────────────────────────────────

function FontCard({
  font,
  onRemove,
  onRoleChange,
}: {
  font: CustomFont;
  onRemove: (id: string) => void;
  onRoleChange: (id: string, role: FontRole | null) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 group transition-all"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Preview glyph */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: '48px', height: '48px', backgroundColor: 'var(--muted)' }}
      >
        {font.status === 'loading' && (
          <Loader size={16} style={{ color: 'var(--muted-foreground)', animation: 'spin 1s linear infinite' }} />
        )}
        {font.status === 'error' && (
          <AlertCircle size={16} style={{ color: 'var(--destructive)' }} />
        )}
        {font.status === 'ready' && (
          <span style={{ fontFamily: `${font.name}, sans-serif`, fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', lineHeight: 1, userSelect: 'none' }}>
            Aa
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: font.status === 'error' ? 'var(--destructive)' : 'var(--foreground)' }}>
            {font.displayName}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', padding: '2px 6px' }}>
            {font.format}
          </span>
          {font.status === 'loading' && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--muted-foreground)' }}>Loading…</span>}
          {font.status === 'error' && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--destructive)' }}>Failed to load</span>}
        </div>
        {font.status === 'ready' && (
          <p className="truncate" style={{ fontFamily: `${font.name}, sans-serif`, fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', letterSpacing: '0.02em' }}>
            The quick brown fox jumps over the lazy dog
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted-foreground)', marginTop: '2px' }}>{font.size}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {font.status === 'ready' && (
          <RoleDropdown fontId={font.id} current={font.assignedRole} onChange={(role) => onRoleChange(font.id, role)} />
        )}
        <button
          onClick={() => onRemove(font.id)}
          className="p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:opacity-60"
          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Active Assignment Pills ────────────────────────────────────────────────

function AssignmentPill({
  role,
  fontName,
  fontFamily,
}: {
  role: FontRole;
  fontName: string;
  fontFamily: string;
}) {
  const roleColors: Record<FontRole, string> = {
    heading: 'rgba(0,140,68,0.06)',
    body:    'rgba(0,255,100,0.06)',
    mono:    'rgba(238,255,140,0.15)',
  };
  const roleBorders: Record<FontRole, string> = {
    heading: 'rgba(0,140,68,0.2)',
    body:    'rgba(0,255,100,0.2)',
    mono:    'rgba(238,255,140,0.4)',
  };

  return (
    <div className="flex-1 p-4" style={{ backgroundColor: roleColors[role], border: `1px solid ${roleBorders[role]}` }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
        {ROLE_LABELS[role]}
      </p>
      <p style={{ fontFamily: `${fontFamily}, sans-serif`, fontSize: '28px', fontWeight: role === 'mono' ? 400 : 700, color: 'var(--foreground)', lineHeight: 1.1, marginBottom: '4px' }}>
        Aa
      </p>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fontName}
      </p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function FontUploader({ assignments, onAssignmentsChange }: FontUploaderProps) {
  const [fonts, setFonts] = useState<CustomFont[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Compute display name for each role's current assignment
  const roleDisplayName = (role: FontRole): string => {
    const assigned = fonts.find(f => f.assignedRole === role && f.status === 'ready');
    return assigned ? assigned.displayName : 'Inter (default)';
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return ACCEPTED.includes(ext);
    });

    if (validFiles.length === 0) {
      setError('Unsupported format. Please upload .ttf, .otf, .woff, or .woff2 files.');
      return;
    }
    if (fileArray.length > validFiles.length) {
      setError(`${fileArray.length - validFiles.length} file(s) skipped — unsupported format.`);
    }

    const newFonts: CustomFont[] = validFiles.map(file => {
      const id = Math.random().toString(36).slice(2, 10);
      const displayName = fontNameFromFile(file.name);
      const name = cssFontName(displayName, id);
      const format = file.name.split('.').pop()?.toLowerCase() ?? 'ttf';
      const url = URL.createObjectURL(file);
      return {
        id,
        name,
        displayName,
        fileName: file.name,
        format,
        url,
        size: formatBytes(file.size),
        assignedRole: null,
        status: 'loading' as const,
      };
    });

    setFonts(prev => [...prev, ...newFonts]);

    // Load each font face asynchronously
    for (const font of newFonts) {
      try {
        await loadFontFace(font.name, font.url);
        setFonts(prev =>
          prev.map(f => f.id === font.id ? { ...f, status: 'ready' } : f)
        );
      } catch {
        setFonts(prev =>
          prev.map(f => f.id === font.id ? { ...f, status: 'error' } : f)
        );
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = ''; // reset so re-uploading same file works
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    setFonts(prev => {
      const font = prev.find(f => f.id === id);
      if (font) {
        // Revoke blob URL
        URL.revokeObjectURL(font.url);
        // If it had a role, clear the assignment
        if (font.assignedRole) {
          onAssignmentsChange({
            ...assignments,
            [font.assignedRole]: 'Inter',
          });
        }
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleRoleChange = (id: string, role: FontRole | null) => {
    setFonts(prev => {
      const font = prev.find(f => f.id === id);
      if (!font) return prev;

      // Clear any other font that had this role
      const updated = prev.map(f => {
        if (f.id === id) return { ...f, assignedRole: role };
        if (role && f.assignedRole === role) return { ...f, assignedRole: null };
        return f;
      });

      // Update assignments
      const newAssignments = { ...assignments };
      if (role) {
        newAssignments[role] = font.name;
      } else if (font.assignedRole) {
        newAssignments[font.assignedRole] = 'Inter';
      }
      // If we displaced another font, reset the role that was cleared
      const displaced = prev.find(f => f.id !== id && role && f.assignedRole === role);
      if (displaced?.assignedRole) {
        // already cleared above by reassignment
      }
      onAssignmentsChange(newAssignments);

      return updated;
    });
  };

  const readyFonts = fonts.filter(f => f.status === 'ready');

  return (
    <div className="overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="flex items-center gap-2">
          <Type size={14} style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--foreground)' }}>
            Custom Fonts
          </span>
          {fonts.length > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', padding: '2px 6px' }}>
              {fonts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 transition-all hover:opacity-80"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer' }}
        >
          <Upload size={11} />
          Upload font
        </button>
        <input ref={fileInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" multiple onChange={handleFileInput} style={{ display: 'none' }} />
      </div>

      {/* Active role assignments */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Active Assignments
        </p>
        <div className="flex gap-3">
          {(['heading', 'body', 'mono'] as FontRole[]).map(role => (
            <AssignmentPill key={role} role={role} fontName={assignments[role]} fontFamily={assignments[role]} />
          ))}
        </div>
      </div>

      {/* Font list */}
      {fonts.length > 0 && (
        <div>
          {fonts.map(font => (
            <FontCard key={font.id} font={font} onRemove={handleRemove} onRoleChange={handleRoleChange} />
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        ref={dropRef}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-all"
        style={{ backgroundColor: dragging ? 'rgba(0,140,68,0.06)' : 'transparent', borderTop: fonts.length > 0 ? '1px solid var(--border)' : 'none' }}
      >
        <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: dragging ? 'rgba(0,140,68,0.1)' : 'var(--muted)' }}>
          <FileType size={15} style={{ color: dragging ? 'var(--primary)' : 'var(--muted-foreground)' }} />
        </div>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: dragging ? 'var(--primary)' : 'var(--foreground)' }}>
            {dragging ? 'Drop to upload' : 'Drop font files here'}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted-foreground)', marginTop: '2px', letterSpacing: '0.04em' }}>
            .ttf · .otf · .woff · .woff2
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderTop: '1px solid rgba(220,38,38,0.15)' }}>
          <AlertCircle size={12} style={{ color: 'var(--destructive)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}