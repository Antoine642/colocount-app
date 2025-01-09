<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">New {{ appName }}</h1>
        <input v-model="colocountName" placeholder="Enter colocount name" class="border p-2 mb-4 w-full" />
        <button @click="createColocount" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create {{ appName }}
        </button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const appName = ref('colocount');
        const colocountName = ref('');
        const router = useRouter();

        const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

        const createColocount = () => {
            const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
            const newColocount = { id: Date.now(), name: colocountName.value, userId: generateId() };
            colocounts.push(newColocount);
            localStorage.setItem('colocounts', JSON.stringify(colocounts));
            router.push(`/colocount/${newColocount.id}`);
        };

        return {
            appName,
            colocountName,
            createColocount
        };
    }
};
</script>