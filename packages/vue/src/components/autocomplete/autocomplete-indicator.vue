<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {cloneVNode, computed, useSlots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {ChevronDownIcon} from "../../shared/icons";
import {useAutocompleteContext} from "./context";
import type {AutocompleteIndicatorProps} from "./types";

defineOptions({name: "SailAutocompleteIndicator", inheritAttrs: false});

defineProps<AutocompleteIndicatorProps>();

const context = useAutocompleteContext();
const componentSlots = useSlots();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(context.slots.value.indicator(), className.value));
const isOpen = computed(() => context.overlay.isOpen.value);

const customIndicator = computed(() => {
  const children = componentSlots.default?.();

  if (!children || children.length === 0) {
    return null;
  }

  return cloneVNode(children[0]!, {
    class: classes.value,
    "data-open": isOpen.value ? "true" : undefined,
    "data-slot": "autocomplete-indicator",
  });
});
</script>

<template>
  <ChevronDownIcon
    v-if="!customIndicator"
    v-bind="forwarded"
    :class="classes"
    :data-open="isOpen ? 'true' : undefined"
    data-slot="autocomplete-default-indicator"
  />
  <component :is="customIndicator" v-else />
</template>
