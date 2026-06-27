import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Lightfall from '../components/Lightfall';

// ─── helpers ────────────────────────────────────────────────────────────────
function getNext10Days() {
  const days: Date[] = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

const DAY_ABBR  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const WEEKEND_TIMES = [
  { time: '12:00 PM', label: 'Whole day to spend together, all on me ;)' },
  { time: '4:00 PM',  label: 'lunch date with coffee and dessert, and your pictures at golden hour by mee' },
  { time: '6:00 PM',  label: 'a yummy dinner in your prettiest outfit followed by a long night drive with your favourite songs' },
];
const WEEKDAY_TIMES = [
  { time: '1:00 PM',  label: 'are you taking lunch break early bubs?' },
  { time: '2:00 PM',  label: 'sounds like a good plan for coffee from ds' },
  { time: '3:00 PM',  label: 'very sus, did u use your lunch break for someone else pookie?' },
  
];
const ACTIVITIES_FOR_WEEKDAYS = [

  { emoji: '☕', label: 'Coffee (we can only go for coffee :( )', wide: true},

];
const ACTIVITIES = [
  { emoji: '🍝', label: 'Food' },
  { emoji: '🍹', label: 'Drinks' },
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🌳', label: 'Dolmen Mall' },
  { emoji: '🥊', label: 'Stationary Shopping' },
  { emoji: '🕵️', label: 'Arcade' },
  { emoji: '✨', label: "Readings/Liberty Books"},
  { emoji: '✨', label: "What would you like bubbles?"},
];

// ─── shared styles ───────────────────────────────────────────────────────────
const font = "'Inter', 'Segoe UI', sans-serif";

const glassCard = (selected: boolean): React.CSSProperties => ({
  background: selected
    ? 'rgba(166, 200, 255, 0.22)'
    : 'rgba(255,255,255,0.07)',
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

const sectionLabel: React.CSSProperties = {
  fontFamily: font,
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  color: 'rgba(166,200,255,0.65)',
  textTransform: 'uppercase',
  marginBottom: 10,
};

// ─── component ───────────────────────────────────────────────────────────────
export default function YesPage() {
  const navigate = useNavigate();
  const days = useMemo(() => getNext10Days(), []);

  const [selectedDay,      setSelectedDay]      = useState<number | null>(null);
  const [selectedTime,     setSelectedTime]     = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const isWeekend = selectedDay !== null
    ? [0, 6].includes(days[selectedDay].getDay())
    : false;

  const times = isWeekend ? WEEKEND_TIMES : WEEKDAY_TIMES;

  // Reset time & activity when day changes and the menu type flips
  function pickDay(i: number) {
    const wasWeekend = selectedDay !== null && [0,6].includes(days[selectedDay].getDay());
    const willBeWeekend = [0,6].includes(days[i].getDay());
    if (wasWeekend !== willBeWeekend) {
      setSelectedTime(null);
      setSelectedActivities([]);
    }
    setSelectedDay(i);
  }

  const activities = isWeekend ? ACTIVITIES : ACTIVITIES_FOR_WEEKDAYS;

  // toggle an activity in/out of the selection
  function toggleActivity(label: string) {
    setSelectedActivities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  }

  // CTA state
  const hasFood   = selectedActivities.includes('Food');
  const hasDrinks = selectedActivities.includes('Drinks');
  const hasAny    = selectedActivities.length > 0;
  let ctaText = 'Pick a time to continue';
  let ctaEnabled = false;
  if (selectedDay !== null && !selectedTime) {
    ctaText = 'Pick a time to continue';
  } else if (selectedTime && !hasAny) {
    ctaText = 'Pick an activity to continue';
  } else if (selectedTime && hasAny && selectedDay !== null) {
    const d = days[selectedDay];
    const dayStr = `${DAY_ABBR[d.getDay()]} ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
    if (hasFood) {
      ctaText = `Next — pick a cuisine 🍽️`;
    } else if (hasDrinks) {
      ctaText = `Lock in ${dayStr} at ${selectedTime} 🍹`;
    } else {
      ctaText = `Lock in ${dayStr} at ${selectedTime} 💕`;
    }
    ctaEnabled = true;
  }

  function handleCta() {
    if (!ctaEnabled || selectedDay === null || !selectedTime || !hasAny) return;
    const d = days[selectedDay];
    const dayStr = `${DAY_ABBR[d.getDay()]} ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
    if (hasFood) {
      navigate('/food', { state: { day: dayStr, time: selectedTime, otherActivities: selectedActivities.filter(a => a !== 'Food') } });
    } else if (hasDrinks) {
      navigate('/confirmed', { state: { day: dayStr, time: selectedTime, items: selectedActivities, emoji: '🍹' } });
    } else {
      navigate('/confirmed', { state: { day: dayStr, time: selectedTime, items: selectedActivities, emoji: '✨' } });
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* ── background ── */}
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

      {/* ── scrollable content ── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* top bar */}
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 24px 0', position: 'relative' }}>
          <button
            onClick={() => navigate('/')}
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
            STEP 2 OF 3
          </span>
        </div>

        {/* main card */}
        <div style={{
          width: '100%',
          maxWidth: 640,
          margin: '28px auto 100px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}>

          {/* heading */}
          <div>
            <h1 style={{ fontFamily: font, fontSize: 'clamp(2.2rem,7vw,3.2rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.03em', textShadow: '0 0 40px rgba(166,200,255,0.5)' }}>
              Pick a{' '}
              <span style={{ fontStyle: 'italic', color: '#A6C8FF' }}>time.</span>
            </h1>
            <p style={{ fontFamily: font, fontSize: '0.97rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
              You said yes (legally binding). Now the fun part — when are we doing this?
            </p>
          </div>

          {/* ── DAY ── */}
          <section>
            <p style={sectionLabel}>DAY</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
              {days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => pickDay(i)}
                  style={{
                    ...glassCard(selectedDay === i),
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 14px',
                    minWidth: 62,
                    background: selectedDay === i ? 'rgba(166,200,255,0.22)' : 'rgba(255,255,255,0.07)',
                    border: selectedDay === i ? '1.5px solid rgba(166,200,255,0.55)' : '1.5px solid rgba(255,255,255,0.12)',
                    boxShadow: selectedDay === i ? '0 0 28px 0 rgba(166,200,255,0.25)' : '0 2px 12px rgba(0,0,0,0.2)',
                    borderRadius: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                    transform: selectedDay === i ? 'scale(1.06)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontFamily: font, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: selectedDay === i ? '#A6C8FF' : 'rgba(255,255,255,0.5)' }}>
                    {DAY_ABBR[d.getDay()]}
                  </span>
                  <span style={{ fontFamily: font, fontSize: '1.3rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginTop: 2 }}>
                    {d.getDate()}
                  </span>
                  <span style={{ fontFamily: font, fontSize: '0.62rem', fontWeight: 600, color: selectedDay === i ? '#A6C8FF' : 'rgba(255,255,255,0.4)' }}>
                    {MONTH_ABBR[d.getMonth()]}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── TIME ── */}
          {selectedDay !== null && (
            <section style={{ animation: 'fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
              <p style={sectionLabel}>
                TIME · {isWeekend ? 'WEEKEND MENU' : 'WEEKDAY MENU'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {times.map(({ time, label }) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      ...glassCard(selectedTime === time),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '14px 18px',
                      width: '100%',
                      textAlign: 'left',
                      background: selectedTime === time ? 'rgba(166,200,255,0.22)' : 'rgba(255,255,255,0.07)',
                      border: selectedTime === time ? '1.5px solid rgba(166,200,255,0.55)' : '1.5px solid rgba(255,255,255,0.12)',
                      boxShadow: selectedTime === time ? '0 0 28px 0 rgba(166,200,255,0.25)' : '0 2px 12px rgba(0,0,0,0.2)',
                      borderRadius: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                      transform: selectedTime === time ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontFamily: font, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{time}</span>
                    <span style={{ fontFamily: font, fontSize: '0.82rem', color: 'rgba(166,200,255,0.7)', marginTop: 2 }}>{label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── WHAT ARE WE DOING ── */}
          {selectedTime && (
            <section style={{ animation: 'fadeSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
              <p style={sectionLabel}>WHAT ARE WE DOING?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {activities.map(({ emoji, label }) => {
                  const isOn = selectedActivities.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleActivity(label)}
                      style={{
                        ...glassCard(isOn),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 16px',
                        width: '100%',
                        textAlign: 'left',
                        background: isOn ? 'rgba(166,200,255,0.22)' : 'rgba(255,255,255,0.07)',
                        border: isOn ? '1.5px solid rgba(166,200,255,0.55)' : '1.5px solid rgba(255,255,255,0.12)',
                        boxShadow: isOn ? '0 0 28px 0 rgba(166,200,255,0.25)' : '0 2px 12px rgba(0,0,0,0.2)',
                        borderRadius: 16,
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                        transform: isOn ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
                      <span style={{ fontFamily: font, fontSize: '0.9rem', fontWeight: 600, color: '#fff', flex: 1 }}>{label}</span>
                      {isOn && <span style={{ fontSize: '0.8rem', color: '#A6C8FF', fontWeight: 700 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ── CTA ── */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 28px',
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(to top, rgba(10,41,255,0.85) 0%, transparent 100%)',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
        }}>
          <button
            disabled={!ctaEnabled}
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
          onClick={handleCta}
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
