<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {BadgeAnchorProps} from "./types";

defineOptions({name: "SailBadgeAnchor", inheritAttrs: false});

withDefaults(defineProps<BadgeAnchorProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx("badge-anchor", className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'badge-anchor'"
  >
    <slot />
  </Primitive>
</template>
