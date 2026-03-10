import { useState, useRef } from 'react';
import { Settings, MapPin, X } from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { FoundationsTab } from './FoundationsTab';
import { ProductLinesTab } from './ProductLinesTab';
import { ContentTypesTab } from './ContentTypesTab';
import { AudiencesTab } from './AudiencesTab';
import { RegionsTab } from './RegionsTab';
import { CustomVariablesTab } from './CustomVariablesTab';
import { LeftNav } from './LeftNav';
import { BrandKitListNav } from './BrandKitListNav';
import { CompletenessPanel, FoundationsCompleteness } from './CompletenessPanel';
import { SnapLanding } from './SnapLanding';

const TABS = [
  { id: 'overview',          label: 'Overview' },
  { id: 'foundations',       label: 'Foundations' },
  { id: 'product-lines',     label: 'Product Lines' },
  { id: 'content-types',     label: 'Content Types' },
  { id: 'audiences',         label: 'Audiences' },
  { id: 'regions',           label: 'Regions' },
  { id: 'custom-variables',  label: 'Custom Variables' },
] as const;

type TabId = typeof TABS[number]['id'];

const DEFAULT_COMPLETENESS: FoundationsCompleteness = {
  aboutBrand:       { filled: true,  wordCount: 421 },
  voiceTone:        { filled: true,  wordCount: 198 },
  authorPersona:    { filled: true,  wordCount: 162 },
  writingRules:     { count: 10 },
  brandColors:      { configured: true },
  typography:       { configured: true },
  illustrations:    { count: 3 },
  modelPermissions: { enabledCount: 2 },
  slideDesign:      { configured: true },
};

export default function BrandKit() {
  const [activeTab, setActiveTab]           = useState<TabId>('foundations');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [activeKit, setActiveKit]           = useState('airops-2026');
  const [completeness, setCompleteness]     = useState<FoundationsCompleteness>(DEFAULT_COMPLETENESS);
  const scrollContainerRef                  = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex overflow-hidden"
      style={{ height: '100vh', backgroundColor: 'var(--background)' }}
    >
      {/* ── Primary nav ────────────────────────────────────────────── */}
      <LeftNav />

      {/* ── Brand kit list ─────────────────────────────────────────── */}
      <BrandKitListNav activeKit={activeKit} onSelect={setActiveKit} />

      {/* ── Snap brand landing (full-bleed, replaces main column) ─── */}
      {activeKit === 'snap' && (
        <div className="flex-1 overflow-y-auto min-w-0">
          <SnapLanding />
        </div>
      )}

      {/* ── Main column ────────────────────────────────────────────── */}
      {activeKit !== 'snap' && <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Header ──────────────────────────────��─────────────────── */}
        <div
          className="flex-shrink-0 flex items-center justify-between"
          style={{
            height: '44px',
            padding: '0 var(--space-6)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h4 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--foreground)',
          }}>
            Brand Kit
          </h4>
          <button
            className="transition-opacity hover:opacity-50"
            style={{
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center',
            }}
            aria-label="Brand kit settings"
          >
            <Settings size={14} />
          </button>
        </div>

        {/* ── Tab bar ───────────────────────────────────────────────── */}
        <nav
          className="flex-shrink-0 flex items-end overflow-x-auto"
          style={{
            borderBottom: '1px solid var(--border)',
            paddingLeft: 'var(--space-6)',
            scrollbarWidth: 'none',
            height: '40px',
          }}
          aria-label="Brand Kit sections"
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap transition-colors"
                style={{
                  height: '100%',
                  padding: '0 var(--space-4)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--foreground)' : 'var(--color-text-secondary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive
                    ? '2px solid var(--primary)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ── Recommendation banner ─────────────────────────────────── */}
        {!bannerDismissed && activeTab === 'overview' && (
          <div
            className="flex-shrink-0 flex items-center justify-between"
            style={{
              padding: '8px var(--space-6)',
              backgroundColor: 'rgba(0,140,68,0.03)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={11} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
                color: 'var(--primary)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Recommendation
              </span>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)', marginLeft: '4px',
              }}>
                Add regions to localize your product messaging for specific geographic markets.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('regions')}
                className="transition-opacity hover:opacity-80"
                style={{
                  padding: '4px 12px',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 500,
                  backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Add Regions
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                className="transition-opacity hover:opacity-60"
                style={{
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center',
                }}
                aria-label="Dismiss recommendation"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── Tab content + optional right panel ───────────────────── */}
        <div className="flex flex-1 min-h-0">

          {/* Scrollable content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
            {activeTab === 'overview'    && <OverviewTab />}
            {activeTab === 'foundations' && (
              <FoundationsTab onCompletenessUpdate={setCompleteness} />
            )}
            {activeTab === 'product-lines'    && <ProductLinesTab />}
            {activeTab === 'content-types'    && <ContentTypesTab />}
            {activeTab === 'audiences'        && <AudiencesTab />}
            {activeTab === 'regions'          && <RegionsTab />}
            {activeTab === 'custom-variables' && <CustomVariablesTab />}
          </div>

          {/* Foundations completeness panel */}
          {activeTab === 'foundations' && (
            <CompletenessPanel completeness={completeness} scrollContainerRef={scrollContainerRef} />
          )}

        </div>
      </div>
      </div>}
    </div>
  );
}