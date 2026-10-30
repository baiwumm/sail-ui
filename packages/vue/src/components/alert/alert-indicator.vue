<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs, useSlots, type Slots} from "vue";

import {DangerIcon, InfoIcon, SuccessIcon, WarningIcon} from "../../shared/icons";
import {hasSlotContent} from "../../shared/vnode";
import {alertContextKey} from "./context";
import type {AlertIndicatorProps} from "./types";

defineOptions({name: "SailAlertIndicator", inheritAttrs: false});

withDefaults(defineProps<AlertIndicatorProps>(), {
  as: "div",
});

const attrs = useAttrs();
const context = inject(alertContextKey, null);
const slots = context?.slots;
const componentSlots = useSlots() as Slots;
const classes = computed(() => cx(slots?.value.indicator(), attrs.class as string | undefined));
const defaultIcon = computed(() => {
  switch (context?.status.value) {
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
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-indicator'"
  >
    <slot v-if="hasSlotContent(componentSlots.default)" />
    <component :is="defaultIcon" v-else data-slot="alert-default-icon" />
  </Primitive>
</template>
