import {renderSSR} from "@sail-ui/testing";
import {describe, expect, it} from "vitest";
import {defineComponent, h} from "vue";

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
import {Input} from "../components/input";
import {Label} from "../components/label";
import {ListBox} from "../components/list-box";
import {ListBoxItem, ListBoxItemIndicator} from "../components/list-box-item";
import {SearchField, SearchFieldGroup, SearchFieldInput} from "../components/search-field";

const fruits = [
  {id: "apple", label: "Apple"},
  {id: "banana", label: "Banana"},
];

const states = [
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
];

const fruitLabel = (value: string | number) => fruits.find((fruit) => fruit.id === value)?.label;
const stateLabel = (value: string | number) => states.find((state) => state.id === value)?.label;

function createComboBoxPage(
  options: {
    defaultValue?: string;
    displayValue?: (value: string | number) => string | undefined;
  } = {},
) {
  return defineComponent({
    setup() {
      return () =>
        h(
          ComboBoxRoot,
          {
            defaultValue: options.defaultValue,
            displayValue: options.displayValue,
          },
          {
            default: () => [
              h(Label, null, {default: () => "Fruit"}),
              h(ComboBoxInputGroup, null, {
                default: () => [h(Input, {placeholder: "Pick a fruit"}), h(ComboBoxTrigger)],
              }),
              h(ComboBoxValue),
              h(ComboBoxPopover, null, {
                default: () =>
                  h(ListBox, null, {
                    default: () =>
                      fruits.map((fruit) =>
                        h(
                          ListBoxItem,
                          {key: fruit.id, textValue: fruit.label, value: fruit.id},
                          {default: () => [fruit.label, h(ListBoxItemIndicator)]},
                        ),
                      ),
                  }),
              }),
            ],
          },
        );
    },
  });
}

function createAutocompletePage(
  options: {
    defaultValue?: string;
    displayValue?: (value: string | number) => string | undefined;
  } = {},
) {
  return defineComponent({
    setup() {
      return () =>
        h(
          AutocompleteRoot,
          {
            defaultValue: options.defaultValue,
            displayValue: options.displayValue,
            placeholder: "Select a state",
          },
          {
            default: () => [
              h(Label, null, {default: () => "State"}),
              h(
                AutocompleteTrigger,
                {"aria-label": "State"},
                {
                  default: () => [
                    h(AutocompleteValue),
                    h(AutocompleteClearButton),
                    h(AutocompleteIndicator),
                  ],
                },
              ),
              h(AutocompletePopover, null, {
                default: () =>
                  h(AutocompleteFilter, null, {
                    default: () => [
                      h(
                        SearchField,
                        {"aria-label": "Search states"},
                        {
                          default: () =>
                            h(SearchFieldGroup, null, {
                              default: () => h(SearchFieldInput, {placeholder: "Search..."}),
                            }),
                        },
                      ),
                      h(ListBox, null, {
                        default: () =>
                          states.map((state) =>
                            h(
                              ListBoxItem,
                              {key: state.id, textValue: state.label, value: state.id},
                              {default: () => [state.label, h(ListBoxItemIndicator)]},
                            ),
                          ),
                      }),
                    ],
                  }),
              }),
            ],
          },
        );
    },
  });
}

const tagsOf = (html: string, slot: string) =>
  [...html.matchAll(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`, "g"))].map((match) => match[0]);

const idOf = (tag: string) => /id="([^"]+)"/.exec(tag)?.[1];

describe("T07 combo-box SSR", () => {
  it("renders only the closed input shell", async () => {
    const html = await renderSSR(createComboBoxPage());

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('placeholder="Pick a fruit"');
    expect(html).not.toContain('data-slot="combo-box-popover"');
    expect(html).not.toContain('data-slot="list-box"');
    expect(html).not.toContain('role="listbox"');
    expect(html).not.toContain("data-state=");
    expect(html).not.toContain('type="hidden"');
  });

  it("seeds the closed input from displayValue", async () => {
    const page = () => createComboBoxPage({defaultValue: "apple", displayValue: fruitLabel});
    const html = await renderSSR(page());

    expect(html).toBe(await renderSSR(page()));
    expect(html).toContain('value="Apple"');
    expect(html).not.toContain('value="apple"');
    expect(html).not.toContain('data-slot="combo-box-popover"');
  });

  it("associates the root Label with the combobox input", async () => {
    const html = await renderSSR(createComboBoxPage());
    const label = tagsOf(html, "label")[0] ?? "";
    const input = tagsOf(html, "input")[0] ?? "";
    const inputId = idOf(input);

    expect(label).toBeTruthy();
    expect(inputId).toBeTruthy();
    expect(label).toContain(`for="${inputId}"`);
  });
});

describe("T07 autocomplete SSR", () => {
  it("renders the trigger shell without the search field", async () => {
    const html = await renderSSR(createAutocompletePage());

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain("Select a state");
    expect(html).toContain('data-placeholder="true"');
    expect(html).toContain('data-slot="autocomplete-clear-button"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-empty="true"');
    expect(html).not.toContain('data-slot="search-field-input"');
    expect(html).not.toContain('data-slot="autocomplete-popover"');
    expect(html).not.toContain("data-state=");
  });

  it("renders the label for a default value through displayValue", async () => {
    const page = () =>
      createAutocompletePage({defaultValue: "california", displayValue: stateLabel});
    const html = await renderSSR(page());

    expect(html).toBe(await renderSSR(page()));
    expect(html).toContain("California");
    expect(html).not.toContain("Select a state");
    expect(tagsOf(html, "autocomplete-value")[0]).not.toContain("data-placeholder");
    expect(tagsOf(html, "autocomplete-clear-button")[0]).not.toContain("data-empty");
    expect(html).not.toContain('data-slot="autocomplete-popover"');
  });
});
