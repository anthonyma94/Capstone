<template>
  <div
    class="w-screen px-1 py-2 bg-gradient-to-r from-purple-600 to-red-400 flex justify-center"
  >
    <nav class="max-w-screen-2xl w-100 flex flex-row justify-center gap-3">
      <router-link v-for="route in routes" :key="route.path" :to="route.path">
        {{ route.name }}
      </router-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";

const router = useRouter();
const routes = computed(() => router.getRoutes());
</script>
<style scoped lang="postcss">
nav {
  a {
    @apply p-1 text-gray-100 hover:text-gray-600 hover:no-underline font-bold;
    &.router-link-exact-active {
      @apply text-green-500;
    }
  }
}
</style>
