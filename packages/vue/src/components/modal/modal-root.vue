<script setup lang="ts">
import {useOverlayState} from "@sail-ui/primitives";
import {modalVariants} from "@sail-ui/styles";
import {DialogRoot} from "reka-ui";
import {computed, provide, ref} from "vue";

import {modalContextKey, type ModalContext, type ModalPlacement} from "./context";
import type {ModalRootProps} from "./types";

defineOptions({name: "SailModalRoot", inheritAttrs: false});

const props = defineProps<ModalRootProps>();
const openModel = defineModel<boolean>("open");

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const slots = computed(() => modalVariants());
const placement = computed<ModalPlacement>(() => "auto");
const isDismissable = ref(true);

provide<ModalContext>(modalContextKey, {
  ...overlay,
  isDismissable,
  placement,
  slots,
});

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
  } else {
    overlay.close();
  }
}

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
