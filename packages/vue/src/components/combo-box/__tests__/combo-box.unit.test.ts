import {flushPromises, mount, type VueWrapper} from "@vue/test-utils";
import {defineComponent, nextTick, ref} from "vue";
import {afterEach, describe, expect, it, vi} from "vitest";

import EmptyState from "../../empty-state/empty-state.vue";
import Label from "../../label/label.vue";
import ListBox from "../../list-box/list-box-root.vue";
import ListBoxItem from "../../list-box-item/list-box-item.vue";
import ListBoxItemIndicator from "../../list-box-item/list-box-item-indicator.vue";
import ComboBoxRoot from "../combo-box-root.vue";
import ComboBoxInputGroup from "../combo-box-input-group.vue";
import ComboBoxPopover from "../combo-box-popover.vue";
import ComboBoxTrigger from "../combo-box-trigger.vue";
import Input from "../../input/input.vue";
import type {ComboBoxModelValue} from "../../../shared/combobox-context";

const fruits = [
  {id: "apple", label: "Apple"},
  {id: "banana", label: "Banana"},
  {id: "cherry", label: "Cherry"},
];

const components = {
  ComboBoxRoot,
  ComboBoxInputGroup,
  ComboBoxTrigger,
  ComboBoxPopover,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemIndicator,
  EmptyState,
};

function createHost({
  initial = "apple" as ComboBoxModelValue,
  allowsCustomValue = false,
  controlled = false,
} = {}) {
  return defineComponent({
    components,
    setup() {
      const value = ref<ComboBoxModelValue>(initial);
      const changes: ComboBoxModelValue[] = [];

      return {
        allowsCustomValue,
        changes,
        controlled,
        fruits,
        value,
        onChange: (next: ComboBoxModelValue) => changes.push(next),
        reject: () => {},
      };
    },
    template: `
      <ComboBoxRoot
        :allows-custom-value="allowsCustomValue"
        :model-value="value"
        @selection-change="onChange"
        @update:model-value="controlled ? reject() : (value = $event)"
      >
        <Label>Fruit</Label>
        <ComboBoxInputGroup>
          <Input placeholder="Pick a fruit" />
          <ComboBoxTrigger aria-label="Show fruits" />
        </ComboBoxInputGroup>
        <ComboBoxPopover>
          <ListBox>
            <ListBoxItem
              v-for="fruit in fruits"
              :key="fruit.id"
              :text-value="fruit.label"
              :value="fruit.id"
            >
              {{ fruit.label }}
              <ListBoxItemIndicator />
            </ListBoxItem>
            <template #empty>
              <EmptyState>No results found</EmptyState>
            </template>
          </ListBox>
        </ComboBoxPopover>
      </ComboBoxRoot>
      <output data-testid="value">{{ value ?? "none" }}</output>
    `,
  });
}

function popover() {
  return document.querySelector<HTMLElement>('[data-slot="combo-box-popover"]');
}

function options() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]'));
}

function option(label: string) {
  return options().find((element) => element.textContent?.includes(label));
}

function input(wrapper: VueWrapper) {
  return wrapper.get('[data-slot="input"]');
}

