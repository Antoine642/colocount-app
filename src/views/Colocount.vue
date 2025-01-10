<template>
  <div class="container mx-auto px-4 py-8">
    <ReturnButton route="/home" />

    <h1 class="text-3xl font-bold mb-6">{{ colocount.name }}</h1>
    <p class="text-sm text-gray-500">Created by: {{ colocount.createdByEmail }}</p>
    <div v-if="userId === colocount.userId" class="relative mb-6">
      <button
        @click="toggleDropdown('colocount', colocount.id)"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
      >
        ...
      </button>
      <div
        v-if="
          dropdownOpen.type === 'colocount' && dropdownOpen.id === colocount.id
        "
        class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
      >
        <button
          @click="editColocount"
          class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          Edit
        </button>
        <button
          @click="deleteColocount"
          class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Dépenses</h2>
        <button
          @click="
            showExpenseForm = true;
            editingExpense = null;
          "
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Ajouter une dépense
        </button>
        <ul class="space-y-2">
          <li
            v-for="expense in expenses"
            :key="expense.id"
            class="bg-white shadow rounded-lg p-4"
          >
            <div class="flex justify-between items-center">
              <span>{{ expense.title }}</span>
              <span
                >{{ (expense.amount / 100).toFixed(2) }}
                {{ expense.currency }}</span
              >
              <div class="relative">
                <button
                  @click="toggleDropdown(expense.id)"
                  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                >
                  ...
                </button>
                <div
                  v-if="
                    dropdownOpen.type === 'expense' &&
                    dropdownOpen.id === expense.id
                  "
                  class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                >
                  <button
                    @click="editExpense(expense)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteExpense(expense.id)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Delete
                  </button>
                  <button
                    @click="viewExpense(expense)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500">{{ expense.date }}</div>
          </li>
        </ul>
      </div>
      <div>
        <h2 class="text-2xl font-semibold mb-4">Revenus</h2>
        <button
          @click="
            showIncomeForm = true;
            editingIncome = null;
          "
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Ajouter un revenu
        </button>
        <ul class="space-y-2">
          <li
            v-for="income in incomes"
            :key="income.id"
            class="bg-white shadow rounded-lg p-4"
          >
            <div class="flex justify-between items-center">
              <span>{{ income.title }}</span>
              <span
                >{{ (income.amount / 100).toFixed(2) }}
                {{ income.currency }}</span
              >
              <div class="relative">
                <button
                  @click="toggleDropdown('income', income.id)"
                  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                >
                  ...
                </button>
                <div
                  v-if="
                    dropdownOpen.type === 'income' &&
                    dropdownOpen.id === income.id
                  "
                  class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                >
                  <button
                    @click="editIncome(income)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteIncome(income.id)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Delete
                  </button>
                  <button
                    @click="viewIncome(income)"
                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500">{{ income.date }}</div>
          </li>
        </ul>
      </div>
    </div>
    <expense-form
      v-if="showExpenseForm"
      @close="showExpenseForm = false"
      @submit="addExpense"
      :expense="editingExpense"
    />
    <income-form
      v-if="showIncomeForm"
      @close="showIncomeForm = false"
      @submit="addIncome"
      :income="editingIncome"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExpenseForm from "../components/ExpenseForm.vue";
import IncomeForm from "../components/IncomeForm.vue";
import ReturnButton from "../components/ReturnButton.vue";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  getCollectionWithCondition,
  updateDocument,
  deleteDocument,
  addDocument,
} from "../service/database";

