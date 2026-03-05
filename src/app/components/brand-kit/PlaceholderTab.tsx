import { Plus } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
  description: string;
  ctaLabel?: string;
}

export function PlaceholderTab({ title, description, ctaLabel }: PlaceholderTabProps) {
  return (
    <div style={{ padding: 'var(--space-8)' }}>
      {/* Section header */}
      <div style={{ marginBottom: 'var(--space-8)', maxWidth: '560px' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'var(--foreground)',
          marginBottom: 'var(--space-2)',
        }}>
          {title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      </div>

      {/* Empty state */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          border: '1.5px dashed var(--border)',
          padding: 'var(--space-24)',
          backgroundColor: 'var(--color-green-50)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--border)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Plus size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </div>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--foreground)',
          marginBottom: 'var(--space-1)',
        }}>
          {ctaLabel ?? `Add ${title}`}
        </p>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          maxWidth: '280px',
        }}>
          Define and organize your {title.toLowerCase()} to keep your brand consistent.
        </p>
        <button
          className="flex items-center gap-2 transition-all hover:opacity-80"
          style={{
            marginTop: 'var(--space-6)',
            padding: '8px 20px',
            backgroundColor: 'var(--primary)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: '#ffffff',
          }}
        >
          <Plus size={13} />
          {ctaLabel ?? `Add ${title}`}
        </button>
      </div>
    </div>
  );
}
