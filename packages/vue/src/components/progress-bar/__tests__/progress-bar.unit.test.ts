import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Label from "../../label/label.vue";
import ProgressBar from "../progress-bar-root.vue";
import ProgressBarFill from "../progress-bar-fill.vue";
import ProgressBarOutput from "../progress-bar-output.vue";
import ProgressBarTrack from "../progress-bar-track.vue";

const parts = () => [
  h(ProgressBarOutput),
  h(ProgressBarTrack, null, {default: () => h(ProgressBarFill)}),
];

describe("ProgressBar", () => {
  it("exposes the progressbar contract with formatted values", () => {
    const wrapper = mount(ProgressBar, {
      props: {maxValue: 10, minValue: 0, value: 5},
      slots: {default: parts},
    });

    expect(wrapper.attributes("role")).toBe("progressbar");
    expect(wrapper.attributes("aria-valuemin")).toBe("0");
    expect(wrapper.attributes("aria-valuemax")).toBe("10");
    expect(wrapper.attributes("aria-valuenow")).toBe("5");
    expect(wrapper.attributes("aria-valuetext")).toBe("50%");
    expect(wrapper.get("[data-slot='progress-bar-output']").text()).toBe("50%");
    expect(wrapper.get("[data-slot='progress-bar-fill']").attributes("style")).toContain(
      "width: 50%",
    );
  });

  it("clamps values into the range", () => {
    const high = mount(ProgressBar, {props: {value: 150}, slots: {default: parts}});

    expect(high.attributes("aria-valuenow")).toBe("100");
    expect(high.get("[data-slot='progress-bar-output']").text()).toBe("100%");
    high.unmount();

    const low = mount(ProgressBar, {props: {value: -20}, slots: {default: parts}});

    expect(low.attributes("aria-valuenow")).toBe("0");
    low.unmount();
  });

  it("omits value attributes and fill width while indeterminate", () => {
    const wrapper = mount(ProgressBar, {props: {isIndeterminate: true}, slots: {default: parts}});

    expect(wrapper.attributes("aria-valuenow")).toBeUndefined();
    expect(wrapper.attributes("aria-valuetext")).toBeUndefined();
    expect(wrapper.get("[data-slot='progress-bar-output']").text()).toBe("");
    expect(wrapper.get("[data-slot='progress-bar-fill']").attributes("style")).toBeUndefined();
  });

  it("links a slotted Label through aria-labelledby", () => {
    const wrapper = mount(ProgressBar, {
      props: {value: 30},
      slots: {default: () => [h(Label, null, {default: () => "Uploading"})]},
    });
    const label = wrapper.get("[data-slot='label']");

    expect(label.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("aria-labelledby")).toBe(label.attributes("id"));
    expect(wrapper.attributes("aria-label")).toBeUndefined();
  });

  it("keeps a consumer aria-label instead of linking a label", () => {
    const wrapper = mount(ProgressBar, {
      attrs: {"aria-label": "Upload progress"},
      slots: {default: () => h(Label, null, {default: () => "Uploading"})},
    });

    expect(wrapper.attributes("aria-label")).toBe("Upload progress");
    expect(wrapper.attributes("aria-labelledby")).toBeUndefined();
  });

  it("prefers valueLabel and custom format options", () => {
    const labelled = mount(ProgressBar, {
      props: {value: 0.4, valueLabel: "Almost done"},
      slots: {default: () => h(ProgressBarOutput)},
    });

    expect(labelled.attributes("aria-valuetext")).toBe("Almost done");
    labelled.unmount();

    const formatted = mount(ProgressBar, {
      props: {formatOptions: {maximumFractionDigits: 0, style: "percent"}, value: 33},
      slots: {default: () => h(ProgressBarOutput)},
    });

    expect(formatted.attributes("aria-valuetext")).toBe("33%");
  });

  it("renders custom output content", () => {
    const wrapper = mount(ProgressBar, {
      props: {value: 10},
      slots: {default: () => h(ProgressBarOutput, null, {default: () => "ten"})},
    });

    expect(wrapper.get("[data-slot='progress-bar-output']").text()).toBe("ten");
  });
});
