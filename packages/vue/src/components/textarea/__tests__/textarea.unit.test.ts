import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import Textarea from "../textarea-root.vue";

describe("Textarea", () => {
  it("renders the upstream slot and variant classes", () => {
    const wrapper = mount(Textarea, {props: {variant: "secondary"}});
    const textarea = wrapper.get('[data-slot="textarea"]');

    expect(textarea.classes()).toContain("textarea");
    expect(textarea.classes()).toContain("textarea--secondary");
  });

  it("updates the value on input", async () => {
    const value = ref("");

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Textarea, {
              modelValue: value.value,
              "onUpdate:modelValue": (next: string | undefined) => (value.value = next ?? ""),
            });
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get("textarea").setValue("Hello");
    await nextTick();

    expect(value.value).toBe("Hello");

    wrapper.unmount();
  });

  it("grows with the content when auto resize is enabled", async () => {
    const wrapper = mount(Textarea, {
      attachTo: document.body,
      props: {autoResize: true},
    });
    const textarea = wrapper.get("textarea").element as HTMLTextAreaElement;

    Object.defineProperty(textarea, "scrollHeight", {value: 120, configurable: true});

    await wrapper.get("textarea").setValue("Hello");
    await nextTick();

    expect(textarea.style.height).toBe("120px");

    wrapper.unmount();
  });

  it("keeps the native disabled state", () => {
    const wrapper = mount(Textarea, {props: {isDisabled: true}});

    expect(wrapper.get("textarea").attributes("disabled")).toBeDefined();
    expect(wrapper.get('[data-slot="textarea"]').attributes("data-disabled")).toBe("true");
  });
});
