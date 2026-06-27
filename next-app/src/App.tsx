// import { Button } from "@/components/ui/button"
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Lightfall from './components/Lightfall';

export function App() {
  const navigate = useNavigate();
  const [noPos, setNoPos] = useState<{ top: string; left: string } | null>(null);

  const dodgeCursor = useCallback(() => {
    const padding = 80;
    const btnW = 130;
    const btnH = 52;
    const maxX = window.innerWidth  - btnW - padding;
    const maxY = window.innerHeight - btnH - padding;
    const x = Math.random() * (maxX - padding) + padding;
    const y = Math.random() * (maxY - padding) + padding;
    setNoPos({ top: `${y}px`, left: `${x}px` });
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
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

      {/* Centered overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        pointerEvents: 'none',
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          textShadow: '0 0 40px rgba(166, 200, 255, 0.6), 0 4px 24px rgba(0,0,0,0.4)',
          margin: 0,
          userSelect: 'none',
        }}>
          untitled
        </h1>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          pointerEvents: 'all',
        }}>
          <button
            id="btn-yes"
            onClick={() => navigate('/yes')}
            style={{
              padding: '0.75rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #A6C8FF 0%, #5227FF 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 24px rgba(82, 39, 255, 0.5)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.07)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(82, 39, 255, 0.7)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(82, 39, 255, 0.5)';
            }}
          >
            Yes
          </button>

          {/* No button rendered inline until first hover, then floats freely */}
          {!noPos && (
            <button
              id="btn-no"
              style={{
                padding: '0.75rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                border: '2px solid rgba(255,255,255,0.35)',
                borderRadius: '999px',
                cursor: 'not-allowed',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                color: '#ffffff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={dodgeCursor}
            >
              No
            </button>
          )}
        </div>
      </div>

      {/* Floating No button that dodges the cursor */}
      {noPos && (
        <button
          id="btn-no"
          style={{
            position: 'fixed',
            top: noPos.top,
            left: noPos.left,
            padding: '0.75rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            border: '2px solid rgba(255,255,255,0.35)',
            borderRadius: '999px',
            cursor: 'not-allowed',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            transition: 'top 0.18s cubic-bezier(0.22,1,0.36,1), left 0.18s cubic-bezier(0.22,1,0.36,1)',
            zIndex: 9999,
          }}
          onMouseEnter={dodgeCursor}
        >
          No
        </button>
      )}
    </div>
  )
}

export default App