export default {
  components: {
    ExpenseForm,
    IncomeForm,
    ReturnButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userId = ref(null);
    const colocount = ref({});
    const expenses = ref([]);
    const incomes = ref([]);
    const dropdownOpen = ref({ type: null, id: null });

    const showExpenseForm = ref(false);
    const showIncomeForm = ref(false);
    const editingExpense = ref(null);
    const editingIncome = ref(null);

    const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

    const fetchUserId = async () => {
      const auth = getAuth();
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user.uid);
          } else {
            resolve(null);
          }
        });
      });
    };

    const loadColocount = async () => {
      const colocountId = Number(route.params.id); // Ensure colocountId is a number
      
      if (isNaN(colocountId)) {
        console.error("Colocount ID is not a valid number");
        return;
      }
      console.log(
        `Fetching colocount from path: Collection/colocounts/${colocountId}`
      );
      try {
        const data = await getCollectionWithCondition(
          "colocounts",
          "id",
          "==",
          colocountId
        );
        if (data.length > 0) {
          const colocountData = data[0];
          const localTimestamp = localStorage.getItem('colocountsTimestamp');
          const remoteTimestamp = colocountData.updatedAt;

          if (!localTimestamp || new Date(remoteTimestamp) > new Date(localTimestamp)) {
            colocount.value = {
              id: colocountId,
              userId: colocountData.userId,
              name: colocountData.name,
              expenses: colocountData.expenses || [],
              incomes: colocountData.incomes || [],
              createdByEmail: colocountData.createdByEmail,
            };
            expenses.value = colocount.value.expenses;
            incomes.value = colocount.value.incomes;
            updateLocalStorage(); // Update local storage with remote data
          } else {
            colocount.value = {
              id: colocountId,
              userId: colocountData.userId,
              name: colocountData.name,
              expenses: colocountData.expenses || [],
              incomes: colocountData.incomes || [],
              createdByEmail: colocountData.createdByEmail,
            };
          }
        } else {
          console.log("No colocount found with the given ID, creating a new one");
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            colocount.value = {
              id: colocountId,
              userId: user.uid, // Ensure userId is set
              name: localStorage.getItem("colocountName") || "New Colocount",
              expenses: JSON.parse(localStorage.getItem("colocountExpenses")) || [],
              incomes: JSON.parse(localStorage.getItem("colocountIncomes")) || [],
              createdByEmail: user.email, // Ensure user email is set
            };
            await addDocument("colocounts", colocount.value);
          } else {
            console.error("User is not logged in");
          }
        }
      } catch (error) {
        console.error("Error fetching colocount document:", error);
        alert("Error fetching colocount document");
      }
    };

    const saveColocount = async () => {
      console.log("value : ", colocount.value);
      if (!colocount.value.id) {
        console.error("Colocount ID is undefined");
        return;
      }
      const auth = getAuth();
      const user = auth.currentUser;
      console.log("user : ", user);
      if (user) {
        const updatedColocount = {
          ...colocount.value,
          userId: user.uid, // Ensure userId is saved
          createdByEmail: user.email, // Ensure user email is saved
          updatedAt: new Date().toISOString(),
          expenses: expenses.value,
          incomes: incomes.value,
        };

        await updateDocument("colocounts", colocount.value.id, updatedColocount);
        updateLocalStorage(); // Ensure local storage is updated after saving
        localStorage.setItem('colocountsTimestamp', new Date().toISOString()); // Update timestamp
      } else {
        console.error("User is not logged in");
      }
    };

    const updateLocalStorage = () => {
      console.log("Updating local storage with:", colocount.value);
      localStorage.setItem("colocountName", colocount.value.name);
      localStorage.setItem("colocountExpenses", JSON.stringify(expenses.value));
      localStorage.setItem("colocountIncomes", JSON.stringify(incomes.value));
      localStorage.setItem('colocountsTimestamp', new Date().toISOString()); // Update timestamp
    };

    const addExpense = async (expense) => {
      if (editingExpense.value) {
        const index = expenses.value.findIndex(
          (e) => e.id === editingExpense.value.id
        );
        expenses.value[index] = { ...expense, id: editingExpense.value.id };
      } else {
        expenses.value.push({ id: generateId(), ...expense });
      }
      await saveColocount();
      updateLocalStorage(); // Ensure local storage is updated after adding an expense
      showExpenseForm.value = false;
      editingExpense.value = null;
    };

    const addIncome = async (income) => {
      if (editingIncome.value) {
        const index = incomes.value.findIndex(
          (i) => i.id === editingIncome.value.id
        );
        incomes.value[index] = { ...income, id: editingIncome.value.id };
      } else {
        incomes.value.push({ id: generateId(), ...income });
      }
      await saveColocount();
      updateLocalStorage(); // Ensure local storage is updated after adding an income
      showIncomeForm.value = false;
      editingIncome.value = null;
    };

    const deleteExpense = async (id) => {
      expenses.value = expenses.value.filter((expense) => expense.id !== id);
      await saveColocount();
      updateLocalStorage(); // Ensure local storage is updated after deleting an expense
    };

    const deleteIncome = async (id) => {
      incomes.value = incomes.value.filter((income) => income.id !== id);
      await saveColocount();
      updateLocalStorage(); // Ensure local storage is updated after deleting an income
    };

    const toggleDropdown = (type, id) => {
      console.log(`Toggling dropdown for ${type} id: ${id}`);
      dropdownOpen.value =
        dropdownOpen.value.id === id && dropdownOpen.value.type === type
          ? { type: null, id: null }
          : { type, id };
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

    const editColocount = async () => {
      const newName = prompt("Enter new name for colocount:", colocount.value.name);
      if (newName !== null && newName.trim() !== "") {
        colocount.value.name = newName.trim();
        await saveColocount();
      }
      console.log("Editing colocount");
    };

    const clearLocalStorage = () => {
      localStorage.removeItem("colocountName");
      localStorage.removeItem("colocountExpenses");
      localStorage.removeItem("colocountIncomes");
    };

    const deleteColocount = async () => {
      await deleteDocument("colocounts", colocount.value.id);
      clearLocalStorage();
      router.push("/home");
    };

    onMounted(async () => {
      // Fetch user ID from some authentication service
      userId.value = await fetchUserId();
      await loadColocount();
    });

    return {
      route,
      router,
      userId,
      colocount,
      expenses,
      incomes,
      dropdownOpen,
      showExpenseForm,
      showIncomeForm,
      editingExpense,
      editingIncome,
      generateId,
      loadColocount,
      saveColocount,
      updateLocalStorage,
      addExpense,
      addIncome,
      deleteExpense,
      deleteIncome,
      toggleDropdown,
      editExpense,
      editIncome,
      editColocount,
      deleteColocount,
      clearLocalStorage,
    };
  },

};
</script>

