import { useState, useCallback } from 'react';
import { Plus, Copy, Check, Trash2, Edit2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

type VariableType = 'text' | 'number' | 'list' | 'boolean';

interface CustomVariable {
  id: string;
  token: string;
  label: string;
  type: VariableType;
  defaultValue: string;
  description: string;
  usedIn: string[];
  required: boolean;
}

// ── Default data ───────────────────────────────────────────────────────────

const DEFAULT_VARIABLES: CustomVariable[] = [
  {
    id: 'var-1',
    token: '{{company_name}}',
    label: 'Company Name',
    type: 'text',
    defaultValue: 'AirOps',
    description: 'The full legal or display name of the company. Used in all formal copy, product pages, and email signatures.',
    usedIn: ['Blog Post', 'Email', 'Product Page', 'Case Study'],
    required: true,
  },
  {
    id: 'var-2',
    token: '{{primary_keyword}}',
    label: 'Primary Keyword',
    type: 'text',
    defaultValue: 'content engineering platform',
    description: 'The target search term for this piece. Drives on-page optimization, title structure, and meta description phrasing.',
    usedIn: ['Blog Post', 'SEO Landing Page', 'Product Page'],
    required: true,
  },
  {
    id: 'var-3',
    token: '{{audience_segment}}',
    label: 'Audience Segment',
    type: 'list',
    defaultValue: 'Content Manager',
    description: 'The primary target persona for this piece. Controls tone mode selection and messaging pillar emphasis in AI workflows.',
    usedIn: ['Blog Post', 'Email', 'LinkedIn Post', 'Thought Leadership'],
    required: true,
  },
  {
    id: 'var-4',
    token: '{{product_name}}',
    label: 'Product Name',
    type: 'list',
    defaultValue: 'Insights',
    description: 'The specific AirOps product or feature being written about. Keeps workflow outputs scoped to the right product context.',
    usedIn: ['Product Page', 'Blog Post', 'Email', 'Documentation'],
    required: false,
  },
  {
    id: 'var-5',
    token: '{{author_name}}',
    label: 'Author Name',
    type: 'text',
    defaultValue: '',
    description: 'Full name of the human author or byline. Required for thought leadership, case studies, and LinkedIn posts.',
    usedIn: ['Thought Leadership', 'Case Study', 'LinkedIn Post'],
    required: false,
  },
  {
    id: 'var-6',
    token: '{{target_region}}',
    label: 'Target Region',
    type: 'list',
    defaultValue: 'North America',
    description: 'Geographic market for this piece. Triggers localization rules — spelling, terminology, and platform references — from the Regions tab.',
    usedIn: ['Blog Post', 'Email', 'Product Page', 'SEO Landing Page'],
    required: false,
  },
  {
    id: 'var-7',
    token: '{{publish_date}}',
    label: 'Publish Date',
    type: 'text',
    defaultValue: '',
    description: 'Intended publication date in YYYY-MM-DD format. Used to calculate content freshness signals and trigger refresh workflows.',
    usedIn: ['Blog Post', 'SEO Landing Page', 'Thought Leadership'],
    required: false,
  },
  {
    id: 'var-8',
    token: '{{competitor_names}}',
    label: 'Competitor Names',
    type: 'list',
    defaultValue: 'Jasper, Writer, Clearscope',
    description: 'Comma-separated list of competitors relevant to this piece. Informs comparison framing and differentiation copy in AI workflows.',
    usedIn: ['Blog Post', 'SEO Landing Page', 'Thought Leadership'],
    required: false,
  },
  {
    id: 'var-9',
    token: '{{word_count_target}}',
    label: 'Word Count Target',
    type: 'number',
    defaultValue: '2000',
    description: 'Target word count for this content piece. AI workflows use this to calibrate depth, section count, and example density.',
    usedIn: ['Blog Post', 'SEO Landing Page', 'Case Study', 'Documentation'],
    required: false,
  },
  {
    id: 'var-10',
    token: '{{include_schema}}',
    label: 'Include Schema',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to generate JSON-LD structured data markup for this piece. Required true for all SEO landing pages.',
    usedIn: ['SEO Landing Page', 'Blog Post', 'Product Page'],
    required: false,
  },
];

const TYPE_COLORS: Record<VariableType, { bg: string; color: string; border: string }> = {
  text:    { bg: 'var(--muted)',               color: 'var(--foreground)',           border: 'var(--border)' },
  number:  { bg: 'var(--color-green-200)',      color: 'var(--primary)',              border: 'var(--color-stroke-green)' },
  list:    { bg: 'var(--color-accent-label)',   color: 'var(--color-near-black)',     border: 'var(--color-stroke-green)' },
  boolean: { bg: 'var(--color-near-black)',     color: '#ffffff',                     border: 'var(--color-near-black)' },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: VariableType }) {
  const cfg = TYPE_COLORS[type];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 7px',
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: cfg.color,
      }}
    >
      {type}
    </span>
  );
}

function CopyTokenButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }, [token]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy ${token}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: copied ? 'var(--primary)' : 'var(--foreground)',
        backgroundColor: 'var(--muted)',
        border: `1px solid ${copied ? 'var(--color-stroke-green)' : 'var(--border)'}`,
        cursor: 'pointer',
        transition: 'all 0.12s ease',
        letterSpacing: '0.02em',
      }}
    >
      {token}
      {copied ? <Check size={10} /> : <Copy size={10} />}
    </button>
  );
}

