import { useState } from 'react';
import { ChevronDown, FileText, Plus } from 'lucide-react';

const BRAND_KITS = [
  { id: 'airops',         label: 'AirOps' },
  { id: 'airops-2026',    label: 'AirOps 2026' },
  { id: 'airops-main',    label: 'AirOps Main' },
  { id: 'alex-linkedin',  label: 'Alex Linkedin' },
  { id: 'eu-actions',     label: '[EU] AirOps' },
  { id: 'matt-linkedin',  label: 'Matt Linkedin' },
  { id: 'ramp',           label: 'Ramp' },
  { id: 'sales-linkedin', label: 'Sales Linkedin' },
];

interface BrandKitListNavProps {
  activeKit: string;
  onSelect: (id: string) => void;
}

export function BrandKitListNav({ activeKit, onSelect }: BrandKitListNavProps) {
  return (
    <nav
      className="flex flex-col overflow-hidden"
      style={{
        width: '152px',
        height: '100%',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
      }}
      aria-label="Brand kits"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '0 10px', borderBottom: '1px solid var(--border)', height: '44px', flexShrink: 0 }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>
          Brand Kits
        </span>
        <ChevronDown size={11} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
      </div>

      {/* Kit list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', padding: '4px 0' }}>
        {BRAND_KITS.map(kit => {
          const isActive = kit.id === activeKit;
          return (
            <button
              key={kit.id}
              onClick={() => onSelect(kit.id)}
              className="w-full flex items-center gap-2 transition-colors"
              style={{
                padding: '5px 10px 5px 8px',
                backgroundColor: isActive ? 'var(--color-stroke-green)' : 'transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <FileText
                size={11}
                style={{ color: isActive ? 'var(--primary)' : 'var(--color-text-secondary)', flexShrink: 0 }}
              />
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: isActive ? 'var(--foreground)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 500 : 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {kit.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* New kit */}
      <div style={{ padding: 'var(--space-2)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          className="flex items-center gap-1.5 w-full transition-opacity hover:opacity-70"
          style={{
            border: '1px dashed var(--border)',
            backgroundColor: 'transparent', cursor: 'pointer',
            padding: '5px 8px',
            fontFamily: 'var(--font-sans)', fontSize: '11px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Plus size={10} style={{ flexShrink: 0 }} />
          New kit
        </button>
      </div>
    </nav>
  );
}
