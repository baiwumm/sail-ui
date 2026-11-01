<script setup lang="ts">
import {avatarVariants, cx} from "@sail-ui/styles";
import {AvatarRoot as AvatarRootPrimitive} from "reka-ui";
import {computed, inject, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {avatarGroupContextKey} from "../avatar-group/context";
import {avatarContextKey} from "./context";
import type {AvatarRootProps} from "./types";

defineOptions({name: "SailAvatar", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarRootProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
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
const classes = computed(() => cx(slots.value.base(), className.value));

provide(avatarContextKey, {slots});
</script>

<template>
  <AvatarRootPrimitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </AvatarRootPrimitive>
</template>
