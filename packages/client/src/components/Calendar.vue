<template>
  <div v-if="missingShifts.length > 0 && authModule.IS_ADMIN">
    <h2 class="text-danger">Missing shifts:</h2>
    <p class="text-danger" v-for="(shift, idx) in missingShifts" :key="idx">
      Missing {{ shift.amount }} {{ shift.job }}(s) for {{ shift.shift }}
    </p>
  </div>
  <div class="flex gap-2">
    <FullCalendar
      ref="fullCalendar"
      class="flex-grow"
      :options="calendarOptions"
    />
  </div>

  <div ref="eventPopover" style="visibility: hidden;">
    <div v-if="eventClickEvent !== undefined">
      <dl>
        <dt>Start</dt>
        <dd>{{ eventClickEvent.start }}</dd>
        <dt>End</dt>
        <dd>{{ eventClickEvent.end }}</dd>
      </dl>
      <Button
        class="btn-danger btn-sm btn-block my-1"
        @click="handleEventDelete(eventClickId)"
        v-if="props.editable"
        >Delete</Button
      >
    </div>
  </div>
  <div ref="calendarPicker" style="visibility: hidden;">
    <CalendarPicker :inline="true" @date-select="handleDatePicker" />
  </div>
</template>
<script setup lang="ts">
import { useStore } from "@/store";
import StoreModule from "@/store/modules/store";
import CalendarPicker from "primevue/calendar";
import FullCalendar, {
  CalendarOptions,
  Dictionary,
  EventApi,
  CalendarApi,
  EventInput
} from "@fullcalendar/vue3";
import Button from "./Button.vue";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { computed, onMounted, ref, watch } from "vue";
import { getModule } from "vuex-module-decorators";
import { ResourceInput, ResourceApi } from "@fullcalendar/resource-common";
import dayjs from "dayjs";
import PersonModule from "@/store/modules/person";
import { useRouter } from "vue-router";
import tippy, { Instance, Props } from "tippy.js";
import ScheduleRuleModule from "@/store/modules/scheduleRule";
import { v4 } from "uuid";
import AuthModule from "@/store/modules/auth";
// Prop and prop interface
interface CalendarProps {
  editable?: boolean;
  calendarType?: string;
}

const props = withDefaults(defineProps<CalendarProps>(), {
  editable: false
});

const emits = defineEmits<{
  (e: "update:weekStart", value: Date | undefined): void;
  (e: "update:activeDay", value: Date | undefined): void;
}>();

// Use hooks
const storeModule = getModule(StoreModule, useStore());
const scheduleRuleModule = getModule(ScheduleRuleModule, useStore());
const personModule = getModule(PersonModule, useStore());
const authModule = getModule(AuthModule, useStore());
const router = useRouter();

// Data
const weekStart = ref<Date>();
const activeDay = ref<Date>();
const tippyInstance = ref<Instance<Props>>();
const eventPopover = ref<HTMLElement>();
const calendarPicker = ref<HTMLElement>();
const fullCalendar = ref<any>();
const eventClickId = ref("");

