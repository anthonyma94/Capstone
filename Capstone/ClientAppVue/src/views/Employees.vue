<template>
  <div>
    <DataTable :columns="Object.keys(persons[0])" :data="persons" />
  </div>
</template>
<script setup lang="ts">
import usePerson from "@/store/modules/person/hook";
import { computed } from "@vue/reactivity";
import DataTable from "@/components/DataTable.vue";

const { GET_ALL } = usePerson();

const persons = computed(GET_ALL);
</script>
<style scoped lang="postcss"></style>
