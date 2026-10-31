<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {colorAreaVariants, cx} from "@sail-ui/styles";
import {
  ColorAreaThumb as ColorAreaThumbPrimitive,
  colorToString,
  injectColorAreaRootContext,
} from "reka-ui";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorAreaContextKey} from "./types";

defineOptions({name: "SailColorAreaThumb", inheritAttrs: false});

const rootContext = injectColorAreaRootContext();
const context = inject(colorAreaContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const thumbRef = ref<HTMLElement | null>(null);

const classes = computed(() => cx(colorAreaVariants().thumb(), className.value));
const thumbColor = computed(() => colorToString(rootContext.color.value, "rgb"));
const isDisabled = computed(() => rootContext.disabled.value);
const isDragging = computed(() => context?.isDragging.value ?? false);

const {isHovered} = useHover(thumbRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(thumbRef, {isDisabled});
</script>

<template>
  <ColorAreaThumbPrimitive as-child>
    <span
      v-bind="forwarded"
      ref="thumbRef"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-dragging="isDragging ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-slot="'color-area-thumb'"
      :style="{'--color-area-thumb-color': thumbColor}"
    >
      <slot />
    </span>
  </ColorAreaThumbPrimitive>
</template>
