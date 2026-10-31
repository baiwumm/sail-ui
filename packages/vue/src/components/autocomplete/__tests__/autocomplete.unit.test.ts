import {flushPromises, mount, type VueWrapper} from "@vue/test-utils";
import {defineComponent, ref} from "vue";
import {afterEach, describe, expect, it, vi} from "vitest";

import EmptyState from "../../empty-state/empty-state.vue";
import Label from "../../label/label.vue";
import ListBox from "../../list-box/list-box-root.vue";
import ListBoxItem from "../../list-box-item/list-box-item.vue";
import ListBoxItemIndicator from "../../list-box-item/list-box-item-indicator.vue";
import SearchField from "../../search-field/search-field-root.vue";
import SearchFieldGroup from "../../search-field/search-field-group.vue";
import SearchFieldInput from "../../search-field/search-field-input.vue";
import AutocompleteRoot from "../autocomplete-root.vue";
import AutocompleteClearButton from "../autocomplete-clear-button.vue";
import AutocompleteFilter from "../autocomplete-filter.vue";
import AutocompleteIndicator from "../autocomplete-indicator.vue";
import AutocompletePopover from "../autocomplete-popover.vue";
import AutocompleteTrigger from "../autocomplete-trigger.vue";
import AutocompleteValue from "../autocomplete-value.vue";
import type {ComboBoxKey, ComboBoxModelValue} from "../../../shared/combobox-context";

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "florida", label: "Florida"},
];

const components = {
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  AutocompleteClearButton,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteFilter,
  EmptyState,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemIndicator,
  SearchField,
  SearchFieldGroup,
  SearchFieldInput,
};

function createHost({
  initial = "california" as ComboBoxKey | undefined,
  displayValue,
  onClear,
}: {
  initial?: ComboBoxKey | undefined;
  displayValue?: (value: ComboBoxKey) => string | undefined;
  onClear?: () => void;
} = {}) {
  return defineComponent({
    components,
    setup() {
      const value = ref<ComboBoxModelValue>(initial);
      const changes: ComboBoxModelValue[] = [];

      return {
        changes,
        displayValue,
        states,
        value,
        onChange: (next: ComboBoxModelValue) => changes.push(next),
        onClear: onClear ?? (() => {}),
      };
    },
    template: `
      <AutocompleteRoot
        :display-value="displayValue"
        :model-value="value"
        :on-clear="onClear"
        @selection-change="onChange"
        @update:model-value="value = $event"
      >
        <Label>State</Label>
        <AutocompleteTrigger aria-label="State">
          <AutocompleteValue />
          <AutocompleteClearButton />
          <AutocompleteIndicator />
        </AutocompleteTrigger>
        <AutocompletePopover>
          <AutocompleteFilter>
            <SearchField aria-label="Search states">
              <SearchFieldGroup>
                <SearchFieldInput placeholder="Search..." />
              </SearchFieldGroup>
            </SearchField>
            <ListBox>
              <ListBoxItem
                v-for="state in states"
                :key="state.id"
                :text-value="state.label"
                :value="state.id"
              >
                {{ state.label }}
                <ListBoxItemIndicator />
              </ListBoxItem>
              <template #empty>
                <EmptyState>No results found</EmptyState>
              </template>
            </ListBox>
          </AutocompleteFilter>
        </AutocompletePopover>
      </AutocompleteRoot>
      <output data-testid="value">{{ value ?? "none" }}</output>
    `,
  });
}

function popover() {
  return document.querySelector<HTMLElement>('[data-slot="autocomplete-popover"]');
}

function searchInput() {
  return document.querySelector<HTMLInputElement>('[data-slot="search-field-input"]');
}

function options() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]'));
}

function trigger(wrapper: VueWrapper) {
  return wrapper.get('[data-slot="autocomplete-trigger"]');
}

async function openFrom(wrapper: VueWrapper) {
  (trigger(wrapper).element as HTMLElement).click();
  await flushPromises();
  await vi.waitFor(() => {
    expect(popover()).not.toBeNull();
  });
  await flushPromises();
}

