<script setup lang="ts">
import {colorInputGroupVariants, cx} from "@sail-ui/styles";
import {ColorFieldInput as ColorFieldInputPrimitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {colorFieldContextKey} from "./context";

defineOptions({name: "SailColorInputGroupInput", inheritAttrs: false});

const field = inject(colorFieldContextKey)!;
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(colorInputGroupVariants().input(), className.value));
</script>

<template>
  <ColorFieldInputPrimitive as-child>
    <input
      v-bind="forwarded"
      :aria-describedby="field.describedBy.value"
      :aria-invalid="field.isInvalid.value ? 'true' : undefined"
      :aria-labelledby="field.labelId"
      :class="classes"
      :data-disabled="field.isDisabled.value ? 'true' : undefined"
      :data-readonly="field.isReadOnly.value ? 'true' : undefined"
      :data-slot="'color-input-group-input'"
    />
  </ColorFieldInputPrimitive>
</template>
