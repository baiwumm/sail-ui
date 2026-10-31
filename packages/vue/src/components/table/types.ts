import type {TableVariants} from "@sail-ui/styles";

export type TableKey = string | number;
export type TableSelection = "all" | Iterable<TableKey>;
export type TableSelectionMode = "none" | "single" | "multiple";
export type TableSortDirection = "ascending" | "descending";

export interface TableSortDescriptor {
  column: string;
  direction: TableSortDirection;
}

export interface TableColumn {
  key: string;
  header: string;
  /** Marks the cell in this column as the row header. */
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  /** Renders the drag handle that resizes this column when the table is resizable. */
  allowsResizing?: boolean;
  /** Initial width in pixels; also used as the size hint for non-resizable tables. */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "start" | "center" | "end";
}

export interface TableProps<Row extends object = Record<string, any>> {
  columns: TableColumn[];
  data: Row[];
  ariaLabel?: string;
  isLoading?: boolean;
  variant?: TableVariants["variant"];
  contentClass?: string;
  getRowKey?: (row: Row, index: number) => string | number;
  isResizable?: boolean;
  isVirtualized?: boolean;
  /** Keeps the header visible while the scroll container scrolls vertically. */
  isStickyHeader?: boolean;
  /** Fixed row height in pixels; required for virtualization. */
  rowHeight?: number;
  /** Renders the load-more sentinel row and emits `loadMore` when it scrolls into view. */
  hasMore?: boolean;
  isLoadingMore?: boolean;
  scrollContainerClass?: string;
  selectionMode?: TableSelectionMode;
  selectedKeys?: TableSelection;
  defaultSelectedKeys?: TableSelection;
  disabledKeys?: Iterable<TableKey>;
  sortDescriptor?: TableSortDescriptor | null;
  defaultSortDescriptor?: TableSortDescriptor | null;
}

export interface TableCellSlotProps<Row extends object = Record<string, any>> {
  column: TableColumn;
  row: Row;
  value: unknown;
  rowIndex: number;
}

export interface TableHeaderSlotProps {
  column: TableColumn;
  sortDirection?: TableSortDirection;
}
