import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent} from "vue";

import ColorSwatchRoot from "../color-swatch.vue";

describe("ColorSwatch", () => {
  it("renders the swatch contract and derives a color name", () => {
    const wrapper = mount(
      defineComponent({
        components: {ColorSwatchRoot},
        template: `<ColorSwatchRoot color="#ff0000" />`,
      }),
    );
    const swatch = wrapper.get('[data-slot="color-swatch"]');

    expect(swatch.classes()).toContain("color-swatch");
    expect(swatch.classes()).toContain("color-swatch--circle");
    expect(swatch.classes()).toContain("color-swatch--md");
    expect(swatch.attributes("role")).toBe("img");
    expect(swatch.attributes("aria-label")).toBe("vibrant red");
    expect(swatch.attributes("aria-roledescription")).toBe("color swatch");
    expect(swatch.attributes("style")).toContain("rgb(255, 0, 0)");

    wrapper.unmount();
  });

  it("applies shape, size and label overrides", () => {
    const wrapper = mount(
      defineComponent({
        components: {ColorSwatchRoot},
        template: `<ColorSwatchRoot color="#336699" label="Brand" shape="square" size="xl" />`,
      }),
    );
    const swatch = wrapper.get('[data-slot="color-swatch"]');

    expect(swatch.classes()).toContain("color-swatch--square");
    expect(swatch.classes()).toContain("color-swatch--xl");
    expect(swatch.attributes("aria-label")).toBe("Brand");

    wrapper.unmount();
  });

  it("renders a transparent swatch without a color", () => {
    const wrapper = mount(
      defineComponent({
        components: {ColorSwatchRoot},
        template: `<ColorSwatchRoot />`,
      }),
    );
    const swatch = wrapper.get('[data-slot="color-swatch"]');

    expect(swatch.attributes("aria-label")).toBe("transparent");
    expect(swatch.attributes("data-no-color")).toBe("");
    expect(swatch.attributes("style")).toContain("--color-swatch-current: transparent");

    wrapper.unmount();
  });

  it("accepts a Reka Color object", () => {
    const wrapper = mount(
      defineComponent({
        components: {ColorSwatchRoot},
        setup: () => ({color: {space: "hsl", h: 120, s: 100, l: 50, alpha: 1}}),
        template: `<ColorSwatchRoot :color="color" />`,
      }),
    );
    const swatch = wrapper.get('[data-slot="color-swatch"]');

    expect(swatch.attributes("style")).toContain("rgb(0, 255, 0)");

    wrapper.unmount();
  });
});
