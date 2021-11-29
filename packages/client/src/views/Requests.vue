<template>
  <h1>Time Off</h1>
  <DataTable
    v-if="computedTimeOffs.length > 0"
    v-model="computedTimeOffs"
    :deletable="false"
    :editable="false"
    :cols="timeCols"
  >
    <template v-slot:after="{ data }">
      <div
        v-if="requestModule.REQUEST_IS_PENDING(data.toString())"
        class="flex gap-3 justify-center"
      >
        <Button
          v-if="requestModule.REQUEST_IS_PENDING(data.toString())"
          class="btn-sm btn-outline-primary"
          @click="handleTimeOff(data.toString(), 'approve')"
          >Approve</Button
        >
        <Button
          v-if="requestModule.REQUEST_IS_PENDING(data.toString())"
          class="btn-sm btn-outline-danger"
          @click="handleTimeOff(data.toString(), 'deny')"
          >Decline</Button
        >
      </div>
    </template>
  </DataTable>
</template>
<script setup lang="ts">
// Prop and prop interface

import { useStore } from "@/store";
import AuthModule from "@/store/modules/auth";
import PersonModule from "@/store/modules/person";
import RequestModule from "@/store/modules/request";
import { LoadingTypes } from "@/store/types";
import { computed, onMounted } from "vue-demi";
import { getModule } from "vuex-module-decorators";
import DataTable from "@/components/DataTable.vue";
import dayjs from "dayjs";
import Button from "@/components/Button.vue";

// Use hooks
const requestModule = getModule(RequestModule, useStore());
const authModule = getModule(AuthModule, useStore());
const personModule = getModule(PersonModule, useStore());
// Data

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

// Computed
const computedTimeOffs = computed(() => {
  return (
    requestModule.ALL_TIMEOFFS.map(item => {
      const person = personModule.GET_BY_ID(item.person).value!;
      return {
        id: item.id,
        employee: person.firstName + " " + person.lastName,
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
const handleTimeOff = async (id: string, action: "approve" | "deny") => {
  await requestModule.APPROVE_TIMEOFF({ id, action });
};

onMounted(() => {
  if (requestModule.GET_STATUS.value === LoadingTypes.IDLE) {
    requestModule.INITIALIZE_DATA();
  }
});

// Watchers
</script>
<style scoped lang="postcss"></style>
