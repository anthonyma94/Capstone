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
</template>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import dayNames from "@/assets/dayNames";
import Input from "@/components/inputs/Input.vue";
import Button from "@/components/Button.vue";
import { ref, watch } from "vue";
import { getModule } from "vuex-module-decorators";
import PersonModule from "@/store/modules/person";
import { useStore } from "@/store";
import { Person } from "@/store/modules/person/types";
import { DayItem } from "@/store/modules/dayItem";
import { useRoute } from "vue-router";
import AuthModule from "@/store/modules/auth";
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
      start: "",
      end: ""
    };
  })
);

const internalVisible = ref(props.visible);

// Computed

// Methods
const onAvailabilitySubmit = async (e: any) => {
  e.preventDefault();
  const values: Person["availabilities"] = availabilityRef.value
    .map((i, idx) => ({
      id: "",
      isApproved: true,
      day: {
        day: idx,
        start: i.start,
        end: i.end
      } as DayItem
    }))
    .filter(i => i.day.start && i.day.end);
  await personModule.ADD_AVAILABILITY({
    id: route.params.id as string,
    data: values
  });
  availabilityRef.value = [...Array(7).keys()].map(_ => {
    return {
      start: "",
      end: ""
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
