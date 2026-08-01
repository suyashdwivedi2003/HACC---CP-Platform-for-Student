import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    GithubAuthProvider
} from "firebase/auth";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  

const firebaseApp = initializeApp(firebaseConfig); // Now, an instance of firebase app is created
export const messaging = getMessaging(firebaseApp);


const firebaseAuth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {

    const signInWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleProvider);
    }

    const signInWithGithub = () => {
        return signInWithPopup(firebaseAuth, githubProvider);
    }


    return <FirebaseContext.Provider value={{signInWithGoogle, signOut, firebaseAuth, signInWithGithub }}>
        {props.children}
    </FirebaseContext.Provider>
}