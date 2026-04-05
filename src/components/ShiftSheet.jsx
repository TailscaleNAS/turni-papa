import React, { useState, useEffect } from 'react';
import { SHIFTS } from '../constants';

export default function ShiftSheet({ day, month, year, currentShift, onSave, onClose }) {
  const [selected, setSelected] = useState(currentShift || null);

  useEffect(() => {
    setSelected(currentShift || null);
  }, [day, currentShift]);

  if (!day) return null;

  const dayNames = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
  const monthNames = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const dow = new Date(year, month, day).getDay();
  const dowIndex = dow === 0 ? 6 : dow - 1;
  const dateLabel = `${dayNames[dowIndex]} ${day} ${monthNames[month]}`;

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.sheet}>
        <div style={styles.handle} />
        <div style={styles.header}>
          <div>
            <div style={styles.title}>{dateLabel}</div>
            <div style={styles.sub}>
              {currentShift
                ? `Turno attuale: ${SHIFTS.find(s => s.id === currentShift)?.name}`
                : 'Nessun turno impostato'}
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.grid}>
          {SHIFTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{
                ...styles.shiftBtn,
                borderColor: selected === s.id ? s.color : 'transparent',
                background: selected === s.id ? s.bg : '#1e1e28',
              }}
            >
              <span style={{ ...styles.code, color: s.color }}>{s.code}</span>
              <span style={styles.nameWrap}>
                <span style={{ ...styles.name, color: s.color }}>{s.name}</span>
                <span style={styles.sub2}>{s.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          style={styles.saveBtn}
          onClick={() => selected && onSave(day, selected)}
          disabled={!selected}
        >
          Salva turno
        </button>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#17171f',
    borderRadius: '24px 24px 0 0',
    padding: '16px 20px 32px',
    zIndex: 11,
    animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
  },
  handle: {
    width: '36px',
    height: '4px',
    background: '#333',
    borderRadius: '2px',
    margin: '0 auto 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '17px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '3px',
  },
  sub: {
    fontSize: '12px',
    color: '#666',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 0 0 12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '14px',
  },
  shiftBtn: {
    borderRadius: '12px',
    padding: '10px',
    border: '1.5px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s',
    textAlign: 'left',
  },
  code: {
    fontSize: '17px',
    fontWeight: 800,
    fontFamily: "'Syne', sans-serif",
    minWidth: '28px',
  },
  nameWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  name: {
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
  },
  sub2: {
    fontSize: '10px',
    color: '#555',
    fontFamily: "'DM Sans', sans-serif",
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    background: '#fff',
    color: '#0f0f13',
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
