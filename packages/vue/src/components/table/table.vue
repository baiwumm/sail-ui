<script setup lang="ts" generic="Row extends object">
import {cx, tableVariants} from "@sail-ui/styles";
import {isKeyboardFocusVisible} from "@sail-ui/primitives";
import {
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/vue-table";
import {useVirtualizer} from "@tanstack/vue-virtual";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch} from "vue";
import {useForwardedAttrs} from "../../shared/attrs";
import {ChevronUpIcon} from "../../shared/icons";
import type {TableColumn, TableKey, TableProps, TableSelection, TableSortDescriptor} from "./types";

defineOptions({name: "SailTable", inheritAttrs: false});

const props = withDefaults(defineProps<TableProps<Row>>(), {
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  isStickyHeader: false,
  isVirtualized: false,
  rowHeight: 44,
  selectionMode: "none",
});
const emit = defineEmits<{
  (e: "update:selectedKeys", keys: "all" | Set<TableKey>): void;
  (e: "update:sortDescriptor", descriptor: TableSortDescriptor): void;
  (e: "loadMore"): void;
}>();
const {className, forwarded} = useForwardedAttrs();
const variants = computed(() => tableVariants({variant: props.variant}));

const columnDefs = computed<ColumnDef<Row, unknown>[]>(() =>
  props.columns.map((column) => ({
    id: column.key,
    accessorFn: (row) => (row as Record<string, unknown>)[column.key],
    header: column.header,
    enableSorting: column.allowsSorting ?? false,
    size: column.width,
    minSize: column.minWidth,
    maxSize: column.maxWidth,
  })),
);

function resolveRowKey(row: Row, index: number): string {
  if (props.getRowKey) {
    return String(props.getRowKey(row, index));
  }

  if (row && typeof row === "object" && "id" in row) {
    const id = (row as Record<string, unknown>).id;

    if (typeof id === "string" || typeof id === "number") {
      return String(id);
    }
  }

  return String(index);
}

const internalSortDescriptor = ref<TableSortDescriptor | null>(props.defaultSortDescriptor ?? null);
const currentSortDescriptor = computed<TableSortDescriptor | null>(() =>
  props.sortDescriptor !== undefined ? props.sortDescriptor : internalSortDescriptor.value,
);
const sortingState = computed<SortingState>(() => {
  const descriptor = currentSortDescriptor.value;

  return descriptor ? [{id: descriptor.column, desc: descriptor.direction === "descending"}] : [];
});

const table = useVueTable<Row>({
  get data() {
    return props.data;
  },
  get columns() {
    return columnDefs.value;
  },
  getRowId: resolveRowKey,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get sorting() {
      return sortingState.value;
    },
  },
});

const rows = computed(() => table.getRowModel().rows);
const headerGroup = computed(() => table.getHeaderGroups()[0]);
const columnMap = computed(() => new Map(props.columns.map((column) => [column.key, column])));
const rowHeaderIndex = computed(() => props.columns.findIndex((column) => column.isRowHeader));
const columnCount = computed(() => Math.max(props.columns.length, 1));
const isEmpty = computed(() => rows.value.length === 0 && !props.isLoading);
const idPrefix = useId();

function resolveColumn(key: string): TableColumn {
  return columnMap.value.get(key) ?? {key, header: key};
}

const isResizable = computed(() => props.isResizable === true);
const isVirtualized = computed(() => props.isVirtualized === true);
const rowHeight = computed(() => props.rowHeight ?? 44);
const columnWidths = ref<Record<string, number>>({});
const resizingKey = ref<string | null>(null);
const hoveredResizerKey = ref<string | null>(null);
const focusVisibleResizerKey = ref<string | null>(null);

interface ResizeSession {
  key: string;
  pointerId: number;
  startX: number;
  startWidth: number;
}

let resizeSession: ResizeSession | null = null;

function minColumnWidth(column: TableColumn): number {
  return column.minWidth ?? 100;
}

function maxColumnWidth(column: TableColumn): number {
  return column.maxWidth ?? Number.MAX_SAFE_INTEGER;
}

function columnWidth(column: TableColumn): number {
  const raw = columnWidths.value[column.key] ?? column.width ?? 150;

  return Math.round(Math.min(Math.max(raw, minColumnWidth(column)), maxColumnWidth(column)));
}

function setColumnWidth(column: TableColumn, width: number) {
  columnWidths.value = {
    ...columnWidths.value,
    [column.key]: Math.round(
      Math.min(Math.max(width, minColumnWidth(column)), maxColumnWidth(column)),
    ),
  };
}

function resizableDirection(column: TableColumn): "left" | "right" | "both" {
  const width = columnWidth(column);

  if (width <= minColumnWidth(column)) {
    return "left";
  }

  if (width >= maxColumnWidth(column)) {
    return "right";
  }

  return "both";
}

