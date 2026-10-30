import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Badge from "../badge-root.vue";
import BadgeAnchor from "../badge-anchor.vue";
import BadgeLabel from "../badge-label.vue";

describe("Badge", () => {
  it("wraps plain text in the label part", () => {
    const wrapper = mount(Badge, {slots: {default: () => "3"}});

    expect(wrapper.get("[data-slot='badge']").text()).toBe("3");
    expect(wrapper.get("[data-slot='badge-label']").text()).toBe("3");
  });

  it("keeps explicit label and anchor parts", () => {
    const wrapper = mount(BadgeAnchor, {
      attrs: {class: "extra"},
      slots: {
        default: () => [
          h("span", "Inbox"),
          h(
            Badge,
            {color: "danger", placement: "bottom-left", size: "lg"},
            {
              default: () => h(BadgeLabel, {class: "label-extra"}, {default: () => "3"}),
            },
          ),
        ],
      },
    });

    expect(wrapper.get("[data-slot='badge-anchor']").classes()).toContain("badge-anchor");
    expect(wrapper.get("[data-slot='badge']").classes()).toEqual(
      expect.arrayContaining(["badge", "badge--danger", "badge--bottom-left", "badge--lg"]),
    );
    expect(wrapper.get("[data-slot='badge-label']").classes()).toContain("label-extra");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Badge, {props: {as: "div"}, slots: {default: () => "New"}});

    expect(wrapper.element.tagName).toBe("DIV");
  });
});
