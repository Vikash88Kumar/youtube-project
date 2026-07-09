importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCXKGuwKX3zHQ9VslvrTNESCPAFON12lYA",
  authDomain: "notification-service-ed93d.firebaseapp.com",
  projectId: "notification-service-ed93d",
  storageBucket: "notification-service-ed93d.firebasestorage.app",
  messagingSenderId: "351765879932",
  appId: "1:351765879932:web:5b8acd87ac4333eeccfdf9",
  measurementId: "G-TH2JFMC0BC"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload)=> {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.item,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
