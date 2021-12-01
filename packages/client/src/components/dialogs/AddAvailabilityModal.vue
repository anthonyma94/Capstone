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
                placeholder="09:00 AM"
              />
              <!-- <Input
                placeholder="9:00"
                :show-label="false"
                v-model="availabilityRef[index].start"
                /> -->
            </td>
            <td>
              <Calendar
                v-model="availabilityRef[index].end"
                :show-time="true"
                hour-format="12"
                :time-only="true"
                :step-minute="15"
                placeholder="06:00 PM"
              />
              <!-- <Input
                placeholder="18:00"
                :show-label="false"
                v-model="availabilityRef[index].end"
              /> -->
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
import { Person } from "@/store/modules/person/types";
import { DayItem } from "@/store/modules/dayItem";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
// Prop and prop interface

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

// Use hooks
const personModule = getModule(PersonModule, useStore());
const route = useRoute();

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

// Computed

// Methods
const onAvailabilitySubmit = async (e: any) => {
  e.preventDefault();
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
  availabilityRef.value = [...Array(7).keys()].map(_ => {
    return {
      start: undefined,
      end: undefined
    };
  });
  emits("update:visible", false);
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
