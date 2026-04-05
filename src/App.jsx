import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './hooks/useAuth';
import { useShifts } from './hooks/useShifts';
import { saveShift as saveShiftDb, clearShift as clearShiftDb } from './firebase/database';
import { requestNotificationPermission } from './firebase/config';
import { saveFcmToken } from './firebase/database';
import LoginScreen from './components/LoginScreen';
import ShiftLegend from './components/ShiftLegend';
import { SHIFTS, SHIFT_MAP, MONTHS_IT, DAYS_IT, WEEKDAYS_SHORT } from './constants';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
  @keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #0f0f13; font-family: 'DM Sans', sans-serif; }
`;

export default function App() {
  const { user, loading, signIn, signOut, isEditor } = useAuth();
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selDay, setSelDay]       = useState(null);
  const [selShifts, setSelShifts] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [multiMode, setMultiMode]         = useState(false);
  const [multiSelected, setMultiSelected] = useState(new Set());
  const [multiSheet, setMultiSheet]       = useState(false);
  const [zoomMode, setZoomMode]           = useState(false);
  const longPressTimer = useRef(null);

  const shifts = useShifts(year, month);

  useEffect(() => {
    if (user) {
      requestNotificationPermission().then(token => {
        if (token) saveFcmToken(user.uid, token);
      });
    }
  }, [user]);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    cancelMulti();
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    cancelMulti();
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    cancelMulti();
  }

  function getShiftArr(raw) { return raw ? (Array.isArray(raw) ? raw : [raw]) : []; }

  function cancelMulti() {
    setMultiMode(false);
    setMultiSelected(new Set());
  }

  function enterMultiMode(d) {
    setMultiMode(true);
    setMultiSelected(new Set([d]));
  }

  function toggleMultiDay(d) {
    setMultiSelected(prev => {
      const next = new Set(prev);
      if (next.has(d)) { next.delete(d); if (next.size === 0) { setMultiMode(false); } }
      else next.add(d);
      return next;
    });
  }

  function openDay(d) {
    if (!isEditor) return;
    const existing = getShiftArr(shifts[d]);
    setSelDay(d);
    setSelShifts([...existing]);
    setMultiSheet(false);
    setSheetOpen(true);
  }

  function openMultiSheet() {
    setSelShifts([]);
    setMultiSheet(true);
    setSheetOpen(true);
  }

  async function handleSave() {
    if (selShifts.length === 0) return;
    const val = selShifts.length === 1 ? selShifts[0] : selShifts;
    if (multiSheet && multiSelected.size > 0) {
      for (const d of multiSelected) await saveShiftDb(year, month, d, val);
      cancelMulti();
    } else if (selDay) {
      await saveShiftDb(year, month, selDay, val);
    }
    setSheetOpen(false);
    setSelDay(null);
  }

  async function handleClear() {
    if (!selDay) return;
    await clearShiftDb(year, month, selDay);
    setSheetOpen(false);
    setSelDay(null);
  }

  function toggleShift(id) {
    setSelShifts(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  }

  function closeSheet() {
    setSheetOpen(false);
    setSelDay(null);
  }

  const isThisMonth = today.getMonth() === month && today.getFullYear() === year;
  const firstDow = new Date(year, month, 1).getDay();
  const offset   = firstDow === 0 ? 6 : firstDow - 1;
  const dim      = new Date(year, month + 1, 0).getDate();
  const cells    = [...Array(offset).fill(null), ...Array.from({length: dim}, (_, i) => i + 1)];

  if (loading) return <div style={{minHeight:'100vh',background:'#0f0f13',display:'flex',alignItems:'center',justifyContent:'center',color:'#888',fontFamily:'DM Sans,sans-serif'}}>Caricamento...</div>;
  if (!user)   return <LoginScreen onLogin={signIn} />;

  return (
    <div style={{minHeight:'100vh',background:'#0f0f13',display:'flex',justifyContent:'center'}}>
      <style>{STYLES}</style>
      <div style={{width:'100%',maxWidth:'430px',minHeight:'100vh',background:'#0f0f13',paddingBottom:'40px',position:'relative'}}>

        {/* Status bar */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 24px 0',fontSize:'12px',color:'#888'}}>
          <span>{String(today.getHours()).padStart(2,'0')}:{String(today.getMinutes()).padStart(2,'0')}</span>
          <span style={{fontSize:'10px',background:'#FFB830',color:'#0f0f13',padding:'2px 8px',borderRadius:'20px',fontWeight:700}}>{isEditor ? 'EDITOR' : 'VIEWER'}</span>
          <button onClick={signOut} style={{background:'none',border:'none',color:'#555',fontSize:'12px',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Esci</button>
        </div>

        {/* Header */}
        <div style={{padding:'18px 24px 12px'}}>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'26px',fontWeight:800,color:'#fff',marginBottom:'2px',letterSpacing:'-0.5px'}}>I miei turni</h1>
          <p style={{fontSize:'13px',color:'#888'}}>{isEditor ? 'Tocca un giorno · tieni premuto per più giorni' : 'Visualizzazione turni'}</p>
        </div>

        {/* Month nav */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 24px 14px'}}>
          <button style={navBtnStyle} onClick={prevMonth}>‹</button>
          <span style={{fontFamily:'Syne,sans-serif',fontSize:'18px',fontWeight:700,color:'#fff'}}>{MONTHS_IT[month]} {year}</span>
          {!isThisMonth && <button style={todayBtnStyle} onClick={goToday}>Oggi</button>}
          <button style={{...navBtnStyle, ...(zoomMode ? {borderColor:'#FFB830',color:'#FFB830',background:'#2e2510'} : {})}} onClick={() => setZoomMode(z => !z)}>{zoomMode ? '⊖' : '⊕'}</button>
          <button style={navBtnStyle} onClick={nextMonth}>›</button>
        </div>

        {/* Weekday headers */}
        <div style={{display:'grid',gridTemplateColumns:`repeat(${zoomMode?4:7},1fr)`,padding:'0 12px',gap:'5px',marginBottom:'6px'}}>
          {zoomMode
            ? <div style={{gridColumn:'1/5',textAlign:'center',fontSize:'10px',color:'#555',padding:'4px 0'}}>Vista ingrandita — 4 giorni per riga</div>
            : WEEKDAYS_SHORT.map((w,i) => <div key={w} style={{textAlign:'center',fontSize:'11px',fontWeight:500,color:i>=5?'#E24B4A':'#555',padding:'4px 0',textTransform:'uppercase',letterSpacing:'0.5px'}}>{w}</div>)
          }
        </div>

        {/* Calendar grid */}
        <div style={{display:'grid',gridTemplateColumns:`repeat(${zoomMode?4:7},1fr)`,gap:'5px',padding:'0 12px'}}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e-${i}`} />;
            const isToday  = isThisMonth && d === today.getDate();
            const isMulti  = multiSelected.has(d);
            const dayShifts = getShiftArr(shifts[d]);
            const cellH = zoomMode ? '120px' : '100px';
            return (
              <div
                key={d}
                style={{
                  borderRadius: zoomMode ? '16px' : '12px',
                  minHeight: cellH,
                  padding: zoomMode ? '10px 4px 9px' : '8px 3px 7px',
                  cursor: isEditor ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  background: isMulti ? '#2e2510' : '#1a1a22',
                  border: `1px solid ${isMulti ? '#FFB830' : '#252530'}`,
                  transition: 'transform 0.1s', userSelect: 'none', overflow: 'hidden',
                }}
                onPointerDown={() => {
                  if (!isEditor) return;
                  longPressTimer.current = setTimeout(() => { longPressTimer.current = null; enterMultiMode(d); }, 500);
                }}
                onPointerUp={() => clearTimeout(longPressTimer.current)}
                onPointerCancel={() => clearTimeout(longPressTimer.current)}
                onClick={() => {
                  if (!isEditor) return;
                  if (longPressTimer.current === null && !multiMode) return;
                  if (multiMode) toggleMultiDay(d);
                  else openDay(d);
                }}
              >
                {isToday
                  ? <div style={{background:'#fff',color:'#0f0f13',borderRadius:'50%',width:zoomMode?'48px':'38px',height:zoomMode?'48px':'38px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:zoomMode?'28px':'22px',fontWeight:700,fontFamily:'Syne,sans-serif'}}>{d}</div>
                  : <div style={{fontSize:zoomMode?'32px':'24px',fontWeight:700,color:isMulti?'#FFB830':'#ccc',lineHeight:1,fontFamily:'Syne,sans-serif'}}>{d}</div>
                }
                {dayShifts.length > 0 && (
                  <div style={{display:'flex',flexDirection:'column',gap:'3px',width:'100%',alignItems:'center'}}>
                    {dayShifts.map(sid => {
                      const sh = SHIFT_MAP[sid]; if (!sh) return null;
                      return <div key={sid} style={{width:'88%',borderRadius:'6px',padding:zoomMode?'4px 0':'3px 0',textAlign:'center',fontSize:zoomMode?'17px':'13px',fontWeight:800,fontFamily:'Syne,sans-serif',lineHeight:1.3,background:sh.bg,color:sh.color,border:`1px solid ${sh.color}55`}}>{sh.id}</div>;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Multi-select bar */}
        {multiMode && multiSelected.size > 0 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#1a1a22',border:'1px solid #2e2510',borderRadius:'14px',margin:'10px 12px 0'}}>
            <span style={{fontSize:'13px',color:'#FFB830',fontWeight:500}}>{multiSelected.size} {multiSelected.size===1?'giorno selezionato':'giorni selezionati'}</span>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={cancelMulti} style={{padding:'7px 14px',borderRadius:'10px',border:'1px solid #2a2a35',background:'transparent',color:'#888',fontFamily:'DM Sans,sans-serif',fontSize:'13px',cursor:'pointer'}}>Annulla</button>
              <button onClick={openMultiSheet} style={{padding:'7px 14px',borderRadius:'10px',border:'none',background:'#FFB830',color:'#0f0f13',fontFamily:'Syne,sans-serif',fontSize:'13px',fontWeight:700,cursor:'pointer'}}>Assegna turno</button>
            </div>
          </div>
        )}

        <div style={{height:'1px',background:'#1e1e28',margin:'12px 24px 0'}} />
        <ShiftLegend />

        {/* Overlay */}
        {sheetOpen && <div onClick={closeSheet} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:10}} />}

        {/* Bottom sheet */}
        {sheetOpen && (
          <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:'430px',background:'#17171f',borderRadius:'24px 24px 0 0',padding:'16px 20px 40px',zIndex:11,animation:'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)'}}>
            <div style={{width:'36px',height:'4px',background:'#333',borderRadius:'2px',margin:'0 auto 14px'}} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px'}}>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:'17px',fontWeight:700,color:'#fff'}}>
                {multiSheet
                  ? `${multiSelected.size} ${multiSelected.size===1?'giorno':'giorni'} selezionati`
                  : (() => { const dow=new Date(year,month,selDay).getDay(); const di=dow===0?6:dow-1; return `${DAYS_IT[di]} ${selDay} ${MONTHS_IT[month]}`; })()
                }
              </div>
              <button onClick={closeSheet} style={{background:'none',border:'none',color:'#555',fontSize:'20px',cursor:'pointer',paddingLeft:'12px'}}>×</button>
            </div>
            <div style={{fontSize:'12px',color:'#666',marginBottom:'8px'}}>
              {selShifts.length > 0 ? 'Turni: ' + selShifts.map(s => SHIFT_MAP[s]?.name).join(' + ') : 'Nessun turno selezionato'}
            </div>
            {!multiSheet && <div style={{fontSize:'11px',color:'#555',marginBottom:'10px'}}>Puoi selezionare fino a <span style={{color:'#FFB830'}}>2 turni</span> per questo giorno</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'14px'}}>
              {SHIFTS.map(s => {
                const idx = selShifts.indexOf(s.id);
                const isActive = idx >= 0;
                return (
                  <button key={s.id} onClick={() => toggleShift(s.id)} style={{borderRadius:'12px',padding:'10px',border:`1.5px solid ${isActive?s.color:'transparent'}`,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',background:isActive?s.bg:'#1e1e28',textAlign:'left',opacity:idx===1?0.75:1}}>
                    <span style={{fontSize:'17px',fontWeight:800,fontFamily:'Syne,sans-serif',minWidth:'28px',color:s.color}}>{s.id}</span>
                    <span><span style={{fontSize:'12px',fontWeight:500,display:'block',color:s.color}}>{s.name}</span><span style={{fontSize:'10px',color:'#555',display:'block'}}>{s.sub}</span></span>
                  </button>
                );
              })}
            </div>
            <button onClick={handleSave} disabled={selShifts.length===0} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'none',background:selShifts.length===0?'#2a2a35':'#fff',color:selShifts.length===0?'#555':'#0f0f13',fontFamily:'Syne,sans-serif',fontSize:'15px',fontWeight:700,cursor:selShifts.length===0?'default':'pointer'}}>Salva turno</button>
            {!multiSheet && selDay && getShiftArr(shifts[selDay]).length > 0 && (
              <button onClick={handleClear} style={{width:'100%',padding:'10px',borderRadius:'14px',border:'1px solid #2a2a35',background:'transparent',color:'#666',fontFamily:'DM Sans,sans-serif',fontSize:'13px',cursor:'pointer',marginTop:'8px'}}>Rimuovi turno</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = { width:'32px',height:'32px',borderRadius:'50%',border:'1px solid #2a2a35',background:'#1a1a22',color:'#aaa',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center' };
const todayBtnStyle = { padding:'5px 14px',borderRadius:'20px',border:'1px solid #2a2a35',background:'#1a1a22',color:'#aaa',fontFamily:'DM Sans,sans-serif',fontSize:'12px',cursor:'pointer' };
