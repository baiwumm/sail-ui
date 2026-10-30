<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {fieldsetContextKey} from "./context";
import type {FieldsetLegendProps} from "./types";

defineOptions({name: "SailFieldsetLegend", inheritAttrs: false});

withDefaults(defineProps<FieldsetLegendProps>(), {
  as: "legend"
});

const attrs = useAttrs();
const slots = inject(fieldsetContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.legend(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'fieldset-legend'"
  >
    <slot />
  </Primitive>
</template>
