<script setup lang="ts">
import {cx, labelVariants} from "@sail-ui/styles";
import {FieldLabel, injectFieldRootContext} from "reka-ui";
import {computed, useAttrs} from "vue";

defineOptions({name: "SailLabel", inheritAttrs: false});

const props = defineProps<{
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
}>();

const attrs = useAttrs();
const field = injectFieldRootContext(null);

const classes = computed(() =>
  cx(
    labelVariants({
      isDisabled: props.isDisabled || field?.disabled.value || false,
      isInvalid: props.isInvalid || field?.invalid.value || false,
      isRequired: props.isRequired || field?.required.value || false
    }),
    attrs.class as string | undefined
  )
);
</script>

<template>
  <FieldLabel
    v-if="field"
    v-bind="$attrs"
    :class="classes"
    :data-slot="'label'"
  >
    <slot />
  </FieldLabel>
  <label
    v-else
    v-bind="$attrs"
    :class="classes"
    :data-slot="'label'"
  >
    <slot />
  </label>
</template>
