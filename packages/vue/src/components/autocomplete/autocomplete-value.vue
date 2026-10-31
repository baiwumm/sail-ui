<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAutocompleteContext} from "./context";
import type {AutocompleteValueProps} from "./types";

defineOptions({name: "SailAutocompleteValue", inheritAttrs: false});

defineProps<AutocompleteValueProps>();

const context = useAutocompleteContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.value(), className.value));
const label = computed(() => context.binding.labelFor(context.binding.modelValue.value));
const placeholder = computed(() => context.placeholder.value);
const isEmpty = computed(() => !label.value);
</script>

<template>
  <span
    v-bind="forwarded"
    :class="classes"
    :data-placeholder="isEmpty ? 'true' : undefined"
    :data-slot="'autocomplete-value'"
  >
    <slot v-bind="{placeholder, value: label}">{{ label ?? placeholder }}</slot>
  </span>
</template>