function columnStyle(column: TableColumn) {
  const style: Record<string, string> = {};

  if (column.align) {
    style.textAlign = column.align;
  }

  if (isResizable.value) {
    style.width = `${columnWidth(column)}px`;
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

const contentStyle = computed(() => {
  if (!isResizable.value) {
    return undefined;
  }

  if (isVirtualized.value) {
    const width = props.columns.reduce((total, column) => total + columnWidth(column), 0);

    return {minWidth: `${width}px`};
  }

  return {tableLayout: "fixed" as const, width: "min-content"};
});

const gridTemplateColumns = computed(() => {
  if (!isVirtualized.value) {
    return undefined;
  }

  if (isResizable.value) {
    return props.columns.map((column) => `${columnWidth(column)}px`).join(" ");
  }

  return `repeat(${Math.max(props.columns.length, 1)}, minmax(0, 1fr))`;
});

const rowGridStyle = computed(() =>
  gridTemplateColumns.value
    ? {display: "grid", gridTemplateColumns: gridTemplateColumns.value}
    : undefined,
);

const headerStyle = computed(() =>
  props.isStickyHeader ? {position: "sticky" as const, top: "0", zIndex: "1"} : undefined,
);

function virtualRowStyle(item: {start: number; size: number}) {
  return {
    height: `${item.size}px`,
    left: "0",
    position: "absolute" as const,
    top: "0",
    transform: `translateY(${item.start}px)`,
    width: "100%",
  };
}

const visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
} as const;

function handleResizerPointerDown(event: PointerEvent, column: TableColumn) {
  if (!column.allowsResizing || event.button !== 0) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const target = event.currentTarget as HTMLElement;

  target.setPointerCapture?.(event.pointerId);
  target.querySelector("input")?.focus({preventScroll: true});
  resizeSession = {
    key: column.key,
    pointerId: event.pointerId,
    startX: event.clientX,
    startWidth: columnWidth(column),
  };
  resizingKey.value = column.key;
}

function handleResizerPointerMove(event: PointerEvent) {
  if (!resizeSession || event.pointerId !== resizeSession.pointerId) {
    return;
  }

  setColumnWidth(
    resolveColumn(resizeSession.key),
    resizeSession.startWidth + event.clientX - resizeSession.startX,
  );
}

function handleResizerEnd(event: PointerEvent) {
  if (!resizeSession) {
    return;
  }

  (event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId);
  resizeSession = null;
  resizingKey.value = null;
}

function handleResizerPointerEnter(columnKey: string) {
  hoveredResizerKey.value = columnKey;
}

function handleResizerPointerLeave(columnKey: string) {
  if (hoveredResizerKey.value === columnKey) {
    hoveredResizerKey.value = null;
  }
}

function handleResizerFocus(event: FocusEvent, columnKey: string) {
  if (isKeyboardFocusVisible(event.target)) {
    focusVisibleResizerKey.value = columnKey;
  }
}

function handleResizerBlur(columnKey: string) {
  if (focusVisibleResizerKey.value === columnKey) {
    focusVisibleResizerKey.value = null;
  }
}

function handleResizerInput(event: Event, column: TableColumn) {
  const input = event.target as HTMLInputElement;
  const nextValue = input.valueAsNumber;

  if (Number.isNaN(nextValue)) {
    return;
  }

  const current = columnWidth(column);

  setColumnWidth(column, nextValue > current ? current + 10 : current - 10);
}

function displayValue(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function rowLabelledBy(rowIndex: number): string | undefined {
  return rowHeaderIndex.value >= 0 ? `${idPrefix}-r${rowIndex}-h` : undefined;
}

function cellId(rowIndex: number, columnIndex: number): string | undefined {
  return rowHeaderIndex.value === columnIndex ? `${idPrefix}-r${rowIndex}-h` : undefined;
}

function normalizeSelection(value: TableSelection | undefined): "all" | Set<TableKey> {
  if (value === undefined) {
    return new Set();
  }

  if (value === "all") {
    return "all";
  }

  return new Set(value);
}

const internalSelection = ref<"all" | Set<TableKey>>(normalizeSelection(props.defaultSelectedKeys));
const currentSelection = computed<"all" | Set<TableKey>>(() =>
  props.selectedKeys === undefined
    ? internalSelection.value
    : normalizeSelection(props.selectedKeys),
);
const selectedKeySet = computed<"all" | Set<string>>(() => {
  const selection = currentSelection.value;

  if (selection === "all") {
    return "all";
  }

  return new Set(Array.from(selection, (key) => String(key)));
});
const disabledKeySet = computed(() => {
  const keys = new Set<string>();

  if (props.disabledKeys) {
    for (const key of props.disabledKeys) {
      keys.add(String(key));
    }
  }

  return keys;
});

function isDisabledRow(rowId: string): boolean {
  return disabledKeySet.value.has(rowId);
}

function isRowSelected(rowId: string): boolean {
  if (props.selectionMode === "none" || isDisabledRow(rowId)) {
    return false;
  }

  const selection = selectedKeySet.value;

  return selection === "all" ? true : selection.has(rowId);
}

function currentSelectedIds(): Set<string> {
  const selection = selectedKeySet.value;

  if (selection !== "all") {
    return new Set(selection);
  }

  const ids = new Set<string>();

  for (const row of rows.value) {
    if (!isDisabledRow(row.id)) {
      ids.add(row.id);
    }
  }

  return ids;
}

function emitSelection(next: "all" | Set<TableKey>) {
  if (props.selectedKeys === undefined) {
    internalSelection.value = next;
  }

  emit("update:selectedKeys", next);
}

function toggleRowSelection(rowId: string) {
  if (props.selectionMode === "none" || isDisabledRow(rowId)) {
    return;
  }

  if (props.selectionMode === "single") {
    emitSelection(isRowSelected(rowId) ? new Set() : new Set([rowId]));

    return;
  }

  const next = currentSelectedIds();

  if (next.has(rowId)) {
    next.delete(rowId);
  } else {
    next.add(rowId);
  }

  emitSelection(next);
}

function toggleSelectAll() {
  if (props.selectionMode !== "multiple") {
    return;
  }

  const selectable = rows.value.map((row) => row.id).filter((rowId) => !isDisabledRow(rowId));
  const allSelected = selectable.length > 0 && selectable.every((rowId) => isRowSelected(rowId));

  emitSelection(allSelected ? new Set() : new Set(selectable));
}

function sortDirectionFor(columnKey: string) {
  const descriptor = currentSortDescriptor.value;

  return descriptor?.column === columnKey ? descriptor.direction : undefined;
}

function toggleSorting(column: TableColumn) {
  if (!column.allowsSorting) {
    return;
  }

  const current = currentSortDescriptor.value;
  const direction =
    current?.column === column.key && current.direction === "ascending"
      ? "descending"
      : "ascending";
  const descriptor: TableSortDescriptor = {column: column.key, direction};

  if (props.sortDescriptor === undefined) {
    internalSortDescriptor.value = descriptor;
  }

  emit("update:sortDescriptor", descriptor);
}

const rootAttrs = computed(() => {
  const rest = {...forwarded.value};

  delete rest["aria-label"];
  delete rest["aria-labelledby"];

  return rest;
});
const gridLabel = computed(
  () => props.ariaLabel ?? (forwarded.value["aria-label"] as string | undefined),
);
const gridLabelledBy = computed(() =>
  props.ariaLabel ? undefined : (forwarded.value["aria-labelledby"] as string | undefined),
);

const tableEl = ref<HTMLElement | null>(null);
const scrollContainerEl = ref<HTMLDivElement | null>(null);
const activeCell = ref<{row: number; column: number} | null>(null);
const rangeAnchor = ref<number | null>(null);
const isMounted = ref(false);

const INITIAL_VIRTUAL_ROWS = 10;
const LOAD_MORE_ROW_HEIGHT = 44;

const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    estimateSize: () => rowHeight.value,
    getScrollElement: () => scrollContainerEl.value,
    overscan: 8,
  })),
);

