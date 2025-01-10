<template>
  <button @click="handleClick" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
    Return
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';

const props = defineProps({
  route: {
    type: String,
    default: null
  }
});

const router = useRouter();

const handleClick = () => {
  if (props.route) {
    router.push(props.route);
  } else {
    router.go(-1);
  }
};
</script>
