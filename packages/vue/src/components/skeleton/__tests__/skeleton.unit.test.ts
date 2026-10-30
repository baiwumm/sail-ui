import {mount} from "@vue/test-utils";
import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {nextTick} from "vue";

import Skeleton from "../skeleton.vue";

describe("Skeleton", () => {
  it("renders no data-slot and defaults to shimmer on the server", async () => {
    const html = await renderSSR(Skeleton);

    expect(html).not.toContain("data-slot");
    expect(html).toContain("skeleton--shimmer");
  });

  it("maps animationType to the variant class", () => {
    const wrapper = mount(Skeleton, {props: {animationType: "none"}});

    expect(wrapper.classes()).toEqual(expect.arrayContaining(["skeleton", "skeleton--none"]));
    expect(wrapper.attributes("data-slot")).toBeUndefined();
  });

  it("inherits --skeleton-animation after mount when no prop is set", async () => {
    document.documentElement.style.setProperty("--skeleton-animation", "pulse");

    const wrapper = mount(Skeleton, {attrs: {class: "extra"}});

    await nextTick();

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["skeleton", "skeleton--pulse", "extra"]),
    );

    document.documentElement.style.removeProperty("--skeleton-animation");
  });

  it("supports polymorphic rendering", () => {
    const wrapper = mount(Skeleton, {props: {as: "span"}});

    expect(wrapper.element.tagName).toBe("SPAN");
  });
});
