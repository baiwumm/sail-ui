<script setup lang="ts">
import {cx, fieldsetVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {fieldsetContextKey} from "./context";
import type {FieldsetRootProps} from "./types";

defineOptions({name: "SailFieldset", inheritAttrs: false});

const props = withDefaults(defineProps<FieldsetRootProps>(), {
  as: "fieldset",
  isDisabled: false
});

const attrs = useAttrs();
const slots = computed(() => fieldsetVariants());
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(fieldsetContextKey, {
  slots,
  isDisabled: computed(() => props.isDisabled)
});
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-slot="'fieldset'"
    :disabled="isDisabled || undefined"
  >
    <slot />
  </Primitive>
</template>
