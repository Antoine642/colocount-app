<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow">
    <div class="container !py-2">
      <ul class="flex justify-around">
        <li>
          <router-link to="/home" class="text-gray-600 hover:text-blue-500">
            <HomeIcon class="h-6 w-6" />
          </router-link>
        </li>
        <li>
          <router-link to="/colocount/new" class="text-gray-600 hover:text-blue-500">
            <PlusIcon class="h-6 w-6" />
          </router-link>
        </li>
        <li>
          <router-link to="/profile" class="text-gray-600 hover:text-blue-500">
            <UserIcon class="h-6 w-6" />
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { HomeIcon, PlusIcon, UserIcon } from 'lucide-vue-next';
</script>