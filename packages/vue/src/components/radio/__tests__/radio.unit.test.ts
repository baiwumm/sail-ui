import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import Radio from "../radio-root.vue";
import RadioContent from "../radio-content.vue";
import RadioControl from "../radio-control.vue";
import RadioIndicator from "../radio-indicator.vue";
import RadioGroup from "../../radio-group/radio-group-root.vue";

const pointer = (element: Element, type: string, init: PointerEventInit = {}) => {
  element.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: "mouse",
      ...init
    })
  );
};

const radio = (value: string, label: string) =>
  h(Radio, {value}, {
    default: () => [
      h(RadioContent, null, {
        default: () => [
          h(RadioControl, null, {default: () => [h(RadioIndicator)]}),
          label
        ]
      })
    ]
  });

describe("Radio", () => {
  it("renders the upstream slots", () => {
    const wrapper = mount(Radio, {
      props: {value: "a"},
      slots: {
        default: () =>
          h(RadioContent, null, {
            default: () => [
              h(RadioControl, null, {default: () => [h(RadioIndicator)]}),
              "A"
            ]
          })
      }
    });

    expect(wrapper.get('[data-slot="radio"]').classes()).toContain("radio");
    expect(wrapper.get('[data-slot="radio-content"]').classes()).toContain("radio__content");
    expect(wrapper.get('[data-slot="radio-control"]').classes()).toContain("radio__control");
    expect(wrapper.get('[data-slot="radio-indicator"]').attributes("aria-hidden")).toBe("true");
  });

  it("shares the native radio group name and marks the selection", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(RadioGroup, {modelValue: "b"}, {default: () => [radio("a", "A"), radio("b", "B")]});
        }
      }),
      {attachTo: document.body}
    );

    const inputs = wrapper.findAll('input[type="radio"]');
    const name = inputs[0]!.attributes("name");

    expect(name).toBeTruthy();
    expect(inputs[1]!.attributes("name")).toBe(name);

    const radios = wrapper.findAll('[data-slot="radio"]');

    expect(radios[0]!.attributes("data-selected")).toBeUndefined();
    expect(radios[1]!.attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("keeps a roving tab index", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(RadioGroup, {modelValue: "b"}, {default: () => [radio("a", "A"), radio("b", "B")]});
        }
      }),
      {attachTo: document.body}
    );

    const inputs = wrapper.findAll('input[type="radio"]');

    expect(inputs[0]!.attributes("tabindex")).toBe("-1");
    expect(inputs[1]!.attributes("tabindex")).toBe("0");

    wrapper.unmount();
  });

  it("reports hover and press on the content", async () => {
    const wrapper = mount(Radio, {
      attachTo: document.body,
      props: {value: "a"},
      slots: {default: () => h(RadioContent, null, {default: () => "A"})}
    });
    const content = wrapper.get('[data-slot="radio-content"]');

    pointer(content.element, "pointerenter");
    await nextTick();
    expect(content.attributes("data-hovered")).toBe("true");

    pointer(content.element, "pointerdown", {button: 0});
    await nextTick();
    expect(content.attributes("data-pressed")).toBe("true");

    wrapper.unmount();
  });

  it("selects the radio that the user picks", async () => {
    const value = ref<string | undefined>("a");

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              RadioGroup,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: string | undefined) => (value.value = next)
              },
              {default: () => [radio("a", "A"), radio("b", "B")]}
            );
        }
      }),
      {attachTo: document.body}
    );

    const inputs = wrapper.findAll('input[type="radio"]');

    await inputs[1]!.setValue(true);
    await nextTick();

    expect(value.value).toBe("b");

    wrapper.unmount();
  });
});
