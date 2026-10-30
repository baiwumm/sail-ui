<script setup lang="ts">
import {useFocusRing, useHover} from "@sail-ui/primitives";
import {cx, inputVariants} from "@sail-ui/styles";
import {FieldControl, injectFieldRootContext} from "reka-ui";
import {computed, inject, ref, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {textFieldContextKey, type InputProps} from "./types";

defineOptions({name: "SailInput", inheritAttrs: false});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  fullWidth: false,
  isDisabled: false,
  isInvalid: false,
});

const model = defineModel<string | number | undefined>();
const {className, forwarded} = useForwardedAttrs();
const field = injectFieldRootContext(null);
const textField = inject(textFieldContextKey, null);
const inputRef = ref<ComponentPublicInstance | HTMLInputElement | null>(null);

if (model.value === undefined && props.defaultValue !== undefined) {
  model.value = props.defaultValue;
}

const variant = computed(() => props.variant ?? textField?.variant.value);

const classes = computed(() =>
  cx(inputVariants({fullWidth: props.fullWidth, variant: variant.value}), className.value),
);

const isInvalid = computed(() => Boolean(field?.invalid.value) || props.isInvalid);
const isDisabled = computed(() => Boolean(field?.disabled.value) || props.isDisabled);

const element = computed(() => {
  const value = inputRef.value as ComponentPublicInstance | HTMLInputElement | null;

  if (!value) {
    return null;
  }

  return "$el" in value ? (value.$el as Element | null) : value;
});

const {isHovered} = useHover(element, {isDisabled});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

function updateModel(value: string | number) {
  model.value = value;
}

function handleInput(event: Event) {
  updateModel((event.target as HTMLInputElement).value);
}
</script>

<template>
  <FieldControl
    v-if="field"
    ref="inputRef"
    v-bind="forwarded"
    :aria-invalid="isInvalid ? true : undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'input'"
    :disabled="isDisabled"
    :model-value="model"
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    :type="type"
    @update:model-value="updateModel"
  />
  <input
    v-else
    ref="inputRef"
    v-bind="forwarded"
    :aria-invalid="isInvalid || undefined"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'input'"
    :disabled="isDisabled"
    :name="name"
    :placeholder="placeholder"
    :required="isRequired"
    :type="type"
    :value="model"
    @input="handleInput"
  />
</template>
