import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {nextTick} from "vue";

import ScrollShadow from "../scroll-shadow.vue";

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

interface ScrollMetrics {
  clientHeight?: number;
  clientWidth?: number;
  scrollHeight?: number;
  scrollLeft?: number;
  scrollTop?: number;
  scrollWidth?: number;
}

function stubMetrics(element: Element, metrics: ScrollMetrics) {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, {configurable: true, value});
  }
}

async function scroll(element: Element) {
  element.dispatchEvent(new Event("scroll"));
  await nextFrame();
}

const content = {
  default: () => "Scrollable content",
};

describe("ScrollShadow", () => {
  it("renders the upstream root attributes, CSS variables and auto mode", async () => {
    const wrapper = mount(ScrollShadow, {slots: content});

    await nextFrame();

    expect(wrapper.attributes("data-slot")).toBe("scroll-shadow");
    expect(wrapper.attributes("data-orientation")).toBe("vertical");
    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("auto");
    expect(wrapper.attributes("data-scroll-shadow-size")).toBe("40");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["scroll-shadow", "scroll-shadow--fade", "scroll-shadow--vertical"]),
    );

    const style = wrapper.attributes("style") ?? "";

    expect(style).toContain("--scroll-shadow-size: 40px");
    expect(style).toContain("--scroll-shadow-offset: 0px");

    expect(wrapper.attributes("data-top-scroll")).toBe("false");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("false");
    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["none"]);
  });

  it("tracks combined and single vertical shadow states", async () => {
    const wrapper = mount(ScrollShadow, {slots: content});
    const element = wrapper.element;

    await nextFrame();

    stubMetrics(element, {clientHeight: 100, scrollHeight: 500, scrollTop: 50});
    await scroll(element);

    expect(wrapper.attributes("data-top-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-bottom-scroll")).toBeUndefined();
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["both"]);

    stubMetrics(element, {scrollTop: 0});
    await scroll(element);

    expect(wrapper.attributes("data-top-scroll")).toBe("false");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["bottom"]);

    stubMetrics(element, {scrollTop: 400});
    await scroll(element);

    expect(wrapper.attributes("data-top-scroll")).toBe("true");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("false");
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["top"]);
  });

  it("uses logical left/right attributes for horizontal scrolling", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {orientation: "horizontal"},
      slots: content,
    });
    const element = wrapper.element;

    await nextFrame();

    expect(wrapper.classes()).toEqual(expect.arrayContaining(["scroll-shadow--horizontal"]));

    stubMetrics(element, {clientWidth: 100, scrollLeft: -50, scrollWidth: 500});
    await scroll(element);

    expect(wrapper.attributes("data-left-right-scroll")).toBe("true");
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["both"]);

    stubMetrics(element, {scrollLeft: -400});
    await scroll(element);

    expect(wrapper.attributes("data-left-scroll")).toBe("true");
    expect(wrapper.attributes("data-right-scroll")).toBe("false");
    expect(wrapper.emitted("visibility-change")?.at(-1)).toEqual(["left"]);
  });

  it("applies a controlled visibility state and clears automatic attributes", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {visibility: "both"},
      slots: content,
    });

    await nextFrame();

    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("manual");
    expect(wrapper.attributes("data-top-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-bottom-scroll")).toBeUndefined();

    await wrapper.setProps({visibility: "bottom"});

    expect(wrapper.attributes("data-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();

    await wrapper.setProps({visibility: "none"});

    expect(wrapper.attributes("data-top-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-bottom-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-left-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-right-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-left-right-scroll")).toBeUndefined();
  });

  it("returns to automatic detection when visibility becomes auto again", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {visibility: "none"},
      slots: content,
    });
    const element = wrapper.element;

    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("manual");

    stubMetrics(element, {clientHeight: 100, scrollHeight: 500, scrollTop: 0});

    await wrapper.setProps({visibility: "auto"});
    await nextFrame();

    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("auto");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-scroll")).toBe("false");
  });

  it("clears every shadow attribute when disabled", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {isEnabled: false},
      slots: content,
    });

    await nextFrame();

    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("manual");
    expect(wrapper.attributes("data-top-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-bottom-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();

    await wrapper.setProps({isEnabled: true});
    await nextFrame();

    expect(wrapper.attributes("data-scroll-shadow-mode")).toBe("auto");
    expect(wrapper.attributes("data-top-scroll")).toBe("false");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("false");
  });

  it("honours the offset when deciding whether a shadow is visible", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {offset: 24},
      slots: content,
    });
    const element = wrapper.element;

    await nextFrame();

    expect(wrapper.attributes("style")).toContain("--scroll-shadow-offset: 24px");

    stubMetrics(element, {clientHeight: 100, scrollHeight: 500, scrollTop: 12});
    await scroll(element);

    expect(wrapper.attributes("data-top-scroll")).toBe("false");
    expect(wrapper.attributes("data-bottom-scroll")).toBe("true");

    await wrapper.setProps({offset: 0});
    await nextFrame();

    expect(wrapper.attributes("data-top-bottom-scroll")).toBe("true");
    expect(wrapper.attributes("data-top-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-bottom-scroll")).toBeUndefined();
  });

  it("maps size, hideScrollBar and consumer classes", async () => {
    const wrapper = mount(ScrollShadow, {
      attrs: {class: "extra"},
      props: {hideScrollBar: true, size: 80},
      slots: content,
    });

    await nextFrame();

    expect(wrapper.attributes("data-scroll-shadow-size")).toBe("80");
    expect(wrapper.attributes("style")).toContain("--scroll-shadow-size: 80px");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["scroll-shadow", "scroll-shadow--hide-scrollbar", "extra"]),
    );
  });

  it("renders polymorphically and forwards attributes", async () => {
    const wrapper = mount(ScrollShadow, {
      attrs: {"data-testid": "shadow"},
      props: {as: "section"},
      slots: content,
    });

    expect(wrapper.element.tagName).toBe("SECTION");
    expect(wrapper.attributes("data-testid")).toBe("shadow");
  });

  it("keeps horizontal controlled attributes in sync when orientation changes", async () => {
    const wrapper = mount(ScrollShadow, {
      props: {orientation: "vertical", visibility: "both"},
      slots: content,
    });

    await nextTick();

    expect(wrapper.attributes("data-top-bottom-scroll")).toBe("true");

    await wrapper.setProps({orientation: "horizontal"});
    await nextTick();

    expect(wrapper.attributes("data-top-bottom-scroll")).toBeUndefined();
    expect(wrapper.attributes("data-left-right-scroll")).toBe("true");
    expect(wrapper.attributes("data-orientation")).toBe("horizontal");
  });
});
