// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import './assets/css/style.css';
import { auth } from './service/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function checkUserAuthentication() {
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

checkUserAuthentication();
