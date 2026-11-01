<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {fieldsetContextKey} from "./context";
import type {FieldsetLegendProps} from "./types";

defineOptions({name: "SailFieldsetLegend", inheritAttrs: false});

withDefaults(defineProps<FieldsetLegendProps>(), {
  as: "legend",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(fieldsetContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.legend(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'fieldset-legend'"
  >
    <slot />
  </Primitive>
</template>
