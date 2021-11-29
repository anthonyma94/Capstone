<template>
  <div>
    <div className="flex justify-between">
      <h1>Employees</h1>
      <!-- <Button href="/employees/new">Create New</Button> -->
    </div>
    <DataTable
      v-if="persons.length > 0"
      :cols="columns"
      v-model="persons"
      key="id"
      :selectableRow="true"
      :editable="false"
      :deletable="false"
      @rowSelect="e => $router.push(`/employees/${e}`)"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from "@vue/reactivity";
import DataTable from "@/components/DataTable.vue";
import { getModule } from "vuex-module-decorators";
import PersonModule from "@/store/modules/person";
import { useStore } from "@/store";

const personModule = getModule(PersonModule, useStore());

const columns: InstanceType<typeof DataTable>["cols"] = [
  {
    name: "Max Hours",
    id: "maxWeeklyHours"
  }
];

const persons = computed<any>(() =>
  personModule.GET_ALL.value.map(item => {
    return {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      role: item.role,
      jobTitle: item.jobTitle.name,
      maxWeeklyHours: item.maxWeeklyHours
    };
  })
);
</script>
<style scoped lang="postcss"></style>
