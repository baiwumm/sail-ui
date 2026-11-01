import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import Checkbox from "../checkbox-root.vue";
import CheckboxContent from "../checkbox-content.vue";
import CheckboxControl from "../checkbox-control.vue";
import CheckboxIndicator from "../checkbox-indicator.vue";
import CheckboxGroup from "../../checkbox-group/checkbox-group-root.vue";
import Label from "../../label/label.vue";

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

describe("Checkbox", () => {
  it("renders the upstream slots and variant classes", () => {
    const wrapper = mount(Checkbox, {
      props: {variant: "secondary"},
      slots: {
        default: () =>
          h(CheckboxContent, null, {
            default: () => [
              h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
              h(Label, null, {default: () => "Accept"}),
            ],
          }),
      },
    });

    expect(wrapper.get('[data-slot="checkbox"]').classes()).toContain("checkbox--secondary");
    expect(wrapper.get('[data-slot="checkbox-content"]').classes()).toContain("checkbox__content");
    expect(wrapper.get('[data-slot="checkbox-control"]').classes()).toContain("checkbox__control");
    expect(wrapper.get('[data-slot="checkbox-indicator"]').classes()).toContain(
      "checkbox__indicator",
    );
    expect(wrapper.get('[data-slot="label"]').element.tagName).toBe("SPAN");
  });

  it("toggles the controlled value", async () => {
    const selected = ref(false);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Checkbox,
              {
                modelValue: selected.value,
                "onUpdate:modelValue": (value: boolean | "indeterminate") =>
                  (selected.value = value === true),
              },
              {
                default: () => [
                  h(CheckboxContent, null, {
                    default: () => [
                      h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                    ],
                  }),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const input = wrapper.get('input[type="checkbox"]');

    await input.setValue(true);
    await nextTick();

    expect(selected.value).toBe(true);
    expect(wrapper.get('[data-slot="checkbox"]').attributes("data-selected")).toBe("true");

    wrapper.unmount();
  });

  it("maps the indeterminate state to data-indeterminate", () => {
    const wrapper = mount(Checkbox, {
      props: {modelValue: "indeterminate"},
      slots: {
        default: () =>
          h(CheckboxContent, null, {
            default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})],
          }),
      },
    });

    expect(wrapper.get('[data-slot="checkbox"]').attributes("data-indeterminate")).toBe("true");
    expect(wrapper.get('[data-slot="checkbox"]').attributes("data-selected")).toBeUndefined();
    expect(wrapper.find('[data-slot="checkbox-default-indicator--indeterminate"]').exists()).toBe(
      true,
    );
    expect(
      wrapper
        .get('[data-slot="checkbox-default-indicator--checkmark"]')
        .attributes("stroke-dashoffset"),
    ).toBe("66");
  });

  it("reports the disabled state on the root and the content", () => {
    const wrapper = mount(Checkbox, {
      props: {isDisabled: true},
      slots: {
        default: () =>
          h(CheckboxContent, null, {
            default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})],
          }),
      },
    });

    expect(wrapper.get('[data-slot="checkbox"]').attributes("data-disabled")).toBe("true");
    expect(wrapper.get('[data-slot="checkbox-content"]').attributes("data-disabled")).toBe("true");
    expect(wrapper.get('input[type="checkbox"]').attributes("disabled")).toBeDefined();
  });

  it("tracks hover and press on the content", async () => {
    const wrapper = mount(Checkbox, {
      attachTo: document.body,
      slots: {
        default: () =>
          h(CheckboxContent, null, {
            default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})],
          }),
      },
    });
    const content = wrapper.get('[data-slot="checkbox-content"]');

    pointer(content.element, "pointerenter");
    await nextTick();
    expect(content.attributes("data-hovered")).toBe("true");

    pointer(content.element, "pointerdown", {button: 0});
    await nextTick();
    expect(content.attributes("data-pressed")).toBe("true");

    pointer(content.element, "pointerup");
    await nextTick();
    expect(content.attributes("data-pressed")).toBeUndefined();

    wrapper.unmount();
  });

  it("keeps the native checkbox activation on Space", async () => {
    const wrapper = mount(Checkbox, {
      attachTo: document.body,
      slots: {
        default: () =>
          h(CheckboxContent, null, {
            default: () => [h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]})],
          }),
      },
    });

    const input = wrapper.get('input[type="checkbox"]');
    const event = new KeyboardEvent("keydown", {key: " ", bubbles: true, cancelable: true});

    input.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);

    wrapper.unmount();
  });

  it("toggles the values of a checkbox group", async () => {
    const values = ref<string[]>(["a"]);

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              CheckboxGroup,
              {
                modelValue: values.value,
                "onUpdate:modelValue": (next: string[]) => (values.value = next),
              },
              {
                default: () => [
                  h(
                    Checkbox,
                    {value: "a"},
                    {
                      default: () => [
                        h(CheckboxContent, null, {
                          default: () => [
                            h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                          ],
                        }),
                      ],
                    },
                  ),
                  h(
                    Checkbox,
                    {value: "b"},
                    {
                      default: () => [
                        h(CheckboxContent, null, {
                          default: () => [
                            h(CheckboxControl, null, {default: () => [h(CheckboxIndicator)]}),
                          ],
                        }),
                      ],
                    },
                  ),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    const checkboxes = wrapper.findAll('[data-slot="checkbox"]');

    expect(checkboxes[0]!.attributes("data-selected")).toBe("true");

    const inputs = wrapper.findAll('input[type="checkbox"]');

    await inputs[1]!.setValue(true);
    await nextTick();

    expect(values.value).toEqual(["a", "b"]);

    wrapper.unmount();
  });

  it("inherits the group variant", () => {
    const wrapper = mount(CheckboxGroup, {
      props: {variant: "secondary", defaultValue: ["a"]},
      slots: {
        default: () => [h(Checkbox, {value: "a"})],
      },
    });

    const checkbox = wrapper.get('[data-slot="checkbox"]');

    // The CSS variant class lives on the member (checkbox.css), so a group
    // variant must propagate to each checkbox.
    expect(checkbox.classes()).toContain("checkbox--secondary");

    wrapper.unmount();
  });
});
