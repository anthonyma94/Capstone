<template>
  <div v-if="searchable" class="my-3 flex justify-around items-end">
    <div class="flex-grow flex gap-3">
      <slot name="toolbar"></slot>
    </div>
    <div style="width: 15rem; max-width: 100%">
      <Input v-model="searchRef" placeholder="Search" />
    </div>
  </div>
  <table class="w-full" v-bind="$attrs">
    <thead>
      <tr class="border-t border-b border-on-primary">
        <th
          class="py-2 px-3 cursor-pointer"
          v-for="col in computedCols"
          :key="col.id"
          @click="handleSortClick(col.id)"
        >
          <div class="flex justify-center items-center">
            <span class="flex-grow">
              {{ col.name }}
            </span>
            <div
              class=""
              :class="
                sortRef.by === col.id
                  ? ' text-on-primary-high'
                  : 'text-on-primary-low'
              "
            >
              <FAIcon
                v-if="sortRef.by === col.id && sortRef.order === 'dsc'"
                icon="sort-alpha-down-alt"
              />
              <FAIcon v-else icon="sort-alpha-up" />
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="even:bg-gray-200 text-center"
        :class="{ 'cursor-pointer hover:bg-primary-light': selectableRow }"
        v-for="(row, idx) in computedData"
        @click="e => handleRowSelected(e, row[key])"
        :key="row[key]"
      >
        <td class="py-3" v-for="col in computedCols" :key="col.id">
          <slot
            name="editor"
            v-if="row._metadata.edit && col.editable"
            :cache="cache"
            :row="row"
            :col="col"
          >
            <Input
              class="px-2"
              :model-value="row[col.id]"
              :type="typeof row[col.id] === 'number' ? 'number' : 'text'"
              @update:model-value="e => (cache[row.id][col.id] = e)"
            />
          </slot>
          <slot v-else :name="col.id" :data="row[col.id]">
            <span>
              {{ row[col.id] }}
            </span>
          </slot>
        </td>
        <td v-if="editable || deletable" class="w-16">
          <div class="flex gap-2 content-center px-2" v-if="row._metadata.edit">
            <FAIcon
              class="cursor-pointer text-success"
              icon="check-circle"
              type="far"
              @click="handleSaveEditClick(row[key])"
            />
            <FAIcon
              class="cursor-pointer text-danger"
              icon="times-circle"
              type="far"
              @click="handleCancelEditClick(row[key])"
            />
          </div>
          <div
            class="flex gap-2 content-center px-2"
            v-if="row._metadata.delete"
          >
            <FAIcon
              class="cursor-pointer text-danger"
              icon="trash-alt"
              @click="handleDeleteConfirmClick(row[key])"
            />
            <FAIcon
              class="cursor-pointer"
              icon="times-circle"
              type="far"
              @click="handleDeleteCancelClick(row[key])"
            />
          </div>
          <div
            class="flex gap-2 content-center px-2"
            v-if="!row._metadata.edit && !row._metadata.delete"
          >
            <FAIcon
              class="cursor-pointer"
              icon="edit"
              type="far"
              v-if="editable"
              @click="handleEditClick(row[key])"
            />
            <FAIcon
              class="cursor-pointer"
              icon="trash-alt"
              type="far"
              v-if="deletable"
              @click="handleDeleteClick(row[key])"
            />
          </div>
        </td>
        <td v-if="$slots['after']">
          <slot name="after" :data="row[key]"></slot>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="requiresPagination" class="my-2 flex flex-nowrap justify-end">
    <button
      class="
        btn
        py-1
        px-3
        m-0
        border border-r-0
        rounded-none
        bg-transparent
        first:rounded-l
        last:border-r last:rounded-r
        disabled:bg-transparent
        disabled:border-gray-400
        disabled:opacity-60
        disabled:text-on-primary-low
      "
      :class="[
        currentPage === i
          ? 'bg-primary text-on-secondary-high'
          : 'border-on-primary text-on-primary-high',
        {
          'hover:bg-primary hover:text-on-secondary-high':
            (i === '<<' && currentPage === 1) ||
            (i === '>>' && currentPage === maxPage)
        }
      ]"
      :disabled="
        ((i === '<<' || i === '<') && currentPage === 1) ||
          ((i === '>>' || i === '>') && currentPage === maxPage)
      "
      v-for="i in paginationButtons"
      :key="i"
      @click="handlePagination(i)"
    >
      {{ i }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "@vue/reactivity";
import { onMounted, watchEffect } from "@vue/runtime-core";
import { watch } from "vue";
import Button from "./Button.vue";
import FAIcon from "./FAIcon.vue";
import Input from "./inputs/Input.vue";
// Prop and prop interface
interface Props {
  modelValue: { [key: string]: string | number }[];
  key?: string;
  cols?: {
    id: string;
    name?: string;
    show?: boolean;
    sortable?: boolean;
    sortFunc?: (x: any, y: any) => number;
    editable?: boolean;
  }[];
  pagination?: boolean;
  rowsPerPage?: number;
  searchable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  selectableRow?: boolean;
}
interface ItemMeta {
  edit: boolean;
  delete: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  key: "id",
  pagination: true,
  rowsPerPage: 10,
  searchable: true,
  editable: true,
  deletable: true
});
const emits = defineEmits<{
  (e: "update:modelValue", value: Props["modelValue"]): void;
  (
    e: "update",
    value: { type: "delete" | "edit"; item: Props["modelValue"][0] }
  ): void;
  (e: "rowSelect", value: string | number): void;
}>();
// Use hooks

// Data
const cache = ref({} as any);
const currentPage = ref(1);
const dataRef = ref(
  [] as Array<
    {
      _metadata: ItemMeta;
    } & typeof props.modelValue[0]
  >
);
const searchRef = ref("");
const sortRef = ref(
  {} as {
    by: string;
    order: "asc" | "dsc";
  }
);

