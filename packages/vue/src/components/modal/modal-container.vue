<script setup lang="ts">
import {cx, modalVariants} from "@sail-ui/styles";
import {computed, provide, useAttrs} from "vue";

import {modalContextKey, type ModalPlacement, useModalContext} from "./context";
import type {ModalContainerProps} from "./types";

defineOptions({name: "SailModalContainer", inheritAttrs: false});

const props = withDefaults(defineProps<ModalContainerProps>(), {
  placement: "auto"
});

const attrs = useAttrs();
const context = useModalContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...modalVariants({scroll: props.scroll, size: props.size})
}));
const placement = computed<ModalPlacement>(() => props.placement);

provide(modalContextKey, {
  ...context,
  placement,
  slots: mergedSlots
});

const classes = computed(() =>
  cx(mergedSlots.value.container(), attrs.class as string | undefined)
);
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-entering="context.isEntering.value ? 'true' : undefined"
    :data-exiting="context.isExiting.value ? 'true' : undefined"
    :data-placement="placement"
    :data-slot="'modal-container'"
  >
    <slot />
  </div>
</template>
