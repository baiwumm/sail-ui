import TableRoot from "./table.vue";

const Table = Object.assign(TableRoot, {
  Root: TableRoot,
});

export {Table, TableRoot};
export type {
  TableProps,
  TableProps as TableRootProps,
  TableColumn,
  TableCellSlotProps,
  TableHeaderSlotProps,
  TableKey,
  TableSelection,
  TableSelectionMode,
  TableSortDirection,
  TableSortDescriptor,
} from "./types";
export {tableVariants, type TableVariants} from "@sail-ui/styles";
