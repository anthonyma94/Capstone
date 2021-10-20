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
              storeModule.CHANGE_NAME({
                id: storeModule.GET_ALL.value.id,
                name: storeName
              })
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
    <Button @click="toggles.addShiftSchedule = !toggles.addShiftSchedule">
      Add
    </Button>
    <AddShiftSchedulingModal v-model:visible="toggles.addShiftSchedule" />
    <DataTable
      v-model="scheduleRuleData"
      :cols="scheduleRuleTitleCols"
      :editable="false"
    />
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
            jobModule.ADD_TITLE(newJobTitle);
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
      v-model="jobModule.GET_ALL_WITH_PEOPLE_AMOUNT"
      :cols="titleCols"
      :editable="false"
    />
  </div>
</template>
<script setup lang="ts">
// Prop and prop interface

import { computed, ref, watchEffect } from "vue";
import Input from "@/components/inputs/Input.vue";
import Button from "@/components/Button.vue";
import DataTable from "@/components/DataTable.vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { getModule } from "vuex-module-decorators";
import StoreModule from "@/store/modules/store";
import { useStore } from "@/store";
import JobTitleModule from "@/store/modules/jobTitle";
import ScheduleRuleModule from "@/store/modules/scheduleRule";
import AddShiftSchedulingModal from "@/components/dialogs/AddShiftSchedulingModal.vue";
import dayjs from "dayjs";

// Use hooks
// const store = useStore();
// const jobStore = useJobTitle();

const storeModule = getModule(StoreModule, useStore());
const jobModule = getModule(JobTitleModule, useStore());
const scheduleRuleModule = getModule(ScheduleRuleModule, useStore());

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
  addJob: false,
  addShiftSchedule: false
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
    name: "Number of Employees",
    id: "numOfEmps"
  }
];

const scheduleRuleTitleCols = [
  {
    name: "Day/Date",
    id: "day"
  },
  {
    name: "Total Billed Hours",
    id: "billedHours"
  }
];

// Computed
const scheduleRuleData = computed(() => {
  return scheduleRuleModule.GET_ALL.value.map(item => {
    const start = dayjs(item.day.start, "HH:mm");
    const end = dayjs(item.day.end, "HH:mm");
    const duration = end.diff(start, "hour");
    const emps = item.rules.reduce((acc, cur) => {
      if (!(cur.jobTitle.name in acc)) {
        acc[cur.jobTitle.name] = cur.amount;
      } else {
        acc[cur.jobTitle.name] += cur.amount;
      }
      acc.total = acc.total ? acc.total + cur.amount : cur.amount;
      return acc;
    }, {} as any);
    return {
      day: dayNames[item.day.day || 0],
      start: item.day.start,
      end: item.day.end,
      employees: Object.keys(emps)
        .sort((a, b) => {
          if (a.toLowerCase() === "total") {
            return 1;
          } else if (b.toLowerCase() === "total") {
            return -1;
          } else return a.localeCompare(b);
        })
        .map(key => `${key.pascalToWords()}: ${emps[key]}`)
        .join("\n"),
      billedHours:
        item.rules.reduce((acc, cur) => acc + cur.amount, 0) * duration
    };
  });
});

// Methods

const onDelete = () => {
  const ids = selectedJobTitles.value.map((i: any) => i.id);
  ids.forEach((i: string) => {
    jobModule.DELETE_DATA(i);
  });
};

// Watchers
// Sets store name and hours if vuex state changes
watchEffect(() => {
  const store = storeModule.GET_ALL.value;
  if (Object.keys(store).length > 0) {
    storeName.value = store.name;
    const hours = storeHours.value.map((item, index) => {
      const hour = store.storeHours.find(item => item.day.day === index);
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
  }
});
</script>
<style scoped lang="postcss"></style>