async function openFrom(trigger: Element) {
  (trigger as HTMLElement).click();
  await flushPromises();
  await vi.waitFor(() => {
    expect(popover()).not.toBeNull();
  });
  await flushPromises();
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("ComboBox", () => {
  it("renders the labelled closed input without popover DOM", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();

    const field = wrapper.get('[data-slot="combo-box"]');
    const trigger = wrapper.get('[data-slot="combo-box-trigger"]');
    const label = wrapper.get('[data-slot="label"]');

    expect(field.classes()).toContain("combo-box");
    expect(label.text()).toBe("Fruit");
    expect(label.attributes("for")).toBe(input(wrapper).attributes("id"));
    expect(input(wrapper).attributes("role")).toBe("combobox");
    expect(input(wrapper).attributes("aria-expanded")).toBe("false");
    expect(input(wrapper).attributes("autocomplete")).toBe("off");
    expect(trigger.attributes("aria-haspopup")).toBe("listbox");
    expect(trigger.attributes("data-state")).toBeUndefined();
    expect(trigger.attributes("data-open")).toBeUndefined();
    expect(popover()).toBeNull();

    wrapper.unmount();
  });

  it("opens the popover from the trigger and highlights the selected value", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    const trigger = wrapper.get('[data-slot="combo-box-trigger"]');
    const wrapperElement = popover()!;
    const listbox = wrapperElement.querySelector<HTMLElement>('[data-slot="list-box"]');

    expect(trigger.attributes("data-open")).toBe("true");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapperElement.getAttribute("role")).toBeNull();
    expect(wrapperElement.getAttribute("data-state")).toBeNull();
    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(input(wrapper).attributes("aria-controls")).toBe(wrapperElement.id);
    expect(options()).toHaveLength(3);
    expect(option("Apple")?.getAttribute("data-selected")).toBe("true");
    await vi.waitFor(() => {
      expect(option("Apple")?.getAttribute("data-focused")).toBe("true");
    });

    wrapper.unmount();
  });

  it("filters the options from the input and renders the empty state", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    await input(wrapper).setValue("ban");
    await flushPromises();

    expect(options().map((element) => element.textContent?.trim())).toEqual(["Banana"]);
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();

    await input(wrapper).setValue("zzz");
    await flushPromises();

    expect(options()).toHaveLength(0);
    expect(document.querySelector('[data-slot="empty-state"]')?.textContent).toContain(
      "No results found",
    );

    wrapper.unmount();
  });

  it("moves the highlight with the keyboard and selects with Enter", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    await input(wrapper).trigger("keydown", {key: "ArrowDown"});
    await flushPromises();

    await vi.waitFor(() => {
      expect(option("Banana")?.getAttribute("data-focused")).toBe("true");
    });

    await input(wrapper).trigger("keydown", {key: "Enter"});
    await flushPromises();
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });

    const changes = (wrapper.vm as unknown as {changes: ComboBoxModelValue[]}).changes;

    expect(changes.at(-1)).toBe("banana");
    expect(input(wrapper).element).toHaveProperty("value", "Banana");
    expect(wrapper.get('[data-testid="value"]').text()).toBe("banana");

    wrapper.unmount();
  });

  it("commits a typed value when allowsCustomValue is set", async () => {
    const wrapper = mount(createHost({initial: undefined, allowsCustomValue: true}), {
      attachTo: document.body,
    });
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    await input(wrapper).setValue("Dragonfruit");
    await flushPromises();
    await input(wrapper).trigger("keydown", {key: "Enter"});
    await flushPromises();
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });

    const changes = (wrapper.vm as unknown as {changes: ComboBoxModelValue[]}).changes;

    expect(changes.at(-1)).toBe("Dragonfruit");
    expect(input(wrapper).element).toHaveProperty("value", "Dragonfruit");
    expect(wrapper.get('[data-testid="value"]').text()).toBe("Dragonfruit");

    wrapper.unmount();
  });

  it("restores the selected label when a typed value is not allowed", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    await input(wrapper).setValue("Dragonfruit");
    await flushPromises();
    await input(wrapper).trigger("keydown", {key: "Enter"});
    await flushPromises();

    expect(popover()).not.toBeNull();

    window.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });
    await vi.waitFor(() => {
      expect(input(wrapper).element).toHaveProperty("value", "Apple");
    });

    wrapper.unmount();
  });

  it("waits for a controlled host to accept the selection", async () => {
    const wrapper = mount(createHost({controlled: true}), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    const changes = (wrapper.vm as unknown as {changes: ComboBoxModelValue[]}).changes;

    await option("Banana")!.click();
    await flushPromises();

    expect(changes.at(-1)).toBe("banana");
    expect(wrapper.get('[data-testid="value"]').text()).toBe("apple");
    // Reka resets the input text one tick after the popover closes.
    await vi.waitFor(() => {
      expect(input(wrapper).element).toHaveProperty("value", "Apple");
    });

    (wrapper.vm as unknown as {value: ComboBoxModelValue}).value = "banana";
    await nextTick();
    await flushPromises();
    await vi.waitFor(() => {
      expect(input(wrapper).element).toHaveProperty("value", "Banana");
    });

    wrapper.unmount();
  });

  it("renders async results unfiltered under a controlled input value", async () => {
    const AsyncHost = defineComponent({
      components,
      setup() {
        const value = ref<ComboBoxModelValue>(undefined);
        const query = ref("");
        const items = ref<typeof fruits>([]);
        const changes: ComboBoxModelValue[] = [];

        return {
          changes,
          items,
          query,
          resolve: () => {
            items.value = [{id: "dragonfruit", label: "Dragonfruit"}];
          },
          value,
          displayValue: (key: unknown) => items.value.find((fruit) => fruit.id === key)?.label,
          onChange: (next: ComboBoxModelValue) => changes.push(next),
        };
      },
      template: `
        <ComboBoxRoot
          ignore-filter
          :input-value="query"
          :model-value="value"
          :display-value="displayValue"
          @selection-change="onChange"
          @update:input-value="query = $event"
          @update:model-value="value = $event"
        >
          <ComboBoxInputGroup>
            <Input placeholder="Search fruit" />
            <ComboBoxTrigger aria-label="Show fruits" />
          </ComboBoxInputGroup>
          <ComboBoxPopover>
            <ListBox>
              <ListBoxItem
                v-for="fruit in items"
                :key="fruit.id"
                :text-value="fruit.label"
                :value="fruit.id"
              >
                {{ fruit.label }}
                <ListBoxItemIndicator />
              </ListBoxItem>
              <template #empty>
                <EmptyState>Searching...</EmptyState>
              </template>
            </ListBox>
          </ComboBoxPopover>
        </ComboBoxRoot>
        <output data-testid="value">{{ value ?? "none" }}</output>
      `,
    });

    const wrapper = mount(AsyncHost, {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper.get('[data-slot="combo-box-trigger"]').element);

    await input(wrapper).setValue("zz");
    await flushPromises();

    // No results until the host answers; Reka's built-in filter is skipped.
    expect(options()).toHaveLength(0);
    expect(document.querySelector('[data-slot="empty-state"]')?.textContent).toContain(
      "Searching...",
    );

    (wrapper.vm as unknown as {resolve: () => void}).resolve();
    await flushPromises();

    expect(options().map((element) => element.textContent?.trim())).toEqual(["Dragonfruit"]);
    expect(document.querySelector('[data-slot="empty-state"]')).toBeNull();

    await option("Dragonfruit")!.click();
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });

    const changes = (wrapper.vm as unknown as {changes: ComboBoxModelValue[]}).changes;

    expect(changes.at(-1)).toBe("dragonfruit");
    expect(wrapper.get('[data-testid="value"]').text()).toBe("dragonfruit");
    await vi.waitFor(() => {
      expect(input(wrapper).element).toHaveProperty("value", "Dragonfruit");
    });

    wrapper.unmount();
  });
});
