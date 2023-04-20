import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvjLcWqYsCC1cyKUkCMRtfb6cOLYamRZM",
  authDomain: "instagram-clone-57e2b.firebaseapp.com",
  projectId: "instagram-clone-57e2b",
  storageBucket: "instagram-clone-57e2b.appspot.com",
  messagingSenderId: "367009070527",
  appId: "1:367009070527:web:6eb76f0fbc1a950ed4b50a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);