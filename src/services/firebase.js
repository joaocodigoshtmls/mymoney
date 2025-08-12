import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDyuhU9zG_jF14_1SWN5ThNitz1ASv2y9g",
  authDomain: "myomoney-71b28.firebaseapp.com",
  projectId: "myomoney-71b28",
  storageBucket: "myomoney-71b28.firebasestorage.app",
  messagingSenderId: "486890555063",
  appId: "1:486890555063:web:d05b2634f5f43319602f32",
  measurementId: "G-2774L5HSN9"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Autenticação com Google
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
