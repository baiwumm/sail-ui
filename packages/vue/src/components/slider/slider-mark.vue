<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderMarkProps} from "./types";

defineOptions({name: "SailSliderMark", inheritAttrs: false});

const props = defineProps<SliderMarkProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(sliderVariants().mark(), className.value));

const percent = computed(() => context.percentOf(props.value));

const isVisible = computed(
  () => props.value >= context.min.value && props.value <= context.max.value,
);

const isFilled = computed(() => {
  const values = context.values.value;

  if (values.length === 0) {
    return false;
  }

  const start = values.length > 1 ? Math.min(...values) : values[0]!;
  const end = values.length > 1 ? Math.max(...values) : values[0]!;

  return props.value >= start && props.value <= end;
});

const style = computed(() => ({
  [context.orientation.value === "vertical" ? "bottom" : context.isRTL.value ? "right" : "left"]:
    `${percent.value * 100}%`,
}));
</script>

<template>
  <div
    v-if="isVisible"
    v-bind="forwarded"
    :class="classes"
    :data-disabled="context.isDisabled.value ? 'true' : undefined"
    :data-filled="isFilled ? 'true' : undefined"
    :data-slot="'slider-mark'"
    :data-value="value"
    :style="style"
  >
    <slot>{{ context.format(value) }}</slot>
  </div>
</template>
