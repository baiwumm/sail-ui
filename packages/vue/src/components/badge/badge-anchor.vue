<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {BadgeAnchorProps} from "./types";

defineOptions({name: "SailBadgeAnchor", inheritAttrs: false});

withDefaults(defineProps<BadgeAnchorProps>(), {
  as: "span"
});

const attrs = useAttrs();
const classes = computed(() => cx("badge-anchor", attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'badge-anchor'"
  >
    <slot />
  </Primitive>
</template>
