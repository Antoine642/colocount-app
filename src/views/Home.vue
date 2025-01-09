<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Bienvenue sur {{ appName }}</h1>
    <button @click="createNewColocount" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
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

const appName = ref('colocount');
const colocounts = ref([]);

const router = useRouter();

const createNewColocount = () => {
  router.push('/colocount/new');
};

onMounted(() => {
  const storedColocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
  colocounts.value = storedColocounts;
});
</script>