<script setup lang="ts">
import {cx, textFieldVariants} from "@sail-ui/styles";
import {FieldRoot} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {textFieldContextKey, type TextFieldProps} from "./types";

defineOptions({name: "SailTextField", inheritAttrs: false});

const props = defineProps<TextFieldProps>();
const attrs = useAttrs();

provide(textFieldContextKey, {
  variant: computed(() => props.variant)
});

const classes = computed(() =>
  cx(textFieldVariants({fullWidth: props.fullWidth}), attrs.class as string | undefined)
);
</script>

<template>
  <FieldRoot
    v-bind="$attrs"
    :class="classes"
    :data-slot="'textfield'"
    :disabled="isDisabled"
    :invalid="isInvalid"
    :name="name"
    :required="isRequired"
    :validate="validate"
    :validation-debounce-time="validationDebounceTime"
    :validation-mode="validationMode"
  >
    <slot />
  </FieldRoot>
</template>