function VariableRow({
  variable,
  onDelete,
  isLast,
}: {
  variable: CustomVariable;
  onDelete: (id: string) => void;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(variable.defaultValue);

  return (
    <div
      className="group"
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 80px 1fr 180px 60px 36px',
        alignItems: 'center',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        minHeight: '52px',
      }}
    >
      {/* Token */}
      <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
        <CopyTokenButton token={variable.token} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              color: 'var(--foreground)',
              fontWeight: 500,
            }}
          >
            {variable.label}
          </span>
          {variable.required && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8px',
                color: 'var(--primary)',
                letterSpacing: '0.06em',
              }}
            >
              *req
            </span>
          )}
        </div>
      </div>

      {/* Type */}
      <div
        style={{
          padding: '12px 12px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TypeBadge type={variable.type} />
      </div>

      {/* Description */}
      <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.55,
          }}
        >
          {variable.description}
        </p>
      </div>

      {/* Used in */}
      <div
        style={{
          padding: '12px 12px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px',
          alignItems: 'flex-start',
        }}
      >
        {variable.usedIn.map(u => (
          <span
            key={u}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.04em',
              padding: '1px 5px',
              border: '1px solid var(--border)',
              whiteSpace: 'nowrap',
            }}
          >
            {u}
          </span>
        ))}
      </div>

      {/* Default value */}
      <div
        style={{
          padding: '12px 10px',
          borderRight: '1px solid var(--border)',
        }}
      >
        {editing ? (
          <input
            autoFocus
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditing(false); }}
            style={{
              width: '100%',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--foreground)',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--color-interaction)',
              padding: '2px 4px',
              outline: 'none',
            }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Click to edit default value"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: localValue ? 'var(--foreground)' : 'var(--color-text-tertiary)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'text',
              padding: 0,
              textAlign: 'left',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {localValue || '—'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '12px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
        }}
      >
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '3px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
          }}
          aria-label={`Edit ${variable.label}`}
        >
          <Edit2 size={11} />
        </button>
        <button
          onClick={() => onDelete(variable.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '3px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
          }}
          aria-label={`Delete ${variable.label}`}
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export function CustomVariablesTab() {
  const [variables, setVariables] = useState<CustomVariable[]>(DEFAULT_VARIABLES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<VariableType>('text');
  const [newDescription, setNewDescription] = useState('');

  const handleDelete = useCallback((id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  }, []);

  const handleAdd = () => {
    if (!newToken.trim() || !newLabel.trim()) return;
    const token = newToken.trim().startsWith('{{')
      ? newToken.trim()
      : `{{${newToken.trim().replace(/\s+/g, '_').toLowerCase()}}}`;
    setVariables(prev => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        token,
        label: newLabel.trim(),
        type: newType,
        defaultValue: '',
        description: newDescription.trim(),
        usedIn: [],
        required: false,
      },
    ]);
    setNewToken('');
    setNewLabel('');
    setNewType('text');
    setNewDescription('');
    setShowAddForm(false);
  };

  const typeOptions: VariableType[] = ['text', 'number', 'list', 'boolean'];

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
            Custom Variables
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
            }}
          >
            Dynamic tokens that inject live context into every workflow, agent, and content
            template. Click any token to copy it. Click a default value to edit it inline.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(v => !v)}
          className="flex items-center gap-2 transition-all hover:opacity-80"
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          <Plus size={13} />
          Add Variable
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div
          style={{
            border: '1px solid var(--color-interaction)',
            padding: '20px 24px',
            marginBottom: '12px',
            backgroundColor: 'rgba(0,255,100,0.02)',
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
              marginBottom: '16px',
            }}
          >
            New Variable
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 120px',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Token name
              </label>
              <input
                placeholder="e.g. company_name"
                value={newToken}
                onChange={e => setNewToken(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  padding: '7px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  borderRadius: 0,
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-interaction)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Label
              </label>
              <input
                placeholder="e.g. Company Name"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  padding: '7px 10px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  borderRadius: 0,
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-interaction)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Type
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as VariableType)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  padding: '7px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--background)',
                  outline: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                }}
              >
                {typeOptions.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              Description (optional)
            </label>
            <input
              placeholder="What does this variable do?"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                padding: '7px 10px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--foreground)',
                backgroundColor: 'var(--background)',
                outline: 'none',
                borderRadius: 0,
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--color-interaction)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={!newToken.trim() || !newLabel.trim()}
              style={{
                padding: '7px 20px',
                backgroundColor: newToken.trim() && newLabel.trim() ? 'var(--primary)' : 'var(--border)',
                color: newToken.trim() && newLabel.trim() ? '#ffffff' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: newToken.trim() && newLabel.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                transition: 'all 0.15s ease',
              }}
            >
              Add Variable
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '7px 16px',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ border: '1px solid var(--border)' }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 80px 1fr 180px 60px 36px',
            backgroundColor: 'var(--muted)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {['Token', 'Type', 'Description', 'Used in', 'Default', ''].map((h, i) => (
            <div key={i} style={{ padding: '9px 12px 9px', borderRight: i < 5 ? '1px solid var(--border)' : 'none' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 500,
                  color: 'var(--foreground)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {h}
              </span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {variables.map((v, i) => (
          <VariableRow
            key={v.id}
            variable={v}
            onDelete={handleDelete}
            isLast={i === variables.length - 1}
          />
        ))}

        {variables.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              No variables yet. Add your first one above.
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div
        className="flex items-center gap-6"
        style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.06em',
          }}
        >
          {variables.length} variable{variables.length !== 1 ? 's' : ''}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.06em',
          }}
        >
          {variables.filter(v => v.required).length} required
        </span>
        {(['text', 'number', 'list', 'boolean'] as VariableType[]).map(t => {
          const count = variables.filter(v => v.type === t).length;
          if (count === 0) return null;
          return (
            <div key={t} className="flex items-center gap-1.5">
              <TypeBadge type={t} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                ×{count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
