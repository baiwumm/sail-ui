import type {DateValue} from "@internationalized/date";

import {CalendarDate} from "@internationalized/date";
import {mount} from "@vue/test-utils";
import type {VueWrapper} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, nextTick, ref} from "vue";

import CalendarCell from "../components/calendar/calendar-cell.vue";
import CalendarGrid from "../components/calendar/calendar-grid.vue";
import CalendarGridBody from "../components/calendar/calendar-grid-body.vue";
import CalendarGridHeader from "../components/calendar/calendar-grid-header.vue";
import CalendarHeader from "../components/calendar/calendar-header.vue";
import CalendarHeading from "../components/calendar/calendar-heading.vue";
import CalendarNavButton from "../components/calendar/calendar-nav-button.vue";
import CalendarRoot from "../components/calendar/calendar-root.vue";
import type {CalendarValue, RangeCalendarValue} from "../components/calendar/types";
import CalendarYearPickerCell from "../components/calendar-year-picker/calendar-year-picker-cell.vue";
import CalendarYearPickerGrid from "../components/calendar-year-picker/calendar-year-picker-grid.vue";
import CalendarYearPickerGridBody from "../components/calendar-year-picker/calendar-year-picker-grid-body.vue";
import CalendarYearPickerTrigger from "../components/calendar-year-picker/calendar-year-picker-trigger.vue";
import CalendarYearPickerTriggerHeading from "../components/calendar-year-picker/calendar-year-picker-trigger-heading.vue";
import CalendarYearPickerTriggerIndicator from "../components/calendar-year-picker/calendar-year-picker-trigger-indicator.vue";
import RangeCalendarCell from "../components/range-calendar/range-calendar-cell.vue";
import RangeCalendarRoot from "../components/range-calendar/range-calendar-root.vue";

const calendarParts = {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  RangeCalendarCell,
  RangeCalendarRoot,
};

interface CalendarHostOptions {
  defaultValue?: CalendarValue;
  defaultFocusedValue?: DateValue;
  dir?: "ltr" | "rtl";
  selectionMode?: "single" | "multiple";
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
}

function mountCalendar(options: CalendarHostOptions = {}) {
  const Host = defineComponent({
    components: calendarParts,
    setup() {
      const model = ref<CalendarValue>(options.defaultValue ?? null);

      return {
        dir: options.dir,
        focused: options.defaultFocusedValue,
        isDateDisabled: options.isDateDisabled,
        isDateUnavailable: options.isDateUnavailable,
        maxValue: options.maxValue,
        minValue: options.minValue,
        model,
        selectionMode: options.selectionMode ?? "single",
      };
    },
    template: `
      <CalendarRoot
        v-model="model"
        aria-label="Event date"
        :dir="dir"
        locale="en"
        :default-focused-value="focused"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
        :max-value="maxValue"
        :min-value="minValue"
        :selection-mode="selectionMode"
      >
        <CalendarHeader>
          <CalendarNavButton :page="'previous'" />
          <CalendarYearPickerTrigger>
            <CalendarYearPickerTriggerHeading />
            <CalendarYearPickerTriggerIndicator />
          </CalendarYearPickerTrigger>
          <CalendarNavButton :page="'next'" />
        </CalendarHeader>
        <CalendarGrid>
          <CalendarGridHeader />
          <CalendarGridBody />
        </CalendarGrid>
        <CalendarYearPickerGrid>
          <CalendarYearPickerGridBody />
        </CalendarYearPickerGrid>
      </CalendarRoot>
    `,
  });

  return mount(Host, {attachTo: document.body});
}

interface RangeHostOptions {
  defaultValue?: RangeCalendarValue;
  defaultFocusedValue?: DateValue;
}

function mountRangeCalendar(options: RangeHostOptions = {}) {
  const Host = defineComponent({
    components: calendarParts,
    setup() {
      const model = ref<RangeCalendarValue>(options.defaultValue ?? null);

      return {focused: options.defaultFocusedValue, model};
    },
    template: `
      <RangeCalendarRoot
        v-model="model"
        aria-label="Range"
        locale="en"
        :default-focused-value="focused"
      >
        <CalendarHeader>
          <CalendarNavButton :page="'previous'" />
          <CalendarHeading />
          <CalendarNavButton :page="'next'" />
        </CalendarHeader>
        <CalendarGrid>
          <CalendarGridHeader />
          <CalendarGridBody />
        </CalendarGrid>
      </RangeCalendarRoot>
    `,
  });

  return mount(Host, {attachTo: document.body});
}

function dayCells(wrapper: VueWrapper) {
  return wrapper.findAll('[data-slot="calendar-cell"], [data-slot="range-calendar-cell"]');
}

