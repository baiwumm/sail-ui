import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import Separator from "../separator.vue";

describe("Separator", () => {
  it("renders a decorative-agnostic div separator by default", () => {
    const wrapper = mount(Separator);

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.attributes("role")).toBe("separator");
    expect(wrapper.attributes("data-orientation")).toBe("horizontal");
    expect(wrapper.attributes("aria-orientation")).toBeUndefined();
    expect(wrapper.attributes("data-slot")).toBe("separator");
  });

  it("sets aria-orientation only for vertical separators", () => {
    const wrapper = mount(Separator, {props: {orientation: "vertical"}});

    expect(wrapper.attributes("aria-orientation")).toBe("vertical");
    expect(wrapper.classes()).toContain("separator--vertical");
  });

  it("hides decorative separators from assistive technology", () => {
    const wrapper = mount(Separator, {props: {isDecorative: true}});

    expect(wrapper.attributes("role")).toBe("presentation");
    expect(wrapper.attributes("aria-hidden")).toBe("true");
    expect(wrapper.attributes("aria-orientation")).toBeUndefined();
  });

  it("renders a native hr without a redundant role", () => {
    const wrapper = mount(Separator, {props: {elementType: "hr"}});

    expect(wrapper.element.tagName).toBe("HR");
    expect(wrapper.attributes("role")).toBeUndefined();
    expect(wrapper.attributes("aria-orientation")).toBeUndefined();
  });

  it("falls back to a div for decorative vertical hr", () => {
    const wrapper = mount(Separator, {
      props: {elementType: "hr", isDecorative: true, orientation: "vertical"}
    });

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.attributes("role")).toBe("presentation");
  });

  it("maps variants and supports the as prop", () => {
    const wrapper = mount(Separator, {props: {as: "span", variant: "tertiary"}});

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["separator", "separator--horizontal", "separator--tertiary"])
    );
  });
});
