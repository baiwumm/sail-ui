<script setup lang="ts">
import {checkboxGroupVariants, cx} from "@sail-ui/styles";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {checkboxGroupContextKey, type CheckboxGroupRootProps} from "./types";

defineOptions({name: "SailCheckboxGroup", inheritAttrs: false});

const props = withDefaults(defineProps<CheckboxGroupRootProps>(), {
  variant: "primary",
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
});

const model = defineModel<string[]>({default: () => []});
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(checkboxGroupVariants({variant: props.variant}), className.value),
);

function isSelected(value: string) {
  return model.value.includes(value);
}

function toggle(value: string) {
  if (props.isDisabled) {
    return;
  }

  model.value = isSelected(value)
    ? model.value.filter((entry) => entry !== value)
    : [...model.value, value];
}

provide(checkboxGroupContextKey, {
  isSelected,
  isDisabled: computed(() => props.isDisabled),
  isInvalid: computed(() => props.isInvalid),
  isRequired: computed(() => props.isRequired),
  name: computed(() => props.name),
  toggle,
});
</script>

<template>
  <div
    v-bind="forwarded"
    role="group"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'checkbox-group'"
  >
    <slot />
  </div>
</template>
