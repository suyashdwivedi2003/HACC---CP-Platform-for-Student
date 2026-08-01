importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCLT5q_BVCAjUmQ5WU0CORaGKsKseGMWbs",
    authDomain: "dj-hacc.firebaseapp.com",
    projectId: "dj-hacc",
    storageBucket: "dj-hacc.firebasestorage.app",
    messagingSenderId: "940911857794",
    appId: "1:940911857794:web:ec5c0b88cc607ee47c649b",
    measurementId: "G-05L5HTS8HD"
  };

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("Message aaya...");
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );

    if (payload && payload.notification) {
      const notificationTitle = payload.notification.title || "New Notification";
      const notificationOptions = {
        body: payload.notification.body || "",
        icon: payload.notification.image || "/avatar.png",
      };
    
      self.registration.showNotification(notificationTitle, notificationOptions);
    }

    console.log(payload.notification);
  });
  