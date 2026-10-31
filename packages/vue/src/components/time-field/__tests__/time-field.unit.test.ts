import {Time} from "@internationalized/date";
import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, shallowRef} from "vue";

import type {TimeValue} from "reka-ui";

import {Description} from "../../description";
import {FieldError} from "../../field-error";
import {Label} from "../../label";
import {TimeFieldGroup, TimeFieldInput, TimeFieldRoot, type TimeFieldRootProps} from "../index";

function mountField(props: TimeFieldRootProps = {}, options: {error?: boolean} = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(
            TimeFieldRoot,
            {name: "time", ...props},
            {
              default: () => [
                h(Label, null, {default: () => "Time"}),
                h(TimeFieldGroup, null, {default: () => [h(TimeFieldInput)]}),
                options.error ? h(FieldError, null, {default: () => "Time is required"}) : null,
                h(Description, null, {default: () => "Pick a time"}),
              ],
            },
          );
      },
    }),
    {attachTo: document.body},
  );
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("TimeField", () => {
  it("renders the upstream slots", () => {
    const wrapper = mountField({defaultValue: new Time(13, 45), locale: "en"});

    expect(wrapper.get('[data-slot="time-field"]').classes()).toContain("time-field");
    expect(wrapper.get('[data-slot="date-input-group"]').classes()).toContain("date-input-group");
    expect(wrapper.get('[data-slot="label"]').element.tagName).toBe("SPAN");

    const segmentTypes = wrapper
      .findAll('[data-slot="date-input-group-segment"]')
      .map((segment) => segment.attributes("data-type"));

    expect(segmentTypes).toEqual(["hour", "literal", "minute", "literal", "dayPeriod", "literal"]);

    wrapper.unmount();
  });

  it("exposes the time spinbuttons in 12-hour time", () => {
    const wrapper = mountField({defaultValue: new Time(13, 45), locale: "en"});
    const spinbuttons = wrapper.findAll('[role="spinbutton"]');

    expect(spinbuttons.map((segment) => segment.attributes("data-type"))).toEqual([
      "hour",
      "minute",
      "dayPeriod",
    ]);
    expect(spinbuttons[0]?.attributes("aria-valuenow")).toBe("13");
    expect(spinbuttons[1]?.attributes("aria-valuenow")).toBe("45");
    expect(spinbuttons[2]?.attributes("aria-valuetext")).toBe("PM");

    wrapper.unmount();
  });

  it("renders 24-hour and second granularity", () => {
    const wrapper = mountField({
      defaultValue: new Time(13, 45, 30),
      granularity: "second",
      hourCycle: 24,
      locale: "en",
    });

    expect(
      wrapper.findAll('[role="spinbutton"]').map((segment) => segment.attributes("data-type")),
    ).toEqual(["hour", "minute", "second"]);

    wrapper.unmount();
  });

  it("updates a controlled value with the arrow keys", async () => {
    // `shallowRef` keeps the Time class identity; `ref` would unwrap it into a
    // structural type and drop its private brand.
    const value = shallowRef<TimeValue | null>(new Time(13, 45));
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              TimeFieldRoot,
              {
                locale: "en",
                modelValue: value.value,
                "onUpdate:modelValue": (next: TimeValue | null | undefined) =>
                  (value.value = next ?? null),
              },
              {
                default: () => [h(TimeFieldGroup, null, {default: () => [h(TimeFieldInput)]})],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get('[data-type="hour"]').trigger("keydown", {key: "ArrowUp"});
    await nextTick();

    expect(value.value?.hour).toBe(14);

    wrapper.unmount();
  });

  it("marks values outside the range invalid", () => {
    const wrapper = mountField({
      defaultValue: new Time(9, 0),
      minValue: new Time(10, 0),
    });

    expect(wrapper.get('[data-slot="time-field"]').attributes("aria-invalid")).toBe("true");
    expect(wrapper.get('[data-slot="date-input-group"]').attributes("data-invalid")).toBe("true");

    wrapper.unmount();
  });

  it("renders the error message when invalid", async () => {
    const wrapper = mountField({isInvalid: true}, {error: true});

    await nextTick();

    expect(wrapper.get('[data-slot="field-error"]').text()).toBe("Time is required");
    expect(wrapper.get('[data-slot="time-field"]').attributes("aria-invalid")).toBe("true");

    wrapper.unmount();
  });
});