function findDay(wrapper: VueWrapper, day: string) {
  const match = dayCells(wrapper).find((cell) => cell.text() === day);

  if (!match) {
    throw new Error(`Day cell ${day} not found`);
  }

  return match;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Calendar", () => {
  it("renders the header, grid and selected day", () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});
    const root = wrapper.get('[data-slot="calendar"]');

    expect(root.attributes("role")).toBe("application");
    expect(wrapper.get('[data-slot="calendar-year-picker-trigger-heading"]').text()).toBe(
      "February 2025",
    );
    expect(wrapper.get('[data-slot="calendar-grid"]').attributes("role")).toBe("grid");

    const cell = findDay(wrapper, "14");

    expect(cell.attributes("data-selected")).toBe("true");
    expect(cell.attributes("data-focused")).toBe("true");
    expect(cell.element.parentElement?.getAttribute("aria-selected")).toBe("true");
    expect(cell.element.parentElement?.getAttribute("role")).toBe("gridcell");
  });

  it("selects a controlled date on click", async () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});

    await findDay(wrapper, "20").trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as {model: CalendarValue}).model?.toString()).toBe("2025-02-20");
    expect(findDay(wrapper, "20").attributes("data-selected")).toBe("true");
    expect(findDay(wrapper, "14").attributes("data-selected")).toBeUndefined();
  });

  it("selects multiple dates and toggles them off", async () => {
    const wrapper = mountCalendar({
      defaultFocusedValue: new CalendarDate(2025, 2, 14),
      defaultValue: [],
      selectionMode: "multiple",
    });

    await findDay(wrapper, "14").trigger("click");
    await nextTick();
    await findDay(wrapper, "15").trigger("click");
    await nextTick();

    const model = (wrapper.vm as unknown as {model: DateValue[]}).model;

    expect(model.map((date) => date.toString())).toEqual(["2025-02-14", "2025-02-15"]);
    expect(wrapper.get('[data-slot="calendar-grid"]').attributes("aria-multiselectable")).toBe(
      "true",
    );

    await findDay(wrapper, "14").trigger("click");
    await nextTick();

    expect(
      (wrapper.vm as unknown as {model: DateValue[]}).model.map((date) => date.toString()),
    ).toEqual(["2025-02-15"]);
  });

  it("marks disabled dates unselectable", async () => {
    const wrapper = mountCalendar({
      defaultValue: new CalendarDate(2025, 2, 14),
      isDateDisabled: (date) => date.day === 20,
    });
    const cell = findDay(wrapper, "20");

    expect(cell.attributes("data-disabled")).toBe("true");
    expect(cell.element.parentElement?.getAttribute("aria-disabled")).toBe("true");

    await cell.trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as {model: CalendarValue}).model?.toString()).toBe("2025-02-14");
  });

  it("marks unavailable dates unselectable", async () => {
    const wrapper = mountCalendar({
      defaultValue: new CalendarDate(2025, 2, 14),
      isDateUnavailable: (date) => date.day === 20,
    });
    const cell = findDay(wrapper, "20");

    expect(cell.attributes("data-unavailable")).toBe("true");
    expect(cell.attributes("data-disabled")).toBeUndefined();
    expect(cell.element.parentElement?.getAttribute("aria-disabled")).toBe("true");

    await cell.trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as {model: CalendarValue}).model?.toString()).toBe("2025-02-14");
  });

  it("marks days from adjacent months", () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});
    const outside = wrapper.findAll('[data-slot="calendar-cell"][data-outside-month="true"]');

    expect(outside.length).toBeGreaterThan(0);
    expect(outside[0]!.element.parentElement?.getAttribute("aria-disabled")).toBe("true");
  });

  it("moves the focused date backwards through ArrowRight in RTL", async () => {
    const wrapper = mountCalendar({
      defaultValue: new CalendarDate(2025, 2, 14),
      dir: "rtl",
    });

    expect(wrapper.get('[data-slot="calendar"]').attributes("dir")).toBe("rtl");

    await findDay(wrapper, "14").trigger("keydown", {key: "ArrowRight", code: "ArrowRight"});
    await nextTick();

    expect(findDay(wrapper, "13").attributes("data-focused")).toBe("true");
    expect(findDay(wrapper, "14").attributes("data-focused")).toBeUndefined();
  });

  it("pages months through the navigation buttons", async () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});

    expect(wrapper.get('button[slot="next"]').attributes("aria-label")).toBe("Next");

    await wrapper.get('button[slot="next"]').trigger("click");
    await nextTick();

    expect(wrapper.get('[data-slot="calendar-year-picker-trigger-heading"]').text()).toBe(
      "March 2025",
    );

    await wrapper.get('button[slot="previous"]').trigger("click");
    await nextTick();

    expect(wrapper.get('[data-slot="calendar-year-picker-trigger-heading"]').text()).toBe(
      "February 2025",
    );
  });
});

