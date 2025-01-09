<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ colocount.name }}</h1>
    <div v-if="userId === colocount.userId" class="relative mb-6">
      <button @click="toggleDropdown('colocount', colocount.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">...</button>
      <div v-if="dropdownOpen.type === 'colocount' && dropdownOpen.id === colocount.id" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
        <button @click="editColocount" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Edit</button>
        <button @click="deleteColocount" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Delete</button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Dépenses</h2>
        <button @click="showExpenseForm = true; editingExpense = null" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          Ajouter une dépense
        </button>
        <ul class="space-y-2">
          <li v-for="expense in expenses" :key="expense.id" class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span>{{ expense.title }}</span>
              <span>{{ (expense.amount / 100).toFixed(2) }} {{ expense.currency }}</span>
              <div class="relative">
                <button @click="toggleDropdown(expense.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">...</button>
                <div v-if="dropdownOpen === expense.id" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button @click="editExpense(expense)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Edit</button>
                  <button @click="deleteExpense(expense.id)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Delete</button>
                  <button @click="viewExpense(expense)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">View</button>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500">{{ expense.date }}</div>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-4">Revenus</h2>
        <button @click="showIncomeForm = true; editingIncome = null" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4">
          Ajouter un revenu
        </button>
        <ul class="space-y-2">
          <li v-for="income in incomes" :key="income.id" class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span>{{ income.title }}</span>
              <span>{{ (income.amount / 100).toFixed(2) }} {{ income.currency }}</span>
              <div class="relative">
                <button @click="toggleDropdown(income.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">...</button>
                <div v-if="dropdownOpen === income.id" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button @click="editIncome(income)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Edit</button>
                  <button @click="deleteIncome(income.id)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Delete</button>
                  <button @click="viewIncome(income)" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">View</button>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500">{{ income.date }}</div>
          </li>
        </ul>
      </div>
    </div>
    <expense-form v-if="showExpenseForm" @close="showExpenseForm = false" @submit="addExpense" :expense="editingExpense" />
    <income-form v-if="showIncomeForm" @close="showIncomeForm = false" @submit="addIncome" :income="editingIncome" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ExpenseForm from '../components/ExpenseForm.vue';
import IncomeForm from '../components/IncomeForm.vue';

const route = useRoute();
const router = useRouter();
const userId = ref(userData.id);
const colocount = ref({ userId: null });
const expenses = ref([]);
const incomes = ref([]);
const dropdownOpen = ref({ type: null, id: null });

const showExpenseForm = ref(false);
const showIncomeForm = ref(false);
const editingExpense = ref(null);
const editingIncome = ref(null);

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const loadColocount = () => {
  const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
  const currentColocount = colocounts.find(c => c.id === parseInt(route.params.id));
  if (currentColocount) {
    colocount.value = currentColocount;
    expenses.value = currentColocount.expenses || [];
    incomes.value = currentColocount.incomes || [];
  }
};

const saveColocount = () => {
  const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
  const index = colocounts.findIndex(c => c.id === colocount.value.id);
  if (index !== -1) {
    colocounts[index] = { ...colocount.value, expenses: expenses.value, incomes: incomes.value };
    localStorage.setItem('colocounts', JSON.stringify(colocounts));
  }
};

const addExpense = (expense) => {
  if (editingExpense.value) {
    const index = expenses.value.findIndex(e => e.id === editingExpense.value.id);
    expenses.value[index] = { ...expense, id: editingExpense.value.id };
  } else {
    expenses.value.push({ id: generateId(), ...expense });
  }
  saveColocount();
  showExpenseForm.value = false;
  editingExpense.value = null;
};

const addIncome = (income) => {
  if (editingIncome.value) {
    const index = incomes.value.findIndex(i => i.id === editingIncome.value.id);
    incomes.value[index] = { ...income, id: editingIncome.value.id };
  } else {
    incomes.value.push({ id: generateId(), ...income });
  }
  saveColocount();
  showIncomeForm.value = false;
  editingIncome.value = null;
};

const deleteExpense = (id) => {
  expenses.value = expenses.value.filter(expense => expense.id !== id);
  saveColocount();
};

const deleteIncome = (id) => {
  incomes.value = incomes.value.filter(income => income.id !== id);
  saveColocount();
};

const toggleDropdown = (type, id) => {
  console.log(`Toggling dropdown for ${type} id: ${id}`);
  dropdownOpen.value = dropdownOpen.value.id === id && dropdownOpen.value.type === type ? { type: null, id: null } : { type, id };
};

const editExpense = (expense) => {
  editingExpense.value = { ...expense };
  showExpenseForm.value = true;
  dropdownOpen.value = null;
};

const editIncome = (income) => {
  editingIncome.value = { ...income };
  showIncomeForm.value = true;
  dropdownOpen.value = null;
};

const editColocount = () => {
  // Logic to edit colocount name
  const newName = prompt('Enter new name for colocount:', colocount.value.name);
  if (newName !== null && newName.trim() !== '') {
    colocount.value.name = newName.trim();
    saveColocount();
  }
  console.log('Editing colocount');
};

const deleteColocount = () => {
  const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
  const updatedColocounts = colocounts.filter(c => c.id !== colocount.value.id);
  localStorage.setItem('colocounts', JSON.stringify(updatedColocounts));
  router.push('/');
};

onMounted(loadColocount);
</script>
