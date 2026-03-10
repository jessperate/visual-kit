// Snap Inc Brand Guidelines — visual-kit landing page
// Typography: Barlow Condensed (web alt for Program Narrow OT), DM Sans (web alt for Ghost Sans)
// Colors: sourced directly from Snap Inc Brand Portal

const SNAP_COLORS_PRIMARY = [
  { name: 'Off-White',       hex: '#FBFBF5', rgb: '251, 251, 245', usage: '45% · Page backgrounds, light surfaces',  textColor: '#000000' },
  { name: 'Snapchat Yellow', hex: '#FFFC00', rgb: '255, 252, 0',   usage: '15% · Primary brand accent, CTAs',        textColor: '#000000' },
  { name: 'Black',           hex: '#000000', rgb: '0, 0, 0',       usage: '15% · Primary text, dark backgrounds',    textColor: '#FFFC00' },
  { name: 'Pale Yellow',     hex: '#FFFFE1', rgb: '255, 255, 225', usage: '10% · Subtle tints, hover states',        textColor: '#000000' },
];

const SNAP_COLORS_SECONDARY = [
  { name: 'Snapchat Blue',   hex: '#0FADFF', rgb: '15, 173, 255',  usage: '5%',  textColor: '#000000' },
  { name: 'Snapchat Red',    hex: '#FD2846', rgb: '253, 38, 70',   usage: '3%',  textColor: '#ffffff' },
  { name: 'Snapchat Green',  hex: '#2ECC4E', rgb: '46, 204, 78',   usage: '3%',  textColor: '#000000' },
  { name: 'Snapchat Purple', hex: '#B428FB', rgb: '180, 40, 251',  usage: '3%',  textColor: '#ffffff' },
];

const TYPE_ROLES = [
  {
    role: 'Hero Headline',
    font: 'Barlow Condensed',
    weight: '700',
    case: 'All-caps',
    leading: '95%',
    tracking: '-1%',
    note: 'Web alternative for Program Narrow OT Medium',
    sample: 'BIG BOLD STATEMENT.',
    sampleSize: 56,
    sampleFamily: "'Barlow Condensed', sans-serif",
    sampleWeight: 700,
  },
  {
    role: 'Section Title / Eyebrow',
    font: 'DM Sans',
    weight: '500',
    case: 'Title Case',
    leading: '120%',
    tracking: '0%',
    note: 'Web alternative for Ghost Sans Medium',
    sample: 'Eyebrows and Section Titles',
    sampleSize: 22,
    sampleFamily: "'DM Sans', sans-serif",
    sampleWeight: 500,
  },
  {
    role: 'Sub Headline',
    font: 'DM Sans',
    weight: '500',
    case: 'Sentence case',
    leading: '120%',
    tracking: '0%',
    note: 'Web alternative for Ghost Sans Medium',
    sample: 'Sub Headline',
    sampleSize: 34,
    sampleFamily: "'DM Sans', sans-serif",
    sampleWeight: 500,
  },
  {
    role: 'Body Copy',
    font: 'DM Sans',
    weight: '400',
    case: 'Sentence case',
    leading: '120%',
    tracking: '0%',
    note: 'Web alternative for Ghost Sans Regular',
    sample: 'This is body copy. Lorem ipsum dolor sit amet consectetur. Faucibus consequat odio rhoncus morbi cursus.',
    sampleSize: 15,
    sampleFamily: "'DM Sans', sans-serif",
    sampleWeight: 400,
  },
  {
    role: 'Fine Print',
    font: 'DM Sans',
    weight: '600',
    case: 'Sentence case',
    leading: '120%',
    tracking: '0%',
    note: 'Web alternative for Ghost Sans Semibold',
    sample: 'Additional small details and fine print.',
    sampleSize: 13,
    sampleFamily: "'DM Sans', sans-serif",
    sampleWeight: 600,
  },
];

