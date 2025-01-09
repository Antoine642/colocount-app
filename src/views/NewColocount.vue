<template>
    <div class="container mx-auto px-4 py-8">
        <ReturnButton />
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
import { firestore } from '../service/firebase';
import { collection, addDoc } from "firebase/firestore";
import ReturnButton from '../components/ReturnButton.vue';

export default {
    components: { ReturnButton },
    setup() {
        const appName = ref('colocount');
        const colocountName = ref('');
        const router = useRouter();

        const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

        const createColocount = async () => {
            const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
            const newColocount = { id: Date.now(), name: colocountName.value, userId: generateId() };
            colocounts.push(newColocount);
            localStorage.setItem('colocounts', JSON.stringify(colocounts));

            // Save new colocount to Firestore
            try {
                await addDoc(collection(firestore, 'colocounts'), newColocount);
                console.log("New colocount added to Firestore");
            } catch (error) {
                console.error("Error adding colocount to Firestore:", error);
            }

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