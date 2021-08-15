<template>
  <table v-bind="$attrs" class="table-auto"></table>
  <thead>
    <tr>
      <th v-for="col in computedCols" :key="col.title">{{ col.title }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, index) in computedData" :key="index">
      <td v-for="(item, innerIndex) in row" :key="innerIndex">
        {{ item }}
      </td>
    </tr>
  </tbody>
</template>
<script setup lang="ts">
import { computed, TableHTMLAttributes } from "@vue/runtime-dom";

interface Props extends TableHTMLAttributes {
  columns:
    | string[]
    | {
        title: string;
        sortable?: boolean;
      }[];
  data: Record<string, string | number | undefined>[];
}
const props = defineProps<Props>();

const computedCols = computed(() => {
  const cols =
    typeof props.columns[0] === "string"
      ? (props.columns as string[])
      : ((props.columns as Props["columns"]).map(
          item => (item as Exclude<typeof item, string>).title
        ) as string[]);
  return cols.map((item, index) => {
    const res = item.replace(/([A-Z])/g, " $1");
    return {
      title: res.charAt(0).toUpperCase() + res.slice(1),
      selector: item,
      id: index
    };
  });
});

const computedData = computed(() => {
  const cols = computedCols.value
    .sort((a, b) => a.id - b.id)
    .map(item => item.selector);
  const data = props.data.map(item =>
    Object.keys(item).map((_, index) => item[cols[index]])
  );
  return data;
});
</script>
<style scoped lang="postcss"></style>