async function typeSearch(value: string) {
  const input = searchInput()!;

  input.value = value;
  input.dispatchEvent(new Event("input", {bubbles: true}));
  await flushPromises();
}

async function pressEnter() {
  searchInput()!.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Enter"}));
  await flushPromises();
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("Autocomplete", () => {
  it("renders the labelled trigger and placeholder without popover DOM", async () => {
    const wrapper = mount(createHost({initial: undefined}), {attachTo: document.body});
    await flushPromises();

    const triggerElement = trigger(wrapper);
    const value = wrapper.get('[data-slot="autocomplete-value"]');

    expect(triggerElement.attributes("role")).toBe("group");
    expect(triggerElement.attributes("aria-haspopup")).toBe("listbox");
    expect(triggerElement.attributes("aria-expanded")).toBe("false");
    expect(triggerElement.attributes("data-hovered")).toBeUndefined();
    expect(value.text()).toBe("");
    expect(value.attributes("data-placeholder")).toBe("true");
    expect(popover()).toBeNull();

    wrapper.unmount();
  });

  it("uses displayValue for the label before the options mount", async () => {
    const wrapper = mount(
      createHost({
        displayValue: (key) => states.find((state) => state.id === key)?.label,
      }),
      {attachTo: document.body},
    );
    await flushPromises();

    expect(wrapper.get('[data-slot="autocomplete-value"]').text()).toBe("California");

    wrapper.unmount();
  });

  it("opens a searchable listbox and focuses the search input", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper);

    const triggerElement = trigger(wrapper);
    const listbox = popover()?.querySelector<HTMLElement>('[data-slot="list-box"]');
    const input = searchInput();

    expect(triggerElement.attributes("aria-expanded")).toBe("true");
    expect(triggerElement.attributes("aria-controls")).toBe(popover()?.id);
    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(options()).toHaveLength(3);
    expect(input?.getAttribute("role")).toBe("combobox");
    expect(input?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(input);

    wrapper.unmount();
  });

  it("filters the list from the search field and shows the empty state", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper);

    await typeSearch("flor");
    expect(options().map((element) => element.textContent?.trim())).toEqual(["Florida"]);

    await typeSearch("zzz");
    expect(options()).toHaveLength(0);
    expect(document.querySelector('[data-slot="empty-state"]')?.textContent).toContain(
      "No results found",
    );

    wrapper.unmount();
  });

  it("selects the highlighted option with the keyboard and restores the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper);

    await typeSearch("tex");
    await pressEnter();
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });

    const changes = (wrapper.vm as unknown as {changes: ComboBoxModelValue[]}).changes;

    expect(changes.at(-1)).toBe("texas");
    expect(wrapper.get('[data-testid="value"]').text()).toBe("texas");
    expect(wrapper.get('[data-slot="autocomplete-value"]').text()).toBe("Texas");

    wrapper.unmount();
  });

  it("clears the selection from the clear button", async () => {
    const onClear = vi.fn();
    const wrapper = mount(createHost({onClear}), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper);

    await wrapper.get('[data-slot="autocomplete-clear-button"]').trigger("click");
    await flushPromises();

    expect(onClear).toHaveBeenCalledOnce();
    expect(wrapper.get('[data-testid="value"]').text()).toBe("none");
    expect(wrapper.get('[data-slot="autocomplete-value"]').text()).toBe("");
    expect(wrapper.get('[data-slot="autocomplete-clear-button"]').attributes("data-empty")).toBe(
      "true",
    );
    expect(wrapper.get('[data-slot="autocomplete-clear-button"]').attributes("aria-hidden")).toBe(
      "true",
    );

    wrapper.unmount();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const wrapper = mount(createHost(), {attachTo: document.body});
    await flushPromises();
    await openFrom(wrapper);

    window.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, key: "Escape"}));
    await vi.waitFor(() => {
      expect(popover()).toBeNull();
    });
    await flushPromises();

    expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");

    wrapper.unmount();
  });
});
