import {readFileSync} from "node:fs";
import {join} from "node:path";

import {flushPromises, mount} from "@vue/test-utils";
import {afterEach, describe, expect, it} from "vitest";
import {defineComponent} from "vue";

import {dataSlots, renderSSR} from "@sail-ui/testing";

import {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
} from "../components/autocomplete";
import {
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger,
  ComboBoxValue,
} from "../components/combo-box";
import {EmptyState} from "../components/empty-state";
import {Input} from "../components/input";
import {Label} from "../components/label";
import {ListBox} from "../components/list-box";
import {ListBoxItem, ListBoxItemIndicator} from "../components/list-box-item";
import {SearchField, SearchFieldGroup, SearchFieldInput} from "../components/search-field";

const stylesRoot = join(process.cwd(), "packages", "styles");
const slotSnapshot = JSON.parse(
  readFileSync(join(stylesRoot, "contracts", "data-slots.json"), "utf8"),
) as {components: Record<string, string[]>};

const uniqueSorted = (slots: string[]) => [...new Set(slots)].sort();

function expectUpstreamSlots(html: string, components: string[], extras: string[] = []) {
  const expected = [
    ...components.flatMap((component) => slotSnapshot.components[component] ?? []),
    ...extras,
  ];

  expect(uniqueSorted(dataSlots(html))).toEqual(uniqueSorted(expected));
}

const fruits = [
  {id: "apple", label: "Apple"},
  {id: "banana", label: "Banana"},
  {id: "cherry", label: "Cherry"},
];

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
  {id: "florida", label: "Florida"},
];

const comboBoxParts = {
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger,
  ComboBoxValue,
  EmptyState,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemIndicator,
};

const autocompleteParts = {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  EmptyState,
  Label,
  ListBox,
  ListBoxItem,
  ListBoxItemIndicator,
  SearchField,
  SearchFieldGroup,
  SearchFieldInput,
};

const ComboBoxPage = defineComponent({
  components: comboBoxParts,
  props: {open: {type: Boolean, default: false}},
  setup: () => ({fruits, value: "apple"}),
  template: `
    <ComboBoxRoot :default-open="open" :model-value="value">
      <Label>Fruit</Label>
      <ComboBoxInputGroup>
        <Input placeholder="Pick a fruit" />
        <ComboBoxTrigger />
      </ComboBoxInputGroup>
      <ComboBoxValue />
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
  `,
});

const AutocompletePage = defineComponent({
  components: autocompleteParts,
  props: {open: {type: Boolean, default: false}},
  setup: () => ({states, value: "california"}),
  template: `
    <AutocompleteRoot :default-open="open" :model-value="value">
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
  `,
});

const popoverOf = (slot: string) => document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
const itemsOf = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-slot="list-box-item"]'));

