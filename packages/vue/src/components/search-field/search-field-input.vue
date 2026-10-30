<script setup lang="ts">
import {cx, searchFieldVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {isComposing} from "../../shared/composition";
import {searchFieldContextKey, type SearchFieldInputProps} from "./types";

defineOptions({name: "SailSearchFieldInput", inheritAttrs: false});

defineProps<SearchFieldInputProps>();

const context = inject(searchFieldContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(searchFieldVariants().input(), className.value)
);

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" || isComposing(event)) {
    return;
  }

  event.preventDefault();
  context?.submit(context.value.value);
}
</script>

<template>
  <input
    v-bind="forwarded"
    :class="classes"
    :data-slot="'search-field-input'"
    :disabled="context?.isDisabled.value"
    type="search"
    :value="context?.value.value"
    @input="context?.setValue(($event.target as HTMLInputElement).value)"
    @keydown="handleKeydown"
  >
</template>
