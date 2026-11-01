<script setup lang="ts">
import {cx, searchFieldVariants} from "@sail-ui/styles";
import {ComboboxInput, injectComboboxRootContext} from "reka-ui";
import {computed, inject, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useComboboxBinding} from "../../shared/combobox-context";
import {isComposing} from "../../shared/composition";
import {searchFieldContextKey, type SearchFieldInputProps} from "./types";

defineOptions({name: "SailSearchFieldInput", inheritAttrs: false});

defineProps<SearchFieldInputProps>();

const context = inject(searchFieldContextKey, null);
const combobox = useComboboxBinding();
const comboboxRoot = injectComboboxRootContext(null);
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(searchFieldVariants().input(), className.value));

const comboboxText = computed<string>({
  get: () => context?.value.value ?? "",
  set: (value) => context?.setValue(value),
});

watch(
  () => context?.value.value ?? "",
  (value) => {
    // SearchField's clear button and controlled hosts change the text outside
    // the input event, so the combobox filter has to follow.
    if (comboboxRoot && comboboxRoot.filterSearch.value !== value) {
      comboboxRoot.filterSearch.value = value;
    }
  },
);

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" || isComposing(event)) {
    return;
  }

  event.preventDefault();

  // Inside a combobox Enter selects the highlighted option instead.
  if (!combobox) {
    context?.submit(context.value.value);
  }
}

function resetComboboxSearch() {
  return "";
}
</script>

<template>
  <ComboboxInput
    v-if="combobox"
    v-bind="forwarded"
    as-child
    :display-value="resetComboboxSearch"
    :model-value="comboboxText"
    @update:model-value="comboboxText = $event"
  >
    <input
      :aria-label="context?.label.value"
      :class="classes"
      :data-slot="'search-field-input'"
      :disabled="context?.isDisabled.value"
      type="search"
      :value="comboboxText"
      @keydown="handleKeydown"
    />
  </ComboboxInput>
  <input
    v-else
    v-bind="forwarded"
    :aria-label="context?.label.value"
    :class="classes"
    :data-slot="'search-field-input'"
    :disabled="context?.isDisabled.value"
    type="search"
    :value="context?.value.value"
    @input="context?.setValue(($event.target as HTMLInputElement).value)"
    @keydown="handleKeydown"
  />
</template>
