<script setup lang="ts">
import {surfaceVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {surfaceContextKey} from "./context";
import type {SurfaceProps} from "./types";

defineOptions({name: "SailSurface", inheritAttrs: false});

const props = withDefaults(defineProps<SurfaceProps>(), {
  as: "div",
  variant: "default",
});

const {className, forwarded} = useForwardedAttrs();

provide(
  surfaceContextKey,
  computed(() => props.variant),
);

const classes = computed(() => cx(surfaceVariants({variant: props.variant}), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'surface'"
  >
    <slot />
  </Primitive>
</template>
