import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../firebase/config';

// ─── Set roles in Firebase Database manually ────────────────────────────────
// In Firebase Console → Realtime Database, add:
// {
//   "roles": {
//     "UID_OF_FATHER": "editor",
//     "UID_OF_VIEWER_1": "viewer",
//     "UID_OF_VIEWER_2": "viewer"
//   }
// }
// ────────────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser]   = useState(null);
  const [role, setRole]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await get(ref(db, `roles/${u.uid}`));
        setRole(snap.exists() ? snap.val() : 'viewer');
        setUser(u);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return { user, role, loading, signIn, signOut, isEditor: role === 'editor' };
}
