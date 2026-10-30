import {mount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";
import {h, nextTick} from "vue";

import Link from "../link-root.vue";
import LinkIcon from "../link-icon.vue";

describe("Link", () => {
  it("renders an anchor with the upstream slot when href is present", () => {
    const wrapper = mount(Link, {
      props: {href: "https://example.com"},
      slots: {default: () => "Docs"}
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("https://example.com");
    expect(wrapper.attributes("data-slot")).toBe("link");
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("renders a focusable link-role span without href", () => {
    const wrapper = mount(Link, {slots: {default: () => "Docs"}});

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.attributes("role")).toBe("link");
    expect(wrapper.attributes("tabindex")).toBe("0");
  });

  it("treats any truthy aria-current as current", () => {
    for (const value of ["page", "false", "true"]) {
      const wrapper = mount(Link, {
        attrs: {"aria-current": value},
        props: {href: "/"},
        slots: {default: () => "Docs"}
      });

      expect(wrapper.attributes("data-current")).toBe("true");
      wrapper.unmount();
    }

    const plain = mount(Link, {props: {href: "/"}, slots: {default: () => "Docs"}});
    expect(plain.attributes("data-current")).toBeUndefined();
  });

  it("renders the default icon and lets a custom icon win", () => {
    const defaultIcon = mount(Link, {
      props: {href: "/"},
      slots: {default: () => [h("span", "Docs"), h(LinkIcon)]}
    });

    expect(defaultIcon.find("[data-slot='link-default-icon']").exists()).toBe(true);
    expect(defaultIcon.get("[data-slot='link-icon']").attributes("data-default-icon")).toBe(
      "true"
    );

    const customIcon = mount(Link, {
      props: {href: "/"},
      slots: {default: () => [h("span", "Docs"), h(LinkIcon, null, {default: () => "->"})]}
    });

    expect(customIcon.find("[data-slot='link-default-icon']").exists()).toBe(false);
    expect(customIcon.get("[data-slot='link-icon']").attributes("data-default-icon")).toBeUndefined();
  });

  it("emits press on pointer activation", async () => {
    const onPress = vi.fn();
    const wrapper = mount(Link, {
      attachTo: document.body,
      props: {href: "/", onPress},
      slots: {default: () => "Docs"}
    });
    const link = wrapper.get("a");

    link.element.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1, pointerType: "mouse"})
    );
    await nextTick();
    link.element.dispatchEvent(
      new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"})
    );
    await nextTick();

    expect(onPress).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Link, {props: {as: "div"}, slots: {default: () => "Docs"}});

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.attributes("data-slot")).toBe("link");
  });
});
