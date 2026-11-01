<script setup lang="ts">
import {radioGroupVariants, cx} from "@sail-ui/styles";
import {computed, provide, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisabledCascade} from "../../shared/disabled-cascade";
import {radioGroupContextKey, type RadioGroupRootProps} from "./types";

defineOptions({name: "SailRadioGroup", inheritAttrs: false});

const props = withDefaults(defineProps<RadioGroupRootProps>(), {
  variant: "primary",
  orientation: "vertical",
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
});

const model = defineModel<string>();
const {className, forwarded} = useForwardedAttrs();
const generatedName = useId();

const name = computed(() => props.name ?? generatedName);
const classes = computed(() => cx(radioGroupVariants({variant: props.variant}), className.value));

// `<Fieldset isDisabled>` cascades to div-based groups the browser cannot
// disable natively.
const cascadeDisabled = useDisabledCascade();
const isDisabled = computed(() => props.isDisabled || cascadeDisabled.value);

provide(radioGroupContextKey, {
  name,
  isDisabled,
  isInvalid: computed(() => props.isInvalid),
  isRequired: computed(() => props.isRequired),
  selectedValue: computed(() => model.value),
  hasSelection: computed(() => model.value !== undefined),
  select: (value: string) => {
    if (isDisabled.value) {
      return;
    }

    model.value = value;
  },
});
</script>

<template>
  <div
    v-bind="forwarded"
    role="radiogroup"
    :aria-orientation="orientation"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-orientation="orientation"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'radio-group'"
    :dir="dir"
  >
    <slot />
  </div>
</template>
