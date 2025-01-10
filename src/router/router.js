import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Colocount from '../views/Colocount.vue';
import Login from '../views/Login.vue';
import NewColocount from '../views/NewColocount.vue';
import Profile from '../views/Profile.vue';

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
    component: NewColocount
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;
