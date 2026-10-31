<script setup lang="ts">
import {cx, meterVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useId, useSlots, type Slots} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {useProgressState} from "../../shared/progress";
import {flattenVNodes} from "../../shared/vnode";
import LabelRoot from "../label/label.vue";
import {meterContextKey} from "./context";
import type {MeterRootProps} from "./types";

defineOptions({name: "SailMeter", inheritAttrs: false});

const props = withDefaults(defineProps<MeterRootProps>(), {
  as: "div",
  maxValue: 100,
  minValue: 0,
  showValueLabel: true,
  value: 0,
});

const {attrs, className, forwarded} = useForwardedAttrs();
const componentSlots = useSlots() as Slots;
const labelId = useId();

const slots = computed(() => meterVariants({color: props.color, size: props.size}));
const classes = computed(() => cx(slots.value.base(), className.value));

const state = useProgressState({
  value: () => props.value,
  minValue: () => props.minValue,
  maxValue: () => props.maxValue,
  isIndeterminate: false,
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

provide(meterContextKey, {
  slots,
  percentage: state.percentage,
  valueText: state.valueText,
  showValueLabel: computed(() => props.showValueLabel),
});

provide(labelContextKey, {id: labelId, elementType: "span"});
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'meter'"
    :data-disabled="dataDisabled"
    :aria-disabled="ariaDisabled"
    :aria-labelledby="ariaLabelledBy"
    :aria-valuemax="state.maxValue.value"
    :aria-valuemin="state.minValue.value"
    :aria-valuenow="state.currentValue.value"
    :aria-valuetext="state.valueText.value"
    role="meter"
  >
    <slot :percentage="state.percentage.value" :value-text="state.valueText.value" />
  </Primitive>
</template>
