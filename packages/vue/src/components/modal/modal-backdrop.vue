<script setup lang="ts">
import {cx, modalVariants} from "@sail-ui/styles";
import {DialogOverlay, DialogPortal} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {modalContextKey, useModalContext} from "./context";
import type {ModalBackdropProps} from "./types";

defineOptions({name: "SailModalBackdrop", inheritAttrs: false});

const props = withDefaults(defineProps<ModalBackdropProps>(), {
  isDismissable: true,
  isKeyboardDismissDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const context = useModalContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...modalVariants({variant: props.variant}),
}));
const isDismissable = computed(() => props.isDismissable);
const isKeyboardDismissDisabled = computed(() => props.isKeyboardDismissDisabled);

provide(modalContextKey, {
  ...context,
  isDismissable,
  isKeyboardDismissDisabled,
  slots: mergedSlots,
});

const classes = computed(() => cx(mergedSlots.value.backdrop(), className.value));

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
        :data-slot="'modal-backdrop'"
        @click.stop
      >
        <slot />
      </div>
    </DialogOverlay>
  </DialogPortal>
</template>
