<template>
  <div>
    <Navbar />
    <main class="w-screen max-w-screen-2xl mx-auto p-10 font-sans">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import { watchEffect } from "vue-demi";
import { getModule } from "vuex-module-decorators";
import PersonModule from "./store/modules/person";
import { useStore as useVuexStore } from "./store";
import { LoadingTypes } from "./store/types";
import JobTitleModule from "./store/modules/jobTitle";
import StoreModule from "./store/modules/store";
import ScheduleRuleModule from "./store/modules/scheduleRule";

const personModule = getModule(PersonModule, useVuexStore());
const storeModule = getModule(StoreModule, useVuexStore());
const jobModule = getModule(JobTitleModule, useVuexStore());
const scheduleRuleModule = getModule(ScheduleRuleModule, useVuexStore());

watchEffect(() => {
  if (personModule.GET_STATUS.value === LoadingTypes.IDLE) {
    personModule.INITIALIZE_DATA();
  }
  if (storeModule.GET_STATUS.value === LoadingTypes.IDLE) {
    storeModule.INITIALIZE_DATA();
  }
  if (jobModule.GET_STATUS.value === LoadingTypes.IDLE) {
    jobModule.INITIALIZE_DATA();
  }
  if (scheduleRuleModule.GET_STATUS.value === LoadingTypes.IDLE) {
    scheduleRuleModule.INITIALIZE_DATA();
  }
});
</script>
