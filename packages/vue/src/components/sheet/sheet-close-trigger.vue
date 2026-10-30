<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {closeButtonVariants, cx} from "@sail-ui/styles";
import {DialogClose} from "reka-ui";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";
import type {SheetCloseTriggerProps} from "./types";

defineOptions({name: "SailSheetCloseTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<SheetCloseTriggerProps>(), {
  isDisabled: false,
  type: "button",
});

const {forwarded, className} = useForwardedAttrs();
const {slots} = useSheetContext();
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
      :data-slot="'sheet-close-trigger'"
      :disabled="isDisabled || undefined"
      :type="type"
    >
      <slot>
        <svg
          aria-hidden="true"
          data-slot="close-button-icon"
          fill="none"
          height="16"
          role="presentation"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            clip-rule="evenodd"
            d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
            fill="currentColor"
            fill-rule="evenodd"
          />
        </svg>
      </slot>
    </button>
  </DialogClose>
</template>
