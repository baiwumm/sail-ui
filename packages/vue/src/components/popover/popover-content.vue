<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {PopoverContent as PopoverContentPrimitive, PopoverPortal} from "reka-ui";
import {computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useAttrs, watch} from "vue";

import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {usePopoverContext} from "./context";
import type {PopoverContentProps} from "./types";

defineOptions({name: "SailPopoverContent", inheritAttrs: false});

const props = withDefaults(defineProps<PopoverContentProps>(), {
  placement: "bottom",
  align: "center",
  alignOffset: 0,
  sideOffset: 8,
  avoidCollisions: true,
});

const attrs = useAttrs();
const context = usePopoverContext();
const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

const forwardedAttrs = computed(() => {
  const rest: Record<string, unknown> = {...attrs};

  delete rest.class;
  delete rest.style;

  return rest;
});

const classes = computed(() => cx(context.slots.value.base(), attrs.class as string | undefined));

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
  attach(context.isMounted.value ? popperContentElement(contentComponent.value) : null);
  context.contentRef.value = element.value;
}

watch([() => context.isMounted.value, contentComponent], () => void nextTick(syncElement), {
  flush: "post",
});
onMounted(() => void nextTick(syncElement));
onBeforeUnmount(() => {
  context.contentRef.value = null;
});
</script>

<template>
  <PopoverPortal v-if="context.isMounted.value">
    <PopoverContentPrimitive
      :ref="setContentRef"
      v-bind="forwardedAttrs"
      :align="align"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
      :class="classes"
      :data-entering="context.isEntering.value ? 'true' : undefined"
      :data-exiting="context.isExiting.value ? 'true' : undefined"
      :reference="context.triggerRef.value ?? undefined"
      :side="placement"
      :side-offset="sideOffset"
      :style="contentStyle"
    >
      <slot />
    </PopoverContentPrimitive>
  </PopoverPortal>
</template>
