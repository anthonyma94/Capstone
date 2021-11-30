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
            :disabled="!authModule.IS_ADMIN"
          />
          <Button
            class="flex-grow-0"
            v-if="authModule.IS_ADMIN"
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
          <Button v-if="authModule.IS_ADMIN" @click="handleHourChange">
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
                <!-- <Input
                  placeholder="9:00"
                  :show-label="false"
                  v-model="storeHours[index].start"
                  :disabled="!authModule.IS_ADMIN"
                /> -->
                <Calendar
                  v-model="storeHours[index].start"
                  :timeOnly="true"
                  placeholder="09:00 AM"
                  hourFormat="12"
                  :manual-input="true"
                />
              </td>
              <td>
                <!-- <Input
                  placeholder="18:00"
                  :show-label="false"
                  v-model="storeHours[index].end"
                  :disabled="!authModule.IS_ADMIN"
                /> -->
                <Calendar
                  v-model="storeHours[index].end"
                  :timeOnly="true"
                  placeholder="08:00 PM"
                  hourFormat="12"
                  :manual-input="true"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="authModule.IS_ADMIN">
      <hr />
      <h1>Shift Scheduling Rules</h1>
      <AddShiftSchedulingModal v-model:visible="toggles.addShiftSchedule" />
      <DataTable
        v-if="scheduleRuleData && scheduleRuleData.length > 0"
        v-model="scheduleRuleData"
        :cols="scheduleRuleTitleCols"
        :editable="false"
      >
        <template #toolbar>
          <Toolbar class="w-full mr-4">
            <template #left>
              <Button
                @click="toggles.addShiftSchedule = !toggles.addShiftSchedule"
              >
                Add
              </Button>
            </template>
          </Toolbar>
        </template>
      </DataTable>
      <hr />
      <h1>Job Titles</h1>
      <DataTable
        v-if="computedJobTitle.length > 0"
        v-model="computedJobTitle"
        :cols="titleCols"
        :editable="false"
      >
        <template #toolbar>
          <Toolbar class="w-full mr-4">
            <template #left>
              <div class="flex gap-3">
                <Button
                  @click="toggles.addJob = !toggles.addJob"
                  :class="{ 'btn-outline-danger': toggles.addJob }"
                >
                  {{ toggles.addJob ? "Cancel" : "Add" }}
                </Button>
                <div class="flex flex-col">
                  <InputText
                    v-model="newJobTitle"
                    v-if="toggles.addJob"
                    placeholder="New Job Title"
                    :class="{ 'p-invalid': v$.newJobTitle.$error }"
                  />
                  <span
                    class="text-danger text-sm"
                    v-if="v$.newJobTitle.$error && toggles.addJob"
                    >{{ v$.newJobTitle.$errors[0].$message || "" }}</span
                  >
                </div>
                <Button
                  v-if="toggles.addJob"
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
              </div>
            </template>
          </Toolbar>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
// Prop and prop interface

import { computed, onMounted, ref, watch } from "vue";
import Input from "@/components/inputs/Input.vue";
import Button from "@/components/Button.vue";
import DataTable from "@/components/DataTable.vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { getModule } from "vuex-module-decorators";
import StoreModule from "@/store/modules/store";
import { useStore } from "@/store";
import JobTitleModule from "@/store/modules/jobTitle";
import ScheduleRuleModule from "@/store/modules/scheduleRule";
import AddShiftSchedulingModal from "@/components/dialogs/AddShiftSchedulingModal.vue";
import dayjs from "dayjs";
import AuthModule from "@/store/modules/auth";
import { convertTo12Hour, localecompareDaynames } from "@/services/dates";
import Calendar from "primevue/calendar";
import PersonModule from "@/store/modules/person";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";

// Use hooks

const storeModule = getModule(StoreModule, useStore());
const jobModule = getModule(JobTitleModule, useStore());
const scheduleRuleModule = getModule(ScheduleRuleModule, useStore());
const authModule = getModule(AuthModule, useStore());
const personModule = getModule(PersonModule, useStore());