// Computed
const calendarApi = computed<CalendarApi | undefined>(() =>
  fullCalendar.value?.getApi()
);
const calendarOptions = computed(() => {
  return {
    plugins: [resourceTimelinePlugin, timeGridPlugin, interactionPlugin],
    initialView: authModule.IS_ADMIN ? "resourceTimeline" : "timeGridWeek",
    views: {
      resourceTimeline: {
        titleFormat: { dateStyle: "full" }
      }
    },
    weekends: true,
    editable: props.editable,
    slotDuration: "00:15:00",
    allDaySlot: false,
    droppable: props.editable,
    selectable: true,
    slotMinTime: slotTimes.value[0],
    slotMaxTime: slotTimes.value[1],
    schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
    events: events.value,
    // Moving event within calendar
    eventDrop: async function(arg) {
      const event = arg.event;
      const resource = arg.newResource;
      await handleEventChange(event, resource);
    },
    eventResize: async function(args) {
      const event = args.event;
      await handleEventChange(event);
    },
    // Gets new schedule if shown date is in a different week
    datesSet: function(dateInfo) {
      const start = dateInfo.start;
      if (
        !activeDay.value ||
        activeDay.value.toDateString() !== start.toDateString()
      ) {
        activeDay.value = new Date(start.toString());
      }
      if (start.getDay() !== 0) {
        start.setDate(start.getDate() - start.getDay());
      }
      if (!weekStart.value || weekStart.value.valueOf() !== start.valueOf()) {
        weekStart.value = new Date(start.toString());
      }
    },
    // Show popover on hover
    eventMouseEnter: function(args) {
      if (!props.editable) {
        eventClickId.value = args.event.id;
        const el = args.el;
        eventPopover.value!.style.visibility = "inherit";
        tippyInstance.value = tippy(el, {
          allowHTML: true,
          showOnCreate: true,
          content: eventPopover.value,
          interactive: props.editable,
          appendTo: () => document.getElementsByClassName("fc-view-harness")[0]
        });
      }
    },
    // Clicking event
    eventClick: function(args) {
      eventClickId.value = args.event.id;
      const el = args.el;
      eventPopover.value!.style.visibility = "inherit";
      tippyInstance.value = tippy(el, {
        allowHTML: true,
        showOnCreate: true,
        content: eventPopover.value,
        trigger: "manual",
        interactive: props.editable,
        appendTo: () => document.getElementsByClassName("fc-view-harness")[0]
      });
    },
    // Clicking date
    dateClick: async function(dateArgs) {
      if (props.editable) {
        const start = dayjs(dateArgs.date);
        const end = start.add(3, "hours");
        const event: EventInput = {
          id: v4(),
          start: start.toISOString(),
          end: end.toISOString(),
          title: `${start.format("HH:mm")}-${end.format("HH:mm")}`,
          resourceId: dateArgs.resource?.id
        };
        await storeModule.ADD_SCHEDULE_ITEM({
          id: event.id!,
          date: start,
          start: start.format("HH:mm"),
          end: end.format("HH:mm"),
          personId: event.resourceId!,
          scheduleId:
            storeModule.GET_SCHEDULE[0]?.extendedProps!.schedule || v4()
        });
      }
    },
    // Applies to all elements within calendar
    unselect: function() {
      tippyInstance.value = undefined;
    },
    resources: resources.value,
    resourceOrder: "title",
    resourceLabelClassNames: "resource-items",
    resourceLabelDidMount: function(args) {
      if (args.resource.getChildren().length === 0) {
        args.el.addEventListener(
          "click",
          onResourceLabelClick(args.resource.toPlainObject())
        );
      }
    },
    resourceLabelWillUnmount: function(args) {
      args.el.removeEventListener(
        "click",
        onResourceLabelClick(args.resource.toPlainObject())
      );
    },
    customButtons: {
      datepicker: {
        text: "Choose Date",
        click: function(ev, el) {
          calendarPicker.value!.style.visibility = "inherit";
          tippyInstance.value = tippy(el, {
            allowHTML: true,
            showOnCreate: true,
            content: calendarPicker.value,
            interactive: true,
            trigger: "manual",
            maxWidth: "none"
          });
        }
      }
    },
    headerToolbar: {
      right: "datepicker today prev,next"
    }
  } as CalendarOptions;
});

