// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDKgEW0X76PO39fY7anORG5P3-V0-Pj7-g",
  authDomain: "filara-cosmo-test.firebaseapp.com",
  projectId: "filara-cosmo-test",
  storageBucket: "filara-cosmo-test.appspot.com",
  messagingSenderId: "952795390723",
  appId: "1:952795390723:web:1941f3adf544290fa33f36",
  measurementId: "G-6D1TZKL2D6",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