onMounted(() => {
  isMounted.value = true;
});

const totalSize = computed(() => {
  const size = rowVirtualizer.value.getTotalSize();

  return size > 0 ? size : rows.value.length * rowHeight.value;
});

interface VirtualRowItem {
  index: number;
  start: number;
  size: number;
}

const virtualRows = computed(() => {
  if (!isVirtualized.value) {
    return [];
  }

  const items = rowVirtualizer.value.getVirtualItems();
  const base: VirtualRowItem[] =
    isMounted.value && items.length > 0
      ? items.map((item) => ({index: item.index, start: item.start, size: item.size}))
      : rows.value
          .slice(0, INITIAL_VIRTUAL_ROWS)
          .map((_, index) => ({index, start: index * rowHeight.value, size: rowHeight.value}));
  const active = activeCell.value;

  if (
    active &&
    active.row >= 0 &&
    active.row < rows.value.length &&
    !base.some((item) => item.index === active.row)
  ) {
    base.push({index: active.row, start: active.row * rowHeight.value, size: rowHeight.value});
    base.sort((first, second) => first.index - second.index);
  }

  return base.flatMap((item) => {
    const row = rows.value[item.index];

    return row ? [{...item, row}] : [];
  });
});

const virtualRowLayoutStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {"--table-row-level": "1"};

  if (gridTemplateColumns.value) {
    style.display = "grid";
    style.gridTemplateColumns = gridTemplateColumns.value;
  }

  return style;
});

