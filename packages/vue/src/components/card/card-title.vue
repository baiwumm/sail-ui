<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {cardContextKey} from "./context";
import type {CardTitleProps} from "./types";

defineOptions({name: "SailCardTitle", inheritAttrs: false});

withDefaults(defineProps<CardTitleProps>(), {
  as: "h3"
});

const attrs = useAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.title(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-title'"
  >
    <slot />
  </Primitive>
</template>
