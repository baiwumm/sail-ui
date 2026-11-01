<script setup lang="ts">
import {cx, kbdVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {kbdContextKey} from "./context";
import type {KbdRootProps} from "./types";

defineOptions({name: "SailKbd", inheritAttrs: false});

const props = withDefaults(defineProps<KbdRootProps>(), {
  as: "kbd",
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => kbdVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), className.value));

provide(kbdContextKey, {slots});
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
