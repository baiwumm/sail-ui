<script setup lang="ts">
import {alertDialogVariants, cx} from "@sail-ui/styles";
import {DialogOverlay, DialogPortal} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useViewportVars} from "../../shared/viewport-vars";
import {alertDialogContextKey, useAlertDialogContext} from "./context";
import type {AlertDialogBackdropProps} from "./types";

defineOptions({name: "SailAlertDialogBackdrop", inheritAttrs: false});

const props = withDefaults(defineProps<AlertDialogBackdropProps>(), {
  isDismissable: false,
  isKeyboardDismissDisabled: true,
});

const {className, forwarded} = useForwardedAttrs();
const context = useAlertDialogContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...alertDialogVariants({variant: props.variant}),
}));
const isDismissable = computed(() => props.isDismissable);
const isKeyboardDismissDisabled = computed(() => props.isKeyboardDismissDisabled);

provide(alertDialogContextKey, {
  ...context,
  isDismissable,
  isKeyboardDismissDisabled,
  slots: mergedSlots,
});

const classes = computed(() => cx(mergedSlots.value.backdrop(), className.value));
const viewportVars = useViewportVars();

// Function refs also run on unmount, so a closed overlay never keeps a stale element.
function setBackdropRef(element: unknown) {
  context.contentRef.value = element instanceof HTMLElement ? element : null;
}
</script>

<template>
  <DialogPortal v-if="context.isMounted.value">
    <DialogOverlay as-child>
      <div
        :ref="setBackdropRef"
        v-bind="forwarded"
        :class="classes"
        :data-entering="context.isEntering.value ? 'true' : undefined"
        :data-exiting="context.isExiting.value ? 'true' : undefined"
        :data-slot="'alert-dialog-backdrop'"
        :style="viewportVars"
        @click.stop
      >
        <slot />
      </div>
    </DialogOverlay>
  </DialogPortal>
</template>
