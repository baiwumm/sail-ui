<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {closeButtonVariants, cx} from "@sail-ui/styles";
import {DialogClose} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {CloseIcon} from "../../shared/icons";
import {useAlertDialogContext} from "./context";
import type {AlertDialogCloseTriggerProps} from "./types";

defineOptions({name: "SailAlertDialogCloseTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<AlertDialogCloseTriggerProps>(), {
  isDisabled: false,
  type: "button",
});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useAlertDialogContext();
const buttonRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() =>
  cx(closeButtonVariants({variant: "default"}), slots.value.closeTrigger(), className.value),
);
</script>

<template>
  <DialogClose as-child>
    <button
      ref="buttonRef"
      v-bind="forwarded"
      aria-label="Close"
      :class="classes"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-slot="'alert-dialog-close-trigger'"
      :disabled="isDisabled || undefined"
      :type="type"
    >
      <slot>
        <CloseIcon data-slot="close-button-icon" />
      </slot>
    </button>
  </DialogClose>
</template>
