import { initializeApp, getApp, getApps } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDenS9QojHw2noDWG3XwYOPvQ2FdUKPuSk",
  authDomain: "guia-redacao.firebaseapp.com",
  projectId: "guia-redacao",
  storageBucket: "guia-redacao.appspot.com",
  messagingSenderId: "368919702393",
  appId: "1:368919702393:web:58f5837af145609e951da8",
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
export { app, db, storage }