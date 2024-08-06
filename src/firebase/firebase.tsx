import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAu4ND57V_cEJtkXgz_mnMD2ypypOsrzg8",
  authDomain: "time-app-21b11.firebaseapp.com",
  projectId: "time-app-21b11",
  storageBucket: "time-app-21b11.appspot.com",
  messagingSenderId: "604117233878",
  appId: "1:604117233878:web:03d677a776049ec05dd977"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);







