import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import ErrorMessage from "../error-message.vue";

describe("ErrorMessage", () => {
  it("renders a span with the upstream slot and class", () => {
    const wrapper = mount(ErrorMessage, {
      attrs: {class: "extra"},
      slots: {default: () => "Something went wrong"}
    });

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("data-slot")).toBe("error-message");
    expect(wrapper.classes()).toEqual(expect.arrayContaining(["error-message", "extra"]));
    expect(wrapper.text()).toBe("Something went wrong");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(ErrorMessage, {props: {as: "p"}});

    expect(wrapper.element.tagName).toBe("P");
  });
});
