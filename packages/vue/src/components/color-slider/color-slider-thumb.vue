<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {colorSliderVariants, cx} from "@sail-ui/styles";
import {
  ColorSliderThumb as ColorSliderThumbPrimitive,
  colorToString,
  injectColorSliderRootContext,
} from "reka-ui";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorSliderContextKey} from "./types";

defineOptions({name: "SailColorSliderThumb", inheritAttrs: false});

const rootContext = injectColorSliderRootContext();
const context = inject(colorSliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const thumbRef = ref<HTMLElement | null>(null);

const classes = computed(() => cx(colorSliderVariants().thumb(), className.value));
const thumbColor = computed(() => colorToString(rootContext.color.value, "rgb"));
const isDisabled = computed(() => rootContext.disabled.value);
const isDragging = computed(() => context.isDragging.value);

const {isHovered} = useHover(thumbRef, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(thumbRef, {isDisabled});
</script>

<template>
  <ColorSliderThumbPrimitive v-slot="{channelName, channelValue}" as-child>
    <span
      v-bind="forwarded"
      ref="thumbRef"
      :class="classes"
      :data-disabled="isDisabled ? 'true' : undefined"
      :data-dragging="isDragging ? 'true' : undefined"
      :data-focused="isFocused ? 'true' : undefined"
      :data-focus-visible="isFocusVisible ? 'true' : undefined"
      :data-hovered="isHovered ? 'true' : undefined"
      :data-slot="'color-slider-thumb'"
      :style="{backgroundColor: isDisabled ? undefined : thumbColor}"
    >
      <slot :channel-name="channelName" :channel-value="channelValue" />
    </span>
  </ColorSliderThumbPrimitive>
</template>
