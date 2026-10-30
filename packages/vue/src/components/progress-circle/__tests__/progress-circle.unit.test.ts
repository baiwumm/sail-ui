import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Label from "../../label/label.vue";
import ProgressCircle from "../progress-circle-root.vue";
import ProgressCircleFillCircle from "../progress-circle-fill-circle.vue";
import ProgressCircleTrack from "../progress-circle-track.vue";
import ProgressCircleTrackCircle from "../progress-circle-track-circle.vue";

const CIRCUMFERENCE = 2 * Math.PI * 16;

const parts = () =>
  h(ProgressCircleTrack, null, {
    default: () => [h(ProgressCircleTrackCircle), h(ProgressCircleFillCircle)]
  });

describe("ProgressCircle", () => {
  it("exposes progressbar values and circle geometry", () => {
    const wrapper = mount(ProgressCircle, {props: {value: 50}, slots: {default: parts}});
    const track = wrapper.get("[data-slot='progress-circle-track']");
    const trackCircle = wrapper.get("[data-slot='progress-circle-track-circle']");
    const fill = wrapper.get("[data-slot='progress-circle-fill-circle']");

    expect(wrapper.attributes("role")).toBe("progressbar");
    expect(wrapper.attributes("aria-valuenow")).toBe("50");
    expect(wrapper.attributes("aria-valuetext")).toBe("50%");
    expect(track.attributes("viewBox")).toBe("0 0 36 36");
    expect(track.attributes("fill")).toBe("none");
    expect(trackCircle.attributes("cx")).toBe("18");
    expect(trackCircle.attributes("cy")).toBe("18");
    expect(trackCircle.attributes("r")).toBe("16");
    expect(trackCircle.attributes("stroke-width")).toBe("4");
    expect(Number(fill.attributes("stroke-dashoffset"))).toBeCloseTo(
      CIRCUMFERENCE / 2,
      5
    );
    expect(fill.attributes("transform")).toBe("rotate(-90 18 18)");
  });

  it("uses three quarters of the circle while indeterminate", () => {
    const wrapper = mount(ProgressCircle, {
      props: {isIndeterminate: true},
      slots: {default: parts}
    });
    const fill = wrapper.get("[data-slot='progress-circle-fill-circle']");

    expect(wrapper.attributes("aria-valuenow")).toBeUndefined();
    expect(Number(fill.attributes("stroke-dashoffset"))).toBeCloseTo(
      CIRCUMFERENCE * 0.75,
      5
    );
  });

  it("links a slotted Label through aria-labelledby", () => {
    const wrapper = mount(ProgressCircle, {
      props: {value: 25},
      slots: {default: () => h(Label, null, {default: () => "Loading"})}
    });
    const label = wrapper.get("[data-slot='label']");

    expect(label.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("aria-labelledby")).toBe(label.attributes("id"));
  });

  it("reflects the disabled state", () => {
    const wrapper = mount(ProgressCircle, {
      props: {isDisabled: true, value: 10},
      slots: {default: parts}
    });

    expect(wrapper.attributes("data-disabled")).toBe("true");
    expect(wrapper.attributes("aria-disabled")).toBe("true");
  });
});
