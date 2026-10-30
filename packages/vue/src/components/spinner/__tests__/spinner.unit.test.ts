import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

import Spinner from "../spinner.vue";

describe("Spinner", () => {
  it("renders a labelled status with the upstream parts", () => {
    const wrapper = mount(Spinner);

    expect(wrapper.attributes("role")).toBe("status");
    expect(wrapper.attributes("aria-label")).toBe("Loading");
    expect(wrapper.attributes("data-slot")).toBe("spinner");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["spinner", "spinner--accent", "spinner--md"])
    );

    const icon = wrapper.get("[data-slot='spinner-icon']");

    expect(icon.element.tagName).toBe("svg");
    expect(icon.attributes("aria-hidden")).toBe("true");
    expect(icon.attributes("viewBox")).toBe("0 0 24 24");
  });

  it("accepts a custom aria-label and size/color variants", () => {
    const wrapper = mount(Spinner, {
      attrs: {"aria-label": "Saving"},
      props: {color: "current", size: "xl"}
    });

    expect(wrapper.attributes("aria-label")).toBe("Saving");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["spinner--current", "spinner--xl"])
    );
  });

  it("keeps gradient ids unique across instances", () => {
    const host = defineComponent({
      setup() {
        return () => h("div", [h(Spinner), h(Spinner)]);
      }
    });
    const wrapper = mount(host);
    const ids = wrapper
      .findAll("linearGradient")
      .map((gradient) => gradient.attributes("id"));

    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Spinner, {props: {as: "div"}});

    expect(wrapper.element.tagName).toBe("DIV");
  });
});
