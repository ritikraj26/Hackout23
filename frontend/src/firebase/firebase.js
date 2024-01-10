import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEcwI1roBeTCwHUjBUcbcK_GT0OmXjFq4",
  authDomain: "cryptolancer-fb.firebaseapp.com",
  projectId: "cryptolancer-fb",
  storageBucket: "cryptolancer-fb.appspot.com",
  messagingSenderId: "628588417932",
  appId: "1:628588417932:web:e54f3f906466047083bca9",
  measurementId: "G-QVE167VDVL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };