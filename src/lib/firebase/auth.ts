import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { getFirebaseAuth } from './config'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(getFirebaseAuth(), googleProvider)

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(getFirebaseAuth(), email, password)

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(getFirebaseAuth(), email, password)

export const logOut = () => signOut(getFirebaseAuth())

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) =>
  onAuthStateChanged(getFirebaseAuth(), callback)
