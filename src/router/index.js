// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Colocount from '../views/Colocount.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/colocount/:id',
    name: 'Colocount',
    component: Colocount
  },
  {
    path: '/colocount/new',
    name: 'NewColocount',
    component: () => import('../views/NewColocount.vue') // Assuming you have a NewColocount.vue
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue') // Assuming you have a Login.vue
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;
