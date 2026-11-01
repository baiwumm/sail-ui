<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {cardContextKey} from "./context";
import type {CardTitleProps} from "./types";

defineOptions({name: "SailCardTitle", inheritAttrs: false});

withDefaults(defineProps<CardTitleProps>(), {
  as: "h3",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.title(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-title'"
  >
    <slot />
  </Primitive>
</template>
