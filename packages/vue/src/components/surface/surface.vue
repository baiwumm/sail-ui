<script setup lang="ts">
import {surfaceVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {surfaceContextKey} from "./context";
import type {SurfaceProps} from "./types";

defineOptions({name: "SailSurface", inheritAttrs: false});

const props = withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  variant: "default",
});

const attrs = useAttrs();

provide(
  surfaceContextKey,
  computed(() => props.variant),
);

const classes = computed(() =>
  cx(surfaceVariants({variant: props.variant}), attrs.class as string | undefined),
);
</script>

<template>
  <Primitive v-bind="$attrs" :as="as" :as-child="asChild" :class="classes" :data-slot="'surface'">
    <slot />
  </Primitive>
</template>