async function mountPage(page: ReturnType<typeof defineComponent>) {
  const wrapper = mount(page, {attachTo: document.body, props: {open: true}});

  await flushPromises();
  await Promise.resolve();
  await flushPromises();

  return wrapper;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("T07 combo-box/autocomplete contract", () => {
  it("renders only upstream slots on the server and omits closed overlays", async () => {
    const comboHtml = await renderSSR(ComboBoxPage);

    const closedComboBoxSlots = (slotSnapshot.components["combo-box"] ?? []).filter(
      (slot) => slot !== "combo-box-popover",
    );

    expectUpstreamSlots(comboHtml, [], [...closedComboBoxSlots, "label", "input"]);
    expect(comboHtml).not.toContain('data-slot="combo-box-popover"');
    expect(comboHtml).toContain('placeholder="Pick a fruit"');
    expect(comboHtml).toContain('aria-expanded="false"');

    const autocompleteHtml = await renderSSR(AutocompletePage);

    const closedAutocompleteSlots = [
      "autocomplete",
      "autocomplete-trigger",
      "autocomplete-value",
      "autocomplete-clear-button",
      "autocomplete-clear-button-icon",
      "autocomplete-default-indicator",
    ];

    for (const slot of closedAutocompleteSlots) {
      expect(slotSnapshot.components.autocomplete).toContain(slot);
    }

    expect(uniqueSorted(dataSlots(autocompleteHtml))).toEqual(
      uniqueSorted([...closedAutocompleteSlots, "label"]),
    );
    expect(autocompleteHtml).not.toContain('data-slot="autocomplete-popover"');
    expect(autocompleteHtml).not.toContain('data-slot="autocomplete-filter"');
    expect(autocompleteHtml).toContain('aria-haspopup="listbox"');
    expect(autocompleteHtml).toContain('aria-expanded="false"');
  });

  it("keeps the ComboBox popover and listbox vocabulary", async () => {
    const wrapper = await mountPage(ComboBoxPage);

    const popover = popoverOf("combo-box-popover");
    const trigger = popoverOf("combo-box-trigger");
    const input = popoverOf("input");
    const listbox = popover.querySelector<HTMLElement>('[data-slot="list-box"]');

    expect(popover.classList.contains("combo-box__popover")).toBe(true);
    expect(popover.getAttribute("role")).toBeNull();
    expect(popover.hasAttribute("data-state")).toBe(false);
    expect(popover.hasAttribute("data-empty")).toBe(false);
    expect(popover.getAttribute("aria-multiselectable")).toBeNull();
    expect(popover.getAttribute("aria-orientation")).toBeNull();
    expect(popover.getAttribute("tabindex")).toBeNull();
    expect(popover.getAttribute("data-side")).not.toBeNull();
    expect(popover.getAttribute("data-placement")).toBe(popover.getAttribute("data-side"));

    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("data-open")).toBe("true");

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(popover.id);

    expect(listbox?.getAttribute("role")).toBe("listbox");
    expect(itemsOf()).toHaveLength(3);
    expect(itemsOf()[0]?.getAttribute("aria-selected")).toBe("true");
    expect(itemsOf()[0]?.getAttribute("data-selection-mode")).toBe("single");

    expectUpstreamSlots(
      document.body.innerHTML,
      ["combo-box", "list-box", "list-box-item"],
      ["label", "input"],
    );

    wrapper.unmount();
  });

  it("suppresses the listbox wrapper attributes on the Autocomplete popover", async () => {
    const wrapper = await mountPage(AutocompletePage);

    const popover = popoverOf("autocomplete-popover");
    const trigger = popoverOf("autocomplete-trigger");
    const input = popoverOf("search-field-input");

    expect(popover.classList.contains("autocomplete__popover")).toBe(true);
    expect(popover.getAttribute("role")).toBeNull();
    expect(popover.hasAttribute("data-state")).toBe(false);
    expect(popover.hasAttribute("data-empty")).toBe(false);
    expect(popover.getAttribute("aria-multiselectable")).toBeNull();
    expect(popover.getAttribute("aria-orientation")).toBeNull();

    expect(trigger.getAttribute("aria-controls")).toBe(popover.id);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox");

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(popover.id);
    expect(input.getAttribute("autocomplete")).toBe("off");

    expect(popoverOf("autocomplete-filter").classList.contains("autocomplete__filter")).toBe(true);
    expect(itemsOf()).toHaveLength(3);

    const autocompleteSlots = (slotSnapshot.components.autocomplete ?? []).filter(
      (slot) => slot !== "autocomplete-indicator",
    );

    expectUpstreamSlots(
      document.body.innerHTML,
      ["list-box", "list-box-item"],
      [...autocompleteSlots, "label", "search-field", "search-field-group", "search-field-input"],
    );

    wrapper.unmount();
  });

  it("renders the empty state in both popovers", async () => {
    const combo = await mountPage(ComboBoxPage);
    const comboInput = popoverOf("input") as HTMLInputElement;

    comboInput.value = "zzz";
    comboInput.dispatchEvent(new Event("input", {bubbles: true}));
    await flushPromises();

    expect(itemsOf()).toHaveLength(0);
    expect(popoverOf("empty-state").textContent).toContain("No results found");
    expect(popoverOf("combo-box-popover").hasAttribute("data-empty")).toBe(false);

    combo.unmount();
    document.body.replaceChildren();

    const autocomplete = await mountPage(AutocompletePage);
    const search = popoverOf("search-field-input") as HTMLInputElement;

    search.value = "zzz";
    search.dispatchEvent(new Event("input", {bubbles: true}));
    await flushPromises();

    expect(itemsOf()).toHaveLength(0);
    expect(popoverOf("empty-state").textContent).toContain("No results found");
    expect(popoverOf("autocomplete-popover").hasAttribute("data-empty")).toBe(false);

    autocomplete.unmount();
  });

  it("uses the custom indicator slot when one is provided", async () => {
    const CustomIndicatorPage = defineComponent({
      components: {
        AutocompleteFilter,
        AutocompleteIndicator,
        AutocompletePopover,
        AutocompleteRoot,
        AutocompleteTrigger,
      },
      template: `
        <AutocompleteRoot :default-open="true">
          <AutocompleteTrigger aria-label="State">
            <AutocompleteIndicator>
              <svg data-testid="custom-indicator" />
            </AutocompleteIndicator>
          </AutocompleteTrigger>
          <AutocompletePopover>
            <AutocompleteFilter />
          </AutocompletePopover>
        </AutocompleteRoot>
      `,
    });

    const wrapper = await mountPage(CustomIndicatorPage);

    expect(popoverOf("autocomplete-indicator").getAttribute("data-open")).toBe("true");
    expect(document.querySelector('[data-slot="autocomplete-default-indicator"]')).toBeNull();

    wrapper.unmount();
  });
});
