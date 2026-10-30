<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, onMounted, onUpdated, ref, useSlots, type Slots, type VNodeChild} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {DangerIcon, InfoIcon, SuccessIcon, WarningIcon} from "../../shared/icons";
import {hasSlotContent} from "../../shared/vnode";
import {useToastProviderContext} from "./context";
import type {ToastVariant} from "./types";

defineOptions({name: "SailToastIndicator", inheritAttrs: false});

const props = defineProps<{
  variant?: ToastVariant;
  /** Custom indicator content. `null` is handled by the provider. */
  indicator?: VNodeChild;
}>();

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const slots = useSlots() as Slots;
const hasSwapped = ref(false);
let previousKind: string | undefined;

const classes = computed(() => cx(provider.slots.value.indicator(), className.value));
const hasSlot = computed(() => hasSlotContent(slots.default));
const defaultIcon = computed(() => {
  switch (props.variant) {
    case "success":
      return SuccessIcon;
    case "warning":
      return WarningIcon;
    case "danger":
      return DangerIcon;
    default:
      return InfoIcon;
  }
});
const indicatorRenderer = () => props.indicator;

function contentKind() {
  if (hasSlot.value) {
    return `slot:${props.variant ?? "default"}`;
  }

  return props.indicator === undefined ? `default:${props.variant ?? "default"}` : "custom";
}

onMounted(() => {
  previousKind = contentKind();
});

onUpdated(() => {
  const kind = contentKind();

  if (previousKind !== undefined && kind !== previousKind) {
    hasSwapped.value = true;
  }

  previousKind = kind;
});
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-slot="'toast-indicator'"
    :data-swapped="hasSwapped ? 'true' : undefined"
  >
    <slot v-if="hasSlot" />
    <component :is="indicatorRenderer" v-else-if="indicator !== undefined && indicator !== null" />
    <component :is="defaultIcon" v-else data-slot="toast-default-icon" />
  </div>
</template>
