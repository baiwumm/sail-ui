<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {sliderContextKey, type SliderStepsProps} from "./types";

defineOptions({name: "SailSliderSteps", inheritAttrs: false});

defineProps<SliderStepsProps>();

const context = inject(sliderContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(sliderVariants().steps(), className.value));

function getDecimalPlaces(value: number) {
  const [coefficient, exponent = "0"] = value.toString().split("e");

  return Math.max(0, (coefficient!.split(".")[1]?.length ?? 0) - Number(exponent));
}

const steps = computed(() => {
  const {min, max, step} = {
    min: context.min.value,
    max: context.max.value,
    step: context.step.value
  };

  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    return [];
  }

  if (!Number.isFinite(step) || step <= 0) {
    return [];
  }

  const stepCount = (max - min) / step;
  const count = Math.floor(stepCount + Number.EPSILON * Math.max(1, stepCount) * 4) + 1;

  if (!Number.isFinite(count) || count <= 0 || count > 1000) {
    return [];
  }

  const precision = Math.max(getDecimalPlaces(min), getDecimalPlaces(step));

  return Array.from({length: count}, (_, index) => {
    const rawValue = min + index * step;

    return {
      value: Math.min(max, precision <= 100 ? Number(rawValue.toFixed(precision)) : rawValue),
      percent: context.percentOf(Math.min(max, rawValue))
    };
  });
});

function isFilled(value: number) {
  const values = context.values.value;

  if (values.length === 0) {
    return false;
  }

  const start = values.length > 1 ? Math.min(...values) : values[0]!;
  const end = values.length > 1 ? Math.max(...values) : values[0]!;

  return value >= start && value <= end;
}

const direction = computed(() => (context.isRTL.value ? "rtl" : "ltr"));
</script>

<template>
  <div
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-direction="direction"
    :data-disabled="context.isDisabled.value ? 'true' : undefined"
    :data-orientation="context.orientation.value"
    :data-slot="'slider-steps'"
  >
    <span
      v-for="step in steps"
      :key="step.value"
      :class="sliderVariants().step()"
      :data-filled="isFilled(step.value) ? 'true' : undefined"
      :data-slot="'slider-step'"
      :data-value="step.value"
      :style="{
        [context.orientation.value === 'vertical' ? 'bottom' : context.isRTL.value ? 'right' : 'left']:
          `${step.percent * 100}%`
      }"
    />
  </div>
</template>
