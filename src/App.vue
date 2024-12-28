<template>
  <div class="min-h-screen bg-gray-100">
    <router-view></router-view>
    <nav-bar></nav-bar>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = useRouter();

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  });
});
</script>