<script setup lang="ts">
import {cx, progressBarVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {useProgressState} from "../../shared/progress";
import {flattenVNodes} from "../../shared/vnode";
import LabelRoot from "../label/label.vue";
import {progressBarContextKey} from "./context";
import type {ProgressBarRootProps} from "./types";

defineOptions({name: "SailProgressBar", inheritAttrs: false});

const props = withDefaults(defineProps<ProgressBarRootProps>(), {
  as: "div",
  minValue: 0,
  maxValue: 100,
});

const {attrs, className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const labelId = useId();

const slots = computed(() => progressBarVariants({color: props.color, size: props.size}));
const classes = computed(() => cx(slots.value.base(), className.value));

const state = useProgressState({
  value: () => props.value,
  minValue: () => props.minValue,
  maxValue: () => props.maxValue,
  isIndeterminate: () => props.isIndeterminate,
  valueLabel: () => props.valueLabel,
  formatOptions: () => props.formatOptions,
});

const hasLabel = computed(() =>
  flattenVNodes(componentSlots.default?.() ?? []).some((node) => node.type === LabelRoot),
);

const ariaLabelledBy = computed(() => {
  if (attrs["aria-labelledby"]) {
    return attrs["aria-labelledby"] as string;
  }

  if (attrs["aria-label"]) {
    return undefined;
  }

  return hasLabel.value ? labelId : undefined;
});

const dataDisabled = computed(
  () => (props.isDisabled ? "true" : (attrs["data-disabled"] as string | undefined)) || undefined,
);
const ariaDisabled = computed(
  () => (props.isDisabled ? "true" : (attrs["aria-disabled"] as string | undefined)) || undefined,
);

provide(progressBarContextKey, {
  slots,
  percentage: state.percentage,
  valueText: state.valueText,
  isIndeterminate: state.isIndeterminate,
});

provide(labelContextKey, {id: labelId, elementType: "span"});
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'progress-bar'"
    :data-disabled="dataDisabled"
    :aria-disabled="ariaDisabled"
    :aria-labelledby="ariaLabelledBy"
    :aria-valuemax="state.maxValue.value"
    :aria-valuemin="state.minValue.value"
    :aria-valuenow="state.isIndeterminate.value ? undefined : state.currentValue.value"
    :aria-valuetext="state.valueText.value"
    role="progressbar"
  >
    <slot
      :is-indeterminate="state.isIndeterminate.value"
      :percentage="state.percentage.value"
      :value-text="state.valueText.value"
    />
  </Primitive>
</template>