const COLOR_RULES = [
  'Never set an accent color as a background flood.',
  'Never set Snap Yellow text on a White or Light Gray background flood.',
  'White text works on image/video backgrounds.',
  'Snap Yellow works as text on image/video backgrounds.',
  'Dark Yellow highlight is valid on Snap Yellow backgrounds.',
];

// Ghost SVG icon (Snapchat ghost)
function SnapGhost({ size = 32, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 6C34 6 21 19 21 35v24c-3 1-7 3-7 7 0 5 7 6 12 7 1 3 3 9 9 9 2 0 4-1 7-2 2 1 5 3 8 3s6-2 8-3c3 1 5 2 7 2 6 0 8-6 9-9 5-1 12-2 12-7 0-4-4-6-7-7V35C79 19 66 6 50 6Z"
        fill={color}
      />
    </svg>
  );
}

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#FFFC00',
  marginBottom: 24,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.1)',
  margin: '0 0 48px 0',
};

export function SnapLanding() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: '#000000',
        color: '#ffffff',
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '72px 64px 64px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <SnapGhost size={40} color="#FFFC00" />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '0.08em',
            color: '#ffffff',
            textTransform: 'uppercase',
          }}>
            Snap Inc
          </span>
        </div>

        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#FFFC00',
          marginBottom: 20,
        }}>
          Brand Essentials
        </div>

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 72,
          lineHeight: '92%',
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          color: '#ffffff',
          margin: '0 0 24px 0',
          maxWidth: 720,
        }}>
          Brand<br />Guidelines
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.55)',
          maxWidth: 520,
          margin: 0,
        }}>
          Snapchat's brand palette is intentionally minimal and refined. These guidelines govern how the brand is expressed across all media, partnerships, and communications.
        </p>
      </div>

      {/* ── Color Palette ─────────────────────────────────────────────────── */}
      <div style={{ padding: '48px 64px' }}>
        <div style={sectionHeadStyle}>Color Palette</div>

        {/* Primary palette */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Primary
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {SNAP_COLORS_PRIMARY.map(c => (
              <div key={c.hex} style={{ backgroundColor: c.hex, padding: '24px 20px 20px' }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  color: c.textColor,
                  marginBottom: 8,
                }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: c.textColor, opacity: 0.7, marginBottom: 4 }}>
                  {c.hex}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: c.textColor, opacity: 0.55, lineHeight: 1.4 }}>
                  {c.usage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary palette */}
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Secondary — sourced from app
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {SNAP_COLORS_SECONDARY.map(c => (
              <div key={c.hex} style={{ backgroundColor: c.hex, padding: '16px 20px 16px' }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: c.textColor,
                  marginBottom: 4,
                }}>
                  {c.name}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: c.textColor, opacity: 0.75, marginBottom: 2 }}>
                  {c.hex}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: c.textColor, opacity: 0.6 }}>
                  {c.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── Color Rules ───────────────────────────────────────────────────── */}
      <div style={{ padding: '0 64px 48px' }}>
        <div style={sectionHeadStyle}>Color Rules</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 720 }}>
          {COLOR_RULES.map((rule, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                backgroundColor: '#FFFC00',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                color: '#000000',
              }}>
                {i + 1}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.75)' }}>
                {rule}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── Typography ────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 64px 48px' }}>
        <div style={sectionHeadStyle}>Typography</div>

        <div style={{ marginBottom: 20, padding: '16px 20px', backgroundColor: 'rgba(255,252,0,0.06)', border: '1px solid rgba(255,252,0,0.15)' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Primary typefaces are <strong style={{ color: '#FFFC00' }}>Program Narrow OT</strong> (headlines) and <strong style={{ color: '#FFFC00' }}>Ghost Sans</strong> (body). Web alternates shown below are <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Barlow Condensed</strong> and <strong style={{ color: 'rgba(255,255,255,0.85)' }}>DM Sans</strong>.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {TYPE_ROLES.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '28px 0',
                gap: 48,
                alignItems: 'center',
              }}
            >
              {/* Meta */}
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                  {t.role}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                  <div>{t.font} · {t.weight}</div>
                  <div>Case: {t.case}</div>
                  <div>Leading: {t.leading} · Tracking: {t.tracking}</div>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#FFFC00', marginTop: 6, opacity: 0.7 }}>
                  {t.note}
                </div>
              </div>

              {/* Sample */}
              <div style={{
                fontFamily: t.sampleFamily,
                fontWeight: t.sampleWeight,
                fontSize: t.sampleSize,
                lineHeight: 1.15,
                color: '#ffffff',
                textTransform: i === 0 ? 'uppercase' : 'none',
                letterSpacing: i === 0 ? '-0.01em' : 'normal',
              }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── Logo System ───────────────────────────────────────────────────── */}
      <div style={{ padding: '0 64px 48px' }}>
        <div style={sectionHeadStyle}>Logo System</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 24 }}>
          {/* Ghost only */}
          <div style={{ backgroundColor: '#FBFBF5', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <SnapGhost size={64} color="#000000" />
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#000000', opacity: 0.5, textAlign: 'center' }}>Ghost — icon only</div>
          </div>

          {/* Wordmark + Ghost horizontal */}
          <div style={{ backgroundColor: '#FBFBF5', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SnapGhost size={40} color="#000000" />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: '#000000', textTransform: 'uppercase' }}>SNAPCHAT</span>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#000000', opacity: 0.5, textAlign: 'center' }}>Horizontal lockup</div>
          </div>

          {/* Wordmark on Yellow */}
          <div style={{ backgroundColor: '#FFFC00', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: '0.04em', color: '#000000', textTransform: 'uppercase' }}>SNAPCHAT</span>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#000000', opacity: 0.6, textAlign: 'center' }}>Wordmark on yellow</div>
          </div>
        </div>

        {/* Clear space rule */}
        <div style={{ padding: '20px 24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>Clear Space</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 360 }}>
              Keep clear space equal to or no less than half the height (0.5x) of the Snapchat wordmark on all sides. Minimum logo size: <strong style={{ color: '#ffffff' }}>30px tall</strong>. Ghost may scale to 16px for avatars/favicons.
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>Partnerships vs Collaborations</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 360 }}>
              <strong style={{ color: '#FFFC00' }}>Partnerships</strong>: Ghost <span style={{ color: '#ffffff' }}>|</span> Partner logo — 2pt rule, Ghost leads.<br/>
              <strong style={{ color: '#FFFC00' }}>Collaborations</strong>: Ghost <span style={{ color: '#ffffff' }}>×</span> Partner logo — equal weight, creating something new together.
            </div>
          </div>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── Slide Design ─────────────────────────────────────────────────── */}
      <div style={{ padding: '0 64px 64px' }}>
        <div style={sectionHeadStyle}>Presentation Design</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Yellow / Black hero slide preview */}
          <div style={{ backgroundColor: '#FFFC00', padding: '40px 36px', position: 'relative', minHeight: 200 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000000', opacity: 0.6, marginBottom: 12 }}>
              Introducing
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 40, lineHeight: '95%', textTransform: 'uppercase', color: '#000000', marginBottom: 12 }}>
              Headline<br />Goes Here
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, color: '#000000', opacity: 0.7, maxWidth: 280 }}>
              Body copy goes here. Keep it short and punchy.
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
              <SnapGhost size={24} color="#000000" />
            </div>
          </div>

          {/* Dark slide preview */}
          <div style={{ backgroundColor: '#111111', padding: '40px 36px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', minHeight: 200 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFC00', marginBottom: 12 }}>
              Agenda Headline
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 40, lineHeight: '95%', textTransform: 'uppercase', color: '#ffffff', marginBottom: 20 }}>
              This Is A<br />Divider Slide
            </div>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: '#FFFC00', width: 20 }}>0{n}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Put agenda line here</span>
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
              <SnapGhost size={24} color="rgba(255,255,255,0.3)" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{
        padding: '24px 64px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SnapGhost size={18} color="rgba(255,255,255,0.3)" />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            Snap Inc Brand Portal · 2025
          </span>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Confidential — internal use only
        </span>
      </div>
    </div>
  );
}
