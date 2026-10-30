<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {popoverVariants} from "@sail-ui/styles";
import {PopoverRoot as PopoverRootPrimitive} from "reka-ui";
import {computed, provide, ref} from "vue";

import {popoverContextKey, type PopoverContext} from "./context";
import type {PopoverRootProps} from "./types";

defineOptions({name: "SailPopoverRoot", inheritAttrs: false});

const props = defineProps<PopoverRootProps>();
const openModel = defineModel<boolean>("open");

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() => popoverVariants());
const triggerRef = ref<HTMLElement | null>(null);

provide<PopoverContext>(popoverContextKey, {
  ...overlay,
  slots,
  triggerRef,
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
