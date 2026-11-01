<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {popoverVariants} from "@sail-ui/styles";
import {PopoverRoot as PopoverRootPrimitive} from "reka-ui";
import {computed, provide, ref} from "vue";

import {popoverContextKey, type PopoverContext} from "./context";
import type {PopoverRootProps} from "./types";

defineOptions({name: "SailPopoverRoot", inheritAttrs: false});

const props = defineProps<PopoverRootProps>();
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

const slots = computed(() => popoverVariants());
const triggerRef = ref<HTMLElement | null>(null);
const arrowHeight = ref(0);

provide<PopoverContext>(popoverContextKey, {
  ...overlay,
  slots,
  triggerRef,
  arrowHeight,
});

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
    return;
  }

  overlay.close();
}

defineExpose({
  open: overlay.open,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <PopoverRootPrimitive :open="overlay.isMounted.value" @update:open="handleOpenChange">
    <slot />
  </PopoverRootPrimitive>
</template>
