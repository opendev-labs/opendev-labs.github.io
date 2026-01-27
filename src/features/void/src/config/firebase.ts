// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvSmMDFZFHRwNrf1hMwfeQrOS-wvtc_hk",
    authDomain: "void-v1.firebaseapp.com",
    projectId: "void-v1",
    storageBucket: "void-v1.firebasestorage.app",
    messagingSenderId: "603444929770",
    appId: "1:603444929770:web:2ceef309f6550b1d522393",
    measurementId: "G-PWZ79LFXRX"
};

import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
