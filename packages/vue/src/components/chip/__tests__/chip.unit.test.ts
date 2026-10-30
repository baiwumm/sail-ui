import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Chip from "../chip-root.vue";
import ChipLabel from "../chip-label.vue";

describe("Chip", () => {
  it("wraps plain text in the label part", () => {
    const wrapper = mount(Chip, {
      props: {color: "success", size: "sm"},
      slots: {default: () => "Active"},
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["chip", "chip--success", "chip--sm"]),
    );
    expect(wrapper.get("[data-slot='chip-label']").classes()).toContain("chip__label");
    expect(wrapper.text()).toBe("Active");
  });

  it("keeps explicit label parts and class overrides", () => {
    const wrapper = mount(Chip, {
      props: {variant: "primary"},
      slots: {default: () => h(ChipLabel, {class: "extra"}, {default: () => "New"})},
    });

    expect(wrapper.classes()).toContain("chip--primary");
    expect(wrapper.get("[data-slot='chip-label']").classes()).toContain("extra");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Chip, {props: {as: "div"}, slots: {default: () => "Tag"}});

    expect(wrapper.element.tagName).toBe("DIV");
  });
});