// Computed
const computedCols = computed(() => {
  type RequiredCols = Required<NonNullable<Props["cols"]>[0]>;
  const userProps =
    props.cols?.reduce(
      (acc, cur) => {
        const { id, ...rest } = cur;
        acc[id] = rest;
        return acc;
      },
      {} as {
        [id: string]: Omit<NonNullable<Props["cols"]>[0], "id">;
      }
    ) || {};
  let cols = Object.keys(props.modelValue[0])
    .map(key => {
      const initial: RequiredCols = {
        id: key,
        name: key.pascalToWords(),
        show: key !== props.key,
        sortable: true,
        editable: true,
        sortFunc: function(x, y) {
          const asc =
            typeof x === "number" && typeof y === "number"
              ? x - y
              : x.toString().localeCompare(y.toString());
          return asc;
        },
        ...userProps[key]
      };

      return initial;
    })
    .filter(x => x.show);
  return cols;
});

const computedData = computed(() => {
  let data = dataRef.value;

  // Sorts data
  if (sortRef.value.by) {
    data = data.sort((x, y) => {
      try {
        const first = x[sortRef.value.by];
        const second = y[sortRef.value.by];
        if (first === undefined || second === undefined) throw new Error();
        const sortFunc = computedCols.value.find(x => x.id === sortRef.value.by)
          ?.sortFunc;
        if (!sortFunc) throw new Error();
        const asc = sortFunc(first, second);
        return sortRef.value.order === "asc" ? asc : asc * -1;
      } catch {
        return 0;
      }
    });
  }

  if (searchRef.value) {
    const search = new RegExp(searchRef.value, "i");
    data = data.filter(x => {
      const keys = Object.keys(x);
      for (let key of keys) {
        if (x[key]?.toString().match(search)) {
          return true;
        }
      }
      return false;
    });
  }

  if (requiresPagination) {
    data = data.filter((_row, index) => {
      let start = (currentPage.value - 1) * props.rowsPerPage;
      let end = currentPage.value * props.rowsPerPage;
      return index >= start && index < end;
    });
  }
  return data;
});

const maxPage = computed(() => {
  return Math.ceil(props.modelValue.length / props.rowsPerPage);
});

const paginationButtons = computed(() => {
  const array = Array(
    computedData.value.length < props.rowsPerPage ? 1 : maxPage.value
  )
    .fill(0)
    .map<number | string>((_, i) => i + 1);
  array.unshift("<<", "<");
  array.push(">", ">>");
  return array;
});

const requiresPagination = computed(
  () => props.modelValue.length > props.rowsPerPage
);

// Methods
const emitChanges = (e: Props["modelValue"][0], type: "delete" | "edit") => {
  const res = dataRef.value.map(item => {
    const { _metadata, ...other } = item;
    return other;
  });
  emits("update:modelValue", res);
  emits("update", { type, item: e });
};

const initDataRef = () => {
  dataRef.value = props.modelValue.map(item => {
    return {
      ...item,
      _metadata: {
        edit: false,
        delete: false
      }
    } as typeof dataRef.value[0];
  });
};

const handleEditClick = (id: string | number) => {
  const item = dataRef.value.find(x => x.id === id)!;
  item._metadata.edit = true;
  const { _metadata, id: itemID, ...other } = item;
  cache.value[itemID] = other;
};

const handlePagination = (e: number | string) => {
  if (typeof e === "number") {
    currentPage.value = e;
  } else if (e === "<" && currentPage.value > 1) {
    currentPage.value--;
  } else if (e === ">" && currentPage.value < maxPage.value) {
    currentPage.value++;
  } else if (e === "<<") {
    currentPage.value = 1;
  } else if (e === ">>") {
    currentPage.value = maxPage.value;
  }
};

const handleSaveEditClick = (id: string | number) => {
  const final = cache.value[id];
  handleCancelEditClick(id);
  const index = dataRef.value.findIndex(x => x.id === id);
  dataRef.value[index] = {
    ...dataRef.value[index],
    ...final
  };
  emitChanges(dataRef.value[index], "edit");
};

const handleCancelEditClick = (id: string | number) => {
  delete cache.value[id!];
  dataRef.value.find(x => x.id === id)!._metadata.edit = false;
};

const handleDeleteClick = (id: string | number) => {
  const item = dataRef.value.find(x => x.id === id)!;
  item._metadata.delete = true;
};

const handleDeleteConfirmClick = (id: string | number) => {
  const itemIndex = dataRef.value.findIndex(x => x.id === id);
  const deletedItem = dataRef.value[itemIndex];
  dataRef.value.splice(itemIndex, 1);
  emitChanges(deletedItem, "delete");
};

const handleDeleteCancelClick = (id: string | number) => {
  const item = dataRef.value.find(x => x.id === id)!;
  item._metadata.delete = false;
};

const handleSortClick = (e: string) => {
  if (sortRef.value.by === e) {
    sortRef.value.order = sortRef.value.order === "asc" ? "dsc" : "asc";
  } else {
    sortRef.value = {
      by: e,
      order: "asc"
    };
  }
};

const handleRowSelected = (e: MouseEvent, id: string | number) => {
  emits("rowSelect", id);
};

// Watchers
watch(
  () => computedCols.value,
  () => {
    sortRef.value = {
      by: computedCols.value
        ? computedCols.value.find(x => x.sortable)?.id || ""
        : "",
      order: "asc"
    };
  }
);
watch(() => props.modelValue, initDataRef);

onMounted(() => {
  initDataRef();
});
</script>
<style scoped lang="postcss"></style>
