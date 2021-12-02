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
    <span>Each availability must span at least 3 hours.</span>
    <Toast group="availabilityError">
      <template #message="slotProps">
        <div class="p-d-flex p-flex-column">
          <div class="p-text-center">
            <h4>{{ slotProps.message.summary }}</h4>
            <p
              v-for="(message, index) in slotProps.message.detail"
              :key="index"
            >
              {{ message }}
            </p>
          </div>
        </div>
      </template>
    </Toast>
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
              <Calendar
                v-model="availabilityRef[index].start"
                :show-time="true"
                hour-format="12"
                :time-only="true"
                :step-minute="15"
                :placeholder="getPlaceholder(index)[0]"
              />
            </td>
            <td>
              <Calendar
                v-model="availabilityRef[index].end"
                :show-time="true"
                hour-format="12"
                :time-only="true"
                :step-minute="15"
                :placeholder="getPlaceholder(index)[1]"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end gap-3 mt-3">
        <Button class="btn-danger">Cancel</Button>
        <Button type="submit" :disabled="availability$.$invalid">Save</Button>
      </div>
    </form>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import dayNames from "@/assets/dayNames";
import Calendar from "primevue/calendar";
import Button from "@/components/Button.vue";
import { ref, watch } from "vue";
import { getModule } from "vuex-module-decorators";
import PersonModule from "@/store/modules/person";
import { useStore } from "@/store";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import StoreModule from "@/store/modules/store";
import useVuelidate from "@vuelidate/core";
import { Person } from "@/store/modules/person/types";
// Prop and prop interface

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// Use hooks
const personModule = getModule(PersonModule, useStore());
const storeModule = getModule(StoreModule, useStore());
const route = useRoute();
const toast = useToast();

// Data
const availabilityRef = ref(
  [...Array(7).keys()].map(_ => {
    return {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined
    };
  })
);

const internalVisible = ref(props.visible);

const bothRequired = (param: any) => (value: any) => {
  const check = availabilityRef.value[param];
  if (!check.start && !check.end) {
    return true;
  } else {
    const start = check.start ? dayjs(check.start) : undefined;
    const end = check.end ? dayjs(check.end) : undefined;

    const res = start && end && end.isSameOrAfter(start.add(3, "hours"));
    return res;
  }
};

const allRequired = (value: any) => {
  return !availabilityRef.value.every(x => !x.start && !x.end);
};

const rules = {
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

const availability$ = useVuelidate(
  rules,
  availabilityRef.value.reduce(
    (acc, cur, index) => {
      acc.start[index] = cur.start;
      acc.end[index] = cur.end;
      return acc;
    },
    {
      start: {} as { [index: number]: Date | undefined },
      end: {} as { [index: number]: Date | undefined }
    }
  ),
  { $autoDirty: true }
);

// Computed

// Methods
const onAvailabilitySubmit = async (e: any) => {
  e.preventDefault();
  const originalAvailability = JSON.parse(
    JSON.stringify(
      personModule.GET_BY_ID(route.params.id as string).value?.availabilities ||
        []
    )
  ) as Person["availabilities"];
  const values = availabilityRef.value
    .map((i, idx) => {
      return {
        day: idx,
        start: i.start && dayjs(i.start).format("HH:mm"),
        end: i.end && dayjs(i.end).format("HH:mm")
      };
    })
    .filter(i => i.start && i.end) as any;
  await personModule.ADD_AVAILABILITY({
    personId: route.params.id as string,
    availabilities: values
  });
  const newAvailability =
    personModule.GET_BY_ID(route.params.id as string).value?.availabilities ||
    [];

  let missing = [];
  if (originalAvailability.length + values.length !== newAvailability.length) {
    missing = values.filter(
      (x: any) =>
        !newAvailability.find(
          y =>
            y.day.start === x.start &&
            y.day.end === x.end &&
            y.day.day === x.day &&
            !originalAvailability.map(x => x.id).includes(y.id)
        )
    );
  }

  if (missing.length === 0) {
    availabilityRef.value = [...Array(7).keys()].map(_ => {
      return {
        start: undefined,
        end: undefined
      };
    });
    emits("update:visible", false);
  } else {
    toast.add({
      severity: "error",
      group: "availabilityError",
      summary: "Availability change error",
      detail: [
        "The following availabilities were not added. Please check that they do not overlap with existing ones:",
        ...missing.map(
          (x: any) =>
            `${dayNames[x.day]} ${dayjs(x.start, "HH:mm").format(
              "hh:mm A"
            )}-${dayjs(x.end, "HH:mm").format("hh:mm A")}`
        )
      ] as any,
      life: 5000
    });
  }
};

const getPlaceholder = (day: number): [string, string] => {
  const hour = storeModule.GET_STORE_HOURS.value.find(x => x.day.day === day);
  return hour
    ? [
        dayjs(hour.day.start, "HH:mm").format("hh:mm A"),
        dayjs(hour.day.end, "HH:mm").format("hh:mm A")
      ]
    : ["09:00 AM", "06:00 PM"];
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
