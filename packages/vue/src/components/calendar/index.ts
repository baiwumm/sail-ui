import CalendarCell from "./calendar-cell.vue";
import CalendarCellIndicator from "./calendar-cell-indicator.vue";
import CalendarGrid from "./calendar-grid.vue";
import CalendarGridBody from "./calendar-grid-body.vue";
import CalendarGridHeader from "./calendar-grid-header.vue";
import CalendarHeader from "./calendar-header.vue";
import CalendarHeaderCell from "./calendar-header-cell.vue";
import CalendarHeading from "./calendar-heading.vue";
import CalendarNavButton from "./calendar-nav-button.vue";
import CalendarRoot from "./calendar-root.vue";
import CalendarYearPickerCell from "../calendar-year-picker/calendar-year-picker-cell.vue";
import CalendarYearPickerGrid from "../calendar-year-picker/calendar-year-picker-grid.vue";
import CalendarYearPickerGridBody from "../calendar-year-picker/calendar-year-picker-grid-body.vue";
import CalendarYearPickerTrigger from "../calendar-year-picker/calendar-year-picker-trigger.vue";
import CalendarYearPickerTriggerHeading from "../calendar-year-picker/calendar-year-picker-trigger-heading.vue";
import CalendarYearPickerTriggerIndicator from "../calendar-year-picker/calendar-year-picker-trigger-indicator.vue";

const Calendar = Object.assign(CalendarRoot, {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Heading: CalendarHeading,
  NavButton: CalendarNavButton,
  Grid: CalendarGrid,
  GridHeader: CalendarGridHeader,
  GridBody: CalendarGridBody,
  HeaderCell: CalendarHeaderCell,
  Cell: CalendarCell,
  CellIndicator: CalendarCellIndicator,
  YearPickerTrigger: CalendarYearPickerTrigger,
  YearPickerTriggerHeading: CalendarYearPickerTriggerHeading,
  YearPickerTriggerIndicator: CalendarYearPickerTriggerIndicator,
  YearPickerGrid: CalendarYearPickerGrid,
  YearPickerGridBody: CalendarYearPickerGridBody,
  YearPickerCell: CalendarYearPickerCell,
});

export {
  Calendar,
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  CalendarCellIndicator,
};

export type {
  CalendarRootProps,
  CalendarRootProps as CalendarProps,
  CalendarRootEmits,
  CalendarHeaderProps,
  CalendarHeadingProps,
  CalendarNavButtonProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarGridBodyProps,
  CalendarHeaderCellProps,
  CalendarCellProps,
  CalendarCellIndicatorProps,
} from "./types";

export {calendarVariants, type CalendarVariants} from "@sail-ui/styles";
