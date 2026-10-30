import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Alert from "../alert-root.vue";
import AlertContent from "../alert-content.vue";
import AlertDescription from "../alert-description.vue";
import AlertIndicator from "../alert-indicator.vue";
import AlertTitle from "../alert-title.vue";

function renderAlert(status: "default" | "accent" | "success" | "warning" | "danger" = "default") {
  return mount(Alert, {
    props: {status},
    slots: {
      default: () => [
        h(AlertIndicator),
        h(AlertContent, null, {
          default: () => [
            h(AlertTitle, null, {default: () => "Title"}),
            h(AlertDescription, null, {default: () => "Description"}),
          ],
        }),
      ],
    },
  });
}

describe("Alert", () => {
  it("renders the upstream BEM structure without a landmark role", () => {
    const wrapper = renderAlert("warning");

    expect(wrapper.get("[data-slot='alert-root']").classes()).toContain("alert--warning");
    expect(wrapper.get("[data-slot='alert-content']").classes()).toContain("alert__content");
    expect(wrapper.get("[data-slot='alert-title']").classes()).toContain("alert__title");
    expect(wrapper.get("[data-slot='alert-description']").text()).toBe("Description");
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("maps every status to its variant class", () => {
    for (const status of ["default", "accent", "success", "warning", "danger"] as const) {
      const wrapper = renderAlert(status);

      expect(wrapper.get("[data-slot='alert-root']").classes()).toContain(`alert--${status}`);
      wrapper.unmount();
    }
  });

  it("renders a status icon and swaps it for custom indicator content", () => {
    const withIcon = renderAlert("success");
    expect(withIcon.find("[data-slot='alert-default-icon']").exists()).toBe(true);

    const custom = mount(Alert, {
      slots: {
        default: () => h(AlertIndicator, null, {default: () => h("span", {class: "custom"}, "!")}),
      },
    });

    expect(custom.find("[data-slot='alert-default-icon']").exists()).toBe(false);
    expect(custom.get(".custom").text()).toBe("!");
  });

  it("supports the as prop on every part", () => {
    const wrapper = mount(Alert, {
      props: {as: "section"},
      slots: {
        default: () => h(AlertContent, {as: "article"}, {default: () => "Body"}),
      },
    });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.get("[data-slot='alert-content']").element.tagName).toBe("ARTICLE");
  });
});
