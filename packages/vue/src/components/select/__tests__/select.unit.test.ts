import type {AcceptableValue} from "reka-ui";

import {flushPromises, mount} from "@vue/test-utils";
import {defineComponent, ref} from "vue";
import {afterEach, describe, expect, it, vi} from "vitest";

import SelectClearButton from "../select-clear-button.vue";
import SelectIndicator from "../select-indicator.vue";
import SelectItem from "../select-item.vue";
import SelectItemIndicator from "../select-item-indicator.vue";
import SelectListBox from "../select-list-box.vue";
import SelectPopover from "../select-popover.vue";
import Select from "../select-root.vue";
import SelectTrigger from "../select-trigger.vue";
import SelectValue from "../select-value.vue";

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "florida", label: "Florida"}
];

function createHost(initial: AcceptableValue = "california") {
  return defineComponent({
    components: {
      Select,
      SelectClearButton,
      SelectIndicator,
      SelectItem,
      SelectItemIndicator,
      SelectListBox,
      SelectPopover,
      SelectTrigger,
      SelectValue
    },
    setup() {
      const value = ref<AcceptableValue | undefined>(initial);

      return {states, value};
    },
    template: `
      <Select v-model="value" placeholder="Select one">
        <SelectTrigger aria-label="State">
          <SelectValue />
          <SelectClearButton />
          <SelectIndicator />
        </SelectTrigger>
        <SelectPopover>
          <SelectListBox>
            <SelectItem
              v-for="item in states"
              :key="item.id"
              :text-value="item.label"
              :value="item.id"
            >
              {{ item.label }}
              <SelectItemIndicator />
            </SelectItem>
          </SelectListBox>
        </SelectPopover>
      </Select>
      <output data-testid="value">{{ value ?? "none" }}</output>
    `
  });
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Select", () => {
  it("renders trigger/value and keeps the popover out of the document while closed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    const trigger = wrapper.get('[data-slot="select-trigger"]');
    const value = wrapper.get('[data-slot="select-value"]');

    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("data-open")).toBeUndefined();
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(value.text()).toBe("California");
    expect(value.attributes("data-placeholder")).toBeUndefined();
    expect(document.querySelector('[data-slot="select-popover"]')).toBeNull();

    wrapper.unmount();
  });

  it("shows a placeholder and clears the value", async () => {
    const wrapper = mount(createHost(null), {attachTo: document.body});
    await flushPromises();

    expect(wrapper.get('[data-slot="select-value"]').text()).toBe("Select one");
    expect(wrapper.get('[data-slot="select-value"]').attributes("data-placeholder")).toBe("true");

    wrapper.unmount();
  });

  it("opens, marks the selected option, and updates the model", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    wrapper.get('[data-slot="select-trigger"]').element.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, button: 0, pointerId: 1, pointerType: "mouse"})
    );
    await flushPromises();

    expect(wrapper.get('[data-slot="select-trigger"]').attributes("data-open")).toBe("true");

    const listbox = document.querySelector<HTMLElement>('[data-slot="select-popover"]');
    const options = Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
    const california = options.find((option) => option.textContent?.includes("California"));
    const texas = options.find((option) => option.textContent?.includes("Texas"));

    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(california?.getAttribute("aria-selected")).toBe("true");
    expect(california?.getAttribute("data-selected")).toBe("true");
    expect(texas?.getAttribute("data-selected")).toBeNull();

    texas?.dispatchEvent(new PointerEvent("pointerup", {bubbles: true}));
    await flushPromises();

    // The exit hold waits for real frames and CSS animations, so poll instead of
    // assuming a fixed delay under load.
    await vi.waitFor(() => {
      expect((wrapper.vm as unknown as {value: string}).value).toBe("texas");
      expect(wrapper.get('[data-slot="select-value"]').text()).toBe("Texas");
      expect(document.querySelector('[data-slot="select-popover"]')).toBeNull();
    });

    wrapper.unmount();
  });

  it("clears with the clear button", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    await wrapper.get('[data-slot="select-clear-button"]').trigger("pointerdown");
    await wrapper.get('[data-slot="select-clear-button"]').trigger("click");
    await flushPromises();

    expect((wrapper.vm as unknown as {value: string | undefined}).value).toBeUndefined();
    expect(wrapper.get('[data-slot="select-value"]').attributes("data-placeholder")).toBe("true");

    wrapper.unmount();
  });
});
