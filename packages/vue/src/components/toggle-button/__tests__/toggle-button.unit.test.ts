import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import ToggleButton from "../toggle-button-root.vue";
import ToggleButtonGroup from "../../toggle-button-group/toggle-button-group-root.vue";
import ToggleButtonGroupSeparator from "../../toggle-button-group/toggle-button-group-separator.vue";

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      ...init,
    }),
  );
};

describe("ToggleButton", () => {
  it("renders the upstream slot and variant classes", () => {
    const wrapper = mount(ToggleButton, {
      props: {variant: "ghost", size: "sm", isIconOnly: true},
      slots: {default: "Bold"},
    });
    const button = wrapper.get('[data-slot="toggle-button"]');

    expect(button.classes()).toContain("toggle-button");
    expect(button.classes()).toContain("toggle-button--ghost");
    expect(button.classes()).toContain("toggle-button--sm");
    expect(button.classes()).toContain("toggle-button--icon-only");
    expect(button.attributes("aria-pressed")).toBe("false");
  });

  it("toggles the pressed state", async () => {
    const pressed = ref(false);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              ToggleButton,
              {
                modelValue: pressed.value,
                "onUpdate:modelValue": (value: boolean | undefined) =>
                  (pressed.value = Boolean(value)),
              },
              {default: () => "Bold"},
            );
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get("button").trigger("click");
    await nextTick();

    expect(pressed.value).toBe(true);
    expect(wrapper.get('[data-slot="toggle-button"]').attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("reports hover, press, and focus states", async () => {
    const wrapper = mount(ToggleButton, {
      attachTo: document.body,
      slots: {default: "Bold"},
    });
    const button = wrapper.get('[data-slot="toggle-button"]');

    pointer(button.element, "pointerenter");
    await nextTick();
    expect(button.attributes("data-hovered")).toBe("true");

    pointer(button.element, "pointerdown", {button: 0});
    await nextTick();
    expect(button.attributes("data-pressed")).toBe("true");

    pointer(button.element, "pointerup");
    await nextTick();
    expect(button.attributes("data-pressed")).toBeUndefined();

    document.dispatchEvent(new KeyboardEvent("keydown", {key: "Tab"}));
    (button.element as HTMLElement).focus();
    await nextTick();

    expect(button.attributes("data-focus-visible")).toBe("true");
    expect(button.attributes("data-focused")).toBe("true");

    wrapper.unmount();
  });

  it("emits press for pointer and keyboard activation", async () => {
    const wrapper = mount(ToggleButton, {slots: {default: "Bold"}});

    await wrapper.get("button").trigger("keydown", {key: "Enter"});
    await wrapper.get("button").trigger("keyup", {key: "Enter"});

    expect(wrapper.emitted("press")).toHaveLength(1);

    wrapper.unmount();
  });
});

describe("ToggleButtonGroup", () => {
  it("renders the group slot and the separator", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              ToggleButtonGroup,
              {type: "multiple"},
              {
                default: () => [
                  h(ToggleButton, {value: "bold"}, {default: () => "Bold"}),
                  h(ToggleButtonGroupSeparator),
                  h(ToggleButton, {value: "italic"}, {default: () => "Italic"}),
                ],
              },
            );
        },
      }),
    );

    expect(wrapper.get('[data-slot="toggle-button-group"]').classes()).toContain(
      "toggle-button-group--horizontal",
    );
    expect(wrapper.findAll('[data-slot="toggle-button-group-separator"]')).toHaveLength(1);
  });

  it("keeps several values in multiple mode", async () => {
    const values = ref<string[]>([]);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              ToggleButtonGroup,
              {
                type: "multiple",
                modelValue: values.value,
                "onUpdate:modelValue": (next: string | string[] | undefined) =>
                  (values.value = Array.isArray(next) ? next : next ? [next] : []),
              },
              {
                default: () => [
                  h(ToggleButton, {value: "bold"}, {default: () => "Bold"}),
                  h(ToggleButton, {value: "italic"}, {default: () => "Italic"}),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const buttons = wrapper.findAll('[data-slot="toggle-button"]');

    await buttons[0]!.trigger("click");
    await nextTick();
    expect(values.value).toEqual(["bold"]);

    await buttons[1]!.trigger("click");
    await nextTick();
    expect(values.value).toEqual(["bold", "italic"]);

    wrapper.unmount();
  });

  it("keeps a single value in single mode", async () => {
    const values = ref<string | undefined>(undefined);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              ToggleButtonGroup,
              {
                type: "single",
                modelValue: values.value,
                "onUpdate:modelValue": (next: string | string[] | undefined) =>
                  (values.value = Array.isArray(next) ? next[0] : next),
              },
              {
                default: () => [
                  h(ToggleButton, {value: "bold"}, {default: () => "Bold"}),
                  h(ToggleButton, {value: "italic"}, {default: () => "Italic"}),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const buttons = wrapper.findAll('[data-slot="toggle-button"]');

    await buttons[0]!.trigger("click");
    await nextTick();
    expect(values.value).toBe("bold");

    await buttons[1]!.trigger("click");
    await nextTick();
    expect(values.value).toBe("italic");

    // Upstream single mode deselects when the selected item is activated again.
    await buttons[1]!.trigger("click");
    await nextTick();
    expect(values.value).toBeUndefined();

    wrapper.unmount();
  });

  it("propagates the size and the disabled state to the buttons", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              ToggleButtonGroup,
              {type: "multiple", size: "lg", isDisabled: true},
              {
                default: () => [h(ToggleButton, {value: "bold"}, {default: () => "Bold"})],
              },
            );
        },
      }),
    );

    const button = wrapper.get('[data-slot="toggle-button"]');

    expect(button.classes()).toContain("toggle-button--lg");
    expect(button.attributes("data-disabled")).toBeDefined();
    expect(button.attributes("disabled")).toBeDefined();
  });
});
