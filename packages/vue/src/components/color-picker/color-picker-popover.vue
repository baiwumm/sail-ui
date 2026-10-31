<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {PopoverContent as PopoverContentPrimitive, PopoverPortal} from "reka-ui";
import {computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useAttrs, watch} from "vue";

import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {useColorPickerRootContext} from "./context";
import type {ColorPickerPopoverProps} from "./types";

defineOptions({name: "SailColorPickerPopover", inheritAttrs: false});

const props = withDefaults(defineProps<ColorPickerPopoverProps>(), {
  placement: "bottom",
  align: "start",
  alignOffset: 0,
  sideOffset: 8,
  avoidCollisions: true,
});

const attrs = useAttrs();
const context = useColorPickerRootContext();
const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

const forwardedAttrs = computed(() => {
  const rest: Record<string, unknown> = {...attrs};

  delete rest.class;
  delete rest.style;

  return rest;
});

const classes = computed(() =>
  cx(context.slots.value.popover(), attrs.class as string | undefined),
);

const contentStyle = computed(() => [
  attrs.style,
  {
    "--trigger-anchor-point": "var(--reka-popover-content-transform-origin)",
  },
]);

function setContentRef(value: unknown) {
  contentComponent.value = value;
}

function syncElement() {
  attach(context.overlay.isMounted.value ? popperContentElement(contentComponent.value) : null);
  context.overlay.contentRef.value = element.value;
}

watch([() => context.overlay.isMounted.value, contentComponent], () => void nextTick(syncElement), {
  flush: "post",
});
onMounted(() => void nextTick(syncElement));
onBeforeUnmount(() => {
  context.overlay.contentRef.value = null;
});
</script>

<template>
  <PopoverPortal v-if="context.overlay.isMounted.value">
    <PopoverContentPrimitive
      :ref="setContentRef"
      v-bind="forwardedAttrs"
      :align="align"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :class="classes"
      :data-entering="context.overlay.isEntering.value ? 'true' : undefined"
      :data-exiting="context.overlay.isExiting.value ? 'true' : undefined"
      :data-slot="'color-picker-popover'"
      :reference="context.triggerRef.value ?? undefined"
      :side="placement"
      :side-offset="sideOffset"
      :style="contentStyle"
    >
      <slot />
    </PopoverContentPrimitive>
  </PopoverPortal>
</template>
