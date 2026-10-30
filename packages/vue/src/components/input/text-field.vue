<script setup lang="ts">
import {cx, textFieldVariants} from "@sail-ui/styles";
import {FieldRoot} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {textFieldContextKey, type TextFieldProps} from "./types";

defineOptions({name: "SailTextField", inheritAttrs: false});

const props = defineProps<TextFieldProps>();
const {className, forwarded} = useForwardedAttrs();

provide(textFieldContextKey, {
  variant: computed(() => props.variant),
});

const classes = computed(() =>
  cx(textFieldVariants({fullWidth: props.fullWidth}), className.value),
);
</script>

<template>
  <FieldRoot
    v-bind="forwarded"
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
