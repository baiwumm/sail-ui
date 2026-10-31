import CalendarCellIndicator from "../calendar/calendar-cell-indicator.vue";
import CalendarGrid from "../calendar/calendar-grid.vue";
import CalendarGridBody from "../calendar/calendar-grid-body.vue";
import CalendarGridHeader from "../calendar/calendar-grid-header.vue";
import CalendarHeader from "../calendar/calendar-header.vue";
import CalendarHeaderCell from "../calendar/calendar-header-cell.vue";
import CalendarHeading from "../calendar/calendar-heading.vue";
import CalendarNavButton from "../calendar/calendar-nav-button.vue";
import CalendarYearPickerCell from "../calendar-year-picker/calendar-year-picker-cell.vue";
import CalendarYearPickerGrid from "../calendar-year-picker/calendar-year-picker-grid.vue";
import CalendarYearPickerGridBody from "../calendar-year-picker/calendar-year-picker-grid-body.vue";
import CalendarYearPickerTrigger from "../calendar-year-picker/calendar-year-picker-trigger.vue";
import CalendarYearPickerTriggerHeading from "../calendar-year-picker/calendar-year-picker-trigger-heading.vue";
import CalendarYearPickerTriggerIndicator from "../calendar-year-picker/calendar-year-picker-trigger-indicator.vue";

import RangeCalendarCell from "./range-calendar-cell.vue";
import RangeCalendarRoot from "./range-calendar-root.vue";

const RangeCalendarHeader = CalendarHeader;
const RangeCalendarHeading = CalendarHeading;
const RangeCalendarNavButton = CalendarNavButton;
const RangeCalendarGrid = CalendarGrid;
const RangeCalendarGridHeader = CalendarGridHeader;
const RangeCalendarGridBody = CalendarGridBody;
const RangeCalendarHeaderCell = CalendarHeaderCell;
const RangeCalendarCellIndicator = CalendarCellIndicator;

const RangeCalendar = Object.assign(RangeCalendarRoot, {
  Root: RangeCalendarRoot,
  Header: RangeCalendarHeader,
  Heading: RangeCalendarHeading,
  NavButton: RangeCalendarNavButton,
  Grid: RangeCalendarGrid,
  GridHeader: RangeCalendarGridHeader,
  GridBody: RangeCalendarGridBody,
  HeaderCell: RangeCalendarHeaderCell,
  Cell: RangeCalendarCell,
  CellIndicator: RangeCalendarCellIndicator,
  YearPickerTrigger: CalendarYearPickerTrigger,
  YearPickerTriggerHeading: CalendarYearPickerTriggerHeading,
  YearPickerTriggerIndicator: CalendarYearPickerTriggerIndicator,
  YearPickerGrid: CalendarYearPickerGrid,
  YearPickerGridBody: CalendarYearPickerGridBody,
  YearPickerCell: CalendarYearPickerCell,
});

export {
  RangeCalendar,
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarGrid,
  RangeCalendarGridHeader,
  RangeCalendarGridBody,
  RangeCalendarHeaderCell,
  RangeCalendarCell,
  RangeCalendarCellIndicator,
};

export type {
  RangeCalendarRootProps,
  RangeCalendarRootProps as RangeCalendarProps,
  RangeCalendarRootEmits,
  CalendarCellProps as RangeCalendarCellProps,
  CalendarHeaderProps as RangeCalendarHeaderProps,
  CalendarHeadingProps as RangeCalendarHeadingProps,
  CalendarNavButtonProps as RangeCalendarNavButtonProps,
  CalendarGridProps as RangeCalendarGridProps,
  CalendarGridHeaderProps as RangeCalendarGridHeaderProps,
  CalendarGridBodyProps as RangeCalendarGridBodyProps,
  CalendarHeaderCellProps as RangeCalendarHeaderCellProps,
  CalendarCellIndicatorProps as RangeCalendarCellIndicatorProps,
} from "../calendar/types";

export {rangeCalendarVariants, type RangeCalendarVariants} from "@sail-ui/styles";
