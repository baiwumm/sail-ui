<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {cardContextKey} from "./context";
import type {CardContentProps} from "./types";

defineOptions({name: "SailCardContent", inheritAttrs: false});

withDefaults(defineProps<CardContentProps>(), {
  as: "div"
});

const attrs = useAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.content(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-content'"
  >
    <slot />
  </Primitive>
</template>
