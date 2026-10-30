import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Card from "../card-root.vue";
import CardContent from "../card-content.vue";
import CardDescription from "../card-description.vue";
import CardFooter from "../card-footer.vue";
import CardHeader from "../card-header.vue";
import CardTitle from "../card-title.vue";

function renderCard(variant: "default" | "secondary" | "tertiary" | "transparent" = "default") {
  return mount(Card, {
    props: {variant},
    slots: {
      default: () => [
        h(CardHeader, null, {
          default: () => [
            h(CardTitle, null, {default: () => "Title"}),
            h(CardDescription, null, {default: () => "Description"})
          ]
        }),
        h(CardContent, null, {default: () => "Body"}),
        h(CardFooter, null, {default: () => "Footer"})
      ]
    }
  });
}

describe("Card", () => {
  it("renders every part with the upstream BEM classes", () => {
    const wrapper = renderCard("secondary");

    expect(wrapper.get("[data-slot='card']").classes()).toEqual(
      expect.arrayContaining(["card", "card--secondary"])
    );
    expect(wrapper.get("[data-slot='card-header']").classes()).toContain("card__header");
    expect(wrapper.get("[data-slot='card-title']").element.tagName).toBe("H3");
    expect(wrapper.get("[data-slot='card-description']").element.tagName).toBe("P");
    expect(wrapper.get("[data-slot='card-content']").classes()).toContain("card__content");
    expect(wrapper.get("[data-slot='card-footer']").classes()).toContain("card__footer");
  });

  it("maps every variant", () => {
    for (const variant of ["default", "secondary", "tertiary", "transparent"] as const) {
      const wrapper = renderCard(variant);

      expect(wrapper.classes()).toContain(`card--${variant}`);
      wrapper.unmount();
    }
  });

  it("supports polymorphic parts and class merging", () => {
    const wrapper = mount(Card, {
      attrs: {class: "extra"},
      props: {as: "article"},
      slots: {default: () => h(CardTitle, {as: "h2"}, {default: () => "Title"})}
    });

    expect(wrapper.element.tagName).toBe("ARTICLE");
    expect(wrapper.classes()).toContain("extra");
    expect(wrapper.get("[data-slot='card-title']").element.tagName).toBe("H2");
  });
});
