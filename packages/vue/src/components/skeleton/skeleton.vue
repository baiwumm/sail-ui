<script setup lang="ts">
import type {SkeletonVariants} from "@sail-ui/styles";

import {cx, skeletonVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {SkeletonRootProps} from "./types";

defineOptions({name: "SailSkeleton", inheritAttrs: false});

const props = withDefaults(defineProps<SkeletonRootProps>(), {
  as: "div",
});

const ANIMATION_VALUES: NonNullable<SkeletonVariants["animationType"]>[] = [
  "none",
  "pulse",
  "shimmer",
];

let cachedAnimation: string | undefined;
let animationCached = false;

function readAnimationVariable(): SkeletonVariants["animationType"] | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  if (!animationCached) {
    cachedAnimation = getComputedStyle(document.documentElement)
      .getPropertyValue("--skeleton-animation")
      .trim();
    animationCached = true;
  }

  return ANIMATION_VALUES.find((value) => value === cachedAnimation);
}

const {className, forwarded} = useForwardedAttrs();
const cssAnimation = ref<SkeletonVariants["animationType"]>();

onMounted(() => {
  if (props.animationType === undefined) {
    cssAnimation.value = readAnimationVariable();
  }
});

const classes = computed(() =>
  cx(
    skeletonVariants({animationType: props.animationType ?? cssAnimation.value}).base(),
    className.value,
  ),
);
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
