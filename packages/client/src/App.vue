<template>
  <div>
    <Navbar />
    <main class="w-screen max-w-screen-2xl mx-auto p-10 font-sans">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { watchEffect } from "vue-demi";
import Navbar from "./components/Navbar.vue";
import useJobTitle from "./store/modules/jobTitle/hook";
import usePerson from "./store/modules/person/hook";
import useStore from "./store/modules/store/hook";
import { LoadingTypes } from "./store/types";

const personStore = usePerson();
const storeStore = useStore();
const jobStore = useJobTitle();

const statuses = computed(() => {
  return {
    person: personStore.GET_STATUS(),
    store: storeStore.GET_STATUS(),
    job: jobStore.GET_STATUS()
  };
});

watchEffect(() => {
  if (statuses.value.person === LoadingTypes.IDLE) {
    personStore.INITIALIZE_DATA();
  }
  if (statuses.value.store === LoadingTypes.IDLE) {
    storeStore.INITIALIZE_DATA();
  }
  if (statuses.value.job === LoadingTypes.IDLE) {
    jobStore.INITIALIZE_DATA();
  }
});
</script>
