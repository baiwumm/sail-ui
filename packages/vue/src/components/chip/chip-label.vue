<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {chipContextKey} from "./context";
import type {ChipLabelProps} from "./types";

defineOptions({name: "SailChipLabel", inheritAttrs: false});

withDefaults(defineProps<ChipLabelProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(chipContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.label(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'chip-label'"
  >
    <slot />
  </Primitive>
</template>
