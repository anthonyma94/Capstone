<template>
  <Dialog
    :modal="true"
    header="Add Availability"
    :draggable="false"
    :dismissable-mask="true"
    :keep-in-view-port="true"
    :min-x="0"
    :min-y="0"
    v-model:visible="internalVisible"
  >
    <div class="flex justify-between">
      <div class="flex-grow w-64">
        <div class=" w-40">
          <Select v-model="type" :options="selectOptions" />
        </div>
      </div>
      <div class="flex gap-3">
        <Button class="p-button-sm">Cancel</Button>
        <Button class="p-button-sm">Save</Button>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-10 mt-3">
      <div class="flex flex-col mx-auto w-full gap-1">
        <div
          class="flex justify-between gap-3"
          v-for="name in dayNames"
          :key="name"
        >
          <span>{{ name }}</span>
          <Checkbox name="dayName" :value="name" v-model="formData.days" />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <Input placeholder="Start" v-model="formData.start" />
        <Input placeholder="End" v-model="formData.end" />
      </div>
      <div class="col-span-2">
        <div class="flex justify-between">
          <h3>Employees</h3>
          <Button class="p-button-sm" @click="rowsOfEmp++">Add</Button>
        </div>
        <div
          v-for="num in Array.from(Array(rowsOfEmp).keys())"
          :key="num"
          class="flex gap-3 my-3"
        >
          <Dropdown
            placeholder="Job Title"
            :options="jobModule.GET_ALL.value.map(item => item.name)"
          />
          <Input placeholder="Number of Employees" />
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import Select from "../inputs/Select.vue";
import Checkbox from "primevue/checkbox";
import { watch, computed, ref } from "vue";
import Button from "primevue/button";
import Input from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { getModule } from "vuex-module-decorators";
import JobTitleModule from "@/store/modules/jobTitle";
import { useStore } from "@/store";
// Prop and prop interface

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// Use hooks
const jobModule = getModule(JobTitleModule, useStore());

// Data
const type = ref<"recurring" | "one-time">("recurring");
const internalVisible = ref(props.visible);
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const formData = ref({
  days: [],
  start: "",
  end: "",
  employees: []
});

const rowsOfEmp = ref(1);

// Computed

const selectOptions = computed(() => [
  { value: "recurring", text: "Recurring" },
  { value: "one-time", text: "One-Time" }
]);

// Methods

// Watchers
watch(internalVisible, () => {
  emits("update:visible", internalVisible.value);
});
watch(
  () => props.visible,
  () => {
    internalVisible.value = props.visible;
  }
);
</script>
<style scoped lang="postcss"></style>
