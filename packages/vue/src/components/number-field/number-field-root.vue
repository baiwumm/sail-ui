<script setup lang="ts">
import {cx, numberFieldVariants} from "@sail-ui/styles";
import {NumberFieldRoot} from "reka-ui";
import {computed, provide, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {labelContextKey} from "../../shared/label-context";
import {numberFieldContextKey, type NumberFieldRootProps} from "./types";

defineOptions({name: "SailNumberField", inheritAttrs: false});

const props = withDefaults(defineProps<NumberFieldRootProps>(), {
  variant: "primary",
  fullWidth: false,
  isDisabled: false,
  isReadOnly: false,
  isInvalid: false,
  isRequired: false,
  step: 1
});

const model = defineModel<number | undefined>();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(
    numberFieldVariants({
      fullWidth: props.fullWidth,
      variant: props.variant
    }).base(),
    className.value
  )
);

const labelId = useId();

provide(numberFieldContextKey, {labelId});

// The label of a number field names the spin button, so it renders as a span.
provide(labelContextKey, {id: labelId, elementType: "span"});
</script>

<template>
  <NumberFieldRoot
    v-model="model"
    v-bind="forwarded"
    :class="classes"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-slot="'number-field'"
    :disabled="isDisabled"
    :format-options="formatOptions"
    :locale="locale"
    :max="max"
    :min="min"
    :name="name"
    :readonly="isReadOnly"
    :required="isRequired"
    :step="step"
  >
    <slot />
  </NumberFieldRoot>
</template>
