<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Profile</h1>
    <div v-if="user">
      <p><strong>Display Name:</strong> {{ user.displayName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <img v-if="user.photoURL" :src="user.photoURL" alt="Profile Picture" class="rounded-full w-32 h-32">
      <p v-else>No profile picture available.</p>
      <button @click="signOut" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login.vue';

export default {
  components: { Login },
  data() {
    return {
      user: null
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Profile Picture:", user.photoURL);
        console.log("Display Name:", user.displayName);
        console.log("Email:", user.email);
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    signOut() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.user = null;
      }).catch((error) => {
        console.error('Sign out error', error);
      });
    }
  }
};
</script>