<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {AvatarImage as AvatarImagePrimitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {avatarContextKey} from "./context";
import type {AvatarImageProps} from "./types";

defineOptions({name: "SailAvatarImage", inheritAttrs: false});

const props = defineProps<AvatarImageProps>();
const attrs = useAttrs();
const slots = inject(avatarContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.image(), attrs.class as string | undefined));
</script>

<template>
  <AvatarImagePrimitive
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :class="classes"
    :cross-origin="props.crossOrigin"
    :referrer-policy="props.referrerPolicy"
    :src="props.src"
  />
</template>
