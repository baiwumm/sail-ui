<script setup lang="ts">
import {cardVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {surfaceContextKey} from "../surface/context";
import {cardContextKey} from "./context";
import type {CardRootProps} from "./types";

defineOptions({name: "SailCard", inheritAttrs: false});

const props = withDefaults(defineProps<CardRootProps>(), {
  as: "div",
  variant: "default",
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => cardVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), className.value));

provide(cardContextKey, {slots});
provide(
  surfaceContextKey,
  computed(() => (props.variant === "transparent" ? undefined : props.variant)),
);
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes" :data-slot="'card'">
    <slot />
  </Primitive>
</template>
