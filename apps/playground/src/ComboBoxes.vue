<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteTrigger,
  AutocompleteValue,
} from "@sail-ui/vue/autocomplete";
import {
  ComboBox,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxTrigger,
} from "@sail-ui/vue/combo-box";
import {EmptyState} from "@sail-ui/vue/empty-state";
import {Input} from "@sail-ui/vue/input";
import {Label} from "@sail-ui/vue/label";
import {ListBox, ListBoxItem, ListBoxItemIndicator} from "@sail-ui/vue/list-box";
import {SearchField, SearchFieldGroup, SearchFieldInput} from "@sail-ui/vue/search-field";
import {ref} from "vue";

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

const fruit = ref<string | undefined>("apple");
const customFruit = ref<string | undefined>();
const state = ref<string | undefined>("california");

const fruitLabel = (value: string | number) => fruits.find((item) => item.id === value)?.label;
const stateLabel = (value: string | number) => states.find((item) => item.id === value)?.label;
</script>

<template>
  <section id="combo-box" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Combo box &amp; autocomplete</h2>
    <div class="flex flex-wrap items-start gap-6">
      <div class="flex flex-col gap-1" data-testid="combo-box-basic">
        <ComboBox v-model="fruit" class="w-64" :display-value="fruitLabel">
          <Label>Fruit</Label>
          <ComboBoxInputGroup>
            <Input placeholder="Pick a fruit" />
            <ComboBoxTrigger aria-label="Show fruits" />
          </ComboBoxInputGroup>
          <ComboBoxPopover>
            <ListBox>
              <ListBoxItem
                v-for="item in fruits"
                :key="item.id"
                :text-value="item.label"
                :value="item.id"
              >
                {{ item.label }}
                <ListBoxItemIndicator />
              </ListBoxItem>
              <template #empty>
                <EmptyState>No fruits found</EmptyState>
              </template>
            </ListBox>
          </ComboBoxPopover>
        </ComboBox>
        <output class="text-sm text-muted" data-testid="combo-box-value">
          {{ fruit ?? "none" }}
        </output>
      </div>

      <div class="flex flex-col gap-1" data-testid="combo-box-custom">
        <ComboBox
          v-model="customFruit"
          allows-custom-value
          class="w-64"
          :display-value="fruitLabel"
        >
          <Label>Favorite fruit</Label>
          <ComboBoxInputGroup>
            <Input placeholder="Type anything" />
            <ComboBoxTrigger aria-label="Show fruits" />
          </ComboBoxInputGroup>
          <ComboBoxPopover>
            <ListBox>
              <ListBoxItem
                v-for="item in fruits"
                :key="item.id"
                :text-value="item.label"
                :value="item.id"
              >
                {{ item.label }}
                <ListBoxItemIndicator />
              </ListBoxItem>
              <template #empty>
                <EmptyState>Press Enter to use the typed value</EmptyState>
              </template>
            </ListBox>
          </ComboBoxPopover>
        </ComboBox>
        <output class="text-sm text-muted" data-testid="combo-box-custom-value">
          {{ customFruit ?? "none" }}
        </output>
      </div>

      <div class="flex flex-col gap-1" data-testid="autocomplete-basic">
        <Autocomplete
          v-model="state"
          class="w-64"
          placeholder="Select a state"
          :display-value="stateLabel"
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
                  v-for="item in states"
                  :key="item.id"
                  :text-value="item.label"
                  :value="item.id"
                >
                  {{ item.label }}
                  <ListBoxItemIndicator />
                </ListBoxItem>
                <template #empty>
                  <EmptyState>No states found</EmptyState>
                </template>
              </ListBox>
            </AutocompleteFilter>
          </AutocompletePopover>
        </Autocomplete>
        <output class="text-sm text-muted" data-testid="autocomplete-value">
          {{ state ?? "none" }}
        </output>
      </div>
    </div>
  </section>
</template>
