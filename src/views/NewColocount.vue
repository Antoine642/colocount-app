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
import { getAuth } from 'firebase/auth';
import ReturnButton from '../components/ReturnButton.vue';
import { addDocument } from '../service/database';

export default {
    components: { ReturnButton },
    setup() {
        const appName = ref('colocount');
        const colocountName = ref('');
        const router = useRouter();


        const createColocount = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error("User is not logged in");
                return;
            }

            const colocounts = JSON.parse(localStorage.getItem('colocounts')) || [];
            const newColocount = {
                id: Date.now(),
                name: colocountName.value,
                userId: user.uid,
                createdByEmail: user.email,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                income: 0,
                expenses: 0,
            };
            colocounts.push(newColocount);
            localStorage.setItem('colocounts', JSON.stringify(colocounts));
            localStorage.setItem('colocountsTimestamp', new Date().toISOString()); // Add timestamp

            // Save new colocount to Firestore
            try {
                await addDocument('colocounts', newColocount);
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