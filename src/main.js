// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import './assets/css/style.css';

const firebaseConfig = {
  // Your Firebase configuration
};

initializeApp(firebaseConfig);

createApp(App).use(router).mount("#app");
