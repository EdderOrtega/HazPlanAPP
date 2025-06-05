import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDfy5_wwPos7Yz-rgtdEtER2LvNkZz8ct0",
  authDomain: "hazplan-7db16.firebaseapp.com",
  projectId: "hazplan-7db16",
  storageBucket: "hazplan-7db16.appspot.com",
  messagingSenderId: "105317671583",
  appId: "1:105317671583:web:7254fa6acb65447ac4b8aa",
  measurementId: "G-G3E2QYRMCP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
