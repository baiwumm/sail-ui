<script setup lang="ts">
import {cx, separatorVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {SeparatorRootProps} from "./types";

defineOptions({name: "SailSeparator", inheritAttrs: false});

const props = withDefaults(defineProps<SeparatorRootProps>(), {
  isDecorative: false,
  orientation: "horizontal",
  variant: "default"
});

const attrs = useAttrs();

const element = computed(() => {
  const requested = (props.as as string | undefined) ?? props.elementType ?? "div";

  if (props.isDecorative && requested === "hr" && props.orientation === "vertical") {
    return "div";
  }

  return requested;
});

const classes = computed(() =>
  cx(
    separatorVariants({orientation: props.orientation, variant: props.variant}),
    attrs.class as string | undefined
  )
);

const isNativeHr = computed(() => element.value === "hr");
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="element"
    :as-child="asChild"
    :class="classes"
    :data-orientation="orientation"
    :data-slot="'separator'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-orientation="!isDecorative && !isNativeHr && orientation === 'vertical' ? 'vertical' : undefined"
    :role="isDecorative ? 'presentation' : isNativeHr ? undefined : 'separator'"
  >
    <slot />
  </Primitive>
</template>
