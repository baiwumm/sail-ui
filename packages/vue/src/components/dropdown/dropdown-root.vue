<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {dropdownVariants} from "@sail-ui/styles";
import {DropdownMenuRoot as DropdownMenuRootPrimitive} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {menuIdentityKey} from "../menu/context";
import {dropdownContextKey, type DropdownContext} from "./context";
import type {DropdownRootProps} from "./types";

defineOptions({name: "SailDropdown", inheritAttrs: false});

const props = withDefaults(defineProps<DropdownRootProps>(), {
  modal: false,
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

const menuId = useId();
const triggerId = ref(useId());
const slots = computed(() => dropdownVariants());

provide<DropdownContext>(dropdownContextKey, {
  overlay,
  menuId,
  slots,
  triggerId,
});
provide(menuIdentityKey, {menuId, triggerId});

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
  toggle: overlay.toggle,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <DropdownMenuRootPrimitive
    :dir="dir"
    :modal="modal"
    :open="overlay.isMounted.value"
    @update:open="handleOpenChange"
  >
    <slot />
  </DropdownMenuRootPrimitive>
</template>
