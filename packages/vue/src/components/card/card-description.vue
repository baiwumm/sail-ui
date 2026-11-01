<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {cardContextKey} from "./context";
import type {CardDescriptionProps} from "./types";

defineOptions({name: "SailCardDescription", inheritAttrs: false});

withDefaults(defineProps<CardDescriptionProps>(), {
  as: "p",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.description(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-description'"
  >
    <slot />
  </Primitive>
</template>
