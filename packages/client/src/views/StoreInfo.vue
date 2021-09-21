<template>
  <div>
    <div class="flex justify-around gap-4">
      <div class="w-64">
        <h1>Store Name</h1>
        <div class="flex justify-start max-w-lg gap-3">
          <Input
            v-model="storeName"
            :invalid="v$.storeName.$error"
            error-text="Please enter a store name."
          />
          <Button
            class="flex-grow-0"
            :disabled="v$.storeName.$invalid"
            @click="
              store.CHANGE_NAME({ id: store.GET_ALL().id, name: storeName })
            "
          >
            Save
          </Button>
        </div>
      </div>
      <div>
        <div class="flex justify-around">
          <h1>Store Hours</h1>
          <Button>
            Save
          </Button>
        </div>
        <!-- {!validStoreHours && (
            <span class="text-red-400">
              Some of your hours are invalid. Please check and fix them.
            </span>
          )} -->
        <table class="table-fixed w-full max-w-sm">
          <thead>
            <tr>
              <th></th>
              <th>Open</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in dayNames" :key="day">
              <th>{{ day }}</th>
              <td>
                <Input
                  placeholder="9:00"
                  :show-label="false"
                  v-model="storeHours[index].start"
                />
              </td>
              <td>
                <Input
                  placeholder="18:00"
                  :show-label="false"
                  v-model="storeHours[index].end"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr />
    <h1>Shift Scheduling Rules</h1>
    <hr />
    <h1>Job Titles</h1>
    <div class="flex justify-around my-3">
      <div class="flex gap-2">
        <Button @click="toggles.addJob = true">
          <i class="pi pi-plus-circle pr-3"></i>
          <span>Add</span>
        </Button>
      </div>
      <div>
        <div class="flex gap-2" :class="{ 'opacity-0': !selectedJobTitles }">
          <!-- <Button class="btn-warning">
            <i class="pi pi-pencil pr-3"></i>
            <span>Edit</span>
          </Button> -->
          <Button class="btn-danger" @click="onDelete">
            <i class="pi pi-trash pr-3"></i>
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
    <div
      v-if="toggles.addJob"
      class="flex justify-start max-w-xs gap-3 mx-auto mb-3"
    >
      <Input
        v-model="newJobTitle"
        placeholder="New Job Title"
        :invalid="v$.newJobTitle.$error"
        error-text="Please enter a job title."
      />
      <Button
        @click="
          () => {
            jobStore.ADD_TITLE(newJobTitle);
            newJobTitle = '';
            v$.newJobTitle.$reset();
          }
        "
        :disabled="v$.newJobTitle.$invalid"
      >
        Save
      </Button>
      <Button
        class="btn-danger"
        @click="
          () => {
            toggles.addJob = false;
            newJobTitle = '';
            v$.newJobTitle.$reset();
          }
        "
      >
        Cancel
      </Button>
    </div>

    <DataTable
      :columns="titleCols"
      :data="jobs"
      size="sm"
      selection-mode="multiple"
      v-model:selection="selectedJobTitles"
    >
    </DataTable>
  </div>
</template>
<script setup lang="ts">
// Prop and prop interface

import { computed, ref, watchEffect } from "vue";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import useStore from "@/store/modules/store/hook";
import useJobTitle from "@/store/modules/jobTitle/hook";
import DataTable from "@/components/DataTable.vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

// Use hooks
const store = useStore();
const jobStore = useJobTitle();

// Data
const storeName = ref("");
const newJobTitle = ref("");
const selectedJobTitles = ref();
const storeHours = ref<{ start: string; end: string; id?: string }[]>(
  [...Array(7).keys()].map(_ => {
    return {
      start: "",
      end: ""
    };
  })
);

const toggles = ref({
  addJob: false
});

const rules = {
  storeName: { required },
  newJobTitle: { required }
};
const v$ = useVuelidate(
  rules,
  { storeName, newJobTitle },
  { $autoDirty: true }
);

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const titleCols = [
  {
    title: "Role",
    selector: "name"
  },
  {
    title: "Number of Employees",
    selector: "numOfEmps"
  }
];

// Computed

const jobs = computed(jobStore.GET_ALL_WITH_PEOPLE_AMOUNT);

// Methods

const onDelete = () => {
  const ids = selectedJobTitles.value.map((i: any) => i.id);
  ids.forEach((i: string) => {
    jobStore.DELETE_DATA(i);
  });
};

// Watchers
// Sets store name and hours if vuex state changes
watchEffect(() => {
  storeName.value = store.GET_ALL().name;
  const hours = storeHours.value.map((item, index) => {
    const hour = store
      .GET_ALL()
      .storeHours.find(item => item.day.day === index);
    if (hour) {
      return {
        start: hour.day.start,
        end: hour.day.end,
        id: hour.day.id
      };
    }
    return item;
  });
  storeHours.value = hours;
});
</script>
<style scoped lang="postcss"></style>
