<template>
  <div
    class="w-full px-1 py-2 bg-gradient-to-r from-purple-600 to-red-400 flex justify-center"
  >
    <nav class="max-w-screen-2xl w-100 flex flex-row justify-center gap-3">
      <router-link v-for="route in routes" :key="route.path" :to="route.path">
        {{
          route.name
            ?.valueOf()
            .toString()
            .pascalToWords()
        }}
      </router-link>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const routes = router
  .getRoutes()
  .filter(i => Object.keys(i.meta).length === 0 || i.meta.show);
</script>
<style scoped lang="postcss">
nav {
  a {
    @apply p-1 text-gray-100 hover:text-gray-600 hover:no-underline font-bold;
    &.router-link-exact-active {
      @apply text-gray-400;
    }
  }
}
</style>
