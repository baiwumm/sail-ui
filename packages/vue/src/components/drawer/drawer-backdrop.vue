<script setup lang="ts">
import {cx, drawerVariants} from "@sail-ui/styles";
import {DialogOverlay, DialogPortal} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {drawerContextKey, useDrawerContext} from "./context";
import type {DrawerBackdropProps} from "./types";

defineOptions({name: "SailDrawerBackdrop", inheritAttrs: false});

const props = withDefaults(defineProps<DrawerBackdropProps>(), {
  isDismissable: true,
  isKeyboardDismissDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const context = useDrawerContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...drawerVariants({variant: props.variant}),
}));
const isDismissable = computed(() => props.isDismissable);
const isKeyboardDismissDisabled = computed(() => props.isKeyboardDismissDisabled);

provide(drawerContextKey, {
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
        :data-slot="'drawer-backdrop'"
        @click.stop
      >
        <slot />
      </div>
    </DialogOverlay>
  </DialogPortal>
</template>
