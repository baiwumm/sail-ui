<script setup lang="ts">
import {disclosureGroupVariants, cx} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {disclosureGroupContextKey, type DisclosureGroupRootProps} from "./types";

defineOptions({name: "SailDisclosureGroup", inheritAttrs: false});

const props = withDefaults(defineProps<DisclosureGroupRootProps>(), {
  allowsMultipleExpanded: false,
  defaultExpandedKeys: () => [],
  isDisabled: false,
});

const model = defineModel<string[]>("expandedKeys");
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(disclosureGroupVariants().base(), className.value));
const expandedKeys = computed(() => model.value ?? props.defaultExpandedKeys);
const isDisabled = computed(() => props.isDisabled);

function toggle(id: string) {
  if (isDisabled.value) {
    return;
  }

  const isExpanded = expandedKeys.value.includes(id);

  if (props.allowsMultipleExpanded) {
    model.value = isExpanded
      ? expandedKeys.value.filter((key) => key !== id)
      : [...expandedKeys.value, id];
  } else {
    model.value = isExpanded ? [] : [id];
  }
}

provide(disclosureGroupContextKey, {expandedKeys, isDisabled, toggle});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-slot="'disclosure-group'"
  >
    <slot />
  </div>
</template>
