import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import NumberField from "../number-field-root.vue";
import NumberFieldDecrementButton from "../number-field-decrement-button.vue";
import NumberFieldGroup from "../number-field-group.vue";
import NumberFieldIncrementButton from "../number-field-increment-button.vue";
import NumberFieldInput from "../number-field-input.vue";

const press = (element: Element) => {
  element.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      pointerId: 1,
      pointerType: "mouse",
    }),
  );
};

describe("NumberField", () => {
  it("renders the upstream slots", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              NumberField,
              {modelValue: 3},
              {
                default: () => [
                  h(NumberFieldGroup, null, {
                    default: () => [
                      h(NumberFieldDecrementButton),
                      h(NumberFieldInput),
                      h(NumberFieldIncrementButton),
                    ],
                  }),
                ],
              },
            );
        },
      }),
    );

    expect(wrapper.get('[data-slot="number-field"]').classes()).toContain("number-field--primary");
    expect(wrapper.get('[data-slot="number-field-group"]').classes()).toContain(
      "number-field__group",
    );
    expect(wrapper.get('[data-slot="number-field-input"]').classes()).toContain(
      "number-field__input",
    );
    expect(wrapper.get('[data-slot="number-field-increment-button"]').attributes("slot")).toBe(
      "increment",
    );
    expect(wrapper.get('[data-slot="number-field-decrement-button"]').attributes("slot")).toBe(
      "decrement",
    );
  });

  it("exposes the spinbutton semantics", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              NumberField,
              {modelValue: 3, min: 0, max: 10},
              {
                default: () => [h(NumberFieldGroup, null, {default: () => [h(NumberFieldInput)]})],
              },
            );
        },
      }),
    );
    const input = wrapper.get('input[role="spinbutton"]');

    expect(input.attributes("aria-valuenow")).toBe("3");
    expect(input.attributes("aria-valuemin")).toBe("0");
    expect(input.attributes("aria-valuemax")).toBe("10");
  });

  it("increments and decrements the value", async () => {
    const value = ref(3);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              NumberField,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: number | undefined) => (value.value = next ?? 0),
                min: 0,
                max: 10,
              },
              {
                default: () => [
                  h(NumberFieldGroup, null, {
                    default: () => [
                      h(NumberFieldDecrementButton),
                      h(NumberFieldInput),
                      h(NumberFieldIncrementButton),
                    ],
                  }),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    await nextTick();

    press(wrapper.get('[data-slot="number-field-increment-button"]').element);
    await nextTick();
    expect(value.value).toBe(4);

    press(wrapper.get('[data-slot="number-field-decrement-button"]').element);
    await nextTick();
    expect(value.value).toBe(3);

    wrapper.unmount();
  });

  it("steps with the arrow keys", async () => {
    const value = ref(3);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              NumberField,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: number | undefined) => (value.value = next ?? 0),
              },
              {
                default: () => [h(NumberFieldGroup, null, {default: () => [h(NumberFieldInput)]})],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const input = wrapper.get('input[role="spinbutton"]');

    await input.trigger("keydown", {key: "ArrowUp"});
    await nextTick();
    expect(value.value).toBe(4);

    await input.trigger("keydown", {key: "ArrowDown"});
    await nextTick();
    expect(value.value).toBe(3);

    wrapper.unmount();
  });

  it("respects the minimum and the maximum", async () => {
    const value = ref(10);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              NumberField,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: number | undefined) => (value.value = next ?? 0),
                min: 0,
                max: 10,
              },
              {
                default: () => [
                  h(NumberFieldGroup, null, {
                    default: () => [
                      h(NumberFieldDecrementButton),
                      h(NumberFieldInput),
                      h(NumberFieldIncrementButton),
                    ],
                  }),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    expect(
      wrapper.get('[data-slot="number-field-increment-button"]').attributes("disabled"),
    ).toBeDefined();

    wrapper.unmount();
  });
});
