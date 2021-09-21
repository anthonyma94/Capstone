<template>
  <div
    class="relative border-b-2 h-10 w-full group hover:cursor-pointer"
    :class="[{ active: showDropdown }, { selected: selectedItem }]"
    @click="showDropdown = !showDropdown"
  >
    <div class="absolute bottom-0 block w-full"></div>
    <ul
      class="absolute top-10 z-10 overflow-hidden mt-1 border-2 rounded-md w-full transform-gpu bg-white transition ease-in-out origin-top-right duration-200 scale-0"
    >
      <li
        class="p-2 hover:bg-blue-400 border-b-2 last:border-0"
        v-for="i in computedOptions"
        :key="i.value"
        @click="onClick(i)"
      >
        {{ i.text }}
      </li>
    </ul>
    <label
      class="absolute bottom-0 -z-1 origin-0 duration-300 text-gray-400 truncate max-w-full"
    >
      {{ props.placeholder }}
    </label>
    <span class="absolute bottom-0" v-if="selectedItem">
      {{ selectedItem.text }}
    </span>
    <span class="absolute bottom-1 right-1 text-gray-400 svg">
      <svg
        class="fill-current h-4 w-4
            transition duration-150 ease-in-out"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </span>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from "vue";

// Prop and prop interface
interface Props {
  allowNull?: boolean;
  options?: { value: string; text?: string }[] | string[];
  modelValue?: string;
  placeholder?: string;
}
const props = withDefaults(defineProps<Props>(), {
  allowNull: true,
  modelValue: "",
  placeholder: "Select an option"
});
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
// Use hooks

// Data
const selectedItem = ref<{ value: string; text: string } | undefined>(
  undefined
);
const showDropdown = ref(false);

// Computed

const computedOptions = computed<
  Exclude<typeof selectedItem.value, undefined>[]
>(() => {
  if (props.options && props.options.length > 0) {
    return props.options.map(i => {
      if (typeof i === "string") {
        return {
          value: i,
          text: i
        };
      } else {
        return {
          value: i.value,
          text: i.text || i.value
        };
      }
    });
  }
  return [];
});

// Methods

const onClick = (e: typeof selectedItem.value) => {
  if (e) {
    selectedItem.value = e;
    emits("update:modelValue", e.value);
  }
};
const close = () => (showDropdown.value = false);

// Watchers
watchEffect(() => {
  selectedItem.value = computedOptions.value.find(
    i => i.value === props.modelValue
  );
});
watchEffect(onInvalidate => {
  let timer1: number | undefined, timer2: number | undefined;
  if (showDropdown.value) {
    timer1 = setTimeout(() => window.addEventListener("click", close), 500);
  } else {
    timer2 = setTimeout(() => window.removeEventListener("click", close), 500);
  }
  onInvalidate(() => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  });
});

onBeforeUnmount(() => window.removeEventListener("click", close));
</script>
<style scoped lang="postcss">
.active {
  @apply border-blue-500;
  ul {
    @apply scale-100;
  }
  label,
  span.svg {
    @apply text-blue-500;
  }
}

/* .inactive ul {
  @apply scale-0;
} */

.selected label {
  @apply transform scale-75 -translate-y-5;
}
</style>
