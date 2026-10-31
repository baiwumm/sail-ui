<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {SelectContent as SelectContentPrimitive, SelectPortal} from "reka-ui";
import {computed, nextTick, onBeforeUnmount, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSelectContext} from "./context";
import type {SelectPopoverProps} from "./types";

defineOptions({name: "SailSelectPopover", inheritAttrs: false});

const props = withDefaults(defineProps<SelectPopoverProps>(), {
  placement: "bottom",
});

const {attrs, className, forwarded} = useForwardedAttrs();
const context = useSelectContext();

const elementRef = ref<HTMLElement | null>(null);

const classes = computed(() => cx(context.slots.value.popover(), className.value));

const forwardedAttrs = computed(() => {
  const rest = {...forwarded.value};

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

function syncContent() {
  const element = elementRef.value;

  if (!context.isMounted.value || !element) {
    context.contentRef.value = null;
    disconnectPlacementObserver();
    return;
  }

  context.contentRef.value = element;

  if (element !== observedElement) {
    observePlacement(element);
  }
}

watch(
  [() => context.isMounted.value, elementRef],
  async () => {
    await nextTick();
    syncContent();
  },
  {flush: "post"},
);

onBeforeUnmount(() => {
  disconnectPlacementObserver();
  context.contentRef.value = null;
});
</script>

<template>
  <SelectPortal>
    <SelectContentPrimitive
      as-child
      position="popper"
      :side-offset="sideOffset"
      :style="contentStyle"
    >
      <div
        :id="undefined"
        ref="elementRef"
        v-bind="forwardedAttrs"
        :role="undefined"
        :class="classes"
        :data-entering="context.isEntering.value ? 'true' : undefined"
        :data-exiting="context.isExiting.value ? 'true' : undefined"
        :data-slot="'select-popover'"
        :data-state="undefined"
      >
        <slot />
      </div>
    </SelectContentPrimitive>
  </SelectPortal>
</template>