const bodyStyle = computed(() => {
  if (!isVirtualized.value || rows.value.length === 0) {
    return undefined;
  }

  return {
    height: `${totalSize.value + (props.hasMore ? LOAD_MORE_ROW_HEIGHT : 0)}px`,
  };
});

const loadMoreStyle = computed(() =>
  isVirtualized.value
    ? {left: "0", position: "absolute" as const, top: `${totalSize.value}px`, width: "100%"}
    : undefined,
);

const loadMoreEl = ref<HTMLElement | null>(null);
let loadMoreObserver: IntersectionObserver | null = null;

function disconnectLoadMore() {
  loadMoreObserver?.disconnect();
  loadMoreObserver = null;
}

function observeLoadMore() {
  disconnectLoadMore();

  if (!props.hasMore || !loadMoreEl.value || typeof IntersectionObserver === "undefined") {
    return;
  }

  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (props.isLoadingMore || !entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      emit("loadMore");
    },
    {root: scrollContainerEl.value},
  );
  loadMoreObserver.observe(loadMoreEl.value);
}

onMounted(observeLoadMore);
watch([() => props.hasMore, () => props.isLoadingMore, loadMoreEl], observeLoadMore);
onBeforeUnmount(disconnectLoadMore);

function isActiveCell(row: number, column: number): boolean {
  return activeCell.value?.row === row && activeCell.value.column === column;
}

function cellTabIndex(row: number, column: number): number {
  return isActiveCell(row, column) ? 0 : -1;
}

function findCell(row: number, column: number) {
  return (
    tableEl.value?.querySelector<HTMLElement>(
      `[data-row-index="${row}"][data-col-index="${column}"]`,
    ) ?? null
  );
}

async function focusCell(row: number, column: number) {
  activeCell.value = {row, column};

  let target = findCell(row, column);

  if (!target && isVirtualized.value) {
    await nextTick();
    target = findCell(row, column);
  }

  if (!target) {
    return;
  }

  target.focus();
}

function handleFocusIn(event: FocusEvent) {
  const target = event.target as HTMLElement | null;
  const cell = target?.closest<HTMLElement>("[data-row-index][data-col-index]");

  if (!cell) {
    return;
  }

  const row = Number(cell.dataset.rowIndex);
  const column = Number(cell.dataset.colIndex);

  if (Number.isNaN(row) || Number.isNaN(column)) {
    return;
  }

  activeCell.value = {row, column};
}

const interactiveSelector =
  "a[href], button, input, select, textarea, [contenteditable='true'], [role='button'], [role='checkbox'], [role='radio'], [role='switch'], [role='slider'], [role='textbox']";

function handleHeaderClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;

  if (
    !target ||
    target.closest(interactiveSelector) ||
    target.closest('[data-slot="table-column-resizer"]')
  ) {
    return;
  }

  const header = target.closest<HTMLElement>('[data-slot="table-column"]');
  const columnIndex = header?.dataset.colIndex;

  if (columnIndex === undefined) {
    return;
  }

  const column = props.columns[Number(columnIndex)];

  if (column) {
    toggleSorting(column);
  }
}

function handleRowClick(event: MouseEvent, rowId: string) {
  if (props.selectionMode === "none") {
    return;
  }

  const target = event.target as HTMLElement | null;

  if (target?.closest(interactiveSelector)) {
    return;
  }

  toggleRowSelection(rowId);
}

