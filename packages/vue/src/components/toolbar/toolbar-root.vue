<script setup lang="ts">
import {toolbarVariants, cx} from "@sail-ui/styles";
import {computed, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDocumentDirection} from "../../shared/direction";
import {toolbarContextKey, type ToolbarRootProps} from "./types";

defineOptions({name: "SailToolbar", inheritAttrs: false});

const props = withDefaults(defineProps<ToolbarRootProps>(), {
  orientation: "horizontal",
  isAttached: false,
});

const {className, forwarded} = useForwardedAttrs();
const toolbarRef = ref<HTMLElement | null>(null);

const classes = computed(() =>
  cx(
    toolbarVariants({
      isAttached: props.isAttached,
      orientation: props.orientation,
    }),
    className.value,
  ),
);

provide(toolbarContextKey, {
  orientation: computed(() => props.orientation),
});

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const documentDirection = useDocumentDirection();

const resolvedDir = computed(() => props.dir ?? documentDirection.value);

function isRTL() {
  return resolvedDir.value === "rtl";
}

/**
 * Arrow keys move the focus between the controls of the toolbar, matching the
 * upstream React Aria behaviour. The controls stay regular tab stops.
 */
function handleKeydown(event: KeyboardEvent) {
  // A nested group already handled the key, for example the roving focus of a
  // toggle button group inside the toolbar.
  if (event.defaultPrevented) {
    return;
  }

  const isHorizontal = props.orientation === "horizontal";
  const forwardKey = isHorizontal ? "ArrowRight" : "ArrowDown";
  const backwardKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

  if (event.key !== forwardKey && event.key !== backwardKey) {
    return;
  }

  const toolbar = toolbarRef.value;

  if (!toolbar) {
    return;
  }

  const items = [...toolbar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (item) => !item.hasAttribute("hidden") && item.getAttribute("aria-hidden") !== "true",
  );

  if (items.length === 0) {
    return;
  }

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);

  if (currentIndex === -1) {
    return;
  }

  const rtl = isHorizontal && isRTL();
  const isForward = event.key === forwardKey;
  const step = (rtl ? !isForward : isForward) ? 1 : -1;
  const nextIndex = (currentIndex + step + items.length) % items.length;

  event.preventDefault();
  items[nextIndex]?.focus();
}
</script>

<template>
  <div
    ref="toolbarRef"
    v-bind="forwarded"
    role="toolbar"
    :aria-orientation="orientation"
    :class="classes"
    :data-orientation="orientation"
    :data-slot="'toolbar'"
    :dir="resolvedDir"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>
