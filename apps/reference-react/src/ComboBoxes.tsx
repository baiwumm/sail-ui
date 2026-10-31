import type {Key} from "@heroui/react";

import {
  Autocomplete,
  ComboBox,
  EmptyState,
  Input,
  Label,
  ListBox,
  SearchField,
  useFilter,
} from "@heroui/react";
import {useState} from "react";

const fruits = [
  {id: "apple", label: "Apple"},
  {id: "banana", label: "Banana"},
  {id: "cherry", label: "Cherry"},
  {id: "dragonfruit", label: "Dragonfruit"},
  {id: "elderberry", label: "Elderberry"},
];

const states = [
  {id: "florida", label: "Florida"},
  {id: "delaware", label: "Delaware"},
  {id: "california", label: "California"},
  {id: "texas", label: "Texas"},
];

export default function ComboBoxes() {
  const [fruit, setFruit] = useState<string | null>("apple");
  const [customFruit, setCustomFruit] = useState<string | null>(null);
  const [state, setState] = useState<string | null>("california");
  const {contains} = useFilter({sensitivity: "base"});

  return (
    <section id="combo-box" className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Combo box &amp; autocomplete</h2>
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-1" data-testid="combo-box-basic">
          <ComboBox
            className="w-64"
            value={fruit}
            onChange={(value) => setFruit(value as string | null)}
          >
            <Label>Fruit</Label>
            <ComboBox.InputGroup>
              <Input placeholder="Pick a fruit" />
              <ComboBox.Trigger aria-label="Show fruits" />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox renderEmptyState={() => <EmptyState>No fruits found</EmptyState>}>
                {fruits.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
          <output className="text-sm text-muted" data-testid="combo-box-value">
            {fruit ?? "none"}
          </output>
        </div>

        <div className="flex flex-col gap-1" data-testid="combo-box-custom">
          <ComboBox
            allowsCustomValue
            className="w-64"
            value={customFruit}
            onChange={(value) => setCustomFruit(value as string | null)}
          >
            <Label>Favorite fruit</Label>
            <ComboBox.InputGroup>
              <Input placeholder="Type anything" />
              <ComboBox.Trigger aria-label="Show fruits" />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox
                renderEmptyState={() => <EmptyState>Press Enter to use the typed value</EmptyState>}
              >
                {fruits.map((item) => (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
          </ComboBox>
          <output className="text-sm text-muted" data-testid="combo-box-custom-value">
            {customFruit ?? "none"}
          </output>
        </div>

        <div className="flex flex-col gap-1" data-testid="autocomplete-basic">
          <Autocomplete
            className="w-64"
            placeholder="Select a state"
            value={state as Key | null}
            onChange={(value) => setState(value as string | null)}
          >
            <Label>State</Label>
            <Autocomplete.Trigger aria-label="State">
              <Autocomplete.Value />
              <Autocomplete.ClearButton />
              <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
              <Autocomplete.Filter filter={contains}>
                <SearchField aria-label="Search states">
                  <SearchField.Group>
                    <SearchField.Input placeholder="Search..." />
                  </SearchField.Group>
                </SearchField>
                <ListBox renderEmptyState={() => <EmptyState>No states found</EmptyState>}>
                  {states.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Autocomplete.Filter>
            </Autocomplete.Popover>
          </Autocomplete>
          <output className="text-sm text-muted" data-testid="autocomplete-value">
            {state ?? "none"}
          </output>
        </div>
      </div>
    </section>
  );
}
