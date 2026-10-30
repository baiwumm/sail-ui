import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import Switch from "../switch-root.vue";
import SwitchContent from "../switch-content.vue";
import SwitchControl from "../switch-control.vue";
import SwitchThumb from "../switch-thumb.vue";
import SwitchIcon from "../switch-icon.vue";
import SwitchGroup from "../../switch-group/switch-group-root.vue";

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

describe("Switch", () => {
  it("renders the upstream slots and size class", () => {
    const wrapper = mount(Switch, {
      props: {size: "lg"},
      slots: {
        default: () =>
          h(SwitchContent, null, {
            default: () => [
              h(SwitchControl, null, {default: () => [h(SwitchThumb), h(SwitchIcon)]}),
            ],
          }),
      },
    });

    expect(wrapper.get('[data-slot="switch"]').classes()).toContain("switch--lg");
    expect(wrapper.get('[data-slot="switch-content"]').classes()).toContain("switch__content");
    expect(wrapper.get('[data-slot="switch-control"]').classes()).toContain("switch__control");
    expect(wrapper.get('[data-slot="switch-thumb"]').classes()).toContain("switch__thumb");
    expect(wrapper.get('[data-slot="switch-icon"]').classes()).toContain("switch__icon");
  });

  it("exposes the switch role on the native control", () => {
    const wrapper = mount(Switch, {
      slots: {default: () => h(SwitchContent, null, {default: () => "Enable"})},
    });

    expect(wrapper.findAll('input[role="switch"]')).toHaveLength(1);
  });

  it("toggles the controlled value", async () => {
    const selected = ref(false);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Switch,
              {
                modelValue: selected.value,
                "onUpdate:modelValue": (value: boolean) => (selected.value = value),
              },
              {default: () => h(SwitchContent, null, {default: () => "Enable"})},
            );
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get('input[role="switch"]').setValue(true);
    await nextTick();

    expect(selected.value).toBe(true);
    expect(wrapper.get('[data-slot="switch"]').attributes("data-selected")).toBe("true");
    expect(wrapper.get('[data-slot="switch-content"]').attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("reports hover and press on the content", async () => {
    const wrapper = mount(Switch, {
      attachTo: document.body,
      slots: {default: () => h(SwitchContent, null, {default: () => "Enable"})},
    });
    const content = wrapper.get('[data-slot="switch-content"]');

    pointer(content.element, "pointerenter");
    await nextTick();
    expect(content.attributes("data-hovered")).toBe("true");

    pointer(content.element, "pointerdown", {button: 0});
    await nextTick();
    expect(content.attributes("data-pressed")).toBe("true");

    wrapper.unmount();
  });

  it("renders the switch group items", () => {
    const wrapper = mount(SwitchGroup, {
      props: {orientation: "horizontal"},
      slots: {default: () => h(Switch)},
    });

    expect(wrapper.get('[data-slot="switch-group"]').classes()).toContain(
      "switch-group--horizontal",
    );
    expect(wrapper.findAll('[data-slot="switch-group-items"]')).toHaveLength(1);
  });
});
