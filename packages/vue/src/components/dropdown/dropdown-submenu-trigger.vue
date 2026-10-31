<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {DropdownMenuSub as DropdownMenuSubPrimitive} from "reka-ui";
import {computed, provide, useId, watch} from "vue";

import {menuIdentityKey, menuSubmenuContextKey} from "../menu/context";
import {useDropdownContext} from "./context";
import type {DropdownSubmenuTriggerProps} from "./types";

defineOptions({name: "SailDropdownSubmenuTrigger", inheritAttrs: false});

defineProps<DropdownSubmenuTriggerProps>();

const dropdown = useDropdownContext();
const overlay = useOverlayState();
const triggerId = useId();
const menuId = useId();

provide(menuSubmenuContextKey, {
  triggerId,
  menuId,
  overlay,
  isOpen: overlay.isOpen,
});
provide(menuIdentityKey, {triggerId: computed(() => triggerId), menuId});

watch(
  () => dropdown.overlay.isOpen.value,
  (isOpen) => {
    if (!isOpen) {
      overlay.close();
    }
  },
);

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
  <DropdownMenuSubPrimitive :open="overlay.isMounted.value" @update:open="handleOpenChange">
    <slot />
  </DropdownMenuSubPrimitive>
</template>
