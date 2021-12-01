<template>
  <div>
    <Toast />
    <div class="flex justify-between">
      <h1>Employee Info</h1>
      <Button
        v-if="authModule.IS_ADMIN"
        @click="onSaveClick"
        :disabled="v$.$invalid"
        :loading="loadingAddPerson"
        >Save</Button
      >
    </div>
    <form>
      <div class="grid gap-4 grid-cols-4">
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2"
          placeholder="First Name"
          v-model="data.firstName"
          autofocus
          :invalid="v$.firstName.$error"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2"
          placeholder="Last Name"
          v-model="data.lastName"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-4"
          placeholder="Address"
          v-model="data.address"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2"
          placeholder="City"
          v-model="data.city"
        />
        <Select
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Province"
          :options="provinceOptions"
          v-model="data.province"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-1"
          placeholder="Postal Code"
          v-model="data.postal"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Phone Number"
          v-model="data.phone"
        />
        <Select
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Role"
          :options="['FT', 'PT']"
          v-model="data.role"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Wage"
          v-model="data.pay"
          type="number"
          step=".01"
        />
        <Select
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Job"
          :options="jobTitles"
          v-model="data.jobTitle"
        />
        <Input
          :disabled="!authModule.IS_ADMIN"
          class="col-span-2 md:col-span-1"
          placeholder="Hours"
          v-model="data.maxWeeklyHours"
          type="number"
        />
      </div>
    </form>
    <hr />
    <h1>Availability</h1>
    <DataTable
      key="id"
      :cols="availabilityCols"
      v-model="computedAvailabilities"
      :editable="authModule.IS_ADMIN"
      :deletable="authModule.IS_ADMIN"
    >
      <template #toolbar>
        <Toolbar class="w-full mr-6">
          <template #left>
            <Button
              v-if="authModule.IS_ADMIN"
              @click="showAddAvailability = !showAddAvailability"
              >Add Availability</Button
            >
          </template>
        </Toolbar>
      </template>
    </DataTable>
    <AddAvailabilityModal v-model:visible="showAddAvailability" />
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Button.vue";
import Toolbar from "primevue/toolbar";
import Input from "@/components/inputs/Input.vue";
import DataTable from "@/components/DataTable.vue";
import Select from "@/components/inputs/Select.vue";
import dayNames from "@/assets/dayNames";
import { useRoute } from "vue-router";
import { computed, onMounted, watch } from "@vue/runtime-core";
import { ref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { Person } from "@/store/modules/person/types";
import { getModule } from "vuex-module-decorators";
import PersonModule from "@/store/modules/person";
import { useStore } from "@/store";
import JobTitleModule from "@/store/modules/jobTitle";
import AddAvailabilityModal from "@/components/dialogs/AddAvailabilityModal.vue";
import AuthModule from "@/store/modules/auth";
import dayjs from "dayjs";
import {
  convertTo12Hour,
  localecompareDayjs,
  localecompareDaynames
} from "@/services/dates";
import provinceNames from "@/assets/provinceNames";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

// Props and prop interface

// Use hooks
const store = useStore();
const personModule = getModule(PersonModule, store);
const jobModule = getModule(JobTitleModule, store);
const authModule = getModule(AuthModule, store);
const route = useRoute();

// Data
interface PersonRef
  extends Omit<Person, "jobTitle" | "pay" | "maxWeeklyHours" | "role"> {
  jobTitle: string;
  pay: string;
  maxWeeklyHours: string;
  role: string;
}

const loadingAddPerson = ref(false);

const availabilityCols: InstanceType<typeof DataTable>["$props"]["cols"] = [
  {
    id: "day",
    editable: false,
    sortFunc: (x, y) => localecompareDaynames(x, y)
  },
  {
    id: "start",
    sortFunc: (x, y) =>
      localecompareDayjs(dayjs(x, "hh:mm A"), dayjs(y, "hh:mm A")),
    dataType: "time",
    validationFunc: x => dayjs(x, ["hh:mm A"]).isValid()
  },
  {
    id: "end",
    sortFunc: (x, y) =>
      localecompareDayjs(dayjs(x, "hh:mm A"), dayjs(y, "hh:mm A")),
    dataType: "time",
    validationFunc: x => dayjs(x, ["hh:mm A"]).isValid()
  }
];

const data = ref<PersonRef>({
  id: "",
  firstName: "",
  lastName: "",
  address: "",
  province: "",
  postal: "",
  city: "",
  jobTitle: "",
  role: "",
  pay: "",
  phone: "",
  maxWeeklyHours: "",
  availabilities: []
});

const toast = useToast();

const postalRegex = helpers.regex(/^\w\w\w\s?\w\w\w$/gi);
const phoneRegex = helpers.regex(/^\+?1?\d{10}$/gi);
const wage = (value: any) => getDecimalPlaces(parseFloat(value)) <= 2;

const getDecimalPlaces = (value: number) => {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
};

const rules = {
  firstName: { required },
  lastName: { required },
  address: { required },
  province: { required },
  postal: { required, postalRegex },
  city: { required },
  jobTitle: { required },
  role: { required },
  pay: { required, wage },
  phone: { required, phoneRegex },
  maxWeeklyHours: { required }
};

const showAddAvailability = ref(false);

const v$ = useVuelidate(rules, data, { $autoDirty: true });

// Computed
const computedAvailabilities = computed({
  get: () =>
    data.value.availabilities.map(i => {
      return {
        id: i.id,
        day: dayNames[i.day.day!],
        start: convertTo12Hour(i.day.start),
        end: convertTo12Hour(i.day.end)
      };
    }),
  set: async val => {
    if (val.length < computedAvailabilities.value.length) {
      // Something is deleted
      const ids = val.map(i => i.id);
      const deletedItem = computedAvailabilities.value.find(
        x => !ids.includes(x.id)
      )!;
      await personModule.REMOVE_AVAILABILITY({
        personId: route.params.id as string,
        availability: deletedItem.id
      });
    } else {
      // Something is changed
      const original = computedAvailabilities.value;
      let changedIndex: number | undefined = undefined;
      for (let i = 0; i < original.length; i++) {
        if (
          original[i].start !== val[i].start ||
          original[i].end !== val[i].end
        ) {
          changedIndex = i;
          break;
        }
      }

      if (changedIndex !== undefined) {
        const item = val[changedIndex];

        await personModule.EDIT_AVAILABILITY({
          id: data.value.id,
          availability: {
            ...item,
            day: dayNames.findIndex(x => x === item.day)!
          }
        });
      }
    }
  }
});

const jobTitles = jobModule.GET_ALL.value
  .map(item => {
    return {
      text: item.name,
      value: item.id
    };
  })
  .sort((x, y) => x.text.localeCompare(y.text));

const provinceOptions = Object.keys(provinceNames).map(key => {
  return {
    text: (provinceNames as any)[key],
    value: key
  };
});

// Methods
const onSaveClick = async () => {
  loadingAddPerson.value = true;
  const res: any = {
    ...data.value,
    pay: parseFloat(data.value.pay),
    maxWeeklyHours: parseFloat(data.value.maxWeeklyHours)
  };
  delete res.availabilities;

  await personModule.EDIT_PERSON(res);
  loadingAddPerson.value = false;

  toast.add({ severity: "info", summary: "Employee updated.", life: 3000 });
};

const initPersonData = () => {
  const person = personModule.GET_BY_ID(route.params.id as string);
  if (person.value) {
    data.value = {
      ...person.value,
      pay: person.value.pay.toString() || "",
      maxWeeklyHours: person.value.maxWeeklyHours.toString() || "",
      jobTitle: person.value.jobTitle.id
    };
  }
};

// Watch

// Updates page data if given person ID
watch(
  () => route.params.id,
  newVal => {
    if (newVal !== "new") {
      initPersonData();
    }
  }
);

onMounted(() => {
  initPersonData();
});
</script>
<style scoped lang="postcss"></style>
