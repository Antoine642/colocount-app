<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Ajouter un revenu</h3>
        <form @submit.prevent="submitForm" class="mt-2 text-left">
          <div class="mb-4">
            <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Titre</label>
            <input v-model="income.title" type="text" id="title" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="amount" class="block text-gray-700 text-sm font-bold mb-2">Montant</label>
            <input v-model="income.amount" type="number" id="amount" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="currency" class="block text-gray-700 text-sm font-bold mb-2">Devise</label>
            <input v-model="income.currency" type="text" id="currency" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="date" class="block text-gray-700 text-sm font-bold mb-2">Date</label>
            <input v-model="income.date" type="date" id="date" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Ajouter
            </button>
            <button @click="$emit('close')" type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const income = ref({
  title: '',
  amount: 0,
  currency: '€',
  date: '',
});

const emit = defineEmits(['close', 'submit']);

const submitForm = () => {
  emit('submit', { ...income.value });
  income.value = { title: '', amount: 0, currency: '€', date: '' };
};
</script>