function extendSelection(from: number, to: number) {
  const anchor = rangeAnchor.value ?? from;

  rangeAnchor.value = anchor;

  const start = Math.min(anchor, to);
  const end = Math.max(anchor, to);
  const next = currentSelectedIds();

  for (let index = start; index <= end; index += 1) {
    const rowId = rows.value[index]?.id;

    if (rowId !== undefined && !isDisabledRow(rowId)) {
      next.add(rowId);
    }
  }

  emitSelection(next);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.altKey) {
    return;
  }

  const target = event.target as HTMLElement | null;

  if (!target || !tableEl.value?.contains(target)) {
    return;
  }

  const cell = target.closest<HTMLElement>("[data-row-index][data-col-index]");

  if (cell && target !== cell && target.closest(interactiveSelector)) {
    return;
  }

  let row = cell ? Number(cell.dataset.rowIndex) : -1;
  let column = cell ? Number(cell.dataset.colIndex) : 0;

  if (Number.isNaN(row) || Number.isNaN(column)) {
    row = -1;
    column = 0;
  }

  const key = event.key;

  if (key === " " || key === "Enter") {
    const activeColumn = props.columns[column];

    if (!cell || !activeColumn) {
      return;
    }

    if (row === -1) {
      event.preventDefault();
      toggleSorting(activeColumn);

      return;
    }

    const rowId = rows.value[row]?.id;

    if (rowId === undefined) {
      return;
    }

    if (props.selectionMode !== "none") {
      event.preventDefault();
      toggleRowSelection(rowId);
    }

    return;
  }

  if (
    (event.ctrlKey || event.metaKey) &&
    key.toLowerCase() === "a" &&
    props.selectionMode === "multiple"
  ) {
    event.preventDefault();
    toggleSelectAll();

    return;
  }

  if (
    ![
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ].includes(key)
  ) {
    return;
  }

  const lastColumn = props.columns.length - 1;

  if (lastColumn < 0) {
    return;
  }

  const lastRow = rows.value.length - 1;
  const withCtrl = event.ctrlKey || event.metaKey;
  const originRow = row;

  switch (key) {
    case "ArrowLeft":
      column = Math.max(0, column - 1);
      break;
    case "ArrowRight":
      column = Math.min(lastColumn, column + 1);
      break;
    case "ArrowUp":
      row = Math.max(-1, row - 1);
      break;
    case "ArrowDown":
      row = Math.min(lastRow, row + 1);
      break;
    case "Home":
      if (withCtrl) {
        row = -1;
        column = 0;
      } else {
        column = 0;
      }
      break;
    case "End":
      if (withCtrl) {
        row = Math.max(lastRow, -1);
        column = lastColumn;
      } else {
        column = lastColumn;
      }
      break;
    case "PageUp":
      row = Math.max(-1, row - getPageSize());
      break;
    case "PageDown":
      row = Math.min(lastRow, row + getPageSize());
      break;
  }

  event.preventDefault();
  void focusCell(row, column);

  if (
    event.shiftKey &&
    props.selectionMode === "multiple" &&
    originRow >= 0 &&
    row >= 0 &&
    row !== originRow
  ) {
    extendSelection(originRow, row);
  } else if (!event.shiftKey) {
    rangeAnchor.value = null;
  }
}

function getPageSize(): number {
  const container = scrollContainerEl.value;

  if (isVirtualized.value) {
    return container ? Math.max(1, Math.floor(container.clientHeight / rowHeight.value) - 1) : 10;
  }

  const firstRow = tableEl.value?.querySelector<HTMLElement>('tbody [data-row-index="0"]');
  const measured = firstRow?.getBoundingClientRect().height ?? 0;

  if (!container || measured <= 0) {
    return 10;
  }

  return Math.max(1, Math.floor(container.clientHeight / measured) - 1);
}

watch(
  () => props.data.length,
  (length) => {
    if (activeCell.value && (activeCell.value.row > length - 1 || props.columns.length === 0)) {
      activeCell.value = null;
    }
  },
);
</script>

