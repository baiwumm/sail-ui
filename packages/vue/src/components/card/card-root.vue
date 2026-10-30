<script setup lang="ts">
import {cardVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {surfaceContextKey} from "../surface/context";
import {cardContextKey} from "./context";
import type {CardRootProps} from "./types";

defineOptions({name: "SailCard", inheritAttrs: false});

const props = withDefaults(defineProps<CardRootProps>(), {
  as: "div",
  variant: "default"
});

const attrs = useAttrs();
const slots = computed(() => cardVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(cardContextKey, {slots});
provide(
  surfaceContextKey,
  computed(() => (props.variant === "transparent" ? undefined : props.variant))
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'card'"
  >
    <slot />
  </Primitive>
</template>
