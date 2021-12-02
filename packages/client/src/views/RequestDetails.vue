<template>
  <div>
    <h1>Request Time Off</h1>
    <span>
      Make sure your request times are not overlapping each other! Only valid
      requests will be submitted.
    </span>
    <div class="flex gap-3 my-3">
      <Calendar
        id="start"
        v-model="start"
        :showTime="true"
        hour-format="12"
        class="w-full"
        placeholder="Start (12/18/2021 09:00 AM)"
        :step-minute="30"
        :min-date="minDate"
        :disabled-dates="scheduleDates"
      />
      <Calendar
        placeholder="End (12/19/2021 08:00 PM)"
        v-model="end"
        class="w-full"
        :showTime="true"
        hour-format="12"
        :step-minute="30"
        :min-date="minDate"
        :disabled-dates="scheduleDates"
      />
    </div>
    <Textarea
      placeholder="Reason"
      class="w-full block"
      v-model="reason"
      rows="3"
    />
    <Button
      class="btn-block my-5"
      :disabled="v$.$invalid"
      @click="submitTimeOff"
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
import StoreModule from "@/store/modules/store";
import { asyncComputed } from "@vueuse/core";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { localecompareDayjs } from "@/services/dates";
// Prop and prop interface

// Use hooks
const requestModule = getModule(RequestModule, useStore());
const authModule = getModule(AuthModule, useStore());
const storeModule = getModule(StoreModule, useStore());

// Data
const start = ref<Date>();
const end = ref<Date>();
const reason = ref("");

// Computed

const minDate = computed(() => {
  const date = new Date();
  date.setDate(new Date().getDate() + 1);
  return date;
});

const scheduleDates = asyncComputed(async () => {
  const dates = await storeModule.SCHEDULE_START_DATES();

  if (dates && dates.length > 0) {
    return dates.flatMap((item: Date) => {
      const arr = [item];
      const start = dayjs(item);

      for (let i = 1; i < 7; i++) {
        arr.push(start.add(i, "day").toDate());
      }

      return arr;
    });
  } else {
    return [];
  }
}, []);

const noOverlap = (value: any) => {
  if (computedTimeOffs.value.length === 0) {
    return true;
  }

  if (!start.value || !end.value) {
    return false;
  }

  const dStart = dayjs(start.value);
  const dEnd = dayjs(end.value);

  if (dEnd.isBefore(dStart)) {
    return false;
  }

  const overlap = computedTimeOffs.value.some(x => {
    const bStart = dayjs(x.start, "MMM DD hh:mm A");
    const bEnd = dayjs(x.end, "MMM DD hh:mm A");
    const res = !(
      dEnd.isSameOrBefore(bStart, "minute") ||
      dStart.isSameOrAfter(bEnd, "minute")
    );
    return res;
  });
  return !overlap;
};
const rules = {
  start: { required },
  end: { required, noOverlap },
  reason: { required }
};

const v$ = useVuelidate(rules, { start, end, reason }, { $autoDirty: true });

const timeCols = [
  {
    id: "start",
    sortFunc: (a: string, b: string) => {
      const x = dayjs(a);
      const y = dayjs(b);
      return localecompareDayjs(x, y);
    }
  },
  {
    id: "end",
    sortFunc: (a: string, b: string) => {
      const x = dayjs(a);
      const y = dayjs(b);
      return localecompareDayjs(x, y);
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

onMounted(async () => {
  if (requestModule.GET_STATUS.value === LoadingTypes.IDLE) {
    requestModule.INITIALIZE_DATA();
  }
});

// Watchers
</script>
<style scoped lang="postcss"></style>
