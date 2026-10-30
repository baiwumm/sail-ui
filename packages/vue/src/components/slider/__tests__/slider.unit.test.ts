import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import Slider from "../slider-root.vue";
import SliderFill from "../slider-fill.vue";
import SliderOutput from "../slider-output.vue";
import SliderThumb from "../slider-thumb.vue";
import SliderTrack from "../slider-track.vue";
import Label from "../../label/label.vue";

describe("Slider", () => {
  it("renders the upstream slots", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Slider,
              {modelValue: 30},
              {
                default: () => [
                  h(Label, null, {default: () => "Volume"}),
                  h(SliderOutput),
                  h(SliderTrack, null, {default: () => [h(SliderFill), h(SliderThumb)]}),
                ],
              },
            );
        },
      }),
    );

    expect(wrapper.get('[data-slot="slider"]').classes()).toContain("slider");
    expect(wrapper.get('[data-slot="slider-track"]').classes()).toContain("slider__track");
    expect(wrapper.get('[data-slot="slider-fill"]').classes()).toContain("slider__fill");
    expect(wrapper.get('[data-slot="slider-thumb"]').classes()).toContain("slider__thumb");
    expect(wrapper.get('[data-slot="slider-output"]').text()).toBe("30");
  });

  it("positions the fill and the thumb from the value", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Slider,
              {modelValue: 25, max: 100},
              {
                default: () => [
                  h(SliderTrack, null, {default: () => [h(SliderFill), h(SliderThumb)]}),
                ],
              },
            );
        },
      }),
    );

    expect(wrapper.get('[data-slot="slider-fill"]').attributes("style")).toContain("width: 25%");
    expect(wrapper.get('[data-slot="slider-thumb"]').attributes("style")).toContain("left: 25%");
    expect(wrapper.get('[data-slot="slider-thumb"]').attributes("aria-valuenow")).toBe("25");
  });

  it("flips the position in RTL", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Slider,
              {modelValue: 25, dir: "rtl"},
              {
                default: () => [
                  h(SliderTrack, null, {default: () => [h(SliderFill), h(SliderThumb)]}),
                ],
              },
            );
        },
      }),
    );

    expect(wrapper.get('[data-slot="slider-thumb"]').attributes("style")).toContain("left: 75%");
    expect(wrapper.get('[data-slot="slider-fill"]').attributes("style")).toContain("right: 0%");
  });

  it("updates the value with the arrow keys", async () => {
    const value = ref(30);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Slider,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: number | number[] | undefined) =>
                  (value.value = Array.isArray(next) ? (next[0] ?? 0) : (next ?? 0)),
              },
              {
                default: () => [
                  h(SliderTrack, null, {default: () => [h(SliderFill), h(SliderThumb)]}),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const thumb = wrapper.get('[data-slot="slider-thumb"]');

    (thumb.element as HTMLElement).focus();
    await nextTick();

    await thumb.trigger("keydown", {key: "ArrowRight"});
    await nextTick();

    expect(value.value).toBe(31);

    wrapper.unmount();
  });

  it("reports the fill range of a range slider", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Slider,
              {modelValue: [20, 60]},
              {
                default: () => [
                  h(SliderTrack, null, {default: () => [h(SliderFill), h(SliderThumb)]}),
                ],
              },
            );
        },
      }),
    );

    const track = wrapper.get('[data-slot="slider-track"]');

    expect(track.attributes("data-fill-start")).toBeUndefined();
    expect(track.attributes("data-fill-end")).toBeUndefined();
    expect(wrapper.get('[data-slot="slider-fill"]').attributes("style")).toContain("width: 40%");
  });
});
