import type {AcceptableValue} from "reka-ui";

import {flushPromises, mount} from "@vue/test-utils";
import {defineComponent, ref} from "vue";
import {afterEach, describe, expect, it, vi} from "vitest";

import Description from "../../description/description.vue";
import Label from "../../label/label.vue";
import SelectClearButton from "../select-clear-button.vue";
import SelectIndicator from "../select-indicator.vue";
import SelectItem from "../select-item.vue";
import SelectItemIndicator from "../select-item-indicator.vue";
import SelectListBox from "../select-list-box.vue";
import SelectPopover from "../select-popover.vue";
import Select from "../select-root.vue";
import SelectTrigger from "../select-trigger.vue";
import SelectValue from "../select-value.vue";
import type {SelectModelValue, SelectSelectionMode} from "../types";

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "florida", label: "Florida"},
];

const components = {
  Select,
  SelectClearButton,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
};

interface HostOptions {
  initial?: SelectModelValue;
  selectionMode?: SelectSelectionMode;
  disabledKeys?: AcceptableValue[];
  isDisabled?: boolean;
}

function createHost({
  initial = "california",
  selectionMode = "single",
  disabledKeys = [],
  isDisabled = false,
}: HostOptions = {}) {
  return defineComponent({
    components,
    setup() {
      const value = ref<SelectModelValue | undefined>(initial);

      return {disabledKeys, isDisabled, selectionMode, states, value};
    },
    template: `
      <Select
        v-model="value"
        :disabled-keys="disabledKeys"
        :is-disabled="isDisabled"
        :selection-mode="selectionMode"
        placeholder="Select one"
      >
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
    `,
  });
}

function pointerDown(element: Element, init: PointerEventInit = {}) {
  element.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      pointerId: 1,
      pointerType: "mouse",
      ...init,
    }),
  );
}

function pointerUp(element: Element) {
  element.dispatchEvent(
    new PointerEvent("pointerup", {
      bubbles: true,
      button: 0,
      pointerId: 1,
      pointerType: "mouse",
    }),
  );
}

function keydown(element: Element, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key}));
}

function popover() {
  return document.querySelector<HTMLElement>('[data-slot="select-popover"]');
}

function options() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]'));
}

function option(label: string) {
  return options().find((element) => element.textContent?.includes(label));
}

async function openFrom(trigger: Element) {
  pointerDown(trigger);
  await flushPromises();
  await vi.waitFor(() => {
    expect(popover()).not.toBeNull();
  });
}

async function close() {
  document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));
  await vi.waitFor(() => {
    expect(popover()).toBeNull();
  });
}

