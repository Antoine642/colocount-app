<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Add ReturnButton component with route prop if needed -->
    <ReturnButton route="/some-specific-route" />
    <h1 class="text-3xl font-bold mb-6">Bienvenue sur {{ appName }}</h1>
    <button @click="createNewColocount"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
      Créer un nouveau {{ appName }}
    </button>
    <h2 class="text-2xl font-semibold mb-4">Vos {{ appName }}s existants :</h2>
    <ul class="space-y-2">
      <li v-for="colocount in colocounts" :key="colocount.id" class="bg-white shadow rounded-lg p-4">
        <router-link :to="`/colocount/${colocount.id}`" class="text-blue-500 hover:text-blue-700">
          {{ colocount.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ReturnButton from '../components/ReturnButton.vue'; // Import ReturnButton component

const appName = ref('colocount');
const colocounts = ref([]);

const router = useRouter();
const db = getFirestore();

const createNewColocount = () => {
  router.push('/colocount/new');
};

const syncColocounts = async () => {
  const querySnapshot = await getDocs(collection(db, 'colocounts'));
  const firestoreColocounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  colocounts.value = firestoreColocounts;
  localStorage.setItem('colocounts', JSON.stringify(firestoreColocounts));
};

onMounted(async () => {
  const storedColocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
  colocounts.value = storedColocounts;
  await syncColocounts();
});
</script>