// Data
const storeName = ref("");
const newJobTitle = ref("");
const selectedJobTitles = ref();
const storeHours = ref<{ start?: Date; end?: Date; id?: string }[]>(
  [...Array(7).keys()].map(_ => {
    return {
      start: undefined,
      end: undefined
    };
  })
);

const toggles = ref({
  addJob: false,
  addShiftSchedule: false
});

const unique = (value: any) => {
  return !jobModule.GET_ALL.value
    .map(x => x.name.toLowerCase().trim())
    .includes(value.toLowerCase().trim());
};

const rules = {
  storeName: { required },
  newJobTitle: {
    required: helpers.withMessage("This field is required.", required),
    unique: helpers.withMessage("Job title must be unique.", unique)
  }
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
  },
  {
    id: "color",
    show: false
  }
];

const scheduleRuleTitleCols = [
  {
    name: "Day/Date",
    id: "day",
    sortFunc: localecompareDaynames
  },
  {
    name: "Total Billed Hours",
    id: "billedHours"
  }
];

// Computed
const scheduleRuleData = computed(() => {
  if (scheduleRuleModule.GET_ALL.value?.length > 0) {
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
        start: convertTo12Hour(item.day.start),
        end: convertTo12Hour(item.day.end),
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
  }
  return [];
});

const computedJobTitle = computed<
  {
    numOfEmps: number;
    id: string;
    name: string;
    color: string;
  }[]
>({
  get() {
    return (
      jobModule.GET_ALL.value.map(item => {
        return {
          ...item,
          numOfEmps: personModule.GET_ALL.value.filter(
            person => person.jobTitle.id === item.id
          ).length
        };
      }) || []
    );
  },
  async set(newValue) {
    console.log(newValue);

    const itemsDeleted = jobModule.GET_ALL.value.filter(
      x => !newValue.map(x => x.id).includes(x.id)
    );

    for (const item of itemsDeleted) {
      await jobModule.DELETE_DATA(item.id);
    }
  }
});

// Methods

const handleHourChange = async () => {
  const data = storeHours.value
    .filter(item => {
      const start = dayjs(item.start);
      const end = dayjs(item.end);
      const dayItemConvert = {
        day: start.day(),
        start: start.format("HH:mm"),
        end: end.format("HH:mm")
      };

      if (item.id) {
        const itemToCompare = storeModule.GET_STORE_HOURS.value.find(
          x => x.id === item.id
        )!;

        const res =
          itemToCompare.day.day === dayItemConvert.day &&
          itemToCompare.day.start === dayItemConvert.start &&
          itemToCompare.day.end === dayItemConvert.end;

        return !res;
      } else return true;
    })
    .map(item => {
      return {
        id: item.id,
        start: dayjs(item.start),
        end: dayjs(item.end)
      };
    });
  console.log(data);
  await storeModule.CHANGE_HOURS({ id: storeModule.GET_ALL.value.id, data });
};

const onDelete = () => {
  const ids = selectedJobTitles.value.map((i: any) => i.id);
  ids.forEach((i: string) => {
    jobModule.DELETE_DATA(i);
  });
};

const initStoreHours = () => {
  const hours = storeModule.GET_STORE_HOURS.value
    ?.sort((x, y) => x.day.day! - y.day.day!)
    .map((item, index) => {
      let hour;
      // If store hour for the weekday exists
      if (item.day.day === index) {
        hour = {
          start: dayjs(item.day.start, "HH:mm")
            .day(item.day.day)
            .toDate(),
          end: dayjs(item.day.end, "HH:mm")
            .day(item.day.day)
            .toDate(),
          id: item.id
        };
      } else {
        hour = {
          start: undefined,
          end: undefined,
          id: undefined
        };
      }
      return hour;
    });

  if (hours) {
    storeHours.value = hours;
  }
};

const initStoreName = () => {
  storeName.value = storeModule.GET_ALL.value.name;
};

// Watchers
watch(() => storeModule.GET_STORE_HOURS.value, initStoreHours);
watch(() => storeModule.GET_ALL.value.name, initStoreName);

onMounted(() => {
  initStoreHours();
  initStoreName();
});
</script>
<style scoped lang="postcss"></style>
