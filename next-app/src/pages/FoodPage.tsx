import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lightfall from '../components/Lightfall';

const font = "'Inter', 'Segoe UI', sans-serif";

const CUISINES = [
  { emoji: '', label: 'Your favourite (sumo duh)' },
  { emoji: '', label: 'Sushi (from some other place pls)' },
  { emoji: '', label: 'Pizza' },
  { emoji: '', label: 'Chinese' },
  { emoji: '', label: 'I pick', wide: true },
];

const glassCard = (selected: boolean): React.CSSProperties => ({
  background: selected ? 'rgba(166,200,255,0.22)' : 'rgba(255,255,255,0.07)',
  border: selected
    ? '1.5px solid rgba(166,200,255,0.55)'
    : '1.5px solid rgba(255,255,255,0.12)',
  boxShadow: selected
    ? '0 0 28px 0 rgba(166,200,255,0.25), 0 4px 20px rgba(0,0,0,0.3)'
    : '0 2px 12px rgba(0,0,0,0.2)',
  borderRadius: 16,
  transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
  cursor: 'pointer',
  transform: selected ? 'scale(1.04)' : 'scale(1)',
});

export default function FoodPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // booking details forwarded via router state from YesPage
  const booking = (location.state as { day: string; time: string; otherActivities?: string[] } | null) ?? { day: '', time: '', otherActivities: [] };

  const [selected, setSelected] = useState<string | null>(null);

  const ctaEnabled = selected !== null;
  const ctaText = ctaEnabled ? `Lock in ${selected} ${CUISINES.find(c => c.label === selected)?.emoji}` : 'Pick a cuisine to continue';

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Lightfall
          colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
          backgroundColor="#0A29FF"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
        />
      </div>

      {/* scrollable content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* top bar */}
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 24px 0', position: 'relative' }}>
          <button
            onClick={() => navigate('/yes')}
            style={{
              position: 'absolute', left: 24,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999,
              color: '#fff',
              fontFamily: font,
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 16px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            ← back
          </button>
          <span style={{ fontFamily: font, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(166,200,255,0.7)', textTransform: 'uppercase' }}>
            STEP 3 OF 3
          </span>
        </div>

        {/* main content */}
        <div style={{ width: '100%', maxWidth: 640, margin: '28px auto 120px', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* booking summary pill */}
          {booking.day && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(166,200,255,0.12)',
              border: '1px solid rgba(166,200,255,0.25)',
              borderRadius: 999,
              padding: '6px 16px',
              alignSelf: 'flex-start',
              animation: 'fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
            }}>
              <span style={{ fontSize: '0.75rem' }}>📅</span>
              <span style={{ fontFamily: font, fontSize: '0.78rem', fontWeight: 600, color: 'rgba(166,200,255,0.85)' }}>
                {booking.day} · {booking.time} · Food 🍽️
              </span>
            </div>
          )}

          {/* heading */}
          <div style={{ animation: 'fadeSlideUp 0.45s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}>
            <h1 style={{ fontFamily: font, fontSize: 'clamp(2.2rem,7vw,3.2rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.03em', textShadow: '0 0 40px rgba(166,200,255,0.5)' }}>
              What are we{' '}
              <span style={{ fontStyle: 'italic', color: '#A6C8FF' }}>eating?</span>
            </h1>
            <p style={{ fontFamily: font, fontSize: '0.97rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
              The make-or-break question. Choose wisely (or don't, I'm easy).
            </p>
          </div>

          {/* cuisine grid */}
          <section style={{ animation: 'fadeSlideUp 0.45s 0.1s cubic-bezier(0.22,1,0.36,1) both' }}>
            <p style={{ fontFamily: font, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(166,200,255,0.65)', textTransform: 'uppercase', marginBottom: 12 }}>
              CUISINE
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CUISINES.map(({ emoji, label, wide }) => (
                <button
                  key={label}
                  onClick={() => setSelected(label)}
                  style={{
                    ...glassCard(selected === label),
                    gridColumn: wide ? '1 / -1' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 18px',
                    width: '100%',
                    textAlign: 'left',
                    background: selected === label ? 'rgba(166,200,255,0.22)' : 'rgba(255,255,255,0.07)',
                    border: selected === label ? '1.5px solid rgba(166,200,255,0.55)' : '1.5px solid rgba(255,255,255,0.12)',
                    boxShadow: selected === label ? '0 0 28px 0 rgba(166,200,255,0.25)' : '0 2px 12px rgba(0,0,0,0.2)',
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                    transform: selected === label ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{emoji}</span>
                  <span style={{ fontFamily: font, fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{label}</span>
                  {selected === label && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#A6C8FF', fontWeight: 700 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* CTA bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 28px',
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(to top, rgba(10,41,255,0.9) 0%, transparent 100%)',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
        }}>
          <button
            disabled={!ctaEnabled}
            onClick={() => {
              if (ctaEnabled && selected) {
                const cuisine = CUISINES.find(c => c.label === selected);
                const items = [selected, ...(booking.otherActivities ?? [])];
                navigate('/confirmed', {
                  state: {
                    day: booking.day,
                    time: booking.time,
                    items,
                    emoji: cuisine?.emoji || '🍽️',
                  },
                });
              }
            }}
            style={{
              fontFamily: font,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#fff',
              background: ctaEnabled
                ? 'linear-gradient(135deg, #A6C8FF 0%, #5227FF 100%)'
                : 'rgba(255,255,255,0.1)',
              border: ctaEnabled ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: 999,
              padding: '16px 32px',
              width: '100%',
              maxWidth: 600,
              cursor: ctaEnabled ? 'pointer' : 'default',
              boxShadow: ctaEnabled ? '0 4px 32px rgba(82,39,255,0.55)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
              transform: ctaEnabled ? 'scale(1)' : 'scale(0.98)',
              opacity: ctaEnabled ? 1 : 0.5,
            }}
            onMouseEnter={e => { if (ctaEnabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { if (ctaEnabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            {ctaText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
