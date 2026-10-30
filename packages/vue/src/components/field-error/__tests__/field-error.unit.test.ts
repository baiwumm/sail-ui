import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import Input from "../../input/input.vue";
import TextField from "../../input/text-field.vue";
import FieldError from "../field-error.vue";

function fieldHost(invalid: boolean, error?: string) {
  return defineComponent({
    setup() {
      return () =>
        h(
          TextField,
          {isInvalid: invalid},
          {
            default: () => [
              h(Input),
              error ? h(FieldError, null, {default: () => error}) : h(FieldError),
            ],
          },
        );
    },
  });
}

describe("FieldError", () => {
  it("renders nothing outside a field", () => {
    const wrapper = mount(FieldError, {slots: {default: () => "Invalid"}});

    expect(wrapper.find("[data-slot='field-error']").exists()).toBe(false);
  });

  it("renders a visible span only when the field is invalid", async () => {
    const valid = mount(fieldHost(false, "Invalid"), {attachTo: document.body});
    expect(valid.find("[data-slot='field-error']").exists()).toBe(false);
    valid.unmount();

    const invalid = mount(fieldHost(true, "Enter a valid email."), {
      attachTo: document.body,
    });
    const error = invalid.get("[data-slot='field-error']");

    expect(error.element.tagName).toBe("SPAN");
    expect(error.attributes("data-visible")).toBe("true");
    expect(error.classes()).toContain("field-error");
    expect(error.text()).toBe("Enter a valid email.");
    invalid.unmount();
  });

  it("registers as the field error description", async () => {
    const wrapper = mount(fieldHost(true, "Invalid"), {attachTo: document.body});

    await nextTick();
    await nextTick();

    const input = wrapper.get("input");
    const error = wrapper.get("[data-slot='field-error']");

    expect(input.attributes("aria-describedby")).toContain(error.attributes("id"));

    await wrapper.setProps({});
    wrapper.unmount();
  });

  it("renders no span when invalid without slot content or errors", () => {
    const wrapper = mount(fieldHost(true), {attachTo: document.body});

    expect(wrapper.find("[data-slot='field-error']").exists()).toBe(false);
    wrapper.unmount();
  });
});
