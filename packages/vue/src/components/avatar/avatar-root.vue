<script setup lang="ts">
import {avatarVariants, cx} from "@sail-ui/styles";
import {AvatarRoot as AvatarRootPrimitive} from "reka-ui";
import {computed, inject, provide, useAttrs} from "vue";

import {avatarGroupContextKey} from "../avatar-group/context";
import {avatarContextKey} from "./context";
import type {AvatarRootProps} from "./types";

defineOptions({name: "SailAvatar", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarRootProps>(), {
  as: "span",
});

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const {class: _class, ...rest} = attrs;

  return rest;
});
const group = inject(avatarGroupContextKey, null);
const finalSize = computed(() => props.size ?? group?.size.value);
const finalColor = computed(() => props.color ?? group?.color.value);
const finalVariant = computed(() => props.variant ?? group?.variant.value);
const slots = computed(() =>
  avatarVariants({
    color: finalColor.value,
    size: finalSize.value,
    variant: finalVariant.value,
  }),
);
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(avatarContextKey, {slots});
</script>

<template>
  <AvatarRootPrimitive v-bind="forwardedAttrs" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </AvatarRootPrimitive>
</template>
