import { ref, set, get, onValue, off } from 'firebase/database';
import { db } from './config';

// ─── Shifts ────────────────────────────────────────────────────────────────

export function shiftsRef(year, month) {
  return ref(db, `shifts/${year}/${month}`);
}

export async function saveShift(year, month, day, shiftId) {
  await set(ref(db, `shifts/${year}/${month}/${day}`), shiftId);
}

export async function clearShift(year, month, day) {
  await set(ref(db, `shifts/${year}/${month}/${day}`), null);
}

export function subscribeToShifts(year, month, callback) {
  const r = shiftsRef(year, month);
  onValue(r, snap => callback(snap.val() || {}));
  return () => off(r);
}

// ─── FCM tokens (for sending push notifications) ───────────────────────────

export async function saveFcmToken(uid, token) {
  await set(ref(db, `fcmTokens/${uid}`), token);
}

export async function getAllFcmTokens() {
  const snap = await get(ref(db, 'fcmTokens'));
  if (!snap.exists()) return [];
  return Object.values(snap.val());
}
