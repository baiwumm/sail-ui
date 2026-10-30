import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import Header from "../header.vue";

describe("Header", () => {
  it("renders a header element with the upstream slot and class", () => {
    const wrapper = mount(Header, {slots: {default: () => "Title"}});

    expect(wrapper.element.tagName).toBe("HEADER");
    expect(wrapper.attributes("data-slot")).toBe("header");
    expect(wrapper.classes()).toContain("header");
    expect(wrapper.text()).toBe("Title");
  });

  it("supports polymorphic rendering and class merging", () => {
    const wrapper = mount(Header, {
      attrs: {class: "extra"},
      props: {as: "div"},
    });

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["header", "extra"]));
  });
});
