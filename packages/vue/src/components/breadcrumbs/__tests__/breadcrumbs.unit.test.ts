import {mount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";
import {h, nextTick} from "vue";

import Breadcrumbs from "../breadcrumbs-root.vue";
import BreadcrumbsItem from "../breadcrumbs-item.vue";

const pointer = (element: Element, type: string) => {
  element.dispatchEvent(
    new PointerEvent(type, {bubbles: true, pointerId: 1, pointerType: "mouse"}),
  );
};

function renderBreadcrumbs(props: Record<string, unknown> = {}) {
  return mount(Breadcrumbs, {
    props,
    slots: {
      default: () => [
        h(BreadcrumbsItem, {href: "/"}, {default: () => "Home"}),
        h(BreadcrumbsItem, {href: "/products"}, {default: () => "Products"}),
        h(BreadcrumbsItem, {href: "/laptop"}, {default: () => "Laptop"}),
      ],
    },
  });
}

describe("Breadcrumbs", () => {
  it("renders an ol with nav semantics and default label", () => {
    const wrapper = renderBreadcrumbs();

    expect(wrapper.element.tagName).toBe("OL");
    expect(wrapper.attributes("aria-label")).toBe("Breadcrumbs");
    expect(wrapper.findAll("li")).toHaveLength(3);
  });

  it("marks only the last item as current and omits its separator", () => {
    const wrapper = renderBreadcrumbs();
    const items = wrapper.findAll("[data-slot='breadcrumbs-item']");

    expect(items[0]!.attributes("data-current")).toBeUndefined();
    expect(items[2]!.attributes("data-current")).toBe("true");
    expect(items[2]!.attributes("data-disabled")).toBe("true");
    expect(wrapper.findAll("[data-slot='breadcrumbs-separator']")).toHaveLength(2);
  });

  it("propagates isDisabled from the root to every link", () => {
    const wrapper = renderBreadcrumbs({isDisabled: true});
    const links = wrapper.findAll("a, [role='link']");

    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.attributes("aria-disabled")).toBe("true");
    }
  });

  it("renders a custom string separator without the separator slot", () => {
    const wrapper = renderBreadcrumbs({separator: "/"});

    expect(wrapper.findAll("[data-slot='breadcrumbs-separator']")).toHaveLength(0);
    expect(wrapper.text().split("/").length - 1).toBe(2);
  });

  it("clones a custom VNode separator with the separator slot and class", () => {
    const wrapper = renderBreadcrumbs({separator: h("span", {class: "custom"}, ">")});

    expect(wrapper.findAll("[data-slot='breadcrumbs-separator']")).toHaveLength(2);
    expect(wrapper.findAll(".custom.breadcrumbs__separator")).toHaveLength(2);
  });

  it("emits press for non-current items", async () => {
    const onPress = vi.fn();
    const wrapper = mount(Breadcrumbs, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(BreadcrumbsItem, {href: "/", onPress}, {default: () => "Home"}),
          h(BreadcrumbsItem, {href: "/current"}, {default: () => "Current"}),
        ],
      },
    });
    const home = wrapper.get("a");

    pointer(home.element, "pointerdown");
    await nextTick();
    pointer(home.element, "pointerup");
    await nextTick();

    expect(onPress).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it("does not emit press for the disabled current item", async () => {
    const onPress = vi.fn();
    const wrapper = mount(Breadcrumbs, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(BreadcrumbsItem, {href: "/", onPress}, {default: () => "Home"}),
          h(BreadcrumbsItem, {href: "/current", onPress}, {default: () => "Current"}),
        ],
      },
    });
    const current = wrapper.get("span[role='link']");

    pointer(current.element, "pointerdown");
    await nextTick();
    pointer(current.element, "pointerup");
    await nextTick();

    expect(onPress).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
