<template>
  <div>
    <div class="flex justify-between">
      <div>
        <Select />
      </div>
      <div class="flex gap-3">
        <Button>Set Default Schedule</Button>
        <Button>Edit Schedule</Button>
        <Button>Generate Schedule</Button>
      </div>
    </div>
    <div class="my-3">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Select from "@/components/inputs/Select.vue";
import Button from "@/components/Button.vue";
import FullCalendar, { CalendarOptions, EventInput } from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { getModule } from "vuex-module-decorators";
import StoreModule from "@/store/modules/store";
import { useStore } from "@/store";
import { ref } from "vue";
// Prop and prop interface

// Use hooks
const storeModule = getModule(StoreModule, useStore());

// Data
const events = [
  {
    id: "a",
    title: "test event",
    start: Date.parse("2021-09-28T09:00:00"),
    end: Date.parse("2021-09-28T13:00:00")
  }
] as EventInput[];
const calendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: "timeGridWeek",
  weekends: true,
  editable: true,
  allDaySlot: false,
  slotMinTime: storeModule.GET_STORE_HOURS.sort((a, b) =>
    a.day.start.localeCompare(b.day.start)
  )[0].day.start,
  slotMaxTime: storeModule.GET_STORE_HOURS.sort(
    (a, b) => a.day.end.localeCompare(b.day.end) * -1
  )[0].day.end,
  events
} as CalendarOptions);

// Computed

// Methods

// Watchers
</script>
<style scoped lang="postcss"></style>
