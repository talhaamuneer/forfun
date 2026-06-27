import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lightfall from '../components/Lightfall';

const font = "'Inter', 'Segoe UI', sans-serif";

interface BookingState {
  day: string;
  time: string;
  items: string[];  // one or more activities/cuisines
  emoji: string;
}

// simple confetti particle
function Particle({ style }: { style: React.CSSProperties }) {
  return <div style={style} />;
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${1.4 + Math.random() * 1.2}s`,
      color: ['#A6C8FF', '#FF9FFC', '#ffffff', '#5227FF', '#FFD6A5'][Math.floor(Math.random() * 5)],
      size: `${6 + Math.random() * 8}px`,
      rotate: `${Math.random() * 360}deg`,
    }))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20, overflow: 'hidden' }}>
      {particles.map(p => (
        <Particle
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotate})`,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
            opacity: 0.9,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)   rotate(0deg)   scale(1);   opacity: 0.9; }
          80%  { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = (location.state as BookingState | null) ?? {
    day: 'Soon',
    time: 'TBD',
    items: ['something fun'],
    emoji: '✨',
  };

  const [showConfetti, setShowConfetti] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving');

  // Stop confetti after 3.5 s
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // Save booking to MongoDB via the Express API
  useEffect(() => {
    const save = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            day:   booking.day,
            time:  booking.time,
            items: booking.items,
          }),
        });
        if (!res.ok) throw new Error('Server error');
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save booking:', err);
        setSaveStatus('error');
      }
    };
    save();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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

      {/* confetti burst */}
      {showConfetti && <Confetti />}

      {/* content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
      }}>

        {/* big emoji */}
        <div style={{
          fontSize: 'clamp(4rem, 14vw, 8rem)',
          lineHeight: 1,
          animation: 'popIn 0.55s cubic-bezier(0.22,1,0.36,1) both',
          marginBottom: 28,
        }}>
          🎉
        </div>

        {/* headline */}
        <h1 style={{
          fontFamily: font,
          fontSize: 'clamp(2.4rem, 8vw, 4.5rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          textShadow: '0 0 60px rgba(166,200,255,0.6), 0 4px 30px rgba(0,0,0,0.4)',
          margin: '0 0 16px',
          animation: 'fadeSlideUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          It's a{' '}
          <span style={{ fontStyle: 'italic', color: '#A6C8FF' }}>date!</span>
        </h1>

        {/* summary card */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1.5px solid rgba(166,200,255,0.3)',
          borderRadius: 20,
          padding: '20px 32px',
          maxWidth: 480,
          width: '100%',
          animation: 'fadeSlideUp 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          marginBottom: 28,
        }}>
          <p style={{ fontFamily: font, fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: '#fff', margin: '0 0 10px', fontWeight: 700, lineHeight: 1.5 }}>
            {booking.day} · {booking.time}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {booking.items.map((act, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(166,200,255,0.12)',
                border: '1px solid rgba(166,200,255,0.28)',
                borderRadius: 999,
                padding: '6px 14px',
                alignSelf: 'flex-start',
              }}>
                <span style={{ fontFamily: font, fontSize: '0.88rem', fontWeight: 600, color: 'rgba(166,200,255,0.9)' }}>
                  {act}
                </span>
              </div>
            ))}
          </div>

          {/* save status dot */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: saveStatus === 'saved' ? '#6ee7b7' : saveStatus === 'error' ? '#fca5a5' : 'rgba(255,255,255,0.3)',
              transition: 'background 0.4s',
            }} />
            <span style={{ fontFamily: font, fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              {saveStatus === 'saved' ? 'saved' : saveStatus === 'error' ? 'could not save' : 'saving…'}
            </span>
          </div>
        </div>

        {/* sub-message */}
        <p style={{
          fontFamily: font,
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          color: 'rgba(255,255,255,0.6)',
          margin: '0 0 40px',
          animation: 'fadeSlideUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          see you my pretty 💗
        </p>

        {/* start over */}
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: font,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 999,
            padding: '10px 24px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.15s ease',
            animation: 'fadeSlideUp 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.16)';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
          }}
        >
          ← start over
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.4) rotate(-15deg); }
          70%  { transform: scale(1.15) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
