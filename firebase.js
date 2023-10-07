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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()
export { app, db, storage }