<template>
  <Dialog
    :modal="true"
    header="Add Shift Schedule Rule"
    :draggable="false"
    :dismissable-mask="true"
    :keep-in-view-port="true"
    :min-x="0"
    :min-y="0"
    @hide="resetForm"
    v-model:visible="internalVisible"
  >
    <div class="flex justify-between">
      <div class="flex-grow w-64">
        <Dropdown
          v-model="type"
          :options="selectOptions"
          optionLabel="name"
          optionValue="value"
        />
      </div>
    </div>
    <div class="grid grid-cols-4 gap-10 mt-3" v-if="type === 'recurring'">
      <div class="flex flex-col mx-auto w-full gap-1">
        <h3 class="mb-6">Shift Days</h3>
        <div
          class="flex justify-between gap-3"
          v-for="(name, index) in dayNames"
          :key="name"
        >
          <span>{{ name }}</span>
          <Checkbox
            name="dayName"
            :value="index"
            v-model="recurringFormData.days"
          />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <h3>Shift Times</h3>
        <span class="text-sm">Shift must be at least 3 hours.</span>
        <Calendar
          placeholder="Start"
          v-model="recurringFormData.start"
          hourFormat="12"
          :time-only="true"
        />
        <Calendar
          placeholder="End"
          v-model="recurringFormData.end"
          hourFormat="12"
          :time-only="true"
        />
      </div>
      <div class="col-span-2">
        <div class="flex justify-between">
          <h3>Employees</h3>
          <Button class="btn-sm" @click="addEmpDataRow">Add</Button>
        </div>
        <div
          v-for="num in Array.from(Array(rowsOfEmp).keys())"
          :key="num"
          class="flex gap-3 my-3"
        >
          <Dropdown
            placeholder="Job Title"
            :options="jobTitleOptions"
            option-label="name"
            option-value="value"
            v-model="recurringFormData.employees[num].jobId"
          />
          <Input
            placeholder="Number of Employees"
            type="number"
            v-model="recurringFormData.employees[num].amount"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row-reverse gap-3 place-items-center">
        <Button :disabled="recurringFormData$.$invalid" @click="handleSubmit"
          >Save</Button
        >
        <Button class="btn-outline-danger" @click="resetForm">Cancel</Button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import dayNames from "@/assets/dayNames";
import Checkbox from "primevue/checkbox";
import { watch, computed, ref, onMounted } from "vue";
import Calendar from "primevue/calendar";
import Button from "@/components/Button.vue";
import Input from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { getModule } from "vuex-module-decorators";
import JobTitleModule from "@/store/modules/jobTitle";
import { useStore } from "@/store";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import dayjs from "dayjs";
import ScheduleRuleModule from "@/store/modules/scheduleRule";
// Prop and prop interface

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// Use hooks
const jobModule = getModule(JobTitleModule, useStore());
const ruleModule = getModule(ScheduleRuleModule, useStore());

// Data
const selectOptions = [
  { value: "recurring", name: "Recurring" },
  { value: "one-time", name: "One-Time" }
];

const type = ref<"recurring" | "one-time">("recurring");
const internalVisible = ref(props.visible);

const recurringFormData = ref({
  days: [] as number[],
  start: undefined as Date | undefined,
  end: undefined as Date | undefined,
  employees: [
    {
      jobId: "",
      amount: ""
    }
  ] as {
    jobId: string;
    amount: string;
  }[]
});

const rowsOfEmp = ref(1);

const empRowRequired = (value: any) =>
  value.some((item: any) => !!item.jobId && !!item.amount);

const recurringShiftEnd = (value: any) =>
  dayjs(value).isAfter(
    dayjs(recurringFormData.value.start)
      .add(3, "hours")
      .subtract(1, "minute")
  );

const rules = {
  recurringFormData: {
    days: { required },
    start: { required },
    end: { required, afterStart: recurringShiftEnd },
    employees: { required: empRowRequired }
  }
};

const recurringFormData$ = useVuelidate(
  rules,
  { recurringFormData },
  { $autoDirty: true }
);

// Computed
const jobTitleOptions = computed(() =>
  jobModule.GET_ALL.value.map(item => {
    return {
      name: item.name,
      value: item.id
    };
  })
);

// Methods

const handleSubmit = async () => {
  if (type.value === "recurring") {
    const data: {
      type: "recurring";
      days: number[];
      start: Date;
      end: Date;
      employees: { jobId: string; amount: number }[];
    } = {
      type: type.value,
      start: recurringFormData.value.start!,
      end: recurringFormData.value.end!,
      days: recurringFormData.value.days,
      employees: recurringFormData.value.employees
        .filter(x => !!x.jobId && !!x.amount)
        .map(x => {
          return {
            ...x,
            amount: parseInt(x.amount)
          };
        })
    };

    await ruleModule.ADD_SCHEDULE_RULE(data);
  }

  resetForm();
};

const resetForm = () => {
  internalVisible.value = false;
  recurringFormData.value = {
    days: [],
    start: undefined as Date | undefined,
    end: undefined as Date | undefined,
    employees: [
      {
        jobId: "",
        amount: ""
      }
    ] as {
      jobId: string;
      amount: string;
    }[]
  };
  rowsOfEmp.value = 1;
};

const addEmpDataRow = () => {
  recurringFormData.value.employees.push({ jobId: "", amount: "" });
  rowsOfEmp.value++;
};

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
