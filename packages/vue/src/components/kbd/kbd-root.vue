<script setup lang="ts">
import {cx, kbdVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {kbdContextKey} from "./context";
import type {KbdRootProps} from "./types";

defineOptions({name: "SailKbd", inheritAttrs: false});

const props = withDefaults(defineProps<KbdRootProps>(), {
  as: "kbd",
});

const attrs = useAttrs();
const slots = computed(() => kbdVariants({variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(kbdContextKey, {slots});
</script>

<template>
  <Primitive v-bind="$attrs" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
