import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import Surface from "../surface.vue";

describe("Surface", () => {
  it("renders the upstream slot and default variant", () => {
    const wrapper = mount(Surface, {slots: {default: () => "Content"}});

    expect(wrapper.attributes("data-slot")).toBe("surface");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["surface", "surface--default"])
    );
    expect(wrapper.text()).toBe("Content");
  });

  it("maps every variant", () => {
    for (const variant of ["default", "secondary", "tertiary", "transparent"] as const) {
      const wrapper = mount(Surface, {props: {variant}});

      expect(wrapper.classes()).toContain(`surface--${variant}`);
      wrapper.unmount();
    }
  });

  it("supports polymorphic rendering and class merging", () => {
    const wrapper = mount(Surface, {
      attrs: {class: "extra"},
      props: {as: "section"}
    });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.classes()).toContain("extra");
  });
});