<template>
  <div v-bind="rootAttrs" :class="cx(variants.base(), className)" data-slot="table">
    <div
      ref="scrollContainerEl"
      :class="
        cx(
          isResizable ? variants.resizableContainer() : variants.scrollContainer(),
          scrollContainerClass,
        )
      "
      :data-slot="isResizable ? 'table-resizable-container' : 'table-scroll-container'"
    >
      <template v-if="isVirtualized">
        <div
          ref="tableEl"
          :aria-busy="isLoading ? 'true' : undefined"
          :aria-colcount="columns.length"
          :aria-label="gridLabel"
          :aria-labelledby="gridLabelledBy"
          :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
          :aria-rowcount="rows.length + 1"
          :class="cx(variants.content(), contentClass)"
          :style="contentStyle"
          :tabindex="activeCell ? -1 : 0"
          data-slot="table-content"
          role="grid"
          @focusin="handleFocusIn"
          @keydown="handleKeydown"
        >
          <div
            :class="variants.header()"
            :style="headerStyle"
            data-slot="table-header"
            role="rowgroup"
          >
            <div :style="rowGridStyle" role="row">
              <div
                v-for="(header, columnIndex) in headerGroup?.headers ?? []"
                :key="header.id"
                role="presentation"
                style="min-width: 0"
              >
                <div
                  :id="`${idPrefix}-h-${header.column.id}`"
                  :aria-colindex="columnIndex + 1"
                  :aria-sort="
                    resolveColumn(header.column.id).allowsSorting
                      ? (sortDirectionFor(header.column.id) ?? 'none')
                      : undefined
                  "
                  :class="variants.column()"
                  :data-allows-sorting="
                    resolveColumn(header.column.id).allowsSorting ? 'true' : undefined
                  "
                  :data-col-index="columnIndex"
                  :data-row-index="-1"
                  :data-sort-direction="sortDirectionFor(header.column.id)"
                  :style="columnStyle(resolveColumn(header.column.id))"
                  :tabindex="cellTabIndex(-1, columnIndex)"
                  data-slot="table-column"
                  role="columnheader"
                  @click="handleHeaderClick"
                >
                  <template v-if="resolveColumn(header.column.id).allowsSorting">
                    <span
                      :class="variants.sortableColumnHeader()"
                      :data-direction="sortDirectionFor(header.column.id)"
                      data-slot="table-sortable-column-header"
                    >
                      <slot
                        :name="`header-${header.column.id}`"
                        :column="resolveColumn(header.column.id)"
                        :sort-direction="sortDirectionFor(header.column.id)"
                      >
                        <slot
                          name="header"
                          :column="resolveColumn(header.column.id)"
                          :sort-direction="sortDirectionFor(header.column.id)"
                        >
                          {{ resolveColumn(header.column.id).header }}
                        </slot>
                      </slot>
                      <ChevronUpIcon
                        v-if="sortDirectionFor(header.column.id)"
                        :class="variants.sortableColumnIndicator()"
                        :data-direction="sortDirectionFor(header.column.id)"
                        data-slot="table-sortable-column-indicator"
                      />
                    </span>
                  </template>
                  <template v-else>
                    <slot
                      :name="`header-${header.column.id}`"
                      :column="resolveColumn(header.column.id)"
                    >
                      <slot name="header" :column="resolveColumn(header.column.id)">
                        {{ resolveColumn(header.column.id).header }}
                      </slot>
                    </slot>
                  </template>
                  <div
                    v-if="isResizable && resolveColumn(header.column.id).allowsResizing"
                    :class="variants.columnResizer()"
                    :data-focus-visible="
                      focusVisibleResizerKey === header.column.id ? 'true' : undefined
                    "
                    :data-hovered="hoveredResizerKey === header.column.id ? 'true' : undefined"
                    :data-resizable-direction="resizableDirection(resolveColumn(header.column.id))"
                    :data-resizing="resizingKey === header.column.id ? 'true' : undefined"
                    data-slot="table-column-resizer"
                    role="presentation"
                    @pointercancel="handleResizerEnd"
                    @pointerdown="handleResizerPointerDown($event, resolveColumn(header.column.id))"
                    @pointerenter="handleResizerPointerEnter(header.column.id)"
                    @pointerleave="handleResizerPointerLeave(header.column.id)"
                    @pointermove="handleResizerPointerMove"
                    @pointerup="handleResizerEnd"
                  >
                    <input
                      :id="`${idPrefix}-resizer-${header.column.id}`"
                      :aria-labelledby="`${idPrefix}-resizer-${header.column.id} ${idPrefix}-h-${header.column.id}`"
                      :aria-valuetext="`${columnWidth(resolveColumn(header.column.id))} pixels`"
                      :max="maxColumnWidth(resolveColumn(header.column.id))"
                      :min="minColumnWidth(resolveColumn(header.column.id))"
                      :style="visuallyHiddenStyle"
                      :value="columnWidth(resolveColumn(header.column.id))"
                      aria-label="Resizer"
                      aria-orientation="horizontal"
                      type="range"
                      @blur="handleResizerBlur(header.column.id)"
                      @focus="handleResizerFocus($event, header.column.id)"
                      @input="handleResizerInput($event, resolveColumn(header.column.id))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            :class="variants.body()"
            :data-empty="isEmpty ? 'true' : undefined"
            :style="bodyStyle"
            data-slot="table-body"
            role="rowgroup"
          >
            <div
              v-for="item in virtualRows"
              :key="item.row.id"
              :style="virtualRowStyle(item)"
              role="presentation"
            >
              <div
                :id="`${idPrefix}-r${item.index}`"
                :aria-disabled="isDisabledRow(item.row.id) ? 'true' : undefined"
                :aria-labelledby="rowLabelledBy(item.index)"
                :aria-rowindex="item.index + 2"
                :aria-selected="selectionMode !== 'none' ? isRowSelected(item.row.id) : undefined"
                :class="variants.row()"
                :data-disabled="isDisabledRow(item.row.id) ? 'true' : undefined"
                :data-selected="isRowSelected(item.row.id) ? 'true' : undefined"
                :data-selection-mode="selectionMode !== 'none' ? selectionMode : undefined"
                :style="virtualRowLayoutStyle"
                data-level="1"
                data-slot="table-row"
                role="row"
                @click="handleRowClick($event, item.row.id)"
              >
                <div
                  v-for="(cell, columnIndex) in item.row.getVisibleCells()"
                  :key="cell.id"
                  role="presentation"
                  style="min-width: 0"
                >
                  <div
                    :id="cellId(item.index, columnIndex)"
                    :aria-colindex="columnIndex + 1"
                    :class="variants.cell()"
                    :data-col-index="columnIndex"
                    :data-column-index="columnIndex"
                    :data-disabled="isDisabledRow(item.row.id) ? 'true' : undefined"
                    :data-row-index="item.index"
                    :data-selected="isRowSelected(item.row.id) ? 'true' : undefined"
                    :role="resolveColumn(cell.column.id).isRowHeader ? 'rowheader' : 'gridcell'"
                    :style="columnStyle(resolveColumn(cell.column.id))"
                    :tabindex="cellTabIndex(item.index, columnIndex)"
                    data-level="1"
                    data-slot="table-cell"
                  >
                    <slot
                      :name="`cell-${cell.column.id}`"
                      :column="resolveColumn(cell.column.id)"
                      :row="item.row"
                      :row-index="item.index"
                      :value="cell.getValue()"
                    >
                      <slot
                        name="cell"
                        :column="resolveColumn(cell.column.id)"
                        :row="item.row"
                        :row-index="item.index"
                        :value="cell.getValue()"
                      >
                        {{ displayValue(cell.getValue()) }}
                      </slot>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isEmpty" role="row">
              <div role="rowheader">
                <slot name="empty" />
              </div>
            </div>
            <div
              v-if="isLoading && rows.length === 0"
              :class="variants.row()"
              data-slot="table-row"
              role="row"
            >
              <div :class="variants.cell()" data-slot="table-cell" role="gridcell">
                <slot name="loading">Loading...</slot>
              </div>
            </div>
            <div
              v-if="hasMore"
              ref="loadMoreEl"
              :class="variants.loadMore()"
              :style="loadMoreStyle"
              data-slot="table-load-more"
              role="row"
            >
              <div role="rowheader">
                <div :class="variants.loadMoreContent()" data-slot="table-load-more-content">
                  <slot name="loadMore" :is-loading="isLoadingMore" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <table
        v-else
        ref="tableEl"
        :aria-busy="isLoading ? 'true' : undefined"
        :aria-colcount="columns.length"
        :aria-label="gridLabel"
        :aria-labelledby="gridLabelledBy"
        :aria-multiselectable="selectionMode === 'multiple' ? 'true' : undefined"
        :aria-rowcount="rows.length + 1"
        :class="cx(variants.content(), contentClass)"
        :style="contentStyle"
        :tabindex="activeCell ? -1 : 0"
        data-slot="table-content"
        role="grid"
        @focusin="handleFocusIn"
        @keydown="handleKeydown"
      >
        <thead
          :class="variants.header()"
          :style="headerStyle"
          data-slot="table-header"
          role="rowgroup"
        >
          <tr role="row">
            <th
              v-for="(header, columnIndex) in headerGroup?.headers ?? []"
              :id="`${idPrefix}-h-${header.column.id}`"
              :key="header.id"
              :aria-colindex="columnIndex + 1"
              :aria-sort="
                resolveColumn(header.column.id).allowsSorting
                  ? (sortDirectionFor(header.column.id) ?? 'none')
                  : undefined
              "
              :class="variants.column()"
              :data-allows-sorting="
                resolveColumn(header.column.id).allowsSorting ? 'true' : undefined
              "
              :data-col-index="columnIndex"
              :data-row-index="-1"
              :data-sort-direction="sortDirectionFor(header.column.id)"
              :style="columnStyle(resolveColumn(header.column.id))"
              :tabindex="cellTabIndex(-1, columnIndex)"
              data-slot="table-column"
              role="columnheader"
              @click="handleHeaderClick"
            >
              <template v-if="resolveColumn(header.column.id).allowsSorting">
                <span
                  :class="variants.sortableColumnHeader()"
                  :data-direction="sortDirectionFor(header.column.id)"
                  data-slot="table-sortable-column-header"
                >
                  <slot
                    :name="`header-${header.column.id}`"
                    :column="resolveColumn(header.column.id)"
                    :sort-direction="sortDirectionFor(header.column.id)"
                  >
                    <slot
                      name="header"
                      :column="resolveColumn(header.column.id)"
                      :sort-direction="sortDirectionFor(header.column.id)"
                    >
                      {{ resolveColumn(header.column.id).header }}
                    </slot>
                  </slot>
                  <ChevronUpIcon
                    v-if="sortDirectionFor(header.column.id)"
                    :class="variants.sortableColumnIndicator()"
                    :data-direction="sortDirectionFor(header.column.id)"
                    data-slot="table-sortable-column-indicator"
                  />
                </span>
              </template>
              <template v-else>
                <slot
                  :name="`header-${header.column.id}`"
                  :column="resolveColumn(header.column.id)"
                >
                  <slot name="header" :column="resolveColumn(header.column.id)">
                    {{ resolveColumn(header.column.id).header }}
                  </slot>
                </slot>
              </template>
              <div
                v-if="isResizable && resolveColumn(header.column.id).allowsResizing"
                :class="variants.columnResizer()"
                :data-focus-visible="
                  focusVisibleResizerKey === header.column.id ? 'true' : undefined
                "
                :data-hovered="hoveredResizerKey === header.column.id ? 'true' : undefined"
                :data-resizable-direction="resizableDirection(resolveColumn(header.column.id))"
                :data-resizing="resizingKey === header.column.id ? 'true' : undefined"
                data-slot="table-column-resizer"
                role="presentation"
                @pointercancel="handleResizerEnd"
                @pointerdown="handleResizerPointerDown($event, resolveColumn(header.column.id))"
                @pointerenter="handleResizerPointerEnter(header.column.id)"
                @pointerleave="handleResizerPointerLeave(header.column.id)"
                @pointermove="handleResizerPointerMove"
                @pointerup="handleResizerEnd"
              >
                <input
                  :id="`${idPrefix}-resizer-${header.column.id}`"
                  :aria-labelledby="`${idPrefix}-resizer-${header.column.id} ${idPrefix}-h-${header.column.id}`"
                  :aria-valuetext="`${columnWidth(resolveColumn(header.column.id))} pixels`"
                  :max="maxColumnWidth(resolveColumn(header.column.id))"
                  :min="minColumnWidth(resolveColumn(header.column.id))"
                  :style="visuallyHiddenStyle"
                  :value="columnWidth(resolveColumn(header.column.id))"
                  aria-label="Resizer"
                  aria-orientation="horizontal"
                  type="range"
                  @blur="handleResizerBlur(header.column.id)"
                  @focus="handleResizerFocus($event, header.column.id)"
                  @input="handleResizerInput($event, resolveColumn(header.column.id))"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          :class="variants.body()"
          :data-empty="isEmpty ? 'true' : undefined"
          data-slot="table-body"
          role="rowgroup"
        >
          <tr
            v-for="(row, rowIndex) in rows"
            :id="`${idPrefix}-r${rowIndex}`"
            :key="row.id"
            :aria-disabled="isDisabledRow(row.id) ? 'true' : undefined"
            :aria-labelledby="rowLabelledBy(rowIndex)"
            :aria-rowindex="rowIndex + 2"
            :aria-selected="selectionMode !== 'none' ? isRowSelected(row.id) : undefined"
            :class="variants.row()"
            :data-disabled="isDisabledRow(row.id) ? 'true' : undefined"
            :data-selected="isRowSelected(row.id) ? 'true' : undefined"
            :data-selection-mode="selectionMode !== 'none' ? selectionMode : undefined"
            data-level="1"
            data-slot="table-row"
            role="row"
            style="--table-row-level: 1"
            @click="handleRowClick($event, row.id)"
          >
            <td
              v-for="(cell, columnIndex) in row.getVisibleCells()"
              :id="cellId(rowIndex, columnIndex)"
              :key="cell.id"
              :aria-colindex="columnIndex + 1"
              :class="variants.cell()"
              :data-col-index="columnIndex"
              :data-column-index="columnIndex"
              :data-disabled="isDisabledRow(row.id) ? 'true' : undefined"
              :data-row-index="rowIndex"
              :data-selected="isRowSelected(row.id) ? 'true' : undefined"
              :role="resolveColumn(cell.column.id).isRowHeader ? 'rowheader' : 'gridcell'"
              :style="columnStyle(resolveColumn(cell.column.id))"
              :tabindex="cellTabIndex(rowIndex, columnIndex)"
              data-level="1"
              data-slot="table-cell"
            >
              <slot
                :name="`cell-${cell.column.id}`"
                :column="resolveColumn(cell.column.id)"
                :row="row.original"
                :row-index="rowIndex"
                :value="cell.getValue()"
              >
                <slot
                  name="cell"
                  :column="resolveColumn(cell.column.id)"
                  :row="row.original"
                  :row-index="rowIndex"
                  :value="cell.getValue()"
                >
                  {{ displayValue(cell.getValue()) }}
                </slot>
              </slot>
            </td>
          </tr>
          <tr v-if="isEmpty" role="row">
            <td :colspan="columnCount" role="rowheader">
              <slot name="empty" />
            </td>
          </tr>
          <tr v-if="isLoading" :class="variants.row()" data-slot="table-row" role="row">
            <td
              :class="variants.cell()"
              :colspan="columnCount"
              data-slot="table-cell"
              role="gridcell"
            >
              <slot name="loading">Loading...</slot>
            </td>
          </tr>
          <tr
            v-if="hasMore"
            ref="loadMoreEl"
            :class="variants.loadMore()"
            data-slot="table-load-more"
            role="row"
          >
            <td :colspan="columnCount">
              <div :class="variants.loadMoreContent()" data-slot="table-load-more-content">
                <slot name="loadMore" :is-loading="isLoadingMore" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" :class="variants.footer()" data-slot="table-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
