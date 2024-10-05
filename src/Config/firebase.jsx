import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKb0lVCSYCt7kUcBVIU--rUputJIPDBrI",
  authDomain: "todo-app-with-react-nati-8b40a.firebaseapp.com",
  projectId: "todo-app-with-react-nati-8b40a",
  storageBucket: "todo-app-with-react-nati-8b40a.appspot.com",
  messagingSenderId: "997954232135",
  appId: "1:997954232135:web:8d7d2a02eeaf41da28f662",
  measurementId: "G-34L9KCC214"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
