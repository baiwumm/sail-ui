<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, inject, useAttrs} from "vue";

import AvatarFallback from "../avatar/avatar-fallback.vue";
import AvatarRoot from "../avatar/avatar-root.vue";
import {avatarGroupContextKey} from "./context";
import type {AvatarGroupCountProps} from "./types";

defineOptions({name: "SailAvatarGroupCount", inheritAttrs: false});

const props = withDefaults(defineProps<AvatarGroupCountProps>(), {
  as: "span",
});

const attrs = useAttrs();
const group = inject(avatarGroupContextKey, null);
const classes = computed(() => cx(group?.slots.value.count(), attrs.class as string | undefined));
const forwardedAttrs = computed(() => {
  const {class: _class, ...rest} = attrs;

  return rest;
});

const finalSize = computed(() => props.size ?? group?.size.value);
const finalColor = computed(() => props.color ?? group?.color.value);
const finalVariant = computed(() => props.variant ?? group?.variant.value);
</script>

<template>
  <AvatarRoot
    v-bind="forwardedAttrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :color="finalColor"
    data-slot="avatar-group-count"
    :size="finalSize"
    :variant="finalVariant"
  >
    <AvatarFallback>
      <slot />
    </AvatarFallback>
  </AvatarRoot>
</template>
