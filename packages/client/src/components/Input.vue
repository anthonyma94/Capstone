<template>
  <div class="w-full">
    <div
      class="relative border-b-2 h-10 w-full focus-within:border-blue-500"
      :class="{ 'border-danger': invalid }"
    >
      <input
        class="absolute bottom-0 block w-full appearance-none focus:outline-none bg-transparent"
        :class="{ 'placeholder-transparent animate': showLabel }"
        :placeholder="placeholder"
        type="text"
        :value="modelValue"
        @input="onInput"
      />
      <label
        v-if="placeholder && showLabel"
        class="absolute bottom-0 -z-1 origin-0 duration-300 truncate max-w-full text-gray-400"
        :class="{ 'text-danger': invalid }"
      >
        {{ placeholder }}
      </label>
    </div>
    <span class="text-sm text-danger" v-if="invalid">{{ errorText }}</span>
  </div>
</template>
<script setup lang="ts">
// Prop and prop interface
interface Props {
  showLabel?: boolean;
  modelValue?: string;
  placeholder?: string;
  invalid?: boolean;
  errorText?: string;
  type?: "text" | "number" | "email" | "password" | "time";
}
const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  type: "text",
  modelValue: "",
  invalid: false,
  errorText: "This is invalid."
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// Use hooks

// Data

// Computed

// Methods
const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

// Watchers
</script>
<style scoped lang="postcss">
input.animate:focus-within ~ label,
input.animate:not(:placeholder-shown) ~ label {
  @apply transform scale-75 -translate-y-5;
}

input.animate:focus-within ~ label {
  @apply text-blue-500;
}
</style>
