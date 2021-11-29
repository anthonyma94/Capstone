<template>
  <div>
    <h1>Request Time Off</h1>
    <div class="flex gap-3 my-3">
      <Calendar
        id="start"
        v-model="start"
        :showTime="true"
        hour-format="12"
        class="w-full"
        placeholder="Start"
      />
      <Calendar
        placeholder="End"
        v-model="end"
        class="w-full"
        :showTime="true"
        hour-format="12"
      />
    </div>
    <Textarea
      placeholder="Reason"
      class="w-full block"
      v-model="reason"
      rows="3"
    />
    <Button class="btn-block my-5" :disabled="!isValid" @click="submitTimeOff"
      >Submit</Button
    >
    <hr />
    <h1>Submitted Time Off Requests</h1>
    <DataTable
      v-if="computedTimeOffs.length > 0"
      v-model="computedTimeOffs"
      :cols="timeCols"
      :editable="false"
      :deletable="false"
    />
  </div>
</template>
<script setup lang="ts">
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import { computed, onMounted, ref } from "vue";
import Button from "@/components/Button.vue";
import { getModule } from "vuex-module-decorators";
import RequestModule from "@/store/modules/request";
import { useStore } from "@/store";
import { LoadingTypes } from "@/store/types";
import AuthModule from "@/store/modules/auth";
import dayjs from "dayjs";
import DataTable from "@/components/DataTable.vue";
// Prop and prop interface

// Use hooks
const requestModule = getModule(RequestModule, useStore());
const authModule = getModule(AuthModule, useStore());

// Data
const start = ref<Date>();
const end = ref<Date>();
const reason = ref("");

// Computed

const isValid = computed(() => {
  return (
    !!start.value && !!end.value && !!reason.value && end.value > start.value
  );
});

const timeCols = [
  {
    id: "start",
    sortFunc: (a: string, b: string) => {
      const x = dayjs(a);
      const y = dayjs(b);
      return x.isBefore(y) ? -1 : x.isAfter(y) ? 1 : 0;
    }
  },
  {
    id: "end",
    sortFunc: (a: string, b: string) => {
      const x = dayjs(a);
      const y = dayjs(b);
      return x.isBefore(y) ? -1 : x.isAfter(y) ? 1 : 0;
    }
  }
];

const computedTimeOffs = computed(() => {
  return (
    requestModule.TIMEOFF_BY_PERSON(authModule.USER_ID).value.map(item => {
      return {
        id: item.id,
        start: dayjs(
          `${item.start.date} ${item.start.start}`,
          "YYYY-MM-DD HH:mm"
        ).format("MMM DD hh:mm A"),
        end: dayjs(
          `${item.end.date} ${item.end.start}`,
          "YYYY-MM-DD HH:mm"
        ).format("MMM DD hh:mm A"),
        reason: item.reason,
        status:
          item.isApproved === true
            ? "Approved"
            : item.isApproved === false
            ? "Rejected"
            : "Pending"
      };
    }) || []
  );
});

// Methods

const submitTimeOff = async () => {
  await requestModule.SUBMIT_TIMEOFF({
    start: start.value!,
    end: end.value!,
    reason: reason.value
  });

  start.value = undefined;
  end.value = undefined;
  reason.value = "";
};

onMounted(() => {
  if (requestModule.GET_STATUS.value === LoadingTypes.IDLE) {
    requestModule.INITIALIZE_DATA();
  }
});

// Watchers
</script>
<style scoped lang="postcss"></style>
