# Turni Papà — Guida Setup Completa

## Struttura del progetto

```
turni-papa/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── firebase-messaging-sw.js   ← service worker notifiche
│   ├── icon-192.png               ← icona app (da creare)
│   └── icon-512.png               ← icona app (da creare)
├── src/
│   ├── firebase/
│   │   ├── config.js              ← credenziali Firebase (da compilare)
│   │   └── database.js            ← helpers database
│   ├── hooks/
│   │   ├── useAuth.js             ← login/logout/ruolo
│   │   └── useShifts.js           ← sync turni in tempo reale
│   ├── components/
│   │   ├── LoginScreen.jsx
│   │   ├── CalendarGrid.jsx
│   │   ├── ShiftSheet.jsx         ← bottom sheet (solo editor)
│   │   └── ShiftLegend.jsx
│   ├── constants.js               ← definizione turni, mesi, giorni
│   ├── App.jsx                    ← componente principale
│   └── index.js                   ← entry point
├── functions/
│   └── index.js                   ← Cloud Function notifiche push
├── database.rules.json            ← regole sicurezza database
└── package.json
```

---

## STEP 1 — Crea il progetto Firebase

1. Vai su https://console.firebase.google.com
2. Clicca **"Aggiungi progetto"** → nome: `turni-papa`
3. Disabilita Google Analytics (non serve) → crea progetto

---

## STEP 2 — Abilita Authentication

1. Nel menu laterale: **Build → Authentication**
2. Clicca **"Inizia"**
3. Tab **"Sign-in method"** → abilita **Email/Password**
4. Tab **"Users"** → aggiungi gli utenti:
   - Email papà + password (es. `papa@turni.it`)
   - Email familiari + password (es. `famiglia@turni.it`)
5. Annota gli **UID** di ogni utente (colonna a sinistra nella tabella utenti)

---

## STEP 3 — Abilita Realtime Database

1. Nel menu: **Build → Realtime Database**
2. Clicca **"Crea database"**
3. Regione: **europe-west1 (Belgio)**
4. Modalità: **Modalità test** (le regole le importiamo dopo)
5. Importa le regole di sicurezza:
   - Vai su tab **"Regole"**
   - Incolla il contenuto di `database.rules.json`
   - Clicca **"Pubblica"**

6. Imposta i ruoli manualmente nel database:
   - Vai su tab **"Dati"**
   - Clicca **"+"** e aggiungi questo nodo:
   ```json
   {
     "roles": {
       "UID_DEL_PAPA": "editor",
       "UID_FAMILIARE_1": "viewer",
       "UID_FAMILIARE_2": "viewer"
     }
   }
   ```
   (Sostituisci con gli UID reali copiati dallo Step 2)

---

## STEP 4 — Abilita Cloud Messaging (notifiche push)

1. Nel menu: **Project Settings** (icona ingranaggio) → tab **"Cloud Messaging"**
2. Sezione **"Web Push certificates"** → clicca **"Generate key pair"**
3. Copia la **chiave VAPID** (la stringa lunga)

---

## STEP 5 — Copia le credenziali nell'app

1. In **Project Settings** → tab **"Le tue app"** → clicca **"</>  Web"**
2. Registra l'app con un nome (es. `turni-pwa`)
3. Copia l'oggetto `firebaseConfig` che ti mostra
4. Aprì `src/firebase/config.js` e sostituisci i valori `"YOUR_..."` con i tuoi
5. Sostituisci anche `VAPID_KEY` con la chiave copiata al punto 4
6. Fai lo stesso in `public/firebase-messaging-sw.js`

---

## STEP 6 — Installa e avvia l'app

```bash
# Installa dipendenze
npm install

# Avvia in locale (per testare)
npm start

# Compila per produzione
npm run build
```

---

## STEP 7 — Deploy Cloud Function (notifiche push)

```bash
# Installa Firebase CLI se non ce l'hai
npm install -g firebase-tools

# Login
firebase login

# Inizializza il progetto (nella cartella turni-papa)
firebase init

# Seleziona: Functions + Hosting + Database
# Progetto: turni-papa
# Lingua: JavaScript

# Installa dipendenze function
cd functions && npm install firebase-admin firebase-functions && cd ..

# Deploy tutto
firebase deploy
```

---

## STEP 8 — Installa sul telefono (PWA)

**Android:**
1. Apri Chrome sul telefono
2. Vai all'URL della tua app (dopo il deploy su Firebase Hosting)
3. Chrome mostra in automatico **"Aggiungi alla schermata Home"**
4. Accetta → l'app appare come un'app nativa

**Alternativa hosting gratuito:** Usa **Firebase Hosting** (già incluso nel progetto):
```bash
firebase deploy --only hosting
```
Ti darà un URL tipo `https://turni-papa.web.app`

---

## Icone app

Crea due immagini PNG quadrate:
- `icon-192.png` (192×192px)
- `icon-512.png` (512×512px)

Mettile in `/public`. Puoi usare qualsiasi tool grafico, o anche semplicemente una "T" gialla su sfondo scuro per cominciare.

---

## Riepilogo ruoli

| Utente | Ruolo | Cosa può fare |
|--------|-------|---------------|
| Papà | `editor` | Vedere + modificare turni |
| Famiglia | `viewer` | Solo vedere turni + notifiche push |

Le regole del database impediscono fisicamente ai viewer di scrivere,
anche se qualcuno tentasse di hackerare l'app.
