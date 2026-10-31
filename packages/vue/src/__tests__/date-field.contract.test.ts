import {CalendarDate, Time} from "@internationalized/date";
import {mount} from "@vue/test-utils";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldPrefix,
  DateFieldRoot,
  DateFieldSegment,
  DateFieldSuffix,
  type DateFieldSegmentContent,
} from "../components/date-field";
import {Description} from "../components/description";
import {FieldError} from "../components/field-error";
import {Label} from "../components/label";
import {TimeFieldGroup, TimeFieldInput, TimeFieldRoot} from "../components/time-field";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const renderedSlots = new Set<string>();

function expectUpstreamSlots(html: string, component: string, extras: string[] = []) {
  const expected = new Set([...(slotSnapshot.components[component] ?? []), ...extras]);

  for (const slot of dataSlots(html)) {
    renderedSlots.add(slot);
    expect(expected.has(slot), `${component} renders an unknown slot: ${slot}`).toBe(true);
  }
}

const DateFieldPage = defineComponent({
  setup() {
    return () =>
      h(
        DateFieldRoot,
        {defaultValue: new CalendarDate(2025, 2, 14), locale: "en", name: "date"},
        {
          default: () => [
            h(Label, null, {default: () => "Date"}),
            h(
              DateFieldGroup,
              {variant: "secondary"},
              {
                default: () => [
                  h(DateFieldPrefix, null, {default: () => "From"}),
                  h(DateFieldInput, null, {
                    default: ({segment}: {segment: DateFieldSegmentContent}) =>
                      h(DateFieldSegment, {segment}),
                  }),
                  h(DateFieldSuffix, null, {default: () => "UTC"}),
                ],
              },
            ),
            h(Description, null, {default: () => "Enter a date"}),
          ],
        },
      );
  },
});

const TimeFieldPage = defineComponent({
  setup() {
    return () =>
      h(
        TimeFieldRoot,
        {defaultValue: new Time(13, 45), locale: "en", name: "time"},
        {
          default: () => [
            h(Label, null, {default: () => "Time"}),
            h(TimeFieldGroup, null, {default: () => [h(TimeFieldInput)]}),
          ],
        },
      );
  },
});

afterEach(() => {
  document.body.replaceChildren();
});

describe("DateField contract", () => {
  it("renders only upstream slots", async () => {
    const html = await renderSSR(DateFieldPage);

    expectUpstreamSlots(html, "date-input-group", ["date-field", "description", "label"]);
    expect(renderedSlots.has("date-input-group-segment")).toBe(true);
    expect(renderedSlots.has("date-input-group-prefix")).toBe(true);
    expect(renderedSlots.has("date-input-group-suffix")).toBe(true);
  });

  it("renders the root and group attributes", async () => {
    const wrapper = mount(DateFieldPage, {attachTo: document.body});
    const root = wrapper.get('[data-slot="date-field"]');
    const group = wrapper.get('[data-slot="date-input-group"]');
    const input = wrapper.get('[data-slot="date-input-group-input"]');
    const label = wrapper.get('[data-slot="label"]');

    expect(root.classes()).toContain("date-field");
    expect(root.attributes("data-slot")).toBe("date-field");
    expect(root.attributes("aria-invalid")).toBeUndefined();
    expect(root.attributes("data-required")).toBeUndefined();

    expect(group.attributes("role")).toBe("group");
    expect(group.classes()).toContain("date-input-group");
    expect(group.classes()).toContain("date-input-group--secondary");
    expect(group.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(input.attributes("role")).toBe("group");
    expect(input.classes()).toContain("date-input-group__input");

    expect(wrapper.get('[data-slot="date-input-group-prefix"]').classes()).toContain(
      "date-input-group__prefix",
    );
    expect(wrapper.get('[data-slot="date-input-group-suffix"]').classes()).toContain(
      "date-input-group__suffix",
    );

    wrapper.unmount();
  });

  it("renders the segment contract", () => {
    const wrapper = mount(DateFieldPage, {attachTo: document.body});
    const month = wrapper.get('[data-type="month"]');
    const literal = wrapper.get('[data-type="literal"]');

    expect(month.attributes("role")).toBe("spinbutton");
    expect(month.attributes("data-slot")).toBe("date-input-group-segment");
    expect(month.attributes("data-placeholder")).toBeUndefined();
    expect(month.attributes("data-disabled")).toBeUndefined();
    expect(month.attributes("contenteditable")).toBe("true");
    expect(month.attributes("tabindex")).toBe("0");
    expect(month.attributes("aria-valuenow")).toBe("2");
    expect(literal.attributes("aria-hidden")).toBe("true");

    wrapper.unmount();
  });

  it("renders the hidden input contract", () => {
    const wrapper = mount(DateFieldPage, {attachTo: document.body});
    const input = wrapper.get('input[name="date"]');

    expect(input.attributes("type")).toBe("date");
    expect(input.attributes("aria-hidden")).toBe("true");
    expect(input.attributes("tabindex")).toBe("-1");
    expect(input.attributes("value")).toBe("2025-02-14");

    wrapper.unmount();
  });

  it("renders the required and invalid attributes", async () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            DateFieldRoot,
            {isInvalid: true, isRequired: true, name: "date"},
            {
              default: () => [
                h(Label, null, {default: () => "Date"}),
                h(DateFieldGroup, null, {default: () => [h(DateFieldInput)]}),
                h(FieldError, null, {default: () => "Required"}),
              ],
            },
          );
      },
    });
    const html = await renderSSR(host);

    expect(html).toContain('data-required="true"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('data-slot="field-error"');
    expect(html).toContain("Required");
  });

  it("marks empty segments as placeholders", () => {
    const host = defineComponent({
      setup() {
        return () =>
          h(
            DateFieldRoot,
            {locale: "en"},
            {
              default: () => [h(DateFieldGroup, null, {default: () => [h(DateFieldInput)]})],
            },
          );
      },
    });
    const wrapper = mount(host, {attachTo: document.body});

    expect(wrapper.get('[data-type="month"]').attributes("data-placeholder")).toBe("true");
    expect(wrapper.get('[data-type="day"]').attributes("data-placeholder")).toBe("true");
    expect(wrapper.get('[data-type="year"]').attributes("data-placeholder")).toBe("true");
    expect(wrapper.get('[data-type="month"]').attributes("aria-valuetext")).toBe("Empty");

    wrapper.unmount();
  });
});

describe("TimeField contract", () => {
  it("renders only upstream slots", async () => {
    const html = await renderSSR(TimeFieldPage);

    expectUpstreamSlots(html, "date-input-group", ["time-field", "label"]);
    expect(renderedSlots.has("date-input-group-segment")).toBe(true);
  });

  it("renders the time segments", () => {
    const wrapper = mount(TimeFieldPage, {attachTo: document.body});

    expect(wrapper.get('[data-slot="time-field"]').classes()).toContain("time-field");
    expect(
      wrapper.findAll('[role="spinbutton"]').map((segment) => segment.attributes("data-type")),
    ).toEqual(["hour", "minute", "dayPeriod"]);
    expect(wrapper.get('input[name="time"]').attributes("value")).toContain("13:45");

    wrapper.unmount();
  });
});
