<template>
  <Input
    inputMode="dropdown"
    :placeholder="placeholder"
    :modelValue="selectedItem ? selectedItem.text : ''"
  >
    <template #dropdown="{hide}">
      <ul class="border-2 rounded-md bg-white w-full">
        <li
          class="py-1 px-2 hover:bg-blue-400 border-b-2 last:border-0 cursor-pointer"
          v-for="i in computedOptions"
          :key="i.value"
          @click="
            onClick(i);
            hide();
          "
        >
          {{ i.text }}
        </li>
      </ul>
    </template>
  </Input>
</template>
<script setup lang="ts">
import Input from "./Input.vue";
import { computed, ref, watchEffect } from "vue";

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

// Watchers
watchEffect(() => {
  selectedItem.value = computedOptions.value.find(
    i => i.value === props.modelValue
  );
});
</script>
<style scoped lang="postcss"></style>
