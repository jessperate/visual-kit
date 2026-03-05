import { useState } from 'react';
import {
  Home, Search, Layers, Star, Clock, BarChart2,
  Lightbulb, FileText, MessageSquare, Bookmark,
  BookOpen, Package, Settings, Cpu, Trash2,
  Activity, GraduationCap, HelpCircle, ChevronRight, Plus,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  hasChevron?: boolean;
};

const TOP_NAV: NavItem[] = [
  { id: 'home',   label: 'Home',   icon: Home },
  { id: 'search', label: 'Search', icon: Search },
];
const ACTION_NAV: NavItem[] = [
  { id: 'browse',    label: 'Browse',    icon: Layers },
  { id: 'favorites', label: 'Favorites', icon: Star,  hasChevron: true },
  { id: 'recents',   label: 'Recents',   icon: Clock, hasChevron: true },
];
const INSIGHTS_NAV: NavItem[] = [
  { id: 'analytics',     label: 'Analytics',     icon: BarChart2 },
  { id: 'opportunities', label: 'Opportunities', icon: Lightbulb },
  { id: 'pages',         label: 'Pages',         icon: FileText },
  { id: 'prompts',       label: 'Prompts',       icon: MessageSquare },
  { id: 'citations',     label: 'Citations',     icon: Bookmark },
];
const CONTEXT_NAV: NavItem[] = [
  { id: 'brand-kits',      label: 'Brand Kits',      icon: Package },
  { id: 'knowledge-bases', label: 'Knowledge Bases', icon: BookOpen },
];
const BOTTOM_NAV: NavItem[] = [
  { id: 'settings',     label: 'Settings',      icon: Settings },
  { id: 'airops-mcp',   label: 'AirOps MCP',    icon: Cpu },
  { id: 'trash',        label: 'Trash',          icon: Trash2 },
  { id: 'usage',        label: 'Usage',          icon: Activity },
  { id: 'learning-hub', label: 'Learning Hub',   icon: GraduationCap },
  { id: 'help',         label: 'Help + Support', icon: HelpCircle },
];

function Item({
  item,
  isActive,
  onSelect,
}: {
  item: NavItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
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
      <item.icon
        size={13}
        style={{ color: isActive ? 'var(--primary)' : 'var(--color-text-secondary)', flexShrink: 0 }}
      />
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '12px',
        color: isActive ? 'var(--foreground)' : 'var(--color-text-secondary)',
        fontWeight: isActive ? 500 : 400,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {item.label}
      </span>
      {item.hasChevron && (
        <ChevronRight size={9} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
      )}
    </button>
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '9px',
      fontWeight: 500,
      color: 'var(--color-text-tertiary)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      padding: '10px 10px 3px',
    }}>
      {label}
    </p>
  );
}

export function LeftNav() {
  const [active, setActive] = useState('brand-kits');

  return (
    <nav
      className="flex flex-col overflow-hidden"
      style={{
        width: '136px',
        height: '100%',
        flexShrink: 0,
        backgroundColor: 'var(--background)',
        borderRight: '1px solid var(--border)',
      }}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: '0 10px',
          borderBottom: '1px solid var(--border)',
          height: '44px',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '20px', height: '20px',
          backgroundColor: 'var(--primary)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', color: 'var(--primary-foreground)', fontWeight: 400, lineHeight: 1 }}>A</span>
        </div>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          AirOps Growth
        </span>
      </div>

      {/* New button */}
      <div style={{ padding: 'var(--space-2)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          className="flex items-center gap-1.5 w-full transition-opacity hover:opacity-70"
          style={{ border: '1px solid var(--border)', backgroundColor: 'transparent', cursor: 'pointer', padding: '5px 8px', fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--foreground)' }}
        >
          <Plus size={10} style={{ flexShrink: 0 }} />
          New
        </button>
      </div>

      {/* Scrollable section */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', padding: '4px 0' }}>
        {TOP_NAV.map(i => <Item key={i.id} item={i} isActive={active === i.id} onSelect={() => setActive(i.id)} />)}
        <GroupLabel label="Actions" />
        {ACTION_NAV.map(i => <Item key={i.id} item={i} isActive={active === i.id} onSelect={() => setActive(i.id)} />)}
        <GroupLabel label="Insights" />
        {INSIGHTS_NAV.map(i => <Item key={i.id} item={i} isActive={active === i.id} onSelect={() => setActive(i.id)} />)}
        <GroupLabel label="Context" />
        {CONTEXT_NAV.map(i => <Item key={i.id} item={i} isActive={active === i.id} onSelect={() => setActive(i.id)} />)}
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '4px 0', flexShrink: 0 }}>
        {BOTTOM_NAV.map(i => <Item key={i.id} item={i} isActive={active === i.id} onSelect={() => setActive(i.id)} />)}
      </div>
    </nav>
  );
}
