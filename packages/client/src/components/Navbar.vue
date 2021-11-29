<template>
  <div
    class="w-full px-1 py-2 bg-gradient-to-r from-purple-600 to-red-400 flex justify-center"
  >
    <nav
      class="max-w-screen-2xl w-full flex flex-row justify-center gap-3 px-10"
    >
      <div class="flex-grow flex place-items-center">
        <span class="text-gray-100 font-bold">{{ auth.USER }}</span>
      </div>
      <router-link v-for="route in routes" :key="route.path" :to="route.path">
        {{
          route.name
            ?.valueOf()
            .toString()
            .pascalToWords()
        }}
      </router-link>
      <div class="flex-grow flex place-items-center justify-end">
        <a href="#" @click="handleLogout">Logout</a>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
import axios from "@/services/axios";
import { useStore } from "@/store";
import AuthModule from "@/store/modules/auth";
import { useRouter } from "vue-router";
import { getModule } from "vuex-module-decorators";

const router = useRouter();
const auth = getModule(AuthModule, useStore());
const routes = router
  .getRoutes()
  .filter(
    i =>
      Object.keys(i.meta).length === 0 ||
      i.meta.show === true || i.meta.show === auth.ROLE
  );

const handleLogout = async () => {
  await axios.get("/auth/logout");
  auth.UPDATE_DATA({ user: undefined, role: undefined });
  router.push("/");
};
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
