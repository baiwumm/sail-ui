<script setup lang="ts">
import type {Color} from "reka-ui";

import type {ColorValue} from "../../shared/color-context";

import {cx, colorAreaVariants} from "@sail-ui/styles";
import {
  ColorAreaArea as ColorAreaAreaPrimitive,
  ColorAreaRoot as ColorAreaRootPrimitive,
  colorToString,
} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {toColor, useColorBinding} from "../../shared/color-context";
import {colorAreaContextKey, type ColorAreaRootEmits, type ColorAreaRootProps} from "./types";

defineOptions({name: "SailColorArea", inheritAttrs: false});

const props = withDefaults(defineProps<ColorAreaRootProps>(), {
  colorSpace: "hsl",
  xChannel: "hue",
  yChannel: "saturation",
  isDisabled: false,
  isRequired: false,
  showDots: false,
});

const emit = defineEmits<ColorAreaRootEmits>();
const model = defineModel<ColorValue>();

const {className, forwarded} = useForwardedAttrs();
const binding = useColorBinding(model, {
  defaultValue: props.defaultValue,
  fallback: "#ff0000",
});
const colorValue = binding.value;

const slots = computed(() => colorAreaVariants({showDots: props.showDots}));
const classes = computed(() => cx(slots.value.base(), className.value));

const isDragging = ref(false);

provide(colorAreaContextKey, {isDragging});

function handleUpdate(value: unknown) {
  binding.setValue(value as ColorValue);
  emit(
    "change",
    typeof value === "string" ? value : colorToString(toColor(value as ColorValue), "hex"),
  );
}

function handleUpdateColor(value: Color) {
  emit("update:color", value);
}

function handlePointerDown() {
  isDragging.value = true;
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

function areaBackground(style: Record<string, unknown> | undefined) {
  const background = style?.background;
  const backgroundImage = style?.backgroundImage;
  const backgroundColor = style?.backgroundColor;

  if (typeof background === "string") {
    return background;
  }

  if (typeof backgroundImage === "string" && typeof backgroundColor === "string") {
    return `${backgroundImage} ${backgroundColor}`;
  }

  if (typeof backgroundImage === "string") {
    return backgroundImage;
  }

  return typeof backgroundColor === "string" ? backgroundColor : "transparent";
}
</script>

<template>
  <ColorAreaRootPrimitive
    :color-space="colorSpace"
    :disabled="isDisabled"
    :model-value="colorValue"
    :name="name"
    :required="isRequired"
    :x-channel="xChannel"
    :x-name="xName"
    :y-channel="yChannel"
    :y-name="yName"
    @change-end="emit('change-end', $event)"
    @update:color="handleUpdateColor"
    @update:model-value="handleUpdate"
  >
    <template #default="{style}">
      <ColorAreaAreaPrimitive as-child @pointerdown="handlePointerDown">
        <div
          v-bind="forwarded"
          :class="classes"
          :data-disabled="isDisabled ? 'true' : undefined"
          :data-slot="'color-area'"
          :style="{
            '--color-area-background': areaBackground(style as Record<string, unknown>),
            backgroundBlendMode: (style as Record<string, unknown>)?.backgroundBlendMode as
              string | undefined,
          }"
        >
          <slot />
        </div>
      </ColorAreaAreaPrimitive>
    </template>
  </ColorAreaRootPrimitive>
</template>
