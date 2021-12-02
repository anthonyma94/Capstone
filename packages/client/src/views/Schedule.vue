<template>
  <div>
    <div class="flex flex-row-reverse">
      <div class="flex gap-3" v-if="!editable && authModule.IS_ADMIN">
        <Button
          @click="showDefaultScheduleModal = true"
          :disabled="isDefaultSchedule"
          >Set Schedule as Default</Button
        >
        <Button @click="editable = true">Edit Schedule</Button>
        <Button @click="showGenerateModal = true">Generate Schedule</Button>
      </div>
      <div class="flex gap-3" v-else-if="editable && authModule.IS_ADMIN">
        <Button @click="editable = false">Done</Button>
      </div>
    </div>
    <div class="my-3">
      <span v-if="isDefaultSchedule" class="text-lg opacity-60 font-bold"
        >Default Schedule</span
      >
      <Calendar
        :editable="editable"
        @update:week-start="e => (weekStart = e)"
      />
    </div>
    <Dialog
      header="Choose a week to generate schedule"
      :modal="true"
      v-model:visible="showGenerateModal"
    >
      <div class="flex flex-col gap-2">
        <CalendarPicker
          v-model="generateWeekStart"
          :inline="true"
          selection-mode="range"
          @update:model-value="handleCalendarPickerUpdate"
          :disabledDays="[1, 2, 3, 4, 5, 6]"
          :disabled-dates="disabledGenerateDates"
          :min-date="minDate"
        />
        <div class="flex flex-row-reverse gap-2 w-full">
          <Button
            :disabled="!generateWeekStart || generateWeekStart.length === 0"
            :loading="loadingGenerateSchedule"
            loading-text="Generating..."
            @click="handleConfirmGenerate"
            >Confirm</Button
          >
          <Button class="btn-outline-danger" @click="showGenerateModal = false"
            >Cancel</Button
          >
        </div>
      </div>
    </Dialog>
    <Dialog :modal="true" v-model:visible="showDefaultScheduleModal">
      <div class="text-center my-3">
        <h2>
          This will set the schedule between
          {{ dayjs(weekStart).format("MMM D") }} and
          {{
            dayjs(weekStart)
              .add(6, "days")
              .format("MMM D")
          }}
          as default.
        </h2>
        <br />
        <h4>
          All future generated schedules will be based from this schedule.
        </h4>
        <h4>All previous default schedules will be removed from default.</h4>
        <h4 class="font-bold">Are you sure?</h4>
      </div>

      <div class="flex flex-row-reverse gap-2 w-full">
        <Button
          @click="handleConfirmDefaultSchedule"
          :loading="loadingDefaultSchedule"
          >Confirm</Button
        >
        <Button
          class="btn-outline-danger"
          @click="showDefaultScheduleModal = false"
          >Cancel</Button
        >
      </div>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import Button from "@/components/Button.vue";
import Calendar from "@/components/Calendar.vue";
import Dialog from "primevue/dialog";
import CalendarPicker from "primevue/calendar";
import { computed, ref } from "@vue/reactivity";
import { getModule } from "vuex-module-decorators";
import StoreModule from "@/store/modules/store";
import { useStore } from "@/store";
import dayjs from "dayjs";
import AuthModule from "@/store/modules/auth";
import { asyncComputed } from "@vueuse/core";
// Prop and prop interface

// Use hooks
const storeModule = getModule(StoreModule, useStore());
const authModule = getModule(AuthModule, useStore());

// Data
const showGenerateModal = ref(false);
const loadingGenerateSchedule = ref(false);
const showDefaultScheduleModal = ref(false);
const generateWeekStart = ref<Date[]>();
const loadingDefaultSchedule = ref(false);
const editable = ref(false);
const weekStart = ref<Date>();

// Computed
const minDate = computed(() => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  date.setDate(date.getDate() + (dayOfWeek % 7) || 7);
  return date;
});
const isDefaultSchedule = computed(() => storeModule.SCHEDULE_IS_DEFAULT.value);

// Methods
const handleCalendarPickerUpdate = (e: [Date, Date | undefined]) => {
  if (e[0]) {
    const firstDate = e[0];
    const secondDate = new Date(firstDate);
    secondDate.setDate(secondDate.getDate() + 6);
    generateWeekStart.value = [firstDate, secondDate];
  }
};

const disabledGenerateDates = asyncComputed(async () => {
  const res = await storeModule.SCHEDULE_START_DATES();
  return res;
}, []);

const handleConfirmGenerate = async () => {
  if (generateWeekStart.value && generateWeekStart.value[0]) {
    loadingGenerateSchedule.value = true;
    await storeModule.GENERATE_SCHEDULE(generateWeekStart.value[0]);
    await storeModule.UPDATE_SCHEDULE(weekStart.value!);
    loadingGenerateSchedule.value = false;
    generateWeekStart.value = [];
    showGenerateModal.value = false;
  }
};

const handleConfirmDefaultSchedule = async () => {
  loadingDefaultSchedule.value = true;

  await storeModule.SET_DEFAULT_SCHEDULE(weekStart.value!);
  loadingDefaultSchedule.value = false;
  showDefaultScheduleModal.value = false;
};
// Watchers
</script>
<style scoped lang="postcss"></style>
