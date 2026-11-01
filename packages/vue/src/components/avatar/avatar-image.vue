<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {AvatarImage as AvatarImagePrimitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {avatarContextKey} from "./context";
import type {AvatarImageProps} from "./types";

defineOptions({name: "SailAvatarImage", inheritAttrs: false});

const props = defineProps<AvatarImageProps>();
const {className, forwarded} = useForwardedAttrs();
const slots = inject(avatarContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.image(), className.value));
</script>

<template>
  <AvatarImagePrimitive
    v-bind="forwarded"
    :as="props.as"
    :as-child="props.asChild"
    :class="classes"
    :cross-origin="props.crossOrigin"
    :referrer-policy="props.referrerPolicy"
    :src="props.src"
  />
</template>
