<template>
  <button
    class="btn btn-primary"
    v-bind="$attrs"
    :disabled="disabled"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { ButtonHTMLAttributes } from "@vue/runtime-dom";
import { computed } from "vue";
import { useRouter } from "vue-router";

interface Props extends ButtonHTMLAttributes {
  href?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
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
</script>
<style scoped lang="postcss"></style>
