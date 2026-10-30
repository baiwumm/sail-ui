import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick} from "vue";

import InputGroup from "../input-group-root.vue";
import InputGroupInput from "../input-group-input.vue";
import InputGroupPrefix from "../input-group-prefix.vue";
import InputGroupSuffix from "../input-group-suffix.vue";
import InputGroupTextArea from "../input-group-text-area.vue";

describe("InputGroup", () => {
  it("renders the upstream slots", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(InputGroup, null, {
              default: () => [
                h(InputGroupPrefix, null, {default: () => "@"}),
                h(InputGroupInput),
                h(InputGroupTextArea),
                h(InputGroupSuffix, null, {default: () => ".com"}),
              ],
            });
        },
      }),
    );

    expect(wrapper.get('[data-slot="input-group"]').classes()).toContain("input-group--primary");
    expect(wrapper.get('[data-slot="input-group-input"]').classes()).toContain(
      "input-group__input",
    );
    expect(wrapper.get('[data-slot="input-group-textarea"]').classes()).toContain(
      "input-group__input",
    );
    expect(wrapper.get('[data-slot="input-group-prefix"]').classes()).toContain(
      "input-group__prefix",
    );
    expect(wrapper.get('[data-slot="input-group-suffix"]').classes()).toContain(
      "input-group__suffix",
    );
  });

  it("focuses the control when the shell is clicked", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(InputGroup, null, {
              default: () => [h(InputGroupPrefix, null, {default: () => "@"}), h(InputGroupInput)],
            });
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get('[data-slot="input-group-prefix"]').trigger("click");
    await nextTick();

    expect(document.activeElement).toBe(wrapper.get("input").element);

    wrapper.unmount();
  });

  it("reports the focus within state", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(InputGroup, null, {default: () => [h(InputGroupInput)]});
        },
      }),
      {attachTo: document.body},
    );
    const group = wrapper.get('[data-slot="input-group"]');

    (wrapper.get("input").element as HTMLElement).focus();
    await nextTick();

    expect(group.attributes("data-focus-within")).toBe("true");

    wrapper.unmount();
  });

  it("disables the control of the group", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(InputGroup, {isDisabled: true}, {default: () => [h(InputGroupInput)]});
        },
      }),
    );

    expect(wrapper.get('[data-slot="input-group"]').attributes("data-disabled")).toBe("true");
    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
  });
});
