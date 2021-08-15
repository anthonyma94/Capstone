<template>
  <Navbar />
  <router-view />
</template>

<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import usePerson from "./store/modules/person/hook";
import { LoadingTypes } from "./store/store-types";

const personStore = usePerson();

if (personStore.GET_STATUS() === LoadingTypes.IDLE) {
  personStore.INITIALIZE_DATA();
}
</script>

<style src="./app.postcss" lang="postcss" />
