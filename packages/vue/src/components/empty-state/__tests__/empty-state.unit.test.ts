import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import EmptyState from "../empty-state.vue";

describe("EmptyState", () => {
  it("renders the default message and upstream slot", () => {
    const wrapper = mount(EmptyState);

    expect(wrapper.attributes("data-slot")).toBe("empty-state");
    expect(wrapper.classes()).toContain("empty-state");
    expect(wrapper.text()).toBe("No results found");
  });

  it("renders custom content instead of the default message", () => {
    const wrapper = mount(EmptyState, {slots: {default: () => "Nothing here"}});

    expect(wrapper.text()).toBe("Nothing here");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(EmptyState, {props: {as: "section"}});

    expect(wrapper.element.tagName).toBe("SECTION");
  });
});
