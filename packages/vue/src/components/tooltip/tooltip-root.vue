<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {tooltipVariants} from "@sail-ui/styles";
import {TooltipProvider, TooltipRoot as TooltipRootPrimitive} from "reka-ui";
import {computed, onScopeDispose, provide, ref, watch} from "vue";

import {readCssTime} from "../../shared/css-time";
import {tooltipContextKey, type TooltipContext, type TooltipTriggerMode} from "./context";
import type {TooltipRootProps} from "./types";

defineOptions({name: "SailTooltipRoot", inheritAttrs: false});

const props = defineProps<TooltipRootProps>();
// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultOpen` can still initialize the overlay.
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() => tooltipVariants());
const triggerRef = ref<HTMLElement | null>(null);
const arrowHeight = ref(0);
const isDisabled = computed(() => Boolean(props.isDisabled));
const triggerMode = computed<TooltipTriggerMode>(() => props.trigger ?? "hover");
const delay = computed(() => props.delay ?? readCssTime("--tooltip-delay", 1500));
const closeDelay = computed(() => props.closeDelay ?? readCssTime("--tooltip-close-delay", 500));

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function cancelScheduled() {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }

  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function scheduleOpen() {
  if (isDisabled.value || overlay.isOpen.value || openTimer) {
    return;
  }

  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  openTimer = setTimeout(() => {
    openTimer = null;

    if (!isDisabled.value) {
      overlay.open();
    }
  }, delay.value);
}

function scheduleClose() {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }

  if (!overlay.isOpen.value || closeTimer) {
    return;
  }

  if (closeDelay.value <= 0) {
    overlay.close();
    return;
  }

  closeTimer = setTimeout(() => {
    closeTimer = null;
    overlay.close();
  }, closeDelay.value);
}

function openNow() {
  cancelScheduled();

  if (!isDisabled.value) {
    overlay.open();
  }
}

provide<TooltipContext>(tooltipContextKey, {
  ...overlay,
  slots,
  triggerRef,
  arrowHeight,
  isDisabled,
  triggerMode,
  scheduleOpen,
  scheduleClose,
  cancelScheduled,
  openNow,
});

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    openNow();
    return;
  }

  scheduleClose();
}

watch(isDisabled, (value) => {
  if (value) {
    cancelScheduled();
    overlay.close();
  }
});

onScopeDispose(cancelScheduled);

defineExpose({
  open: openNow,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <TooltipProvider :delay-duration="delay">
    <TooltipRootPrimitive
      :delay-duration="delay"
      :disabled="isDisabled"
      :open="overlay.isMounted.value"
      @update:open="handleOpenChange"
    >
      <slot />
    </TooltipRootPrimitive>
  </TooltipProvider>
</template>
