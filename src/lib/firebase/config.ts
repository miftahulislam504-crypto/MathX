import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

let authInstance: Auth | null = null
let storageInstance: FirebaseStorage | null = null

// getAuth()/getStorage() validate the config and throw synchronously if the
// API key is missing or malformed. Evaluating that eagerly at module scope
// crashes Next.js during static prerendering of any page that imports this
// module (even indirectly), before a real request ever happens. Lazy access
// defers that validation to first real use, matching getOpenAI() in
// src/lib/ai/tutor.ts.
export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(app)
  }
  return authInstance
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(app)
  }
  return storageInstance
}

export default app