function modelOf(wrapper: {vm: unknown}) {
  return (wrapper.vm as unknown as {value: SelectModelValue | undefined}).value;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Select", () => {
  it("renders the closed trigger without popover DOM", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    const trigger = wrapper.get('[data-slot="select-trigger"]');
    const value = wrapper.get('[data-slot="select-value"]');

    expect(trigger.element.tagName).toBe("BUTTON");
    expect(trigger.attributes("role")).toBe("combobox");
    expect(trigger.attributes("aria-haspopup")).toBe("listbox");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(trigger.attributes("aria-autocomplete")).toBeUndefined();
    expect(trigger.attributes("data-open")).toBeUndefined();
    expect(trigger.attributes("data-state")).toBeUndefined();
    expect(trigger.attributes("data-disabled")).toBeUndefined();
    expect(value.text()).toBe("California");
    expect(value.attributes("data-placeholder")).toBeUndefined();
    expect(popover()).toBeNull();
    expect(document.querySelector('[role="listbox"]')).toBeNull();

    wrapper.unmount();
  });

  it("shows the placeholder while empty", async () => {
    const wrapper = mount(createHost({initial: null}), {attachTo: document.body});
    await flushPromises();

    const value = wrapper.get('[data-slot="select-value"]');

    expect(value.text()).toBe("Select one");
    expect(value.attributes("data-placeholder")).toBe("true");

    wrapper.unmount();
  });

  it("opens the popover wrapper around a labelled listbox", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    const trigger = wrapper.get('[data-slot="select-trigger"]');
    const wrapperElement = popover()!;
    const listbox = wrapperElement.querySelector<HTMLElement>('[data-slot="list-box"]');

    expect(trigger.attributes("data-open")).toBe("true");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapperElement.getAttribute("role")).toBeNull();
    expect(wrapperElement.getAttribute("data-state")).toBeNull();
    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(listbox?.getAttribute("aria-multiselectable")).toBeNull();
    expect(trigger.attributes("aria-controls")).toBe(listbox?.id);

    expect(options()).toHaveLength(3);

    const california = option("California")!;
    const texas = option("Texas")!;

    expect(california.getAttribute("aria-selected")).toBe("true");
    expect(california.getAttribute("data-selected")).toBe("true");
    expect(california.getAttribute("data-selection-mode")).toBe("single");
    expect(california.getAttribute("data-state")).toBeNull();
    expect(california.getAttribute("data-highlighted")).toBeNull();
    expect(texas.getAttribute("aria-selected")).toBe("false");
    expect(texas.getAttribute("data-selected")).toBeNull();
    expect(
      california
        .querySelector('[data-slot="list-box-item-indicator"]')
        ?.getAttribute("data-visible"),
    ).toBe("true");
    expect(
      texas.querySelector('[data-slot="list-box-item-indicator"]')?.getAttribute("data-visible"),
    ).toBeNull();

    await close();
    wrapper.unmount();
  });

  it("selects an option with the pointer and closes", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    pointerUp(option("Texas")!);

    await vi.waitFor(() => {
      expect(modelOf(wrapper)).toBe("texas");
      expect(wrapper.get('[data-slot="select-value"]').text()).toBe("Texas");
      expect(popover()).toBeNull();
    });

    wrapper.unmount();
  });

  it("toggles multiple values and keeps the popover open", async () => {
    const wrapper = mount(createHost({initial: [], selectionMode: "multiple"}), {
      attachTo: document.body,
    });
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    const listbox = document.querySelector('[data-slot="list-box"]');

    expect(listbox?.getAttribute("aria-multiselectable")).toBe("true");
    expect(option("California")?.getAttribute("data-selection-mode")).toBe("multiple");

    pointerUp(option("California")!);
    await vi.waitFor(() => {
      expect(modelOf(wrapper)).toEqual(["california"]);
    });

    pointerUp(option("Texas")!);
    await vi.waitFor(() => {
      expect(modelOf(wrapper)).toEqual(["california", "texas"]);
    });

    expect(popover()).not.toBeNull();
    expect(wrapper.get('[data-slot="select-value"]').text()).toBe("California, Texas");

    const clearButton = wrapper.get('[data-slot="select-clear-button"]');
    await clearButton.trigger("pointerdown");
    await clearButton.trigger("click");
    await flushPromises();

    expect(modelOf(wrapper)).toEqual([]);
    expect(wrapper.get('[data-slot="select-value"]').text()).toBe("Select one");
    expect(wrapper.get('[data-slot="select-value"]').attributes("data-placeholder")).toBe("true");

    await close();
    wrapper.unmount();
  });

  it("keeps disabled keys out of reach", async () => {
    const wrapper = mount(createHost({disabledKeys: ["texas"]}), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    const texas = option("Texas")!;

    expect(texas.getAttribute("aria-disabled")).toBe("true");
    expect(texas.getAttribute("data-disabled")).toBe("true");

    pointerUp(texas);
    await flushPromises();

    expect(modelOf(wrapper)).toBe("california");
    expect(popover()).not.toBeNull();

    await close();
    wrapper.unmount();
  });

  it("moves focus with End and selects with Enter", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    keydown(popover()!, "End");

    const florida = option("Florida")!;
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(florida);
    });

    keydown(florida, "Enter");

    await vi.waitFor(() => {
      expect(modelOf(wrapper)).toBe("florida");
      expect(popover()).toBeNull();
    });

    wrapper.unmount();
  });

  it("closes on Escape without changing the value", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    document.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));

    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });
    expect(modelOf(wrapper)).toBe("california");

    wrapper.unmount();
  });

  it("clears with the clear button", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    const clearButton = wrapper.get('[data-slot="select-clear-button"]');
    await clearButton.trigger("pointerdown");
    await clearButton.trigger("click");
    await flushPromises();

    expect(modelOf(wrapper)).toBeUndefined();
    expect(wrapper.get('[data-slot="select-value"]').attributes("data-placeholder")).toBe("true");

    wrapper.unmount();
  });

  it("clears with Backspace when the popover is closed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    keydown(wrapper.get('[data-slot="select-trigger"]').element, "Backspace");
    await flushPromises();

    expect(modelOf(wrapper)).toBeUndefined();

    wrapper.unmount();
  });

  it("waits for the parent to accept a controlled value", async () => {
    const Host = defineComponent({
      components,
      setup() {
        const value = ref<SelectModelValue>("california");
        const updates = ref<SelectModelValue[]>([]);

        function onUpdate(next: SelectModelValue) {
          updates.value.push(next);
        }

        return {onUpdate, states, updates, value};
      },
      template: `
        <Select :model-value="value" placeholder="Select one" @update:model-value="onUpdate">
          <SelectTrigger aria-label="State">
            <SelectValue />
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
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>
      `,
    });
    const wrapper = mount(Host, {attachTo: document.body});

    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    pointerUp(option("Texas")!);

    await vi.waitFor(() => {
      expect((wrapper.vm as unknown as {updates: SelectModelValue[]}).updates).toContain("texas");
    });
    await vi.waitFor(() => {
      expect(wrapper.get('[data-slot="select-value"]').text()).toBe("California");
    });

    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);
    expect(option("California")?.getAttribute("aria-selected")).toBe("true");

    await close();
    wrapper.unmount();
  });

  it("links item Label and Description to the option", async () => {
    const Host = defineComponent({
      components: {...components, Description, Label},
      setup() {
        return {states};
      },
      template: `
        <Select placeholder="Select one">
          <SelectTrigger aria-label="State">
            <SelectValue />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem
                v-for="item in states"
                :key="item.id"
                :text-value="item.label"
                :value="item.id"
              >
                <Label>{{ item.label }}</Label>
                <Description>Description for {{ item.label }}</Description>
                <SelectItemIndicator />
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>
      `,
    });
    const wrapper = mount(Host, {attachTo: document.body});

    await flushPromises();
    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);

    const california = option("California")!;
    const label = california.querySelector<HTMLElement>('[data-slot="label"]');
    const description = california.querySelector<HTMLElement>('[data-slot="description"]');

    expect(label?.tagName).toBe("SPAN");
    expect(label?.id).toBeTruthy();
    expect(description?.id).toBeTruthy();
    expect(california.getAttribute("aria-labelledby")).toBe(label?.id);
    expect(california.getAttribute("aria-describedby")).toBe(description?.id);

    await close();
    wrapper.unmount();
  });

  it("labels the trigger and listbox from the root Label", async () => {
    const Host = defineComponent({
      components: {...components, Label},
      setup() {
        const value = ref<SelectModelValue | undefined>("california");

        return {states, value};
      },
      template: `
        <Select v-model="value" placeholder="Select one">
          <Label>State</Label>
          <SelectTrigger>
            <SelectValue />
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
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>
      `,
    });
    const wrapper = mount(Host, {attachTo: document.body});

    await flushPromises();

    const label = wrapper.get('[data-slot="label"]');
    const trigger = wrapper.get('[data-slot="select-trigger"]');

    expect(label.element.tagName).toBe("LABEL");
    expect(trigger.attributes("aria-labelledby")).toBe(label.attributes("id"));

    await openFrom(trigger.element);

    expect(document.querySelector('[data-slot="list-box"]')?.getAttribute("aria-labelledby")).toBe(
      label.attributes("id"),
    );

    await close();
    wrapper.unmount();
  });

  it("disables the trigger while the whole select is disabled", async () => {
    const wrapper = mount(createHost({isDisabled: true}), {attachTo: document.body});
    await flushPromises();

    const trigger = wrapper.get('[data-slot="select-trigger"]');

    expect(trigger.attributes("disabled")).toBeDefined();
    expect(trigger.attributes("data-disabled")).toBe("true");

    pointerDown(trigger.element);
    await flushPromises();

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(popover()).toBeNull();

    wrapper.unmount();
  });

  it("compares object values with by", async () => {
    const objectStates = [
      {code: "ca", label: "California"},
      {code: "tx", label: "Texas"},
    ];
    const Host = defineComponent({
      components,
      setup() {
        const value = ref<SelectModelValue | undefined>(objectStates[0]);

        return {objectStates, value};
      },
      template: `
        <Select v-model="value" by="code" placeholder="Select one">
          <SelectTrigger aria-label="State">
            <SelectValue />
          </SelectTrigger>
          <SelectPopover>
            <SelectListBox>
              <SelectItem
                v-for="item in objectStates"
                :key="item.code"
                :text-value="item.label"
                :value="item"
              >
                {{ item.label }}
              </SelectItem>
            </SelectListBox>
          </SelectPopover>
        </Select>
      `,
    });
    const wrapper = mount(Host, {attachTo: document.body});

    await flushPromises();
    expect(wrapper.get('[data-slot="select-value"]').text()).toBe("California");

    await openFrom(wrapper.get('[data-slot="select-trigger"]').element);
    expect(option("California")?.getAttribute("aria-selected")).toBe("true");

    pointerUp(option("Texas")!);

    await vi.waitFor(() => {
      expect((wrapper.vm as unknown as {value?: {code?: string}}).value?.code).toBe("tx");
      expect(wrapper.get('[data-slot="select-value"]').text()).toBe("Texas");
      expect(popover()).toBeNull();
    });

    wrapper.unmount();
  });
});
