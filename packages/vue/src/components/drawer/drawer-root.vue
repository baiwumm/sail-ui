<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {drawerVariants} from "@sail-ui/styles";
import {DialogRoot} from "reka-ui";
import {computed, provide, ref, useId, watch} from "vue";

import {drawerContextKey, type DrawerContext} from "./context";
import type {DrawerRootProps} from "./types";

defineOptions({name: "SailDrawerRoot", inheritAttrs: false});

const props = defineProps<DrawerRootProps>();
const openModel = defineModel<boolean>("open");

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() => drawerVariants());
const placement = computed(() => "bottom" as const);
const isDismissable = ref(true);
const isKeyboardDismissDisabled = ref(false);
const isTriggerDisabled = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const contentId = useId();

provide<DrawerContext>(drawerContextKey, {
  ...overlay,
  contentId,
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
