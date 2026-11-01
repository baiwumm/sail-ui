<script setup lang="ts">
import {cx, separatorVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {separatorToolbarContextKey, type SeparatorRootProps} from "./types";

defineOptions({name: "SailSeparator", inheritAttrs: false});

const props = withDefaults(defineProps<SeparatorRootProps>(), {
  isDecorative: false,
  variant: "default",
});

const {className, forwarded} = useForwardedAttrs();
const toolbar = inject(separatorToolbarContextKey, null);

// The separator's own orientation wins; inside a toolbar the context provides
// the orientation flipped relative to the toolbar, matching upstream.
const orientation = computed(() => props.orientation ?? toolbar?.orientation.value ?? "horizontal");

const element = computed(() => {
  const requested = (props.as as string | undefined) ?? props.elementType ?? "div";

  if (props.isDecorative && requested === "hr" && orientation.value === "vertical") {
    return "div";
  }

  return requested;
});

const classes = computed(() =>
  cx(separatorVariants({orientation: orientation.value, variant: props.variant}), className.value),
);

const isNativeHr = computed(() => element.value === "hr");
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="element"
    :as-child="asChild"
    :class="classes"
    :data-orientation="orientation"
    :data-slot="'separator'"
    :aria-hidden="isDecorative ? 'true' : undefined"
    :aria-orientation="
      !isDecorative && !isNativeHr && orientation === 'vertical' ? 'vertical' : undefined
    "
    :role="isDecorative ? 'presentation' : isNativeHr ? undefined : 'separator'"
  >
    <slot />
  </Primitive>
</template>
