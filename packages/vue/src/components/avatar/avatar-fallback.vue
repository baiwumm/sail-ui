<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {AvatarFallback as AvatarFallbackPrimitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {avatarContextKey} from "./context";
import type {AvatarFallbackProps} from "./types";

defineOptions({name: "SailAvatarFallback", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarFallbackProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(avatarContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.fallback({color: props.color}), className.value));
</script>

<template>
  <AvatarFallbackPrimitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'avatar-fallback'"
    :delay-ms="props.delayMs"
  >
    <slot />
  </AvatarFallbackPrimitive>
</template>
