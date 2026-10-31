<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {
  PopoverContent as PopoverContentPrimitive,
  PopoverPortal,
  injectPopoverRootContext,
} from "reka-ui";
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

import {popperContentElement, useDataPlacement} from "../../shared/popper";
import {useDatePickerContext} from "./context";
import type {DatePickerPopoverProps} from "./types";

defineOptions({name: "SailDatePickerPopover", inheritAttrs: false});

const props = withDefaults(defineProps<DatePickerPopoverProps>(), {
  placement: "bottom",
  align: "center",
  alignOffset: 0,
  sideOffset: 8,
  avoidCollisions: true,
});

const attrs = useAttrs();
const context = useDatePickerContext();
const rootContext = injectPopoverRootContext();
const contentComponent = shallowRef<unknown>(null);
const {element, attach} = useDataPlacement(() => props.placement);

rootContext.contentId ||= useId();

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
      :data-slot="'date-picker-popover'"
      :reference="context.anchorRef.value ?? context.triggerRef.value ?? undefined"
      :side="placement"
      :side-offset="sideOffset"
      :style="contentStyle"
    >
      <slot />
    </PopoverContentPrimitive>
  </PopoverPortal>
</template>
