<template>
  <button
    class="btn btn-primary"
    v-bind="$attrs"
    :disabled="disabledState"
    @click="onClick"
  >
    <span v-if="loading">{{ loadingText }}</span>
    <slot v-else></slot>
  </button>
</template>
<script setup lang="ts">
import { ButtonHTMLAttributes } from "@vue/runtime-dom";
import { computed } from "vue";
import { useRouter } from "vue-router";

interface Props extends ButtonHTMLAttributes {
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  loadingText: "Loading...",
});
const emit = defineEmits(["click"]);
const router = useRouter();
const onClick = computed(() => {
  return (e: MouseEvent) => {
    emit("click", e);
    if (props.href) {
      if (props.href.startsWith("/")) {
        router.push(props.href);
      } else {
        window.location.href = props.href;
      }
    }
  };
});
const disabledState = computed(() => props.disabled || props.loading);
</script>
<style scoped lang="postcss"></style>
