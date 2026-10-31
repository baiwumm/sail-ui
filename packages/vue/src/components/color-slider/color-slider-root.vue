<script setup lang="ts">
import type {ColorSpace} from "reka-ui";

import {colorSliderVariants, cx} from "@sail-ui/styles";
import {ColorSliderRoot as ColorSliderRootPrimitive} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useColorBinding, type ColorValue} from "../../shared/color-context";
import {useDocumentDirection} from "../../shared/direction";
import {labelContextKey} from "../../shared/label-context";
import {colorSliderContextKey, type ColorSliderRootEmits, type ColorSliderRootProps} from "./types";

defineOptions({name: "SailColorSlider", inheritAttrs: false});

const props = withDefaults(defineProps<ColorSliderRootProps>(), {
  orientation: "horizontal",
  inverted: false,
  isDisabled: false,
});

const emit = defineEmits<ColorSliderRootEmits>();
const model = defineModel<ColorValue>();

const {className, forwarded} = useForwardedAttrs();
const binding = useColorBinding(model, {defaultValue: props.defaultValue, fallback: "#000000"});
const colorValue = binding.value;

const classes = computed(() => cx(colorSliderVariants().base(), className.value));

const documentDirection = useDocumentDirection();
const resolvedDir = computed(() => props.dir ?? documentDirection.value);

const REQUIRED_SPACE: Partial<Record<string, ColorSpace>> = {
  red: "rgb",
  green: "rgb",
  blue: "rgb",
  lightness: "hsl",
  brightness: "hsb",
};
const HSL_HSB_ONLY = new Set(["hue", "saturation"]);

function warnInDev(message: string) {
  if (import.meta.env.DEV) {
    console.warn(message);
  }
}

const resolvedColorSpace = computed<ColorSpace | undefined>(() => {
  const required = REQUIRED_SPACE[props.channel];

  if (required && props.colorSpace && props.colorSpace !== required) {
    warnInDev(
      `[SailUI ColorSlider] Invalid combination: channel="${props.channel}" requires colorSpace="${required}", ` +
        `but received colorSpace="${props.colorSpace}". Auto-correcting to "${required}".`,
    );

    return required;
  }

  if (HSL_HSB_ONLY.has(props.channel) && props.colorSpace === "rgb") {
    warnInDev(
      `[SailUI ColorSlider] Invalid combination: channel="${props.channel}" is not available in RGB color space. ` +
        `Use colorSpace="hsl" or colorSpace="hsb" instead. Auto-correcting to "hsl".`,
    );

    return "hsl";
  }

  return props.colorSpace;
});

const isDragging = ref(false);

provide(colorSliderContextKey, {isDragging, dir: resolvedDir});

provide(labelContextKey, {id: useId(), elementType: "span"});

function handleUpdate(value: unknown) {
  binding.setValue(value as ColorValue);
}

function startDragging() {
  if (!props.isDisabled) {
    isDragging.value = true;
  }
}

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
  <ColorSliderRootPrimitive
    v-bind="forwarded"
    as="div"
    :channel="channel"
    :class="classes"
    :color-space="resolvedColorSpace"
    :data-slot="'color-slider'"
    :dir="resolvedDir"
    :disabled="isDisabled"
    :inverted="inverted"
    :model-value="colorValue"
    :name="name"
    :orientation="orientation"
    :required="isRequired"
    :step="step"
    @change="emit('change', $event)"
    @change-end="emit('change-end', $event)"
    @pointerdown="startDragging"
    @update:color="emit('update:color', $event)"
    @update:model-value="handleUpdate"
  >
    <slot />
  </ColorSliderRootPrimitive>
</template>