const resources = computed(() => {
  const pplByJob = personModule.GET_ALL.value
    .sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`
      )
    )
    .reduce((acc, cur) => {
      const job = cur.jobTitle.name;
      const newItem = {
        id: cur.id,
        title: cur.firstName + " " + cur.lastName,
        eventBackgroundColor: cur.jobTitle.color,
        eventBorderColor: cur.jobTitle.color
      };
      if (!acc[job]) {
        acc[job] = [newItem];
      } else {
        acc[job].push(newItem);
      }
      return acc;
    }, {} as any);
  return Object.keys(pplByJob).map(key => {
    return {
      id: key,
      title: key,
      children: pplByJob[key]
    } as ResourceInput;
  });
});

const slotTimes = computed<[string, string]>(() => {
  const hours = storeModule.GET_STORE_HOURS.value;
  let slotMinTime: string = "00:00:00";
  let slotMaxTime: string = "24:00:00";

  if (authModule.IS_ADMIN) {
    const day = hours?.find(x => x.day.day === activeDay.value?.getDay())?.day;
    slotMinTime = day?.start ?? slotMinTime;
    slotMaxTime = day?.end ?? slotMaxTime;
  } else {
    const times = hours?.reduce(
      (acc, cur) => {
        function compareTimes(
          accu: string,
          curr: string,
          type: "start" | "end"
        ) {
          if (!accu) {
            return curr;
          } else {
            const compare = curr.localeCompare(accu);
            if (
              (type === "start" && compare < 0) ||
              (type === "end" && compare > 0)
            ) {
              return curr;
            } else {
              return accu;
            }
          }
        }
        acc[0] = compareTimes(acc[0], cur.day.start, "start");
        acc[1] = compareTimes(acc[1], cur.day.end, "end");
        return acc;
      },
      ["", ""]
    );
    slotMinTime = times[0] || slotMinTime;
    slotMaxTime = times[1] || slotMaxTime;
  }
  return [slotMinTime, slotMaxTime];
});

const events = computed(() => {
  if (weekStart.value) {
    const resp = authModule.IS_ADMIN
      ? storeModule.GET_SCHEDULE
      : storeModule.GET_SCHEDULE.map(x => {
          delete x.title;
          return x;
        });
    return resp;
  }
  return [];
});

const eventClickEvent = computed(() => {
  const event = events.value?.find(x => x.id === eventClickId.value);
  if (event) {
    return {
      start: dayjs(event.start as string).format("hh:mm A"),
      end: dayjs(event.end as string).format("hh:mm A")
    };
  }
  return;
});

const missingShifts = computed(() => {
  if (activeDay.value) {
    const day = activeDay.value.getDay();
    const rules = scheduleRuleModule.GET_BY_DAY(day).value;
    const daySchedules = storeModule.GET_SCHEDULE_BY_DATE(
      dayjs(activeDay.value)
    );
    if (rules.length > 0 && daySchedules.length > 0) {
      const missingCountObj = [] as {
        shift: string;
        job: string;
        amount: number;
      }[];
      rules.forEach(rule => {
        const ruleStart = rule.day.start;
        const ruleEnd = rule.day.end;
        const start = dayjs(ruleStart, "HH:mm").format("hh:mm A");
        const end = dayjs(ruleEnd, "HH:mm").format("hh:mm A");
        rule.rules.forEach(item => {
          const jobTitle = item.jobTitle.name;
          const count = daySchedules.reduce((acc, cur) => {
            const start = dayjs(cur.start as string).format("HH:mm");
            const end = dayjs(cur.end as string).format("HH:mm");
            if (
              start === ruleStart &&
              end === ruleEnd &&
              jobTitle === cur.extendedProps?.job
            )
              acc++;
            return acc;
          }, 0);
          const missingCount = item.amount - count;
          if (missingCount > 0) {
            missingCountObj.push({
              shift: `${start} - ${end}`,
              job: jobTitle,
              amount: missingCount
            });
          }
        });
      });
      return missingCountObj;
    }
  }
  return [];
});

// Methods

const handleDatePicker = (date: Date) => {
  tippyInstance.value?.hide();
  calendarApi.value?.gotoDate(date);
};

const onResourceLabelClick = (resource: Dictionary) => (e: MouseEvent) => {
  router.push(`/employees/${resource.id}`);
};

const handleEventDelete = async (eventId: string) => {
  await storeModule.DELETE_SCHEDULE_ITEM(eventId);
  tippyInstance.value?.hide();
};

const handleEventChange = async (event: EventApi, resource?: ResourceApi) => {
  const start = dayjs(event.start);
  const end = dayjs(event.end);

  const startStr = start.format("HH:mm");
  const endStr = end.format("HH:mm");

  const personId = resource?.id;

  await storeModule.EDIT_SCHEDULE_ITEM({
    id: event.id,
    date: start.toDate(),
    start: startStr,
    end: endStr,
    personId
  });
};

onMounted(() => {
  storeModule.UPDATE_SCHEDULE(
    dayjs()
      .day(0)
      .toDate()
  );
});

// Watchers
watch(
  () => weekStart.value,
  async newVal => {
    if (newVal) {
      await storeModule.UPDATE_SCHEDULE(newVal);
    }
    emits("update:weekStart", newVal);
  }
);
watch(
  () => activeDay.value,
  newVal => {
    emits("update:activeDay", newVal);
  }
);
</script>
<style lang="postcss">
.item-class {
  @apply bg-primary p-1 rounded text-white cursor-pointer my-1;
}
.resource-items {
  @apply cursor-pointer hover:bg-gray-200;
}
dl dd {
  display: inline;
  margin: 0;
}
dl dd:after {
  display: block;
  content: "";
}
dl dt {
  display: inline-block;
  min-width: 100px;
}
</style>
