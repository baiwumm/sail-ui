<script setup lang="ts">
import type {ColorValue} from "../../shared/color-context";

import {colorFieldVariants, cx} from "@sail-ui/styles";
import {ColorFieldRoot as ColorFieldRootPrimitive} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorPickerContextKey, toColor, toHex, useColorBinding} from "../../shared/color-context";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import {colorFieldContextKey} from "./context";
import type {ColorFieldRootEmits, ColorFieldRootProps} from "./types";

defineOptions({name: "SailColorField", inheritAttrs: false});

const props = withDefaults(defineProps<ColorFieldRootProps>(), {
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isRequired: false,
  fullWidth: false,
  disableWheelChange: false,
});

const emit = defineEmits<ColorFieldRootEmits>();
const model = defineModel<ColorValue>();

const {className, forwarded} = useForwardedAttrs();
const binding = useColorBinding(model, {defaultValue: props.defaultValue, fallback: "#000000"});
const colorValue = binding.value;

const classes = computed(() =>
  cx(colorFieldVariants({fullWidth: props.fullWidth}), className.value),
);

const labelId = useId();
const descriptionIds = ref<string[]>([]);
const describedBy = computed(() =>
  descriptionIds.value.length > 0 ? descriptionIds.value.join(" ") : undefined,
);
const errors = computed<string[]>(() => []);

const isDisabled = computed(() => props.isDisabled);
const isInvalid = computed(() => props.isInvalid);
const isReadOnly = computed(() => props.isReadOnly);
const isRequired = computed(() => props.isRequired);

function registerDescription(id: string) {
  if (!descriptionIds.value.includes(id)) {
    descriptionIds.value = [...descriptionIds.value, id];
  }

  return () => {
    descriptionIds.value = descriptionIds.value.filter((item) => item !== id);
  };
}

provide(fieldContextKey, {
  describedBy,
  disabled: isDisabled,
  errors,
  invalid: isInvalid,
  registerDescription,
  required: isRequired,
});

provide(labelContextKey, {id: labelId, elementType: "span"});

provide(colorFieldContextKey, {
  labelId,
  describedBy,
  isDisabled,
  isInvalid,
  isReadOnly,
  isRequired,
});

provide(colorPickerContextKey, {
  color: computed(() => toColor(binding.value.value)),
  setColor(next) {
    binding.setValue(next);
    emit("update:color", toColor(next));
    emit("change", toHex(next));
  },
});

function handleUpdate(value: unknown) {
  binding.setValue(value as ColorValue);
  emit("change", value as string);
}
</script>

<template>
  <ColorFieldRootPrimitive
    v-bind="forwarded"
    :channel="channel"
    :class="classes"
    :color-space="colorSpace"
    :data-channel="channel ?? 'hex'"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-readonly="isReadOnly ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'color-field'"
    :disable-wheel-change="disableWheelChange"
    :disabled="isDisabled"
    :locale="locale"
    :model-value="colorValue"
    :name="name"
    :readonly="isReadOnly"
    :required="isRequired"
    :step="step"
    @update:color="emit('update:color', $event)"
    @update:model-value="handleUpdate"
  >
    <slot />
  </ColorFieldRootPrimitive>
</template>
