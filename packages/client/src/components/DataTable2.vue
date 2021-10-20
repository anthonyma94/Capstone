<template>
  <div>
    <Table
      v-bind="$attrs"
      class="w-full"
      :class="[
        { 'p-datatable-sm': size === 'sm' },
        { 'p-datatable-lg': size === 'lg' }
      ]"
      :value="data"
      :paginator="data.length > 10"
      :rows="10"
      :selection-mode="selectionMode"
      :meta-key-selection="false"
      data-key="id"
      v-model:selection="selected"
    >
      <slot name="before"></slot>
      <Column
        v-if="selectionMode === 'multiple' && isSelected"
        selectionMode="multiple"
        class="w-3"
      ></Column>
      <Column
        v-for="col in computedCols"
        :key="col.selector"
        :field="col.selector"
        :header="col.title"
        :sortable="col.sortable"
      />
      <slot name="after"></slot>
    </Table>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "@vue/runtime-dom";
import Table from "primevue/datatable";
import Column from "primevue/column";

interface Props extends Partial<Pick<Table, "$props">> {
  columns: {
    selector: string;
    title?: string;
    sortable?: boolean;
  }[];
  data: any[];
  size?: "sm" | "lg";
  selectionMode?: "single" | "multiple";
  selection?: any;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "selected", value: any): void;
  (e: "update:selection", value: any): void;
}>();

const selected = ref();
watch(selected, (newVal, oldVal) => {
  const val = checkSelected(newVal) ? newVal : null;
  emit("selected", val);
  emit("update:selection", val);
});
const computedCols = computed(() => {
  const cols = props.columns
    .filter(i => i.selector.toLowerCase() !== "id")
    .map(i => {
      return {
        ...i,
        sortable: i.sortable || true
      };
    });
  return cols.map(item => {
    let title = item.title;
    if (!title) {
      title = item.selector.pascalToWords();
    }
    return {
      ...item,
      title
    };
  });
});
const isSelected = computed(() => checkSelected(selected.value));

const checkSelected = (selected: any) => {
  if (!selected) return false;
  else {
    if (typeof selected === "object") {
      return Object.keys(selected).length > 0;
    }
    if (Array.isArray(selected)) {
      return selected.length > 0;
    }
    return true;
  }
};
</script>
<style lang="postcss">
.p-column-header-content {
  @apply justify-center;
  /* justify-content: center; */
}
.p-datatable-tbody {
  td {
    @apply text-center !important;
  }
}
</style>
