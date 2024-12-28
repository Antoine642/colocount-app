<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ colocount.name }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Dépenses</h2>
        <button @click="showExpenseForm = true" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          Ajouter une dépense
        </button>
        <ul class="space-y-2">
          <li v-for="expense in expenses" :key="expense.id" class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span>{{ expense.title }}</span>
              <span>{{ expense.amount }} {{ expense.currency }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ expense.date }}</div>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-4">Revenus</h2>
        <button @click="showIncomeForm = true" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4">
          Ajouter un revenu
        </button>
        <ul class="space-y-2">
          <li v-for="income in incomes" :key="income.id" class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span>{{ income.title }}</span>
              <span>{{ income.amount }} {{ income.currency }}</span>
            </div>
            <div class="text-sm text-gray-500">{{ income.date }}</div>
          </li>
        </ul>
      </div>
    </div>
    <expense-form v-if="showExpenseForm" @close="showExpenseForm = false" @submit="addExpense" />
    <income-form v-if="showIncomeForm" @close="showIncomeForm = false" @submit="addIncome" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ExpenseForm from '../components/ExpenseForm.vue';
import IncomeForm from '../components/IncomeForm.vue';

const colocount = ref({ name: 'Appartement Paris' });
const expenses = ref([
  { id: 1, title: 'Courses', amount: 50, currency: '€', date: '2023-05-15' },
  { id: 2, title: 'Électricité', amount: 80, currency: '€', date: '2023-05-10' },
]);
const incomes = ref([
  { id: 1, title: 'Salaire', amount: 2000, currency: '€', date: '2023-05-01' },
]);

const showExpenseForm = ref(false);
const showIncomeForm = ref(false);

const addExpense = (expense) => {
  expenses.value.push({ id: expenses.value.length + 1, ...expense });
  showExpenseForm.value = false;
};

const addIncome = (income) => {
  incomes.value.push({ id: incomes.value.length + 1, ...income });
  showIncomeForm.value = false;
};
</script>