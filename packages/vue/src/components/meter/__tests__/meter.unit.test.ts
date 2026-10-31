import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Label from "../../label/label.vue";
import Meter from "../meter-root.vue";
import MeterFill from "../meter-fill.vue";
import MeterOutput from "../meter-output.vue";
import MeterTrack from "../meter-track.vue";

const parts = () => [h(MeterOutput), h(MeterTrack, null, {default: () => h(MeterFill)})];

describe("Meter", () => {
  it("exposes the meter contract with formatted values", () => {
    const wrapper = mount(Meter, {
      props: {maxValue: 10, minValue: 0, value: 5},
      slots: {default: parts},
    });

    expect(wrapper.attributes("role")).toBe("meter");
    expect(wrapper.attributes("aria-valuemin")).toBe("0");
    expect(wrapper.attributes("aria-valuemax")).toBe("10");
    expect(wrapper.attributes("aria-valuenow")).toBe("5");
    expect(wrapper.attributes("aria-valuetext")).toBe("50%");
    expect(wrapper.get("[data-slot='meter-output']").text()).toBe("50%");
    expect(wrapper.get("[data-slot='meter-fill']").attributes("style")).toContain("width: 50%");
  });

  it("clamps values into the range", () => {
    const high = mount(Meter, {props: {value: 150}, slots: {default: parts}});

    expect(high.attributes("aria-valuenow")).toBe("100");
    expect(high.get("[data-slot='meter-output']").text()).toBe("100%");
    high.unmount();

    const low = mount(Meter, {props: {value: -20}, slots: {default: parts}});

    expect(low.attributes("aria-valuenow")).toBe("0");
    expect(low.get("[data-slot='meter-output']").text()).toBe("0%");
    low.unmount();
  });

  it("formats custom value scales and value labels", () => {
    const formatOptions = {currency: "USD", style: "currency"} as const;
    const expected = new Intl.NumberFormat(undefined, formatOptions).format(750);
    const formatted = mount(Meter, {
      props: {
        formatOptions,
        maxValue: 1000,
        value: 750,
      },
      slots: {default: parts},
    });

    expect(formatted.attributes("aria-valuetext")).toBe(expected);
    expect(formatted.get("[data-slot='meter-output']").text()).toBe(expected);
    formatted.unmount();

    const labelled = mount(Meter, {
      props: {value: 40, valueLabel: "Nearly full"},
      slots: {default: parts},
    });

    expect(labelled.attributes("aria-valuetext")).toBe("Nearly full");
    expect(labelled.get("[data-slot='meter-output']").text()).toBe("Nearly full");
  });

  it("hides the default value label when showValueLabel is false", () => {
    const wrapper = mount(Meter, {
      props: {showValueLabel: false, value: 40},
      slots: {default: parts},
    });

    expect(wrapper.attributes("aria-valuetext")).toBe("40%");
    expect(wrapper.get("[data-slot='meter-output']").text()).toBe("");
  });

  it("renders custom output content", () => {
    const wrapper = mount(Meter, {
      props: {value: 10},
      slots: {default: () => h(MeterOutput, null, {default: () => "ten percent"})},
    });

    expect(wrapper.get("[data-slot='meter-output']").text()).toBe("ten percent");
  });

  it("links a slotted Label through aria-labelledby", () => {
    const wrapper = mount(Meter, {
      props: {value: 30},
      slots: {default: () => [h(Label, null, {default: () => "Storage"}), ...parts()]},
    });
    const label = wrapper.get("[data-slot='label']");

    expect(label.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(wrapper.attributes("aria-label")).toBeUndefined();
  });

  it("keeps a consumer aria-label instead of linking a label", () => {
    const wrapper = mount(Meter, {
      attrs: {"aria-label": "Storage used"},
      slots: {default: () => [h(Label, null, {default: () => "Storage"}), ...parts()]},
    });

    expect(wrapper.attributes("aria-label")).toBe("Storage used");
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  it("applies color and size variants", () => {
    const wrapper = mount(Meter, {
      props: {color: "danger", size: "lg", value: 50},
      slots: {default: parts},
    });

    expect(wrapper.classes()).toContain("meter--danger");
    expect(wrapper.classes()).toContain("meter--lg");
  });

  it("marks the disabled state", async () => {
    const wrapper = mount(Meter, {
      props: {isDisabled: true, value: 25},
      slots: {default: parts},
    });

    expect(wrapper.attributes("data-disabled")).toBe("true");
    expect(wrapper.attributes("aria-disabled")).toBe("true");

    await wrapper.setProps({isDisabled: false});
    expect(wrapper.attributes("data-disabled")).toBeUndefined();
    expect(wrapper.attributes("aria-disabled")).toBeUndefined();
  });
});
