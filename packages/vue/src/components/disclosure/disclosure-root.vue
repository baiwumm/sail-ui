<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisclosureGroupContext} from "../disclosure-group/types";
import {disclosureContextKey} from "./context";
import type {DisclosureRootProps} from "./types";

defineOptions({name: "SailDisclosure", inheritAttrs: false});

const props = withDefaults(defineProps<DisclosureRootProps>(), {
  defaultOpen: false,
  isDisabled: false,
  open: undefined,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const group = useDisclosureGroupContext();
const localOpen = ref(props.defaultOpen);
const {className, forwarded} = useForwardedAttrs();

const generatedId = useId();
const triggerId = useId();
const contentId = useId();
const itemId = computed(() => props.id ?? generatedId);

const isExpanded = computed(() =>
  group ? group.expandedKeys.value.includes(itemId.value) : (props.open ?? localOpen.value),
);
const isDisabled = computed(() => props.isDisabled || Boolean(group?.isDisabled.value));

function toggle() {
  if (isDisabled.value) {
    return;
  }

  if (group) {
    group.toggle(itemId.value);
    return;
  }

  const next = !isExpanded.value;

  if (props.open === undefined) {
    localOpen.value = next;
  }

  emit("update:open", next);
}

const classes = computed(() => cx(disclosureVariants().base(), className.value));

provide(disclosureContextKey, {
  contentId,
  isDisabled,
  isExpanded,
  toggle,
  triggerId,
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-expanded="isExpanded ? 'true' : undefined"
    :data-slot="'disclosure'"
  >
    <slot />
  </div>
</template>
