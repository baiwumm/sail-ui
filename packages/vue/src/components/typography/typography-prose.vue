<script setup lang="ts">
import {cx, typographyVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {ProseProps} from "./types";

defineOptions({name: "SailTypographyProse", inheritAttrs: false});

withDefaults(defineProps<ProseProps>(), {
  as: "div"
});

const attrs = useAttrs();
const classes = computed(() =>
  cx(typographyVariants().prose(), attrs.class as string | undefined)
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'prose'"
  >
    <slot />
  </Primitive>
</template>
