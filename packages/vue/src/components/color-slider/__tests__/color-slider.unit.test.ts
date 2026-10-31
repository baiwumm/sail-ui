import {mount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";
import {defineComponent, nextTick, shallowRef} from "vue";

import {Label} from "../../label";
import ColorSliderOutput from "../color-slider-output.vue";
import ColorSliderRoot from "../color-slider-root.vue";
import ColorSliderThumb from "../color-slider-thumb.vue";
import ColorSliderTrack from "../color-slider-track.vue";

const parts = {ColorSliderOutput, ColorSliderRoot, ColorSliderThumb, ColorSliderTrack, Label};

function mountSlider(template: string, setup: () => Record<string, unknown> = () => ({})) {
  return mount(defineComponent({components: parts, setup, template}), {
    attachTo: document.body,
  });
}

const sliderOf = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-slot="color-slider"]');
const thumbOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-slot="color-slider-thumb"]');
const trackOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-slot="color-slider-track"]');
const outputOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.get('[data-slot="color-slider-output"]');

describe("ColorSlider", () => {
  it("renders the slider, output, track and thumb contract", async () => {
    const wrapper = mountSlider(`
      <ColorSliderRoot channel="hue" color-space="hsl" default-value="#ff0000">
        <Label>Hue</Label>
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);
    await nextTick();
    const slider = sliderOf(wrapper);
    const track = trackOf(wrapper);
    const thumb = thumbOf(wrapper);

    expect(slider.classes()).toContain("color-slider");
    expect(slider.attributes("data-orientation")).toBe("horizontal");
    expect(wrapper.get('[data-slot="label"]').classes()).toContain("label");
    expect(outputOf(wrapper).text()).toBe("0°");
    expect(track.classes()).toContain("color-slider__track");
    expect(track.attributes("style")).toContain("linear-gradient");
    expect(track.attributes("style")).toContain("--track-start-color");
    expect(track.attributes("style")).toContain("--track-end-color");
    expect(thumb.classes()).toContain("color-slider__thumb");
    expect(thumb.attributes("role")).toBe("slider");
    expect(thumb.attributes("aria-valuenow")).toBe("0");
    expect(thumb.attributes("aria-valuemin")).toBe("0");
    expect(thumb.attributes("aria-valuemax")).toBe("360");
    expect(thumb.attributes("aria-orientation")).toBe("horizontal");
    expect(thumb.attributes("tabindex")).toBe("0");

    wrapper.unmount();
  });

  it("steps the channel with the keyboard on a controlled model", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const changeEnds: string[] = [];
    const wrapper = mountSlider(
      `
      <ColorSliderRoot
        v-model="value"
        channel="hue"
        color-space="hsl"
        @change="changes.push($event)"
        @change-end="changeEnds.push($event)"
      >
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `,
      () => ({changes, changeEnds, value}),
    );

    await thumbOf(wrapper).trigger("keydown", {key: "ArrowRight"});

    expect(value.value).not.toBe("#ff0000");
    expect(changes).toHaveLength(1);
    expect(changeEnds).toHaveLength(1);
    expect(outputOf(wrapper).text()).toBe("1°");
    expect(thumbOf(wrapper).attributes("aria-valuenow")).toBe("1");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("updates an uncontrolled slider", async () => {
    const changes: string[] = [];
    const wrapper = mountSlider(
      `
      <ColorSliderRoot
        channel="hue"
        color-space="hsl"
        default-value="#ff0000"
        @change="changes.push($event)"
      >
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `,
      () => ({changes}),
    );

    await thumbOf(wrapper).trigger("keydown", {key: "ArrowRight"});

    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatch(/^#[0-9a-f]{6}$/);
    expect(outputOf(wrapper).text()).toBe("1°");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("renders numeric channels in their native format", () => {
    const wrapper = mountSlider(`
      <ColorSliderRoot channel="red" color-space="rgb" default-value="#336699">
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);

    expect(outputOf(wrapper).text()).toBe("51");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("renders alpha channels with a checkerboard track", () => {
    const wrapper = mountSlider(`
      <ColorSliderRoot channel="alpha" default-value="#ff000080">
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);

    expect(outputOf(wrapper).text()).toBe("50%");
    expect(trackOf(wrapper).attributes("style")).toContain("repeating-conic-gradient");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("follows the orientation and direction for the track gradient", () => {
    const vertical = mountSlider(`
      <ColorSliderRoot channel="hue" color-space="hsl" orientation="vertical" default-value="#ff0000">
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);

    expect(sliderOf(vertical).attributes("data-orientation")).toBe("vertical");
    expect(trackOf(vertical).attributes("style")).toContain("to top");

    vertical.unmount();
    document.body.replaceChildren();

    const rtl = mountSlider(`
      <ColorSliderRoot channel="hue" color-space="hsl" dir="rtl" default-value="#ff0000">
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);

    expect(trackOf(rtl).attributes("style")).toContain("to left");

    rtl.unmount();
    document.body.replaceChildren();
  });

  it("autocorrects an invalid channel color space", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = mountSlider(`
      <ColorSliderRoot channel="red" color-space="hsb" default-value="#336699">
        <ColorSliderOutput />
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Auto-correcting"));
    expect(outputOf(wrapper).text()).toBe("51");

    wrapper.unmount();
    document.body.replaceChildren();
  });

  it("does not change a disabled slider", async () => {
    const value = shallowRef("#ff0000");
    const changes: string[] = [];
    const wrapper = mountSlider(
      `
      <ColorSliderRoot
        v-model="value"
        channel="hue"
        color-space="hsl"
        is-disabled
        @change="changes.push($event)"
      >
        <ColorSliderTrack>
          <ColorSliderThumb />
        </ColorSliderTrack>
      </ColorSliderRoot>
    `,
      () => ({changes, value}),
    );

    expect(sliderOf(wrapper).attributes("aria-disabled")).toBe("true");
    expect(thumbOf(wrapper).attributes("data-disabled")).toBe("true");
    expect(thumbOf(wrapper).attributes("tabindex")).toBeUndefined();

    await thumbOf(wrapper).trigger("keydown", {key: "ArrowRight"});

    expect(value.value).toBe("#ff0000");
    expect(changes).toHaveLength(0);

    wrapper.unmount();
    document.body.replaceChildren();
  });
});
