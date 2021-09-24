<template>
  <div>
    <div class="flex justify-between">
      <h1>Employee Info</h1>
      <Button @click="onSaveClick">Save</Button>
    </div>
    <form>
      <div class="grid gap-4 grid-cols-4">
        <Input
          class="col-span-2"
          placeholder="First Name"
          v-model="data.firstName"
          autofocus
          :invalid="v$.firstName.$error"
        />
        <Input
          class="col-span-2"
          placeholder="Last Name"
          v-model="data.lastName"
        />
        <Input
          class="col-span-4"
          placeholder="Address"
          v-model="data.address"
        />
        <Input class="col-span-2" placeholder="City" v-model="data.city" />
        <Input
          class="col-span-1"
          placeholder="Province"
          v-model="data.province"
        />
        <Input
          class="col-span-1"
          placeholder="Postal Code"
          v-model="data.postal"
        />
        <Input
          class="col-span-2 md:col-span-1"
          placeholder="Phone Number"
          v-model="data.phone"
        />
        <Select
          class="col-span-2 md:col-span-1"
          placeholder="Role"
          :options="['FT', 'PT']"
          v-model="data.role"
        />
        <Input
          class="col-span-2 md:col-span-1"
          placeholder="Wage"
          v-model="data.pay"
        />
        <Select
          class="col-span-2 md:col-span-1"
          placeholder="Job"
          :options="jobTitles.map(x => x.name).sort()"
          v-model="data.jobTitle"
        />
        <Input
          class="col-span-2 md:col-span-1"
          placeholder="Hours"
          v-model="data.maxWeeklyHours"
        />
      </div>
    </form>
    <hr />
    <h1>Availability</h1>
    <DataTable
      v-if="computedAvailabilities.length > 0"
      key="id"
      :cols="availabilityCols"
      v-model="computedAvailabilities"
      @update:model-value="onAvailabilityUpdate"
    >
      <template #toolbar>
        <Button @click="showAddAvailability = !showAddAvailability"
          >Add Availability</Button
        >
      </template>
    </DataTable>
    <AddAvailabilityModal v-model:visible="showAddAvailability" />
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/inputs/Input.vue";
import DataTable from "@/components/DataTable.vue";
import Select from "@/components/inputs/Select.vue";
import dayNames from "@/assets/dayNames";
import { useRoute } from "vue-router";
import { computed, watchEffect } from "@vue/runtime-core";
import { ref } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { Person } from "@/store/modules/person/types";
import { getModule } from "vuex-module-decorators";
import PersonModule from "@/store/modules/person";
import { useStore } from "@/store";
import JobTitleModule from "@/store/modules/jobTitle";
import AddAvailabilityModal from "@/components/dialogs/AddAvailabilityModal.vue";

// Props and prop interface

// Use hooks
// const personHook = usePerson();
const store = useStore();
const personModule = getModule(PersonModule, store);
// const jobHook = useJobTitle();
const jobModule = getModule(JobTitleModule, store);
const route = useRoute();

// Data
interface PersonRef
  extends Omit<Person, "jobTitle" | "pay" | "maxWeeklyHours" | "role"> {
  jobTitle: string;
  pay: string;
  maxWeeklyHours: string;
  role: string;
}

const availabilityCols: InstanceType<typeof DataTable>["$props"]["cols"] = [
  {
    id: "day",
    editable: false,
    sortFunc: (x, y) => {
      const sortNames = dayNames.map(i => i.toLowerCase());
      if (
        sortNames.indexOf((x as string).toLowerCase()) >
        sortNames.indexOf((y as string).toLowerCase())
      ) {
        return 1;
      } else if (
        sortNames.indexOf((x as string).toLowerCase()) <
        sortNames.indexOf((y as string).toLowerCase())
      ) {
        return -1;
      } else return 0;
    }
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

const rules = {
  firstName: { required },
  lastName: { required }
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
        start: i.day.start,
        end: i.day.end
      };
    }),
  set: async val => {
    if (val.length < computedAvailabilities.value.length) {
      // Something is deleted
      const ids = val.map(i => i.id);
      const item = computedAvailabilities.value.find(x => !ids.includes(x.id))!;
      await personModule.REMOVE_AVAILABILITY({
        id: route.params.id as string,
        item: {
          id: item.id,
          isApproved: true,
          day: {
            id: "",
            start: item.start,
            end: item.end,
            day: parseInt(item.day)
          }
        }
      });
    } else {
      console.log(val);
    }
  }
});

// const computedPerson = computed(() => {
//   return {
//     ...data.value,
//     jobTitle: jobTitles.value.find(x => x.name === data.value.jobTitle)!,
//     // availabilities: data.value.availabilities.map(i => {
//     //   return {
//     //     id: i.id,
//     //     day: dayNames[i.day.day!],
//     //     start: i.day.start,
//     //     end: i.day.end,
//     //   } as Person["availabilities"];
//     role: data.value.role as "FT" | "PT",
//     pay: parseFloat(data.value.pay),
//     maxWeeklyHours: parseInt(data.value.maxWeeklyHours)
//   };
// });

const jobTitles = jobModule.GET_ALL;

// Methods
const onAvailabilityUpdate = async (e: any) => {
  // console.log(e)
};
const onSaveClick = async (e: MouseEvent) => {
  // await personHook.UPDATE_DATA(data.value);
  // await personModule.UPDATE_DATA(computedPerson.value);
};

// Watch

// Updates page data if given person ID
watchEffect(() => {
  if (route.params.id !== "new") {
    const person = personModule.GET_BY_ID(route.params.id as string);
    if (person.value) {
      data.value = {
        ...person.value,
        pay: person.value.pay.toString() || "",
        maxWeeklyHours: person.value.maxWeeklyHours.toString() || "",
        jobTitle: person.value.jobTitle.name
      };
    }
  }
});
</script>
<style scoped lang="postcss"></style>
