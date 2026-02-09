import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbNZCaMye-aZYALfsKQ7PWjg1hNYiS4ug",
    authDomain: "dsa-tracker-3b005.firebaseapp.com",
    projectId: "dsa-tracker-3b005",
    storageBucket: "dsa-tracker-3b005.firebasestorage.app",
    messagingSenderId: "992405422249",
    appId: "1:992405422249:web:acc8fb3f4b3b528390a9b8",
    measurementId: "G-NPHKS0LW43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
