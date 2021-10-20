<template>
  <svg
    class="w-4 overflow-visible inline"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 ${width} ${height}`"
    v-bind="$attrs"
  >
    <path fill="currentColor" :d="svgPath" />
  </svg>
</template>
<script setup lang="ts">
import {
  IconDefinition,
  IconName,
  IconPrefix
} from "@fortawesome/fontawesome-common-types";
import { computed } from "@vue/reactivity";
import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";

// Prop and prop interface
interface Props {
  icon: IconName | IconDefinition;
  type?: IconPrefix;
}
const props = withDefaults(defineProps<Props>(), { type: "fas" });
// Use hooks

// Data

// Computed
const definition = computed(() => {
  if (typeof props.icon === "string") {
    return findIconDefinition({
      prefix: props.type,
      iconName: props.icon
    });
  } else return props.icon as IconDefinition;
});

const width = computed(() => definition.value.icon[0]);
const height = computed(() => definition.value.icon[1]);
const svgPath = computed(() => definition.value.icon[4] as string);

// Methods

// Watchers
</script>
<style scoped lang="postcss"></style>
