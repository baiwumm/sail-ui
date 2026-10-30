<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {AvatarFallback as AvatarFallbackPrimitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {avatarContextKey} from "./context";
import type {AvatarFallbackProps} from "./types";

defineOptions({name: "SailAvatarFallback", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarFallbackProps>(), {
  as: "span"
});

const attrs = useAttrs();
const slots = inject(avatarContextKey, null)?.slots;
const classes = computed(() =>
  cx(slots?.value.fallback({color: props.color}), attrs.class as string | undefined)
);
</script>

<template>
  <AvatarFallbackPrimitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'avatar-fallback'"
    :delay-ms="props.delayMs"
  >
    <slot />
  </AvatarFallbackPrimitive>
</template>
