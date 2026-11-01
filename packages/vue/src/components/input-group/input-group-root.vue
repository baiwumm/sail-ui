<script setup lang="ts">
import {useHover} from "@sail-ui/primitives";
import {cx, inputGroupVariants} from "@sail-ui/styles";
import {computed, inject, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {textFieldContextKey} from "../input/types";
import {inputGroupContextKey, type InputGroupRootProps} from "./types";

defineOptions({name: "SailInputGroup", inheritAttrs: false});

const props = withDefaults(defineProps<InputGroupRootProps>(), {
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
});

const {className, forwarded} = useForwardedAttrs();
const textField = inject(textFieldContextKey, null);
const groupRef = ref<HTMLElement | null>(null);
const isFocusWithin = ref(false);

const variant = computed(() => props.variant ?? textField?.variant.value);

const {isHovered} = useHover(groupRef, {isDisabled: computed(() => props.isDisabled)});

const slots = computed(() =>
  inputGroupVariants({
    fullWidth: props.fullWidth,
    variant: variant.value,
  }),
);

const classes = computed(() => cx(slots.value.base(), className.value));

provide(inputGroupContextKey, {
  isDisabled: computed(() => props.isDisabled),
});

/**
 * Clicking the shell focuses the control inside it, like the upstream
 * component does.
 */
function handleClick(event: MouseEvent) {
  const group = groupRef.value;

  if (!group) {
    return;
  }

  const target = event.target as HTMLElement | null;
  const control = group.querySelector<HTMLElement>(
    '[data-slot="input-group-input"], [data-slot="input-group-textarea"]',
  );

  if (control && target !== control && !control.contains(target)) {
    control.focus();
  }
}

function handleFocusIn() {
  isFocusWithin.value = true;
}

function handleFocusOut(event: FocusEvent) {
  const group = groupRef.value;
  const next = event.relatedTarget as Node | null;

  if (group && next && group.contains(next)) {
    return;
  }

  isFocusWithin.value = false;
}
</script>

<template>
  <div
    ref="groupRef"
    v-bind="forwarded"
    role="group"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-within="isFocusWithin ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'input-group'"
    @click="handleClick"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <slot />
  </div>
</template>
