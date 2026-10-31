<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {sheetVariants} from "@sail-ui/styles";
import {DialogRoot} from "reka-ui";
import {computed, provide, ref, useId, watch} from "vue";

import {sheetContextKey, type SheetContext, type SheetPlacement} from "./context";
import type {SheetRootProps} from "./types";

defineOptions({name: "SailSheetRoot", inheritAttrs: false});

const props = withDefaults(defineProps<SheetRootProps>(), {
  placement: "bottom",
});
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

const placement = computed<SheetPlacement>(() => props.placement);
const slots = computed(() => sheetVariants({placement: placement.value}));
const isDismissable = ref(true);
const isKeyboardDismissDisabled = ref(false);
const isTriggerDisabled = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const contentId = useId();

provide<SheetContext>(sheetContextKey, {
  ...overlay,
  contentId,
  dialogRef,
  isDismissable,
  isKeyboardDismissDisabled,
  isTriggerDisabled,
  placement,
  slots,
  triggerRef,
});

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    if (isTriggerDisabled.value) {
      return;
    }

    overlay.open();
    return;
  }

  overlay.close();
}

// Reka's focus restore is bypassed because Sail unmounts the portal through
// `isMounted` instead of Presence, so the trigger gets focus back here.
watch(
  () => overlay.isMounted.value,
  (mounted, wasMounted) => {
    if (!wasMounted || mounted || overlay.isOpen.value) {
      return;
    }

    const trigger = triggerRef.value;

    if (trigger?.isConnected) {
      trigger.focus();
    }
  },
  {flush: "post"},
);

defineExpose({
  open: overlay.open,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <DialogRoot :open="overlay.isMounted.value" @update:open="handleOpenChange">
    <slot />
  </DialogRoot>
</template>
