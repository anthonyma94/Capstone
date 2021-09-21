<template>
  <div>
    <div className="flex justify-between">
      <h1>Employees</h1>
      <Button href="/employees/new">Create New</Button>
    </div>
    <DataTable
      :columns="columns"
      :data="persons"
      selection-mode="single"
      @selected="e => $router.push(`/employees/${e.id}`)"
    />
  </div>
</template>
<script setup lang="ts">
import usePerson from "@/store/modules/person/hook";
import { computed } from "@vue/reactivity";
import DataTable from "@/components/DataTable.vue";
import Button from "@/components/Button.vue";

const { GET_ALL } = usePerson();

const columns: InstanceType<typeof DataTable>["columns"] = [
  {
    title: "First Name",
    selector: "firstName"
  },
  {
    title: "Last Name",
    selector: "lastName"
  },
  {
    title: "Role",
    selector: "role"
  },
  {
    title: "Job Title",
    selector: "jobTitle"
  },
  {
    title: "Availability",
    selector: "availability"
  },
  {
    title: "Max Hours",
    selector: "maxWeeklyHours"
  }
];

const persons = computed<any>(GET_ALL);
</script>
<style scoped lang="postcss"></style>
