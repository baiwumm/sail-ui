<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {
  injectSelectRootContext,
  SelectContent as SelectContentPrimitive,
  SelectPortal,
} from "reka-ui";
import {computed, nextTick, onBeforeUnmount, onMounted, useAttrs, watch} from "vue";

import {useSelectContext} from "./context";
import type {SelectPopoverProps} from "./types";

defineOptions({name: "SailSelectPopover", inheritAttrs: false});

const props = withDefaults(defineProps<SelectPopoverProps>(), {
  placement: "bottom",
});

const attrs = useAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();

const classes = computed(() =>
  cx(context.slots.value.popover(), attrs.class as string | undefined),
);

const forwardedAttrs = computed(() => {
  const rest: Record<string, unknown> = {...attrs};

  delete rest.class;
  delete rest.style;

  return rest;
});

const contentStyle = computed(() => [
  attrs.style,
  {
    "--trigger-width": "var(--reka-select-trigger-width)",
    "--trigger-anchor-point": "var(--reka-select-content-transform-origin)",
  },
]);

let observedElement: HTMLElement | null = null;
let placementObserver: MutationObserver | null = null;

function disconnectPlacementObserver() {
  placementObserver?.disconnect();
  placementObserver = null;
  observedElement = null;
}

// Reka reports the resolved side as `data-side`; upstream CSS selects on data-placement.
function observePlacement(element: HTMLElement) {
  disconnectPlacementObserver();
  observedElement = element;

  const applyPlacement = () => {
    const side = element.getAttribute("data-side") ?? props.placement;

    if (element.getAttribute("data-placement") !== side) {
      element.setAttribute("data-placement", side);
    }
  };

  applyPlacement();
  placementObserver = new MutationObserver(applyPlacement);
  placementObserver.observe(element, {
    attributeFilter: ["data-side"],
    attributes: true,
  });
}

async function syncContent() {
  await nextTick();

  if (!context.isMounted.value) {
    context.contentRef.value = null;
    disconnectPlacementObserver();
    return;
  }

  const contentId = rootContext.contentId;
  const element = contentId ? document.getElementById(contentId) : null;

  if (!(element instanceof HTMLElement)) {
    return;
  }

  context.contentRef.value = element;

  if (element !== observedElement) {
    observePlacement(element);
  }
}

watch(() => context.isMounted.value, syncContent, {flush: "post"});
onMounted(syncContent);
onBeforeUnmount(() => {
  disconnectPlacementObserver();
  context.contentRef.value = null;
});
</script>

<template>
  <SelectPortal>
    <SelectContentPrimitive
      v-bind="forwardedAttrs"
      position="popper"
      :class="classes"
      :data-entering="context.isEntering.value ? 'true' : undefined"
      :data-exiting="context.isExiting.value ? 'true' : undefined"
      :data-slot="'select-popover'"
      :side-offset="sideOffset"
      :style="contentStyle"
    >
      <slot />
    </SelectContentPrimitive>
  </SelectPortal>
</template>
