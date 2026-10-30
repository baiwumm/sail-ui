<script setup lang="ts">
import {cx, inputGroupVariants} from "@sail-ui/styles";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {inputGroupContextKey, type InputGroupTextAreaProps} from "./types";

defineOptions({name: "SailInputGroupTextArea", inheritAttrs: false});

defineProps<InputGroupTextAreaProps>();

const model = defineModel<string>();
const context = inject(inputGroupContextKey, null);
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(inputGroupVariants().input(), className.value)
);
</script>

<template>
  <textarea
    v-bind="forwarded"
    :class="classes"
    :data-slot="'input-group-textarea'"
    :disabled="context?.isDisabled.value"
    :value="model"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>
