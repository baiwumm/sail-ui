<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {badgeContextKey} from "./context";
import type {BadgeLabelProps} from "./types";

defineOptions({name: "SailBadgeLabel", inheritAttrs: false});

withDefaults(defineProps<BadgeLabelProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(badgeContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.label(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'badge-label'"
  >
    <slot />
  </Primitive>
</template>
