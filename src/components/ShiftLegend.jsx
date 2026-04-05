import React from 'react';
import { SHIFTS } from '../constants';

export default function ShiftLegend() {
  return (
    <div style={styles.wrap}>
      {SHIFTS.map(s => (
        <div key={s.id} style={styles.item}>
          <div style={{ ...styles.dot, background: s.color }} />
          <span style={{ ...styles.code, color: s.color }}>{s.code}</span>
          <span style={styles.name}>{s.name}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px 12px',
    padding: '14px 24px 10px',
    fontFamily: "'DM Sans', sans-serif",
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#777',
  },
  dot: {
    width: '22px',
    height: '5px',
    borderRadius: '3px',
    flexShrink: 0,
  },
  code: {
    fontSize: '10px',
    fontWeight: 700,
    minWidth: '28px',
    fontFamily: "'Syne', sans-serif",
  },
  name: {
    fontSize: '11px',
    color: '#666',
  },
};
