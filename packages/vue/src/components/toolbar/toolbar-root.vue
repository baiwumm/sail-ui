<script setup lang="ts">
import {toolbarVariants, cx} from "@sail-ui/styles";
import {computed, onBeforeUnmount, onMounted, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDocumentDirection} from "../../shared/direction";
import {separatorToolbarContextKey} from "../separator/types";
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

// Upstream flips the orientation of inner separators: a horizontal toolbar
// renders vertical separator rules (toolbar.css sizes them with h-1/2).
provide(separatorToolbarContextKey, {
  orientation: computed(() => (props.orientation === "horizontal" ? "vertical" : "horizontal")),
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

function collectItems(toolbar: HTMLElement) {
  return [...toolbar.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (item) => !item.hasAttribute("hidden") && item.getAttribute("aria-hidden") !== "true",
  );
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

  const items = collectItems(toolbar);

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

// The toolbar is a single tab stop like the upstream RAC Toolbar: Tab moves
// focus out of the entire toolbar by focusing the last (Shift+Tab: first)
// focusable child and letting the browser continue from there.
let lastFocusedElement: HTMLElement | null = null;

function handleTabCapture(event: KeyboardEvent) {
  if (event.key !== "Tab") {
    return;
  }

  const toolbar = toolbarRef.value;

  if (!toolbar) {
    return;
  }

  const items = collectItems(toolbar);

  if (items.length === 0) {
    return;
  }

  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  if (event.shiftKey) {
    items[0]?.focus();
  } else {
    items[items.length - 1]?.focus();
  }
}

function handleFocusCapture(event: FocusEvent) {
  const toolbar = toolbarRef.value;
  const from = event.relatedTarget as Node | null;

  if (
    lastFocusedElement &&
    toolbar &&
    from &&
    !toolbar.contains(from) &&
    toolbar.contains(event.target as Node)
  ) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function handleBlurCapture(event: FocusEvent) {
  const toolbar = toolbarRef.value;
  const to = event.relatedTarget as Node | null;

  if (!lastFocusedElement && toolbar && to && !toolbar.contains(to)) {
    lastFocusedElement = event.target instanceof HTMLElement ? event.target : null;
  }
}

// A toolbar nested inside another one degrades to `group` upstream.
const isInToolbar = ref(false);

onMounted(() => {
  isInToolbar.value = Boolean(toolbarRef.value?.parentElement?.closest('[role="toolbar"]'));
});

onBeforeUnmount(() => {
  lastFocusedElement = null;
});
</script>

<template>
  <div
    ref="toolbarRef"
    v-bind="forwarded"
    :role="isInToolbar ? 'group' : 'toolbar'"
    :aria-orientation="orientation"
    :class="classes"
    :data-orientation="orientation"
    :data-slot="'toolbar'"
    :dir="resolvedDir"
    @focusin.capture="handleFocusCapture"
    @focusout.capture="handleBlurCapture"
    @keydown="handleKeydown"
    @keydown.capture="handleTabCapture"
  >
    <slot />
  </div>
</template>
