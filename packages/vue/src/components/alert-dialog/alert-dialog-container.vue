<script setup lang="ts">
import {alertDialogVariants, cx} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {alertDialogContextKey, type AlertDialogPlacement, useAlertDialogContext} from "./context";
import type {AlertDialogContainerProps} from "./types";

defineOptions({name: "SailAlertDialogContainer", inheritAttrs: false});

const props = withDefaults(defineProps<AlertDialogContainerProps>(), {
  placement: "auto",
});

const {className, forwarded} = useForwardedAttrs();
const context = useAlertDialogContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...alertDialogVariants({size: props.size}),
}));
const placement = computed<AlertDialogPlacement>(() => props.placement);

provide(alertDialogContextKey, {
  ...context,
  placement,
  slots: mergedSlots,
});

const classes = computed(() => cx(mergedSlots.value.container(), className.value));
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-entering="context.isEntering.value ? 'true' : undefined"
    :data-exiting="context.isExiting.value ? 'true' : undefined"
    :data-placement="placement"
    :data-slot="'alert-dialog-container'"
  >
    <slot />
  </div>
</template>
