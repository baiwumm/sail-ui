<script setup lang="ts">
import {cx, scrollShadowVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, onMounted, ref, watch, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {ScrollShadowRootProps, ScrollShadowVisibility} from "./types";
import {useScrollShadow} from "./use-scroll-shadow";

defineOptions({name: "SailScrollShadow", inheritAttrs: false});

const props = withDefaults(defineProps<ScrollShadowRootProps>(), {
  as: "div",
  hideScrollBar: false,
  isEnabled: true,
  offset: 0,
  orientation: "vertical",
  size: 40,
  variant: "fade",
  visibility: "auto",
});

const emit = defineEmits<{
  "visibility-change": [visibility: ScrollShadowVisibility];
}>();

const {className, forwarded} = useForwardedAttrs();

const rootRef = ref<ComponentPublicInstance | null>(null);
const element = computed(() => (rootRef.value?.$el as HTMLElement | null | undefined) ?? null);

const slots = computed(() =>
  scrollShadowVariants({
    hideScrollBar: props.hideScrollBar,
    orientation: props.orientation,
    variant: props.variant,
  }),
);
const classes = computed(() => cx(slots.value.base(), className.value));
const style = computed(() => ({
  "--scroll-shadow-offset": `${props.offset}px`,
  "--scroll-shadow-size": `${props.size}px`,
}));

useScrollShadow({
  containerRef: element,
  isEnabled: () => props.isEnabled,
  offset: () => props.offset,
  onVisibilityChange: (visibility) => emit("visibility-change", visibility),
  orientation: () => props.orientation,
  visibility: () => props.visibility,
});

const SHADOW_ATTRIBUTES = [
  "topScroll",
  "bottomScroll",
  "topBottomScroll",
  "leftScroll",
  "rightScroll",
  "leftRightScroll",
] as const;

function applyControlledVisibility() {
  const target = element.value;

  if (!target || (props.visibility === "auto" && props.isEnabled)) {
    return;
  }

  for (const attribute of SHADOW_ATTRIBUTES) {
    delete target.dataset[attribute];
  }

  if (props.visibility === "auto") {
    return;
  }

  if (props.visibility === "both") {
    target.dataset[props.orientation === "vertical" ? "topBottomScroll" : "leftRightScroll"] =
      "true";
  } else if (props.visibility !== "none") {
    target.dataset[`${props.visibility}Scroll`] = "true";
  }
}

onMounted(applyControlledVisibility);
watch(() => [props.visibility, props.orientation, props.isEnabled], applyControlledVisibility, {
  flush: "post",
});
</script>

<template>
  <Primitive
    ref="rootRef"
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-orientation="orientation"
    :data-scroll-shadow-mode="isEnabled && visibility === 'auto' ? 'auto' : 'manual'"
    :data-scroll-shadow-size="size"
    :data-slot="'scroll-shadow'"
    :style="style"
  >
    <slot />
  </Primitive>
</template>
