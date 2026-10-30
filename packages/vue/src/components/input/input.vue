<script setup lang="ts">
import {cx, inputVariants} from "@sail-ui/styles";
import {FieldControl, injectFieldRootContext} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {textFieldContextKey, type InputProps} from "./types";

defineOptions({name: "SailInput", inheritAttrs: false});

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  fullWidth: false,
  isDisabled: false,
  isInvalid: false
});

const model = defineModel<string | number | undefined>();
const attrs = useAttrs();
const field = injectFieldRootContext(null);
const textField = inject(textFieldContextKey, null);

const variant = computed(() => props.variant ?? textField?.variant.value);

const classes = computed(() =>
  cx(inputVariants({fullWidth: props.fullWidth, variant: variant.value}), attrs.class as string | undefined)
);

const isInvalid = computed(() => Boolean(field?.invalid.value) || props.isInvalid);
const isDisabled = computed(() => Boolean(field?.disabled.value) || props.isDisabled);

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
    v-bind="$attrs"
    :aria-invalid="props.isInvalid ? true : undefined"
    :class="classes"
    :data-disabled="isDisabled ? '' : undefined"
    :data-invalid="isInvalid ? '' : undefined"
    :data-slot="'input'"
    :disabled="props.isDisabled || undefined"
    :model-value="model"
    :type="type"
    @update:model-value="updateModel"
  />
  <input
    v-else
    v-bind="$attrs"
    :aria-invalid="props.isInvalid || undefined"
    :class="classes"
    :data-disabled="props.isDisabled ? '' : undefined"
    :data-invalid="props.isInvalid ? '' : undefined"
    :data-slot="'input'"
    :disabled="props.isDisabled || undefined"
    :type="type"
    :value="model"
    @input="handleInput"
  >
</template>
