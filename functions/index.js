// functions/index.js
// Deploy with: firebase deploy --only functions
// Install deps first: cd functions && npm install firebase-admin firebase-functions

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

const db = admin.database();

const SHIFT_NAMES = {
  '1':   'Primo (Mattino)',
  '2':   'Secondo (Pomeriggio)',
  '3':   'Notte',
  'R':   'Riposo',
  'PAR': 'Permesso annuale',
  'F':   'Festivo',
  'M':   'Malattia / Infortunio',
  '104': 'Legge 104',
};

const MONTHS_IT = [
  'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'
];

// Fires whenever a shift is written: shifts/{year}/{month}/{day}
exports.onShiftChanged = functions
  .region('europe-west1')
  .database.ref('shifts/{year}/{month}/{day}')
  .onWrite(async (change, context) => {
    const { year, month, day } = context.params;
    const newShift = change.after.val();
    if (!newShift) return null;

    const shiftName  = SHIFT_NAMES[newShift] || newShift;
    const monthName  = MONTHS_IT[parseInt(month)] || month;
    const title      = 'Turno aggiornato';
    const body       = `${day} ${monthName} ${year}: ${shiftName}`;

    const snap = await db.ref('fcmTokens').once('value');
    if (!snap.exists()) return null;

    const tokens = Object.values(snap.val()).filter(Boolean);
    if (tokens.length === 0) return null;

    const message = {
      notification: { title, body },
      tokens,
      android: { priority: 'high', notification: { channelId: 'turni_updates' } },
      apns:    { payload: { aps: { sound: 'default' } } },
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Notifiche inviate: ${response.successCount}/${tokens.length}`);
    return null;
  });
