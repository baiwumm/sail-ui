<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {chipContextKey} from "./context";
import type {ChipLabelProps} from "./types";

defineOptions({name: "SailChipLabel", inheritAttrs: false});

withDefaults(defineProps<ChipLabelProps>(), {
  as: "span"
});

const attrs = useAttrs();
const slots = inject(chipContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.label(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'chip-label'"
  >
    <slot />
  </Primitive>
</template>
