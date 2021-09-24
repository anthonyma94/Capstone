<template>
  <div class="w-full">
    <div class="relative border-b-2 h-10 w-full focus-within:border-blue-500">
      <input
        :class="[
          { 'placeholder-transparent': showLabel },
          'absolute bottom-0 block w-full appearance-none focus:outline-none bg-transparent'
        ]"
        v-bind="$attrs"
      />
      <label
        v-if="placeholder && showLabel"
        class="absolute bottom-0 -z-1 origin-0 duration-300 truncate max-w-full text-gray-400"
      ></label>
    </div>
  </div>
</template>
<script setup lang="ts">
import { InputHTMLAttributes } from "@vue/runtime-dom";
interface Props extends InputHTMLAttributes {
  showLabel?: boolean;
  value?: string | number;
  mask?: string | RegExp;
  errorText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  errorText: "This is invalid.",
  showLabel: true
});
</script>
<style scoped lang="postcss">
input:focus-within ~ label,
input:not(:placeholder-shown) ~ label {
  @apply transform scale-75 -translate-y-5;
}

input:focus-within ~ label {
  @apply text-blue-500;
}
</style>
