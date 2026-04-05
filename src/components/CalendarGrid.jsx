import React from 'react';
import { SHIFT_MAP, WEEKDAYS_SHORT } from '../constants';

export default function CalendarGrid({ year, month, shifts, selectedDay, onDayPress, isEditor }) {
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const firstDow = new Date(year, month, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={styles.weekdays}>
        {WEEKDAYS_SHORT.map((w, i) => (
          <div key={w} style={{ ...styles.weekday, color: i >= 5 ? '#E24B4A' : '#555' }}>{w}</div>
        ))}
      </div>
      <div style={styles.grid}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const shift = shifts[d] ? SHIFT_MAP[shifts[d]] : null;
          const isToday = isCurrentMonth && d === today.getDate();
          const isSelected = d === selectedDay;

          return (
            <div
              key={d}
              onClick={() => onDayPress(d)}
              style={{
                ...styles.cell,
                borderColor: isSelected ? '#555' : '#252530',
                cursor: isEditor ? 'pointer' : 'default',
              }}
            >
              <span style={{
                ...styles.dayNum,
                ...(isToday ? styles.todayNum : {}),
              }}>{d}</span>

              {shift && (
                <>
                  <div style={{ ...styles.dot, background: shift.color }} />
                  <span style={{ ...styles.code, color: shift.color }}>{shift.code}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0 16px',
    gap: '4px',
    marginBottom: '6px',
  },
  weekday: {
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 500,
    padding: '4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    padding: '0 16px',
  },
  cell: {
    borderRadius: '12px',
    minHeight: '52px',
    padding: '6px 2px 5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    transition: 'transform 0.12s',
    background: '#1a1a22',
    border: '1px solid #252530',
  },
  dayNum: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#ccc',
    lineHeight: 1,
    fontFamily: "'DM Sans', sans-serif",
  },
  todayNum: {
    background: '#fff',
    color: '#0f0f13',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
  },
  dot: {
    width: '26px',
    height: '5px',
    borderRadius: '3px',
  },
  code: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.3px',
    fontFamily: "'DM Sans', sans-serif",
  },
};
