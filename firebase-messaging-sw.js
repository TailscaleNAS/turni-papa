importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyC6qh3TUdnIk4donXVs2ImBMSadUZ2OhFQ",
  authDomain:        "turni-sevel.firebaseapp.com",
  databaseURL:       "https://turni-sevel-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "turni-sevel",
  storageBucket:     "turni-sevel.firebasestorage.app",
  messagingSenderId: "833989436186",
  appId:             "1:833989436186:web:3e2150c75af992d60542a3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  });
});