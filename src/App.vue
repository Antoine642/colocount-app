<template>
  <div class="min-h-screen bg-gray-100">
    <router-view></router-view>
    <NavBar v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(false);

function checkSessionStorageForUser() {
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  if (userData) {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }
}

onMounted(() => {
  checkSessionStorageForUser();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
      const userData = {
        id: user.uid,
        email: user.email,
        // Add other user data as needed
      };
      sessionStorage.setItem('userData', JSON.stringify(userData));
      if (route.path === '/') {
        router.push('/home');
      }
    } else {
      isAuthenticated.value = false;
      sessionStorage.removeItem('userData');
      if (route.path === '/') {
        router.push('/login');
      }
    }
  });
});
</script>