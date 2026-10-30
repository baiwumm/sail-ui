<script setup lang="ts">
import {useHover} from "@sail-ui/primitives";
import {cx, numberFieldVariants} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {NumberFieldGroupProps} from "./types";

defineOptions({name: "SailNumberFieldGroup", inheritAttrs: false});

defineProps<NumberFieldGroupProps>();

const {className, forwarded} = useForwardedAttrs();
const groupRef = ref<HTMLElement | null>(null);
const isFocusWithin = ref(false);

const {isHovered} = useHover(groupRef);

const classes = computed(() => cx(numberFieldVariants().group(), className.value));

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
    :data-focus-within="isFocusWithin ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-slot="'number-field-group'"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <slot />
  </div>
</template>
