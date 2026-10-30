<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {cardContextKey} from "./context";
import type {CardHeaderProps} from "./types";

defineOptions({name: "SailCardHeader", inheritAttrs: false});

withDefaults(defineProps<CardHeaderProps>(), {
  as: "div"
});

const attrs = useAttrs();
const slots = inject(cardContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.header(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card-header'"
  >
    <slot />
  </Primitive>
</template>
