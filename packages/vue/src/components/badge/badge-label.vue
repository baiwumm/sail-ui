<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {badgeContextKey} from "./context";
import type {BadgeLabelProps} from "./types";

defineOptions({name: "SailBadgeLabel", inheritAttrs: false});

withDefaults(defineProps<BadgeLabelProps>(), {
  as: "span"
});

const attrs = useAttrs();
const slots = inject(badgeContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.label(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'badge-label'"
  >
    <slot />
  </Primitive>
</template>
