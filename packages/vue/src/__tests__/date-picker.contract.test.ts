import {CalendarDate} from "@internationalized/date";
import {flushPromises, mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, shallowRef} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
} from "../components/calendar";
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldSegment,
  DateFieldSuffix,
} from "../components/date-field";
import {
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
} from "../components/date-picker";
import {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
} from "../components/date-range-picker";
import {Label} from "../components/label";
import {RangeCalendarRoot} from "../components/range-calendar";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const renderedSlots = new Set<string>();

function expectUpstreamSlots(html: string, components: string[], extras: string[] = []) {
  const expected = new Set([
    ...components.flatMap((component) => slotSnapshot.components[component] ?? []),
    ...extras,
  ]);

  for (const slot of dataSlots(html)) {
    renderedSlots.add(slot);
    expect(expected.has(slot), `unknown slot: ${slot}`).toBe(true);
  }
}

const pickerParts = {
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

const rangeParts = {
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

const DatePickerPage = defineComponent({
  components: pickerParts,
  setup() {
    return {
      value: shallowRef(new CalendarDate(2025, 2, 14)),
    };
  },
  template: `
    <DatePickerRoot v-model="value" locale="en" name="date">
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
});

const DateRangePickerPage = defineComponent({
  components: rangeParts,
  setup() {
    return {
      value: shallowRef({
        start: new CalendarDate(2025, 2, 10),
        end: new CalendarDate(2025, 2, 12),
      }),
    };
  },
  template: `
    <DateRangePickerRoot v-model="value" end-name="end" locale="en" start-name="start">
      <Label>Stay</Label>
      <DateFieldGroup>
        <DateFieldInput v-bind="{ slot: 'start' }">
          <template #default="{ segment }">
            <DateFieldSegment :segment="segment" />
          </template>
        </DateFieldInput>
        <DateRangePickerRangeSeparator />
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
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("DatePicker contract", () => {
  it("renders only upstream slots", async () => {
    const html = await renderSSR(DatePickerPage);

    expectUpstreamSlots(html, ["date-picker", "date-input-group"], ["label"]);
    expect(renderedSlots.has("date-picker-trigger")).toBe(true);
    expect(renderedSlots.has("date-picker-trigger-indicator")).toBe(true);
    expect(renderedSlots.has("date-picker-popover")).toBe(false);
  });

  it("renders the closed root and trigger contract", () => {
    const wrapper = mount(DatePickerPage, {attachTo: document.body});
    const root = wrapper.get('[data-slot="date-picker"]');
    const trigger = wrapper.get('[data-slot="date-picker-trigger"]');
    const indicator = wrapper.get('[data-slot="date-picker-trigger-indicator"]');

    expect(root.classes()).toContain("date-picker");
    expect(root.attributes("data-open")).toBeUndefined();
    expect(trigger.element.tagName).toBe("BUTTON");
    expect(trigger.classes()).toContain("date-picker__trigger");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.attributes("aria-haspopup")).toBe("dialog");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(trigger.attributes("aria-controls")).toBeUndefined();
    expect(trigger.attributes("aria-label")).toBe("Choose date");
    expect(indicator.classes()).toContain("date-picker__trigger-indicator");
    expect(indicator.attributes("aria-hidden")).toBe("true");
    expect(indicator.find("svg").exists()).toBe(true);
    expect(document.querySelector('[data-slot="date-picker-popover"]')).toBeNull();

    wrapper.unmount();
  });

  it("renders the popover contract when open", async () => {
    const wrapper = mount(DatePickerPage, {attachTo: document.body});

    (wrapper.get('[data-slot="date-picker-trigger"]').element as HTMLElement).click();
    await flushPromises();

    const popover = document.querySelector<HTMLElement>('[data-slot="date-picker-popover"]');

    expect(popover).not.toBeNull();
    expect(popover?.classList.contains("date-picker__popover")).toBe(true);
    expect(popover?.getAttribute("role")).toBe("dialog");
    expect(popover?.getAttribute("data-placement")).toBe("bottom");
    expect(popover?.hasAttribute("data-entering")).toBe(true);
    expect(wrapper.get('[data-slot="date-picker"]').attributes("data-open")).toBe("true");
    expect(document.querySelector('[data-slot="calendar"]')).not.toBeNull();

    wrapper.unmount();
  });
});

describe("DateRangePicker contract", () => {
  it("renders only upstream slots", async () => {
    const html = await renderSSR(DateRangePickerPage);

    expectUpstreamSlots(html, ["date-range-picker", "date-input-group"], ["label"]);
    expect(renderedSlots.has("date-range-picker-range-separator")).toBe(true);
    expect(renderedSlots.has("date-range-picker-trigger")).toBe(true);
    expect(renderedSlots.has("date-range-picker-trigger-indicator")).toBe(true);
    expect(renderedSlots.has("date-range-picker-popover")).toBe(false);
  });

  it("renders the range root, inputs and separator contract", () => {
    const wrapper = mount(DateRangePickerPage, {attachTo: document.body});
    const root = wrapper.get('[data-slot="date-range-picker"]');
    const inputs = wrapper.findAll('[data-slot="date-input-group-input"]');
    const separator = wrapper.get('[data-slot="date-range-picker-range-separator"]');
    const trigger = wrapper.get('[data-slot="date-range-picker-trigger"]');

    expect(root.classes()).toContain("date-range-picker");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.attributes("slot")).toBe("start");
    expect(inputs[1]?.attributes("slot")).toBe("end");
    expect(separator.classes()).toContain("date-range-picker__range-separator");
    expect(separator.attributes("aria-hidden")).toBe("true");
    expect(separator.text()).toBe("-");
    expect(trigger.classes()).toContain("date-range-picker__trigger");
    expect(trigger.attributes("aria-label")).toBe("Choose dates");
    expect(wrapper.get('input[name="start"]').attributes("value")).toBe("2025-02-10");
    expect(wrapper.get('input[name="end"]').attributes("value")).toBe("2025-02-12");

    wrapper.unmount();
  });

  it("renders the range popover contract when open", async () => {
    const wrapper = mount(DateRangePickerPage, {attachTo: document.body});

    (wrapper.get('[data-slot="date-range-picker-trigger"]').element as HTMLElement).click();
    await flushPromises();

    const popover = document.querySelector<HTMLElement>('[data-slot="date-range-picker-popover"]');

    expect(popover).not.toBeNull();
    expect(popover?.classList.contains("date-range-picker__popover")).toBe(true);
    expect(popover?.getAttribute("role")).toBe("dialog");
    expect(document.querySelector('[data-slot="range-calendar"]')).not.toBeNull();
    expect(wrapper.get('[data-slot="date-range-picker"]').attributes("data-open")).toBe("true");

    wrapper.unmount();
  });
});
