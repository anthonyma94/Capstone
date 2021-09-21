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
        <!-- <Input
            class="col-span-2 md:col-span-1"
            placeholder="City"
            // v-model={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.v-model })}
          /> 
          <Input
            class="col-span-2 md:col-span-1"
            placeholder="Province"
            // v-model={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.v-model })}
          /> 
          <Input
            class="col-span-2 md:col-span-1"
            placeholder="Postal Code"
            // v-model={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.v-model })}
          /> -->
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
    <Toolbar>
      <template #left>
        <Button
          @click="toggles.showAddAvailability = !toggles.showAddAvailability"
          >Add Availability</Button
        >
      </template>
    </Toolbar>
    <DataTable :columns="columns" :data="computedAvailabilities"></DataTable>
    <Dialog
      :modal="true"
      header="Add Availability"
      :draggable="false"
      :dismissable-mask="true"
      :keep-in-view-port="true"
      :min-x="0"
      :min-y="0"
      v-model:visible="toggles.showAddAvailability"
    >
      <form @submit="onAvailabilitySubmit">
        <table class="table-fixed w-full max-w-sm">
          <thead>
            <tr>
              <th></th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in dayNames" :key="day">
              <th>{{ day }}</th>
              <td>
                <Input
                  placeholder="9:00"
                  :show-label="false"
                  v-model="availabilityRef[index].start"
                />
              </td>
              <td>
                <Input
                  placeholder="18:00"
                  :show-label="false"
                  v-model="availabilityRef[index].end"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end gap-3 mt-3">
          <Button class="btn-danger">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import DataTable from "@/components/DataTable.vue";
import Select from "@/components/Select.vue";
import usePerson from "@/store/modules/person/hook";
import Toolbar from "primevue/toolbar";
import Dialog from "primevue/dialog";
import { useRoute } from "vue-router";
import { computed, watchEffect } from "@vue/runtime-core";
import { ref } from "vue";
import { required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { Person } from "@/store/modules/person/types";
import createGuid from "@/services/guid";
import person from "@/store/modules/person";
import useJobTitle from "@/store/modules/jobTitle/hook";

// Props and prop interface

// Use hooks
const personHook = usePerson();
const jobHook = useJobTitle();
const route = useRoute();

// Data
interface PersonRef
  extends Omit<Person, "jobTitle" | "pay" | "maxWeeklyHours" | "role"> {
  jobTitle: string;
  pay: string;
  maxWeeklyHours: string;
  role: string;
}
const data = ref<PersonRef>({
  id: "",
  firstName: "",
  lastName: "",
  address: "",
  province: "",
  postal: "",
  jobTitle: "",
  role: "",
  pay: "",
  phone: "",
  maxWeeklyHours: "",
  availabilities: []
});

const availabilityRef = ref(
  [...Array(7).keys()].map(_ => {
    return {
      start: "",
      end: ""
    };
  })
);

const rules = {
  firstName: { required },
  lastName: { required }
};

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const columns: InstanceType<typeof DataTable>["columns"] = [
  {
    title: "Day",
    selector: "day"
  },
  {
    title: "Start",
    selector: "start"
  },
  {
    title: "End",
    selector: "end"
  }
];

const v$ = useVuelidate(rules, data, { $autoDirty: true });

const toggles = ref({
  showAddAvailability: false
});

// Computed
const computedAvailabilities = computed(() =>
  data.value.availabilities.map(i => {
    return {
      id: i.id,
      day: dayNames[i.day.day!],
      start: i.day.start,
      end: i.day.end
    };
  })
);

const computedPerson = computed(() => {
  return {
    ...data.value,
    jobTitle: jobTitles.value.find(x => x.name === data.value.jobTitle),
    availabilities: data.value.availabilities.map(i => {
      return {
        id: i.id,
        day: dayNames[i.day.day!],
        start: i.day.start,
        end: i.day.end
      };
    })
  };
});

const jobTitles = computed(() => jobHook.GET_ALL());

// Methods
const onSaveClick = async (e: MouseEvent) => {
  await personHook.UPDATE_DATA(data.value);
};

const onAvailabilitySubmit = (e: any) => {
  e.preventDefault();
  toggles.value.showAddAvailability = false;
  const values = availabilityRef.value
    .map((i, idx) => {
      if (i.start && i.end)
        return {
          day: idx,
          start: i.start,
          end: i.end
        };
      else return;
    })
    .filter(i => !!i);
  values.forEach(item => {
    data.value.availabilities.push({
      id: createGuid(),
      isApproved: true,
      day: {
        id: createGuid(),
        day: item!.day,
        start: item!.start,
        end: item!.end
      }
    });
  });
  availabilityRef.value = [...Array(7).keys()].map(_ => {
    return {
      start: "",
      end: ""
    };
  });
};

// Watch

// Updates page data if given person ID
watchEffect(() => {
  if (route.params.id !== "new") {
    const person = personHook.GET_BY_ID(route.params.id as string);
    if (person) {
      data.value = {
        ...person,
        pay: person.pay.toString() || "",
        maxWeeklyHours: person.maxWeeklyHours.toString() || ""
      };
    }
  }
});
</script>
<style scoped lang="postcss"></style>
