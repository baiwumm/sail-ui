<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {AccordionItem as AccordionItemPrimitive} from "reka-ui";
import {computed, provide, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {accordionItemContextKey, useAccordionContext} from "./context";
import type {AccordionItemProps} from "./types";

defineOptions({name: "SailAccordionItem", inheritAttrs: false});

const props = withDefaults(defineProps<AccordionItemProps>(), {isDisabled: false});

const root = useAccordionContext();
const {className, forwarded} = useForwardedAttrs();

const generatedId = useId();
const triggerId = useId();
const panelId = useId();

const itemId = computed(() => props.id ?? generatedId);
const isExpanded = computed(() => root.expandedKeys.value.includes(itemId.value));
const isDisabled = computed(() => root.isDisabled.value || props.isDisabled);

const classes = computed(() => cx(root.slots.value.item(), className.value));

provide(accordionItemContextKey, {
  isDisabled,
  isExpanded,
  panelId,
  toggle: () => root.toggle(itemId.value),
  triggerId,
});
</script>

<template>
  <AccordionItemPrimitive
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-expanded="isExpanded ? 'true' : undefined"
    :data-hide-separator="root.hideSeparator.value ? 'true' : undefined"
    :data-slot="'accordion-item'"
    :value="itemId"
  >
    <slot />
  </AccordionItemPrimitive>
</template>
