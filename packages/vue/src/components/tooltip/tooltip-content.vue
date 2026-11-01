<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {TooltipContent as TooltipContentPrimitive, TooltipPortal} from "reka-ui";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useId,
  watch,
} from "vue";
import {injectTooltipRootContext} from "reka-ui";

import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {useTooltipContext} from "./context";
import type {TooltipContentProps} from "./types";

defineOptions({name: "SailTooltipContent", inheritAttrs: false});

const props = withDefaults(defineProps<TooltipContentProps>(), {
  placement: "top",
  align: "center",
  alignOffset: 0,
  avoidCollisions: true,
  showArrow: false,
});

const attrs = useAttrs();
const context = useTooltipContext();
const rootContext = injectTooltipRootContext();
const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

rootContext.contentId ||= useId();

const forwardedAttrs = computed(() => {
  const rest: Record<string, unknown> = {...attrs};

  delete rest.class;
  delete rest.style;

  return rest;
});

const classes = computed(() => cx(context.slots.value.base(), attrs.class as string | undefined));

const sideOffset = computed(
  () => (props.sideOffset ?? (props.showArrow ? 7 : 3)) - context.arrowHeight.value,
);

const contentStyle = computed(() => [
  attrs.style,
  {
    "--trigger-anchor-point": "var(--reka-tooltip-content-transform-origin)",
  },
]);

function setContentRef(value: unknown) {
  contentComponent.value = value;
}

function syncElement() {
  attach(context.isMounted.value ? popperContentElement(contentComponent.value) : null);
  context.contentRef.value = element.value;
}

function handlePointerEnter() {
  context.cancelScheduled();
}

function handlePointerLeave() {
  context.scheduleClose();
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
  <TooltipPortal v-if="context.isMounted.value">
    <TooltipContentPrimitive
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
      @pointerenter="handlePointerEnter"
      @pointerleave="handlePointerLeave"
    >
      <slot />
    </TooltipContentPrimitive>
  </TooltipPortal>
</template>
