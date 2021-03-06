import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import "firebase/performance"
import { createFirestoreInstance, reduxFirestore } from 'redux-firestore'

/**
 * Configuration object for Firebase to link to the right project
 */
const firebaseConfig = {
  apiKey: "AIzaSyCeGBBE_vDvaVUkdbeUBu2qxdZV7U6_JO4",
  authDomain: "commontime-1581984480494.firebaseapp.com",
  databaseURL: "https://commontime-1581984480494.firebaseio.com",
  projectId: "commontime-1581984480494",
  storageBucket: "commontime-1581984480494.appspot.com",
  messagingSenderId: "915779472474",
  appId: "1:915779472474:web:94f97ff3c15ad591f69c63",
  measurementId: "G-RZ9Y39J6H8",
}

/**
 * React-Redux-Firebase config
 */
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, 
  enableClaims: true,
}

firebase.initializeApp(firebaseConfig)
firebase.functions()
if (process.env.NODE_ENV !== "production") {
  firebase.functions().useFunctionsEmulator("http://localhost:5001")
}
firebase.firestore()
/*if (process.env.NODE_ENV !== "production") {
  db.settings({
    host: "localhost:8080",
    ssl: false,
  })
}*/

if (process.env.NODE_ENV === "production") {
  firebase.performance()
}

/**
 * Redux-Firestore config
 */
const rfConfig = {}

export const enhanceStore = reduxFirestore(firebase, rfConfig)

export const setupFB = (store) => ({
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
})