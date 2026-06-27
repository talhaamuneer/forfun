// import { Button } from "@/components/ui/button"
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GridDistortion from './components/GridDistortion';

export function App() {
  const navigate = useNavigate();
  const [noPos, setNoPos] = useState<{ top: string; left: string } | null>(null);
  const floatingNoPos = noPos;

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
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GridDistortion
          imageSrc="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          grid={12}
          mouse={0.12}
          strength={0.18}
          relaxation={0.92}
          className="absolute inset-0"
        />
      </div>

      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'radial-gradient(circle at center, rgba(10, 16, 35, 0.08) 0%, rgba(10, 16, 35, 0.35) 100%)'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        backdropFilter: 'blur(1px)'
      }} />

      {/* Centered overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
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
          fontSize: 'clamp(2.5rem, 10vw, 4rem)',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          textShadow: '0 0 40px rgba(166, 200, 255, 0.6), 0 4px 24px rgba(0,0,0,0.4)',
          margin: 0,
          userSelect: 'none',
        }}>
          Would you go on a date with me zee?
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
              e.currentTarget.style.transform = 'scale(1.07)';
              e.currentTarget.style.boxShadow = '0 6px 32px rgba(82, 39, 255, 0.7)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(82, 39, 255, 0.5)';
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
      {floatingNoPos && (
        <button
          id="btn-no"
          style={{
            position: 'fixed',
            top: floatingNoPos.top,
            left: floatingNoPos.left,
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
