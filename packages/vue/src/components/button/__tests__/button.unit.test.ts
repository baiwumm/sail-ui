import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";

import Button from "../button.vue";

describe("Button", () => {
  it("renders the upstream data-slot and variant classes", () => {
    const wrapper = mount(Button, {
      props: {size: "lg", variant: "danger"},
      slots: {default: "Delete"},
    });
    const button = wrapper.get("button");

    expect(button.attributes("data-slot")).toBe("button");
    expect(button.attributes("type")).toBe("button");
    expect(button.classes()).toContain("button");
    expect(button.classes()).toContain("button--danger");
    expect(button.classes()).toContain("button--lg");
  });

  it("merges class, style, and attributes onto the button element", () => {
    const wrapper = mount(Button, {
      attrs: {
        class: "custom-button",
        "data-testid": "attrs-button",
        style: "letter-spacing: 0.04em",
      },
    });
    const button = wrapper.get("button");

    expect(button.classes()).toContain("button");
    expect(button.classes()).toContain("custom-button");
    expect(button.attributes("data-testid")).toBe("attrs-button");
    expect(button.attributes("style")).toContain("letter-spacing");
  });

  it("emits press for pointer activation", async () => {
    const wrapper = mount(Button);

    wrapper.get("button").element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.get("button").attributes("data-pressed")).toBe("true");

    wrapper
      .get("button")
      .element.dispatchEvent(
        new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
      );
    await wrapper.vm.$nextTick();
    expect(wrapper.get("button").attributes("data-pressed")).toBeUndefined();
    expect(wrapper.emitted("press")).toHaveLength(1);
    expect(wrapper.emitted("press")?.[0]?.[0]).toMatchObject({pointerType: "mouse"});
  });

  it("emits press for Enter and Space keyboard activation", async () => {
    const wrapper = mount(Button);

    await wrapper.get("button").trigger("keydown", {key: "Enter"});
    await wrapper.get("button").trigger("keyup", {key: "Enter"});
    await wrapper.get("button").trigger("keydown", {key: " "});
    await wrapper.get("button").trigger("keyup", {key: " "});

    expect(wrapper.emitted("press")).toHaveLength(2);
    expect(wrapper.emitted("press")?.[0]?.[0]).toMatchObject({pointerType: "keyboard"});
  });

  it("disables interaction when isDisabled or isLoading is set", async () => {
    const disabled = mount(Button, {props: {isDisabled: true}});

    expect(disabled.get("button").attributes("disabled")).toBeDefined();

    disabled
      .get("button")
      .element.dispatchEvent(
        new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1}),
      );
    disabled
      .get("button")
      .element.dispatchEvent(
        new PointerEvent("pointerup", {bubbles: true, pointerId: 1, pointerType: "mouse"}),
      );
    expect(disabled.emitted("press")).toBeUndefined();

    const loading = mount(Button, {props: {isLoading: true}});

    expect(loading.get("button").attributes("aria-busy")).toBe("true");
    expect(loading.get("button").attributes("data-pending")).toBe("true");
    expect(loading.get("button").attributes("disabled")).toBeDefined();
    expect(loading.find('[data-slot="spinner"]').exists()).toBe(true);
  });

  it("tracks hover and focus-visible state for CSS", async () => {
    const wrapper = mount(Button, {attachTo: document.body});
    const button = wrapper.get("button");

    await button.trigger("pointerenter", {pointerType: "mouse"});
    expect(button.attributes("data-hovered")).toBe("true");

    await button.trigger("pointerleave");
    expect(button.attributes("data-hovered")).toBeUndefined();

    document.dispatchEvent(new KeyboardEvent("keydown", {key: "Tab"}));
    button.element.focus();
    await wrapper.vm.$nextTick();
    expect(button.attributes("data-focus-visible")).toBe("true");

    wrapper.unmount();
  });

  it("renders the native button type", () => {
    const submit = mount(Button, {props: {type: "submit"}});
    const reset = mount(Button, {props: {type: "reset"}});

    expect(submit.get("button").attributes("type")).toBe("submit");
    expect(reset.get("button").attributes("type")).toBe("reset");

    submit.unmount();
    reset.unmount();
  });

  it("renders another element with the as prop", () => {
    const wrapper = mount(Button, {props: {as: "a"}, slots: {default: "Link"}});

    expect(wrapper.get("a").attributes("data-slot")).toBe("button");
    expect(wrapper.get("a").attributes("type")).toBeUndefined();

    wrapper.unmount();
  });

  it("merges the props into the child with asChild", () => {
    const wrapper = mount(Button, {
      props: {asChild: true},
      slots: {default: '<a href="/docs">Docs</a>'},
    });

    expect(wrapper.get("a").attributes("data-slot")).toBe("button");
    expect(wrapper.get("a").attributes("href")).toBe("/docs");

    wrapper.unmount();
  });

  it("keeps the native submit activation of the keyboard", async () => {
    const wrapper = mount(Button, {props: {type: "submit"}});
    const event = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });

    wrapper.get("button").element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);

    wrapper.unmount();
  });
});
