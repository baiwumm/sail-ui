<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {cardContextKey} from "./context";
import type {CardDescriptionProps} from "./types";

defineOptions({name: "SailCardDescription", inheritAttrs: false});

withDefaults(defineProps<CardDescriptionProps>(), {
  as: "p",
});

const attrs = useAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.description(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-description'"
  >
    <slot />
  </Primitive>
</template>
