<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {cardContextKey} from "./context";
import type {CardFooterProps} from "./types";

defineOptions({name: "SailCardFooter", inheritAttrs: false});

withDefaults(defineProps<CardFooterProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.footer(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-footer'"
  >
    <slot />
  </Primitive>
</template>
