import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import KbdAbbr from "../kbd-abbr.vue";
import KbdContent from "../kbd-content.vue";
import Kbd from "../kbd-root.vue";

describe("Kbd", () => {
  it("renders a kbd element without inventing data-slots", () => {
    const wrapper = mount(Kbd, {
      slots: {
        default: () => [
          h(KbdContent, null, {default: () => "Save"}),
          h(KbdAbbr, {keyValue: "command"}),
        ],
      },
    });

    expect(wrapper.element.tagName).toBe("KBD");
    expect(wrapper.classes()).toContain("kbd");
    expect(wrapper.find("[data-slot]").exists()).toBe(false);
    expect(wrapper.get("abbr").text()).toBe("⌘");
    expect(wrapper.get("abbr").attributes("title")).toBe("Command");
  });

  it("renders content span and abbr classes", () => {
    const wrapper = mount(Kbd, {
      slots: {
        default: () => [h(KbdContent, {class: "extra"}, {default: () => "Ctrl"})],
      },
    });

    expect(wrapper.get("span").classes()).toEqual(
      expect.arrayContaining(["kbd__content", "extra"]),
    );
  });

  it("keeps a custom title and applies the light variant", () => {
    const wrapper = mount(Kbd, {
      props: {variant: "light"},
      slots: {default: () => h(KbdAbbr, {keyValue: "enter", title: "Return"})},
    });

    expect(wrapper.classes()).toContain("kbd--light");
    expect(wrapper.get("abbr").attributes("title")).toBe("Return");
    expect(wrapper.get("abbr").text()).toBe("↵");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Kbd, {props: {as: "span"}});

    expect(wrapper.element.tagName).toBe("SPAN");
  });
});
