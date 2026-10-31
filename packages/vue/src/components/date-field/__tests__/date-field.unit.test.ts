import {CalendarDate} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, shallowRef} from "vue";

import {Description} from "../../description";
import {FieldError} from "../../field-error";
import {Label} from "../../label";
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldPrefix,
  DateFieldRoot,
  DateFieldSegment,
  DateFieldSuffix,
  type DateFieldRootProps,
  type DateFieldSegmentContent,
} from "../index";

interface MountOptions {
  affixes?: boolean;
  description?: boolean;
  error?: boolean;
}

function mountField(props: DateFieldRootProps = {}, options: MountOptions = {}) {
  return mount(
    defineComponent({
      setup() {
        return () =>
          h(
            DateFieldRoot,
            {name: "date", ...props},
            {
              default: () => [
                h(Label, null, {default: () => "Date"}),
                h(DateFieldGroup, null, {
                  default: () => [
                    options.affixes ? h(DateFieldPrefix, null, {default: () => "From"}) : null,
                    h(DateFieldInput, null, {
                      default: ({segment}: {segment: DateFieldSegmentContent}) =>
                        h(DateFieldSegment, {segment}),
                    }),
                    options.affixes ? h(DateFieldSuffix, null, {default: () => "UTC"}) : null,
                  ],
                }),
                options.description ? h(Description, null, {default: () => "Enter a date"}) : null,
                options.error ? h(FieldError, null, {default: () => "Date is required"}) : null,
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

describe("DateField", () => {
  it("renders the upstream slots", () => {
    const wrapper = mountField(
      {defaultValue: new CalendarDate(2025, 2, 14), locale: "en"},
      {affixes: true, description: true},
    );

    expect(wrapper.get('[data-slot="date-field"]').classes()).toContain("date-field");
    expect(wrapper.get('[data-slot="date-input-group"]').classes()).toContain("date-input-group");
    expect(wrapper.get('[data-slot="date-input-group-input"]').classes()).toContain(
      "date-input-group__input",
    );
    expect(wrapper.find('[data-slot="date-input-group-prefix"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="date-input-group-suffix"]').exists()).toBe(true);
    expect(wrapper.get('[data-slot="label"]').element.tagName).toBe("SPAN");

    const segments = wrapper.findAll('[data-slot="date-input-group-segment"]');

    expect(segments).toHaveLength(5);
    expect(segments[0]?.classes()).toContain("date-input-group__segment");
    expect(segments.map((segment) => segment.attributes("data-type"))).toEqual([
      "month",
      "literal",
      "day",
      "literal",
      "year",
    ]);

    wrapper.unmount();
  });

  it("exposes the date spinbuttons", () => {
    const wrapper = mountField({defaultValue: new CalendarDate(2025, 2, 14), locale: "en"});
    const spinbuttons = wrapper.findAll('[role="spinbutton"]');

    expect(spinbuttons.map((segment) => segment.attributes("data-type"))).toEqual([
      "month",
      "day",
      "year",
    ]);
    expect(spinbuttons[0]?.attributes("aria-label")).toContain("month");
    expect(spinbuttons[0]?.attributes("aria-valuenow")).toBe("2");
    expect(spinbuttons[1]?.attributes("aria-valuenow")).toBe("14");
    expect(spinbuttons[2]?.attributes("aria-valuenow")).toBe("2025");
    expect(spinbuttons[0]?.attributes("aria-valuemin")).toBe("1");
    expect(spinbuttons[0]?.attributes("aria-valuemax")).toBe("12");

    wrapper.unmount();
  });

  it("updates a controlled value with the arrow keys", async () => {
    // `shallowRef` keeps the CalendarDate class identity; `ref` would unwrap it
    // into a structural type and drop its private brand.
    const value = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
    const changes: (DateValue | null)[] = [];
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              DateFieldRoot,
              {
                locale: "en",
                modelValue: value.value,
                onChange: (next: DateValue | null) => changes.push(next),
                "onUpdate:modelValue": (next: DateValue | null | undefined) =>
                  (value.value = next ?? null),
              },
              {
                default: () => [h(DateFieldGroup, null, {default: () => [h(DateFieldInput)]})],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const month = wrapper.get('[data-type="month"]');

    await month.trigger("keydown", {key: "ArrowUp"});
    await nextTick();

    expect(value.value?.month).toBe(3);
    expect(changes.at(-1)?.month).toBe(3);

    wrapper.unmount();
  });

  it("marks the field invalid and hides the description slot state", async () => {
    const wrapper = mountField({isInvalid: true}, {description: true, error: true});

    await nextTick();

    const root = wrapper.get('[data-slot="date-field"]');
    const group = wrapper.get('[data-slot="date-input-group"]');
    const description = wrapper.get('[data-slot="description"]');
    const error = wrapper.get('[data-slot="field-error"]');

    expect(root.attributes("aria-invalid")).toBe("true");
    expect(group.attributes("data-invalid")).toBe("true");
    expect(wrapper.get('[data-type="month"]').attributes("data-invalid")).toBe("true");
    expect(error.text()).toBe("Date is required");
    expect(group.attributes("aria-describedby")).toContain(error.attributes("id"));
    expect(group.attributes("aria-describedby")).toContain(description.attributes("id"));

    wrapper.unmount();
  });

  it("marks values outside the range invalid", () => {
    const wrapper = mountField({
      defaultValue: new CalendarDate(2025, 1, 1),
      minValue: new CalendarDate(2025, 2, 1),
    });

    expect(wrapper.get('[data-slot="date-field"]').attributes("aria-invalid")).toBe("true");
    expect(wrapper.get('[data-type="month"]').attributes("data-invalid")).toBe("true");

    wrapper.unmount();
  });

  it("propagates the disabled and required states", () => {
    const wrapper = mountField({isDisabled: true, isRequired: true});

    const group = wrapper.get('[data-slot="date-input-group"]');
    const segment = wrapper.get('[data-type="month"]');

    expect(wrapper.get('[data-slot="date-field"]').attributes("data-required")).toBe("true");
    expect(group.attributes("data-disabled")).toBe("true");
    expect(segment.attributes("data-disabled")).toBe("true");
    expect(segment.attributes("contenteditable")).toBe("false");
    expect(group.attributes("aria-disabled")).toBe("true");

    wrapper.unmount();
  });

  it("tracks segment focus", async () => {
    const wrapper = mountField({defaultValue: new CalendarDate(2025, 2, 14), locale: "en"});
    const segment = wrapper.get('[data-type="month"]');

    await segment.trigger("focus");
    expect(segment.attributes("data-focused")).toBe("true");

    await segment.trigger("blur");
    expect(segment.attributes("data-focused")).toBeUndefined();

    wrapper.unmount();
  });
});
