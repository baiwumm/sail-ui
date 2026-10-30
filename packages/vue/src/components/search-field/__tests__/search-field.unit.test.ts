import {mount} from "@vue/test-utils";
import {describe, expect, it} from "vitest";
import {defineComponent, h, nextTick, ref} from "vue";

import SearchField from "../search-field-root.vue";
import SearchFieldClearButton from "../search-field-clear-button.vue";
import SearchFieldGroup from "../search-field-group.vue";
import SearchFieldInput from "../search-field-input.vue";
import SearchFieldSearchIcon from "../search-field-search-icon.vue";

describe("SearchField", () => {
  it("renders the upstream slots", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(SearchField, null, {
              default: () => [
                h(SearchFieldGroup, null, {
                  default: () => [
                    h(SearchFieldSearchIcon),
                    h(SearchFieldInput),
                    h(SearchFieldClearButton),
                  ],
                }),
              ],
            });
        },
      }),
    );

    expect(wrapper.get('[data-slot="search-field"]').classes()).toContain("search-field--primary");
    expect(wrapper.get('[data-slot="search-field-group"]').classes()).toContain(
      "search-field__group",
    );
    expect(wrapper.get('[data-slot="search-field-input"]').classes()).toContain(
      "search-field__input",
    );
    expect(wrapper.get('[data-slot="search-field-search-icon"]').classes()).toContain(
      "search-field__search-icon",
    );
    expect(wrapper.get('[data-slot="search-field-clear-button"]').attributes("slot")).toBe("clear");
  });

  it("clears the value", async () => {
    const value = ref("sail");

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              SearchField,
              {
                modelValue: value.value,
                "onUpdate:modelValue": (next: string) => (value.value = next),
              },
              {
                default: () => [
                  h(SearchFieldGroup, null, {
                    default: () => [h(SearchFieldInput), h(SearchFieldClearButton)],
                  }),
                ],
              },
            );
        },
      }),
      {attachTo: document.body},
    );

    await wrapper.get('[data-slot="search-field-clear-button"]').trigger("click");
    await nextTick();

    expect(value.value).toBe("");
    expect(wrapper.get('[data-slot="search-field"]').attributes("data-empty")).toBe("true");

    wrapper.unmount();
  });

  it("submits the value on Enter", async () => {
    const wrapper = mount(SearchField, {
      attachTo: document.body,
      props: {modelValue: "sail"},
      slots: {
        default: () => h(SearchFieldGroup, null, {default: () => [h(SearchFieldInput)]}),
      },
    });

    await wrapper.get('[data-slot="search-field-input"]').trigger("keydown", {key: "Enter"});
    await nextTick();

    expect(wrapper.emitted("submit")).toHaveLength(1);
    expect(wrapper.emitted("submit")?.[0]?.[0]).toBe("sail");

    wrapper.unmount();
  });

  it("does not submit while an IME composition is active", async () => {
    const wrapper = mount(SearchField, {
      attachTo: document.body,
      props: {modelValue: "sail"},
      slots: {
        default: () => h(SearchFieldGroup, null, {default: () => [h(SearchFieldInput)]}),
      },
    });

    const input = wrapper.get('[data-slot="search-field-input"]');

    await input.trigger("keydown", {key: "Enter", isComposing: true});
    await nextTick();

    expect(wrapper.emitted("submit")).toBeUndefined();

    wrapper.unmount();
  });

  it("reports the hover state of the group", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(SearchField, null, {
              default: () => [h(SearchFieldGroup, null, {default: () => [h(SearchFieldInput)]})],
            });
        },
      }),
      {attachTo: document.body},
    );
    const group = wrapper.get('[data-slot="search-field-group"]');

    group.element.dispatchEvent(
      new PointerEvent("pointerenter", {bubbles: true, pointerType: "mouse", pointerId: 1}),
    );
    await nextTick();

    expect(group.attributes("data-hovered")).toBe("true");

    wrapper.unmount();
  });
});