describe("Calendar year picker", () => {
  it("opens, focuses the selected year and selects a year", async () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});
    const trigger = wrapper.get('[data-slot="calendar-year-picker-trigger"]');

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get('[data-slot="calendar-year-picker-grid"]').attributes("aria-hidden")).toBe(
      "true",
    );

    await trigger.trigger("click");
    await nextTick();
    await nextTick();

    const grid = wrapper.get('[data-slot="calendar-year-picker-grid"]');

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("data-open")).toBe("true");
    expect(grid.attributes("aria-hidden")).toBe("false");
    expect(grid.attributes("role")).toBe("listbox");
    expect(wrapper.findAll('[data-slot="calendar-year-picker-year-cell"]')).toHaveLength(20);

    const selected = wrapper.get('[data-year="2025"]');

    expect(selected.attributes("data-selected")).toBe("true");
    expect(selected.attributes("tabindex")).toBe("0");
    expect(document.activeElement).toBe(selected.element);

    await selected.trigger("keydown", {key: "ArrowRight"});
    await nextTick();

    expect(document.activeElement).toBe(wrapper.get('[data-year="2026"]').element);
    expect(wrapper.get('[data-year="2026"]').attributes("tabindex")).toBe("0");
    expect(wrapper.get('[data-year="2025"]').attributes("tabindex")).toBe("-1");

    await wrapper.get('[data-year="2026"]').trigger("click");
    await nextTick();

    expect(wrapper.get('[data-slot="calendar-year-picker-grid"]').attributes("aria-hidden")).toBe(
      "true",
    );
    expect(wrapper.get('[data-slot="calendar-year-picker-trigger-heading"]').text()).toBe(
      "February 2026",
    );
    expect((wrapper.vm as unknown as {model: CalendarValue}).model?.toString()).toBe("2025-02-14");
  });

  it("closes with Escape", async () => {
    const wrapper = mountCalendar({defaultValue: new CalendarDate(2025, 2, 14)});

    await wrapper.get('[data-slot="calendar-year-picker-trigger"]').trigger("click");
    await nextTick();

    expect(wrapper.get('[data-slot="calendar-year-picker-grid"]').attributes("data-open")).toBe(
      "true",
    );

    await wrapper
      .get('[data-slot="calendar-year-picker-grid"]')
      .trigger("keydown", {key: "Escape"});
    await nextTick();

    expect(
      wrapper.get('[data-slot="calendar-year-picker-grid"]').attributes("data-open"),
    ).toBeUndefined();
  });
});

describe("RangeCalendar", () => {
  it("renders a selected range with start and end markers", () => {
    const wrapper = mountRangeCalendar({
      defaultValue: {
        start: new CalendarDate(2025, 2, 10),
        end: new CalendarDate(2025, 2, 12),
      },
    });

    expect(wrapper.get('[data-slot="range-calendar"]').attributes("role")).toBe("application");
    expect(wrapper.get('[data-slot="range-calendar-grid"]').attributes("role")).toBe("grid");
    expect(
      wrapper.get('[data-slot="range-calendar-grid"]').attributes("aria-multiselectable"),
    ).toBe("true");

    expect(findDay(wrapper, "10").attributes("data-selection-start")).toBe("true");
    expect(findDay(wrapper, "12").attributes("data-selection-end")).toBe("true");
    expect(findDay(wrapper, "11").attributes("data-selected")).toBe("true");

    const span = findDay(wrapper, "10").get('[data-slot="range-calendar-cell-button"]');

    expect(span.attributes("data-selected")).toBe("true");
    expect(
      findDay(wrapper, "11")
        .get('[data-slot="range-calendar-cell-button"]')
        .attributes("data-selected"),
    ).toBeUndefined();
  });

  it("commits a new range after the second click", async () => {
    const wrapper = mountRangeCalendar({
      defaultFocusedValue: new CalendarDate(2025, 2, 1),
    });

    await findDay(wrapper, "10").trigger("mouseenter");
    await findDay(wrapper, "10").trigger("click");
    await nextTick();

    expect((wrapper.vm as unknown as {model: RangeCalendarValue}).model).toBeNull();

    await findDay(wrapper, "20").trigger("mouseenter");
    await findDay(wrapper, "20").trigger("click");
    await nextTick();

    const model = (wrapper.vm as unknown as {model: RangeCalendarValue}).model;

    expect(model?.start.toString()).toBe("2025-02-10");
    expect(model?.end?.toString()).toBe("2025-02-20");
    expect(findDay(wrapper, "15").attributes("data-selected")).toBe("true");
  });
});
