<script setup lang="ts">
import {cx, sliderVariants} from "@sail-ui/styles";
import {SliderRoot} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisabledCascade} from "../../shared/disabled-cascade";
import {useDocumentDirection} from "../../shared/direction";
import {labelContextKey} from "../../shared/label-context";
import {sliderContextKey, type SliderRootProps} from "./types";

defineOptions({name: "SailSlider", inheritAttrs: false});

const props = withDefaults(defineProps<SliderRootProps>(), {
  orientation: "horizontal",
  isDisabled: false,
  min: 0,
  max: 100,
  step: 1,
});

const model = defineModel<number | number[]>();
const {className, forwarded} = useForwardedAttrs();

const isDragging = ref(false);
const labelId = useId();

const values = computed<number[]>(() => {
  const value = model.value;

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "number") {
    return [value];
  }

  return [props.min];
});

const sliderModel = computed<number[]>({
  get: () => values.value,
  set: (next) => {
    model.value = Array.isArray(model.value) ? next : next[0];
  },
});

const classes = computed(() => cx(sliderVariants().base(), className.value));

const formatter = computed(
  () => new Intl.NumberFormat(props.locale, props.formatOptions ?? {maximumFractionDigits: 2}),
);

function percentOf(value: number) {
  const range = props.max - props.min;

  if (range === 0) {
    return 0;
  }

  return (value - props.min) / range;
}

const documentDirection = useDocumentDirection();

const resolvedDir = computed(() => props.dir ?? documentDirection.value);

function isRTL() {
  return resolvedDir.value === "rtl";
}

// `<Fieldset isDisabled>` cascades to the slider, which renders as a div.
const cascadeDisabled = useDisabledCascade();

provide(sliderContextKey, {
  values,
  min: computed(() => props.min),
  max: computed(() => props.max),
  step: computed(() => props.step),
  orientation: computed(() => props.orientation),
  isDisabled: computed(() => props.isDisabled || cascadeDisabled.value),
  isRTL: computed(isRTL),
  isDragging,
  labelId,
  format: (value: number) => formatter.value.format(value),
  percentOf,
});

// The label of a slider labels the thumb, so it renders as a span instead of
// a label element.
provide(labelContextKey, {id: labelId, elementType: "span"});

function stopDragging() {
  isDragging.value = false;
}

onMounted(() => {
  window.addEventListener("pointerup", stopDragging);
  window.addEventListener("pointercancel", stopDragging);
});

onBeforeUnmount(() => {
  window.removeEventListener("pointerup", stopDragging);
  window.removeEventListener("pointercancel", stopDragging);
});
</script>

<template>
  <SliderRoot
    v-model="sliderModel"
    v-bind="forwarded"
    as="div"
    :class="classes"
    :data-slot="'slider'"
    :dir="resolvedDir"
    :disabled="isDisabled"
    :max="max"
    :min="min"
    :name="name"
    :orientation="orientation"
    :required="isRequired"
    :step="step"
    @pointerdown="isDragging = true"
  >
    <slot />
  </SliderRoot>
</template>
