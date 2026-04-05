export const SHIFTS = [
  { id:'1',   color:'#4FC3F7', bg:'#0d2535', name:'Primo',     sub:'Mattino · 06:00–14:00' },
  { id:'2',   color:'#1D9E75', bg:'#0a2218', name:'Secondo',   sub:'Pomeriggio · 14:00–22:00' },
  { id:'3',   color:'#FFD600', bg:'#2e2a00', name:'Notte',     sub:'22:00–06:00' },
  { id:'R',   color:'#E24B4A', bg:'#2a0d0d', name:'Riposo',    sub:'Giorno libero' },
  { id:'PAR', color:'#D4537E', bg:'#2a0e1a', name:'Permesso',  sub:'Permesso annuale' },
  { id:'FER', color:'#C0392B', bg:'#2d0b09', name:'Ferie',     sub:'Ferie' },
  { id:'F',   color:'#D85A30', bg:'#2a1508', name:'Festivo',   sub:'Giorno festivo' },
  { id:'M',   color:'#8B5E3C', bg:'#2a1a0d', name:'Malattia',  sub:'Malattia o Infortunio' },
  { id:'104', color:'#9C6FE4', bg:'#1e1430', name:'Legge 104', sub:'Permesso L.104' },
];
export const SHIFT_MAP = Object.fromEntries(SHIFTS.map(s => [s.id, s]));
export const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
export const DAYS_IT   = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
export const WEEKDAYS_SHORT = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
