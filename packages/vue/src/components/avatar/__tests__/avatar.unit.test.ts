import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {h} from "vue";

import Avatar from "../avatar-root.vue";
import AvatarFallback from "../avatar-fallback.vue";
import AvatarImage from "../avatar-image.vue";

describe("Avatar", () => {
  it("renders the fallback with the upstream slot and variant classes", () => {
    const wrapper = mount(Avatar, {
      props: {color: "success", size: "lg"},
      slots: {default: () => h(AvatarFallback, null, {default: () => "AD"})},
    });

    const fallback = wrapper.get("[data-slot='avatar-fallback']");

    expect(wrapper.classes()).toContain("avatar");
    expect(wrapper.classes()).toContain("avatar--lg");
    expect(fallback.classes()).toContain("avatar__fallback");
    expect(fallback.classes()).toContain("avatar__fallback--success");
    expect(fallback.text()).toBe("AD");
  });

  it("renders the image with src and alt", () => {
    const wrapper = mount(Avatar, {
      slots: {
        default: () => [
          h(AvatarImage, {alt: "Ada", src: "https://example.com/ada.png"}),
          h(AvatarFallback, null, {default: () => "AD"}),
        ],
      },
    });
    const image = wrapper.get("img");

    expect(image.attributes("alt")).toBe("Ada");
    expect(image.attributes("src")).toBe("https://example.com/ada.png");
  });

  it("forwards the as prop and merges classes", () => {
    const wrapper = mount(Avatar, {
      attrs: {class: "extra"},
      props: {as: "div"},
      slots: {default: () => h(AvatarFallback, null, {default: () => "AD"})},
    });

    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("extra");
  });
});
