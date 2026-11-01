<script setup lang="ts">
import {cx, typographyVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {ProseProps} from "./types";

defineOptions({name: "SailTypographyProse", inheritAttrs: false});

withDefaults(defineProps<ProseProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx(typographyVariants().prose(), className.value));
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes" :data-slot="'prose'">
    <slot />
  </Primitive>
</template>
