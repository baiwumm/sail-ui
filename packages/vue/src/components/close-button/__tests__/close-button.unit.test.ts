import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import CloseButton from "../close-button-root.vue";

describe("CloseButton", () => {
  it("renders the default icon with the upstream slots and label", () => {
    const wrapper = mount(CloseButton);

    expect(wrapper.get("[data-slot='close-button']").classes()).toContain("close-button");
    expect(wrapper.find("[data-slot='close-button-icon']").exists()).toBe(true);
    expect(wrapper.attributes("aria-label")).toBe("Close");
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("replaces the icon with custom content", () => {
    const wrapper = mount(CloseButton, {slots: {default: () => h("span", "x")}});

    expect(wrapper.find("[data-slot='close-button-icon']").exists()).toBe(false);
    expect(wrapper.text()).toBe("x");
  });

  it("honors aria-label and aria-labelledby", () => {
    const labelled = mount(CloseButton, {attrs: {"aria-label": "Dismiss"}});
    expect(labelled.attributes("aria-label")).toBe("Dismiss");

    const referenced = mount(CloseButton, {attrs: {"aria-labelledby": "title"}});
    expect(referenced.attributes("aria-label")).toBeUndefined();
  });

  it("turns submit into button while pending", async () => {
    const wrapper = mount(CloseButton, {props: {type: "submit"}});

    expect(wrapper.attributes("type")).toBe("submit");

    await wrapper.setProps({isPending: true});
    expect(wrapper.attributes("type")).toBe("button");
    expect(wrapper.attributes("aria-disabled")).toBe("true");
    expect(wrapper.attributes("disabled")).toBeUndefined();
  });

  it("supports the variant class and disabled state", async () => {
    const wrapper = mount(CloseButton, {props: {isDisabled: true}});

    expect(wrapper.classes()).toContain("close-button--default");
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.attributes("data-disabled")).toBe("true");
  });
});
