<script setup lang="ts">
import {cx, fieldsetVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {disabledCascadeKey} from "../../shared/disabled-cascade";
import {fieldsetContextKey} from "./context";
import type {FieldsetRootProps} from "./types";

defineOptions({name: "SailFieldset", inheritAttrs: false});

const props = withDefaults(defineProps<FieldsetRootProps>(), {
  as: "fieldset",
  isDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => fieldsetVariants());
const classes = computed(() => cx(slots.value.base(), className.value));

provide(fieldsetContextKey, {
  slots,
  isDisabled: computed(() => props.isDisabled),
});

// Native `<fieldset disabled>` only disables form-associated elements, so the
// state is also cascaded to the controls the browser cannot reach.
provide(
  disabledCascadeKey,
  computed(() => props.isDisabled),
);
</script>

<template>
  <Primitive
    v-bind="forwarded"
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
