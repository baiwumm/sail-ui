<script setup lang="ts">
import {accordionVariants, cx} from "@sail-ui/styles";
import {AccordionRoot as AccordionRootPrimitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {surfaceContextKey} from "../surface/context";
import {accordionContextKey} from "./context";
import type {AccordionRootProps} from "./types";

defineOptions({name: "SailAccordion", inheritAttrs: false});

const props = withDefaults(defineProps<AccordionRootProps>(), {
  allowsMultipleExpanded: false,
  defaultExpandedKeys: () => [],
  hideSeparator: false,
  isDisabled: false,
  orientation: "vertical",
  variant: "default",
});

const model = defineModel<string[]>("expandedKeys");
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => accordionVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), className.value));
const expandedKeys = computed(() => model.value ?? props.defaultExpandedKeys);
const isDisabled = computed(() => props.isDisabled);
const allowsMultipleExpanded = computed(() => props.allowsMultipleExpanded);
const hideSeparator = computed(() => props.hideSeparator);
const orientation = computed(() => props.orientation);

const primitiveValue = computed(() =>
  allowsMultipleExpanded.value ? expandedKeys.value : (expandedKeys.value[0] ?? ""),
);

function toggle(id: string) {
  if (isDisabled.value) {
    return;
  }

  const isExpanded = expandedKeys.value.includes(id);
  let next: string[];

  if (allowsMultipleExpanded.value) {
    next = isExpanded
      ? expandedKeys.value.filter((key) => key !== id)
      : [...expandedKeys.value, id];
  } else {
    next = isExpanded ? [] : [id];
  }

  model.value = next;
}
provide(accordionContextKey, {
  allowsMultipleExpanded,
  expandedKeys,
  hideSeparator,
  isDisabled,
  orientation,
  slots,
  toggle,
});
provide(
  surfaceContextKey,
  computed(() => (props.variant === "surface" ? "default" : undefined)),
);
</script>

<template>
  <AccordionRootPrimitive
    v-bind="forwarded"
    :class="classes"
    :collapsible="true"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-slot="'accordion'"
    :disabled="isDisabled"
    :model-value="primitiveValue"
    :orientation="orientation"
    :type="allowsMultipleExpanded ? 'multiple' : 'single'"
  >
    <slot />
  </AccordionRootPrimitive>
</template>
