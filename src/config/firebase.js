import firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB2py5xD4RL35G-kZu5_FH7pqLPnA_UMYA",
  authDomain: "cpu-seminar-7--22.firebaseapp.com",
  projectId: "cpu-seminar-7--22",
  storageBucket: "cpu-seminar-7--22.appspot.com",
  messagingSenderId: "550273819635",
  appId: "1:550273819635:web:474d10d14a6208068ea886"
};

let app = undefined;
let  db = undefined;

// Initialize Firebase
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
  db = app.firestore();
}

export { db };

