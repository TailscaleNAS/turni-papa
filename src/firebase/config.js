import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            "AIzaSyC6qh3TUdnIk4donXVs2ImBMSadUZ2OhFQ",
  authDomain:        "turni-sevel.firebaseapp.com",
  databaseURL:       "https://turni-sevel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "turni-sevel",
  storageBucket:     "turni-sevel.firebasestorage.app",
  messagingSenderId: "833989436186",
  appId:             "1:833989436186:web:3e2150c75af992d60542a3"
};

const app = initializeApp(firebaseConfig);

export const auth      = getAuth(app);
export const db        = getDatabase(app);
export const messaging = getMessaging(app);

export const VAPID_KEY = "YOUR_VAPID_KEY";

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token;
  } catch (err) {
    console.error('Errore permesso notifiche:', err);
    return null;
  }
}

export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}