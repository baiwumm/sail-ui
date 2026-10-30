import {mount} from "@vue/test-utils";
import {defineComponent, h, ref} from "vue";
import {describe, expect, it} from "vitest";

import Description from "../description.vue";
import FieldError from "../field-error.vue";
import Input from "../input.vue";
import Label from "../label.vue";
import TextField from "../text-field.vue";

describe("Input", () => {
  it("renders as a standalone input with the upstream data-slot", () => {
    const wrapper = mount(Input, {
      attrs: {placeholder: "Type here"},
      props: {modelValue: "hello"}
    });
    const input = wrapper.get("input");

    expect(input.attributes("data-slot")).toBe("input");
    expect(input.attributes("placeholder")).toBe("Type here");
    expect((input.element as HTMLInputElement).value).toBe("hello");
  });

  it("supports v-model and full-width styling", async () => {
    const Host = defineComponent({
      components: {Input},
      setup() {
        const value = ref("a");

        return {value};
      },
      template: `<Input v-model="value" full-width />`
    });
    const wrapper = mount(Host);

    await wrapper.get("input").setValue("sail");

    expect(wrapper.vm.value).toBe("sail");
    expect(wrapper.get("input").classes()).toContain("input--full-width");
  });

  it("wires label, description, and field error through the field context", () => {
    const wrapper = mount(TextField, {
      props: {isInvalid: true},
      slots: {
        default: () => [
          h(Label, null, {default: () => "Email"}),
          h(Input, {placeholder: "you@example.com"}),
          h(Description, null, {default: () => "We never share it."}),
          h(FieldError, null, {default: () => "Enter a valid email."})
        ]
      }
    });
    const label = wrapper.get("label");
    const input = wrapper.get("input");
    const description = wrapper.get('[data-slot="description"]');
    const error = wrapper.get('[data-slot="field-error"]');

    expect(label.attributes("for")).toBe(input.attributes("id"));
    expect(label.attributes("data-slot")).toBe("label");
    expect(description.text()).toBe("We never share it.");
    expect(error.text()).toBe("Enter a valid email.");
    expect(error.attributes("data-visible")).toBe("true");
    expect(input.attributes("aria-invalid")).toBe("true");
  });

  it("reflects disabled state from the field root", () => {
    const wrapper = mount(TextField, {
      props: {isDisabled: true},
      slots: {
        default: () => [
          h(Label, null, {default: () => "Name"}),
          h(Input)
        ]
      }
    });

    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    expect(wrapper.get("label").classes()).toContain("label--disabled");
  });
});
