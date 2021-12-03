<template>
  <div class="w-full" tabindex="-1" ref="wrapper" @focusout="onBlur">
    <div
      class="relative border-b-2 h-10 w-full focus-within:border-blue-500"
      :class="{ 'border-danger focus-within:border-danger': invalid }"
      tabindex="-1"
    >
      <input
        class="absolute bottom-0 block w-full appearance-none focus:outline-none bg-transparent"
        :class="[
          { 'placeholder-transparent': showLabel },
          { dropdown: !allowsKeypress }
        ]"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :type="props.type"
        :value="internalValue"
        v-bind="$attrs"
        @input="onInput"
        @focus="onFocus"
        @keypress="onKeypress"
      />
      <label
        v-if="placeholder && showLabel"
        class="absolute bottom-0 origin-0 duration-300 -z-1 truncate max-w-full text-gray-400"
        :class="[
          { active: isInFocus || internalValue !== '' },
          { filled: isInFocus && internalValue !== '' },
          { invalid: invalid }
        ]"
        tabindex="-1"
      >
        {{ placeholder }}
      </label>
      <div
        v-if="containsDropdown"
        class="absolute top-11 z-10 overflow-hidden transform-gpu transition ease-in-out origin-top-left duration-200 scale-0 box-border"
        :class="{ 'scale-100': isInFocus }"
      >
        <slot
          name="dropdown"
          :hide="() => (isInFocus = false)"
          :show="() => (isInFocus = true)"
        >
        </slot>
      </div>
      <span
        v-if="containsDropdown"
        class="absolute bottom-1 right-1 text-gray-400 svg"
      >
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
    <span class="text-sm invalid" v-if="invalid">{{ errorText }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue-demi";

// Prop and prop interface
interface Props {
  showLabel?: boolean;
  modelValue: string | number;
  placeholder?: string;
  invalid?: boolean;
  errorText?: string;
  autofocus?: boolean;
  inputMode?: "text" | "dropdown" | "datalist";
  type?: "text" | "number" | "email" | "password" | "time";
}
const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  type: "text",
  modelValue: "",
  invalid: false,
  autofocus: false,
  inputMode: "text",
  errorText: "This is invalid."
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Use hooks

// Data
const isInFocus = ref(false);
const wrapper = ref();
const internalValue = ref("");

// Computed

const allowsKeypress = computed(() => props.inputMode !== "dropdown");
const containsDropdown = computed(
  () => props.inputMode === "dropdown" || props.inputMode === "datalist"
);

// Methods
const onBlur = (e: FocusEvent) => {
  const target = e.relatedTarget;
  if (!(target === wrapper.value || wrapper.value.contains(target))) {
    isInFocus.value = false;
  }

  internalValue.value = internalValue.value.trim();

  // if (typeof props.modelValue === "string") {
  // emit("update:modelValue", props.modelValue.trim());
  // }
};
const onFocus = (e: FocusEvent) => {
  isInFocus.value = true;
};
const onInput = (e: Event) => {
  internalValue.value = (e.target as HTMLInputElement).value;
  // emit("update:modelValue", (e.target as HTMLInputElement).value);
};
const onKeypress = (e: KeyboardEvent) => {
  if (!allowsKeypress.value) e.preventDefault();
};

// Watchers
watch(
  () => props.modelValue,
  newVal =>
    (internalValue.value =
      typeof newVal === "string" ? newVal : newVal.toString())
);
watch(
  () => internalValue.value,
  newVal => {
    emit("update:modelValue", newVal);
  }
);

onMounted(() => {
  internalValue.value =
    typeof props.modelValue === "string"
      ? props.modelValue
      : props.modelValue.toString();
});
</script>
<style scoped lang="postcss">
.active {
  @apply transform scale-75 -translate-y-5;
}
.filled {
  @apply text-blue-500;
}
.invalid {
  @apply text-danger;
}

.dropdown {
  @apply cursor-pointer;
  caret-color: transparent;
}
/* input.animate:focus-within ~ label,
input.animate:not(:placeholder-shown) ~ label {
  @apply transform scale-75 -translate-y-5;
}

input.animate:focus-within ~ label {
  @apply text-blue-500;
} */
</style>
