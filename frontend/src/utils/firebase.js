import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCXKGuwKX3zHQ9VslvrTNESCPAFON12lYA",
  authDomain: "notification-service-ed93d.firebaseapp.com",
  projectId: "notification-service-ed93d",
  storageBucket: "notification-service-ed93d.firebasestorage.app",
  messagingSenderId: "351765879932",
  appId: "1:351765879932:web:5b8acd87ac4333eeccfdf9",
  measurementId: "G-TH2JFMC0BC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // TODO: Replace with your VAPID key from Firebase Console -> Project Settings -> Cloud Messaging
      const token = await getToken(messaging, { 
        vapidKey: "BOD9Oht76aIyaWRKaayCVZOEGpiq0YZkFSIMAoFCkNmnwTFrQSRMmOfkfEPiVdPBTAlgXrFhTBsqE7GajUbGhmk" 
      });
      return token;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
  }
  return null;
};

export const onMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
