<template>
  <div>
    <Toast />
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
            @click="handleStoreNameChange"
          >
            Save
          </Button>
        </div>
      </div>
      <div>
        <div class="flex justify-around">
          <h1>Store Hours</h1>
          <Button
            v-if="authModule.IS_ADMIN"
            @click="handleHourChange"
            :disabled="v$.start.$invalid || v$.end.$invalid"
          >
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
                  v-if="!authModule.IS_ADMIN"
                  :model-value="dateToTimeString(storeHours[index].start)"
                  :disabled="true"
                />
                <Calendar
                  v-model="storeHours[index].start"
                  :timeOnly="true"
                  v-else
                  placeholder="09:00 AM"
                  hourFormat="12"
                  :step-minute="30"
                  :manual-input="true"
                />
              </td>
              <td>
                <Input
                  v-if="!authModule.IS_ADMIN"
                  :model-value="dateToTimeString(storeHours[index].end)"
                  :disabled="true"
                />
                <Calendar
                  v-model="storeHours[index].end"
                  v-else
                  :timeOnly="true"
                  placeholder="08:00 PM"
                  hourFormat="12"
                  :keep-invalid="!authModule.IS_ADMIN"
                  :step-minute="30"
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
      <ShiftSchedulingModal
        v-model:visible="toggles.showShiftSchedule"
        :id="selectedScheduleRuleId"
      />
      <DataTable
        v-model="scheduleRuleData"
        :cols="scheduleRuleTitleCols"
        :editable="false"
        :deletable="false"
        :selectable-row="true"
        @row-select="handleShiftRowSelect"
      >
        <template #toolbar>
          <Toolbar class="w-full mr-4">
            <template #left>
              <Button
                @click="
                  toggles.showShiftSchedule = !toggles.showShiftSchedule;
                  selectedScheduleRuleId = '';
                "
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
        v-model="computedJobTitle"
        :cols="titleCols"
        :editable="false"
        :deletable="checkJobTitleDeletable"
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
                      toggles.addJob = false;
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
import ShiftSchedulingModal from "@/components/dialogs/ShiftSchedulingModal.vue";
import dayjs, { Dayjs } from "dayjs";
import AuthModule from "@/store/modules/auth";
import { convertTo12Hour, localecompareDaynames } from "@/services/dates";
import Calendar from "primevue/calendar";
import PersonModule from "@/store/modules/person";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

// Use hooks

const storeModule = getModule(StoreModule, useStore());
const jobModule = getModule(JobTitleModule, useStore());
const scheduleRuleModule = getModule(ScheduleRuleModule, useStore());
const authModule = getModule(AuthModule, useStore());
const personModule = getModule(PersonModule, useStore());
const toast = useToast();

// Data
const storeName = ref("");
const newJobTitle = ref("");
const selectedScheduleRuleId = ref("");

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
  showShiftSchedule: false
});

const unique = (value: any) => {
  return !jobModule.GET_ALL.value
    .map(x => x.name.toLowerCase().trim())
    .includes(value.toLowerCase().trim());
};

const allRequired = (value: any) => {
  return !storeHours.value.every(x => !x.start && !x.end);
};

const bothRequired = (param: any) => (value: any) => {
  const check = storeHours.value[param];
  if (!check.start && !check.end) {
    return true;
  } else {
    const start = check.start ? dayjs(check.start) : undefined;
    const end = check.end ? dayjs(check.end) : undefined;

    const res = start && end && end.isAfter(start);
    return res;
  }
};

const rules = {
  storeName: { required },
  newJobTitle: {
    required: helpers.withMessage("This field is required.", required),
    unique: helpers.withMessage("Job title must be unique.", unique)
  },
  start: [...Array(7).keys()].reduce((acc, cur) => {
    acc[cur] = {
      // rules for start here
      required: bothRequired(cur),
      allRequired
    };
    return acc;
  }, {} as any),
  end: [...Array(7).keys()].reduce((acc, cur) => {
    acc[cur] = {
      // rules for end here
      required: bothRequired(cur),
      allRequired
    };
    return acc;
  }, {} as any)
};
const v$ = useVuelidate(
  rules,
  {
    storeName,
    newJobTitle,
    ...storeHours.value.reduce(
      (acc, cur, index) => {
        acc.start[index] = cur.start;
        acc.end[index] = cur.end;
        return acc;
      },
      {
        start: {} as { [index: number]: Date | undefined },
        end: {} as { [index: number]: Date | undefined }
      }
    )
  },
  { $autoDirty: true }
);

// const availability$ = useVuelidate(
//   rules,
//   availabilityRef.value.reduce(
//     (acc, cur, index) => {
//       acc.start[index] = cur.start;
//       acc.end[index] = cur.end;
//       return acc;
//     },
//     {
//       start: {} as { [index: number]: Date | undefined },
//       end: {} as { [index: number]: Date | undefined }
//     }
//   ),
//   { $autoDirty: true }
// );

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
const scheduleRuleData = computed<
  {
    id: string;
    day: string;
    start: string;
    end: string;
    employees: string;
    billedHours: number;
  }[]
>(() => {
  if (scheduleRuleModule.GET_ALL.value?.length > 0) {
    return scheduleRuleModule.GET_ALL.value.map(item => {
      let start: Dayjs;
      let end: Dayjs;
      if (item.day.day !== undefined && item.day.day !== null) {
        start = dayjs(item.day.start, "HH:mm");
        end = dayjs(item.day.end, "HH:mm");
      } else if (item.day.date) {
        start = dayjs(`${item.day.date} ${item.day.start}`, "YYYY-MM-DD HH:mm");
        end = dayjs(`${item.day.date} ${item.day.end}`, "YYYY-MM-DD HH:mm");
      } else throw new Error("Missing weekday and date.");
      const duration = end.diff(start, "hour", true);
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
        id: item.id,
        day:
          item.day.day !== undefined && item.day.day !== null
            ? dayNames[item.day.day]
            : start.format("MMM DD, YYYY"),
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
    const itemsDeleted = jobModule.GET_ALL.value.filter(
      x => !newValue.map(x => x.id).includes(x.id)
    );

    for (const item of itemsDeleted) {
      await jobModule.DELETE_DATA(item.id);
    }
  }
});

// Methods

const dateToTimeString = (e: Date | undefined) => {
  if (e) {
    return dayjs(e).format("hh:mm A");
  }
  return "";
};

const checkJobTitleDeletable = (e: any) => {
  const res = e.numOfEmps === 0;
  return res;
};

const handleShiftRowSelect = (e: any) => {
  toggles.value.showShiftSchedule = true;
  selectedScheduleRuleId.value = e;
};

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
  await storeModule.CHANGE_HOURS({ id: storeModule.GET_ALL.value.id, data });
  toast.add({ severity: "info", summary: "Store hours changed.", life: 3000 });
  toast.add({
    severity: "warn",
    summary: "Warning",
    detail: "Please change any corresponding shift rules as well."
  });
};

const handleStoreNameChange = async () => {
  await storeModule.CHANGE_NAME({
    id: storeModule.GET_ALL.value.id,
    name: storeName.value
  });
  toast.add({ severity: "info", summary: "Store name changed.", life: 3000 });
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
