import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import { initializeApp } from "firebase/app";
import './assets/css/style.css';
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function updateDatabaseFromLocalStorage() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    set(ref(database, 'users/' + userData.id), userData);
  }
}

function checkUserAuthentication() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify({
        id: user.uid,
        email: user.email,
        // Add other user data as needed
      }));
    } else {
      localStorage.removeItem('userData');
    }
  });
}

createApp(App).use(router).mount("#app");

updateDatabaseFromLocalStorage();
checkUserAuthentication();
