<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {cardContextKey} from "./context";
import type {CardHeaderProps} from "./types";

defineOptions({name: "SailCardHeader", inheritAttrs: false});

withDefaults(defineProps<CardHeaderProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.header(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-header'"
  >
    <slot />
  </Primitive>
</template>
