import type {DateValue} from "@internationalized/date";
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
import CalendarRoot from "../../calendar/calendar-root.vue";
import {DateFieldGroup, DateFieldInput, DateFieldSegment, DateFieldSuffix} from "../../date-field";
import {Label} from "../../label";
import DatePickerPopover from "../date-picker-popover.vue";
import DatePickerRoot from "../date-picker-root.vue";
import DatePickerTrigger from "../date-picker-trigger.vue";
import DatePickerTriggerIndicator from "../date-picker-trigger-indicator.vue";

const parts = {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
  DateFieldGroup,
  DateFieldInput,
  DateFieldSegment,
  DateFieldSuffix,
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
  Label,
};

interface HostOptions {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
  open?: boolean;
  closeOnSelect?: boolean;
}

function mountPicker(options: HostOptions = {}) {
  const value = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
  const changes: (DateValue | null)[] = [];

  const host = {
    components: parts,
    data() {
      return {
        changes,
        closeOnSelect: options.closeOnSelect ?? true,
        isDisabled: options.isDisabled ?? false,
        isInvalid: options.isInvalid ?? false,
        isReadOnly: options.isReadOnly ?? false,
        maxValue: options.maxValue,
        minValue: options.minValue,
        open: options.open,
        value,
      };
    },
    template: `
      <DatePickerRoot
        v-model="value"
        v-model:open="open"
        locale="en"
        name="date"
        :close-on-select="closeOnSelect"
        :is-disabled="isDisabled"
        :is-invalid="isInvalid"
        :is-read-only="isReadOnly"
        :max-value="maxValue"
        :min-value="minValue"
        :placeholder-value="value ?? undefined"
        @change="(next) => changes.push(next)"
      >
        <Label>Date</Label>
        <DateFieldGroup>
          <DateFieldInput>
            <template #default="{ segment }">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateFieldSuffix>
            <DatePickerTrigger aria-label="Choose date">
              <DatePickerTriggerIndicator />
            </DatePickerTrigger>
          </DateFieldSuffix>
        </DateFieldGroup>
        <DatePickerPopover>
          <CalendarRoot>
            <CalendarHeader>
              <CalendarNavButton :page="'previous'" />
              <CalendarHeading />
              <CalendarNavButton :page="'next'" />
            </CalendarHeader>
            <CalendarGrid>
              <CalendarGridHeader />
              <CalendarGridBody />
            </CalendarGrid>
          </CalendarRoot>
        </DatePickerPopover>
      </DatePickerRoot>
    `,
  };

  return {wrapper: mount(host, {attachTo: document.body}), value, changes};
}

const triggerOf = () => document.querySelector<HTMLElement>('[data-slot="date-picker-trigger"]');
const popoverOf = () => document.querySelector<HTMLElement>('[data-slot="date-picker-popover"]');

// The popover is teleported to the body, so it lives outside the mounted
// wrapper.
function findDay(day: string) {
  const match = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="calendar-cell"]'),
  ).find((cell) => cell.textContent?.trim() === day);

  if (!match) {
    throw new Error(`Day cell ${day} not found`);
  }

  return match;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("DatePicker", () => {
  it("renders the field, trigger and hidden input while closed", () => {
    const {wrapper} = mountPicker();
    const root = wrapper.get('[data-slot="date-picker"]');
    const trigger = triggerOf();

    expect(root.classes()).toContain("date-picker");
    expect(root.attributes("data-open")).toBeUndefined();
    expect(trigger?.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(trigger?.hasAttribute("aria-controls")).toBe(false);
    expect(
      wrapper.get('[data-slot="date-picker-trigger-indicator"]').attributes("aria-hidden"),
    ).toBe("true");
    expect(wrapper.get('[data-slot="date-input-group"]').classes()).toContain("date-input-group");
    expect(popoverOf()).toBeNull();
    expect(wrapper.find('input[name="date"]').exists()).toBe(true);

    wrapper.unmount();
  });

  it("opens the popover from the trigger with the calendar bound to the picker", async () => {
    const {wrapper} = mountPicker();

    triggerOf()?.click();
    await flushPromises();

    const popover = popoverOf();

    expect(popover).not.toBeNull();
    expect(popover?.getAttribute("role")).toBe("dialog");
    expect(popover?.getAttribute("data-placement")).toBe("bottom");
    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBe("true");
    expect(triggerOf()?.getAttribute("aria-expanded")).toBe("true");
    expect(triggerOf()?.getAttribute("aria-controls")).toBe(popover?.id);
    const calendar = document.querySelector<HTMLElement>('[data-slot="calendar"]');

    expect(calendar?.getAttribute("role")).toBe("application");
    expect(findDay("14").getAttribute("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("selects a day, emits change and closes on select", async () => {
    const {wrapper, value, changes} = mountPicker();

    triggerOf()?.click();
    await flushPromises();

    findDay("20").click();
    await flushPromises();
    await nextTick();

    expect(value.value?.toString()).toBe("2025-02-20");
    expect(changes.at(-1)?.toString()).toBe("2025-02-20");
    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBeUndefined();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(popoverOf()).toBeNull();
    expect(document.activeElement).toBe(triggerOf());

    wrapper.unmount();
  });

  it("keeps the popover open when closeOnSelect is false", async () => {
    const {wrapper} = mountPicker({closeOnSelect: false});

    triggerOf()?.click();
    await flushPromises();

    findDay("20").click();
    await flushPromises();

    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBe("true");
    expect(popoverOf()).not.toBeNull();

    wrapper.unmount();
  });

  it("toggles the popover closed without selecting", async () => {
    const {wrapper} = mountPicker();

    triggerOf()?.click();
    await flushPromises();

    triggerOf()?.click();
    await flushPromises();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(popoverOf()).toBeNull();
    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBeUndefined();

    wrapper.unmount();
  });

  it("does not open from a disabled trigger", async () => {
    const {wrapper} = mountPicker({isDisabled: true});

    expect(triggerOf()?.hasAttribute("disabled")).toBe(true);
    expect(triggerOf()?.getAttribute("data-disabled")).toBe("true");

    triggerOf()?.click();
    await flushPromises();

    expect(popoverOf()).toBeNull();

    wrapper.unmount();
  });

  it("renders the invalid state on the root and segments", () => {
    const {wrapper} = mountPicker({isInvalid: true});
    const root = wrapper.get('[data-slot="date-picker"]');

    expect(root.attributes("data-invalid")).toBe("true");
    expect(wrapper.get('[data-slot="date-input-group"]').attributes("data-invalid")).toBe("true");

    wrapper.unmount();
  });

  it("marks days outside min and max as disabled", async () => {
    const {wrapper} = mountPicker({minValue: new CalendarDate(2025, 2, 10)});

    triggerOf()?.click();
    await flushPromises();

    expect(findDay("9").getAttribute("data-disabled")).toBe("true");
    expect(findDay("10").getAttribute("data-disabled")).toBeNull();

    wrapper.unmount();
  });

  it("supports a controlled open state", async () => {
    const {wrapper} = mountPicker({open: true});

    await flushPromises();

    expect(popoverOf()).not.toBeNull();
    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBe("true");

    wrapper.unmount();
  });
});
