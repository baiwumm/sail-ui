<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {DialogTrigger} from "reka-ui";
import {computed, ref, useAttrs} from "vue";

import {useModalContext} from "./context";
import type {ModalTriggerProps} from "./types";

defineOptions({name: "SailModalTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<ModalTriggerProps>(), {
  isDisabled: false,
  type: "button"
});

const attrs = useAttrs();
const {slots} = useModalContext();
const buttonRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() =>
  cx(slots.value.trigger(), attrs.class as string | undefined)
);
</script>

<template>
  <DialogTrigger as-child>
    <button
      ref="buttonRef"
      v-bind="$attrs"
      :class="classes"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-slot="'modal-trigger'"
      :disabled="isDisabled || undefined"
      :type="type"
    >
      <slot />
    </button>
  </DialogTrigger>
</template>
