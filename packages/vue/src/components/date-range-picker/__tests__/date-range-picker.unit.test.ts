import {CalendarDate} from "@internationalized/date";
import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {nextTick, shallowRef} from "vue";

import CalendarGrid from "../../calendar/calendar-grid.vue";
import CalendarGridBody from "../../calendar/calendar-grid-body.vue";
import CalendarGridHeader from "../../calendar/calendar-grid-header.vue";
import CalendarHeader from "../../calendar/calendar-header.vue";
import CalendarHeading from "../../calendar/calendar-heading.vue";
import CalendarNavButton from "../../calendar/calendar-nav-button.vue";
import {DateFieldGroup, DateFieldInput, DateFieldSegment, DateFieldSuffix} from "../../date-field";
import {Label} from "../../label";
import RangeCalendarRoot from "../../range-calendar/range-calendar-root.vue";
import DateRangePickerPopover from "../date-range-picker-popover.vue";
import DateRangePickerRangeSeparator from "../date-range-picker-range-separator.vue";
import DateRangePickerRoot from "../date-range-picker-root.vue";
import DateRangePickerTrigger from "../date-range-picker-trigger.vue";
import DateRangePickerTriggerIndicator from "../date-range-picker-trigger-indicator.vue";
import type {DateRangePickerValue} from "../types";

const parts = {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  DateFieldGroup,
  DateFieldInput,
  DateFieldSegment,
  DateFieldSuffix,
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
  Label,
  RangeCalendarRoot,
};

interface HostOptions {
  isDisabled?: boolean;
  open?: boolean;
  closeOnSelect?: boolean;
}

function mountRangePicker(options: HostOptions = {}) {
  const value = shallowRef<DateRangePickerValue | null>({
    start: new CalendarDate(2025, 2, 10),
    end: new CalendarDate(2025, 2, 12),
  });
  const changes: (DateRangePickerValue | null)[] = [];

  const host = {
    components: parts,
    data() {
      return {
        changes,
        closeOnSelect: options.closeOnSelect ?? true,
        isDisabled: options.isDisabled ?? false,
        open: options.open,
        placeholder: new CalendarDate(2025, 2, 1),
        value,
      };
    },
    template: `
      <DateRangePickerRoot
        v-model="value"
        v-model:open="open"
        end-name="end"
        locale="en"
        name="range"
        start-name="start"
        :close-on-select="closeOnSelect"
        :is-disabled="isDisabled"
        :placeholder-value="placeholder"
        @change="(next) => changes.push(next)"
      >
        <Label>Stay</Label>
        <DateFieldGroup>
          <DateFieldInput v-bind="{ slot: 'start' }">
            <template #default="{ segment }">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateRangePickerRangeSeparator> - </DateRangePickerRangeSeparator>
          <DateFieldInput v-bind="{ slot: 'end' }">
            <template #default="{ segment }">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateFieldSuffix>
            <DateRangePickerTrigger aria-label="Choose dates">
              <DateRangePickerTriggerIndicator />
            </DateRangePickerTrigger>
          </DateFieldSuffix>
        </DateFieldGroup>
        <DateRangePickerPopover>
          <RangeCalendarRoot>
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
        </DateRangePickerPopover>
      </DateRangePickerRoot>
    `,
  };

  return {wrapper: mount(host, {attachTo: document.body}), value, changes};
}

const triggerOf = () =>
  document.querySelector<HTMLElement>('[data-slot="date-range-picker-trigger"]');
const popoverOf = () =>
  document.querySelector<HTMLElement>('[data-slot="date-range-picker-popover"]');

function findDay(day: string) {
  const match = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="range-calendar-cell"]'),
  ).find((cell) => cell.textContent?.trim() === day);

  if (!match) {
    throw new Error(`Day cell ${day} not found`);
  }

  return match;
}

function pickDay(day: string) {
  const cell = findDay(day);

  cell.dispatchEvent(new MouseEvent("mouseenter", {bubbles: true}));
  cell.click();
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("DateRangePicker", () => {
  it("renders both field inputs, the separator and the hidden range inputs", () => {
    const {wrapper} = mountRangePicker();
    const root = wrapper.get('[data-slot="date-range-picker"]');
    const inputs = wrapper.findAll('[data-slot="date-input-group-input"]');
    const separator = wrapper.get('[data-slot="date-range-picker-range-separator"]');

    expect(root.classes()).toContain("date-range-picker");
    expect(root.attributes("data-open")).toBeUndefined();
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.attributes("slot")).toBe("start");
    expect(inputs[1]?.attributes("slot")).toBe("end");
    expect(separator.attributes("aria-hidden")).toBe("true");
    expect(separator.text()).toBe("-");
    expect(wrapper.get('input[name="start"]').attributes("value")).toBe("2025-02-10");
    expect(wrapper.get('input[name="end"]').attributes("value")).toBe("2025-02-12");
    expect(
      wrapper.get('[data-slot="date-range-picker-trigger-indicator"]').attributes("aria-hidden"),
    ).toBe("true");
    expect(popoverOf()).toBeNull();

    wrapper.unmount();
  });

  it("shows the selected range when opened", async () => {
    const {wrapper} = mountRangePicker();

    triggerOf()?.click();
    await flushPromises();

    expect(popoverOf()).not.toBeNull();
    expect(wrapper.get('[data-slot="date-range-picker"]').attributes("data-open")).toBe("true");
    expect(findDay("10").getAttribute("data-selection-start")).toBe("true");
    expect(findDay("12").getAttribute("data-selection-end")).toBe("true");
    expect(findDay("11").getAttribute("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("commits a new range, emits change and closes on select", async () => {
    const {wrapper, value, changes} = mountRangePicker();

    triggerOf()?.click();
    await flushPromises();

    pickDay("15");
    await flushPromises();
    await nextTick();

    expect(value.value?.start?.toString()).toBe("2025-02-15");
    expect(value.value?.end).toBeUndefined();
    expect(wrapper.get('[data-slot="date-range-picker"]').attributes("data-open")).toBe("true");

    pickDay("20");
    await flushPromises();
    await nextTick();

    expect(value.value?.start?.toString()).toBe("2025-02-15");
    expect(value.value?.end?.toString()).toBe("2025-02-20");
    expect(changes.at(-1)?.end?.toString()).toBe("2025-02-20");
    expect(wrapper.get('[data-slot="date-range-picker"]').attributes("data-open")).toBeUndefined();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(popoverOf()).toBeNull();
    expect(document.activeElement).toBe(triggerOf());

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const {wrapper} = mountRangePicker({isDisabled: true});

    expect(triggerOf()?.hasAttribute("disabled")).toBe(true);
    expect(triggerOf()?.getAttribute("data-disabled")).toBe("true");

    triggerOf()?.click();
    await flushPromises();

    expect(popoverOf()).toBeNull();

    wrapper.unmount();
  });

  it("supports a controlled open state", async () => {
    const {wrapper} = mountRangePicker({open: true});

    await flushPromises();

    expect(popoverOf()).not.toBeNull();
    expect(wrapper.get('[data-slot="date-range-picker"]').attributes("data-open")).toBe("true");

    wrapper.unmount();
  });
});
