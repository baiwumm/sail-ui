<script setup lang="ts">
import {useFocusRing} from "@sail-ui/primitives";
import {cx, sliderVariants} from "@sail-ui/styles";
import {injectSliderRootContext} from "reka-ui";
import {computed, inject, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderThumbProps} from "./types";

defineOptions({name: "SailSliderThumb", inheritAttrs: false});

const props = withDefaults(defineProps<SliderThumbProps>(), {
  index: 0,
});

const context = inject(sliderContextKey)!;
const rootContext = injectSliderRootContext();
const {className, forwarded} = useForwardedAttrs();
const thumbRef = ref<HTMLElement | null>(null);

const value = computed(() => context.values.value[props.index] ?? context.min.value);
const percent = computed(() => context.percentOf(value.value));

const position = computed(() => {
  const isVertical = context.orientation.value === "vertical";
  const flipped = isVertical || context.isRTL.value;

  return `${(flipped ? 1 - percent.value : percent.value) * 100}%`;
});

const style = computed(() => ({
  position: "absolute" as const,
  [context.orientation.value === "vertical" ? "top" : "left"]: position.value,
  transform: "translate(-50%, -50%)",
}));

const classes = computed(() => cx(sliderVariants().thumb(), className.value));

const isDragging = computed(
  () => context.isDragging.value && rootContext.valueIndexToChangeRef.value === props.index,
);

const {isFocused, isFocusVisible} = useFocusRing(thumbRef, {
  isDisabled: context.isDisabled,
});

function handleFocus() {
  rootContext.valueIndexToChangeRef.value = props.index;
}

onMounted(() => {
  if (thumbRef.value) {
    rootContext.thumbElements.value[props.index] = thumbRef.value;
  }
});

onBeforeUnmount(() => {
  if (rootContext.thumbElements.value[props.index] === thumbRef.value) {
    rootContext.thumbElements.value[props.index] = undefined as never;
  }
});
</script>

<template>
  <div
    ref="thumbRef"
    v-bind="forwarded"
    :aria-labelledby="($attrs['aria-labelledby'] as string | undefined) ?? context.labelId"
    :aria-orientation="context.orientation.value"
    :aria-valuemax="context.max.value"
    :aria-valuemin="context.min.value"
    :aria-valuenow="value"
    :class="classes"
    :data-dragging="isDragging ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-thumb'"
    :style="style"
    :tabindex="context.isDisabled.value ? undefined : 0"
    role="slider"
    @focus="handleFocus"
  >
    <slot />
  </div>
</template>
