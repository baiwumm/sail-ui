<script setup lang="ts">
import {scrollShadowVariants, cx} from "@sail-ui/styles";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "../../shared/icons";
import {useTabsContext} from "./context";

defineOptions({name: "SailTabListContainer", inheritAttrs: false});

const root = useTabsContext();
const {className, forwarded} = useForwardedAttrs();

const scrollerRef = ref<HTMLElement | null>(null);
const slots = computed(() => root.slots.value);
const containerClasses = computed(() => cx(slots.value.tabListContainer(), className.value));
const scrollerClasses = computed(() =>
  cx(
    scrollShadowVariants({hideScrollBar: true, orientation: root.orientation.value}).base(),
    slots.value.scroller(),
  ),
);
const isVertical = computed(() => root.orientation.value === "vertical");

const scrollerStyle = {
  "--scroll-shadow-offset": "0px",
  "--scroll-shadow-size": "64px",
};

let previous: {before: boolean; after: boolean} | null = null;
let frame: number | null = null;

function updateOverflow() {
  const element = scrollerRef.value;

  if (!element) {
    return;
  }

  const vertical = isVertical.value;
  const start = vertical ? element.scrollTop : Math.abs(element.scrollLeft);
  const scrollSize = vertical ? element.scrollHeight : element.scrollWidth;
  const clientSize = vertical ? element.clientHeight : element.clientWidth;
  const before = start > 0;
  const after = start + clientSize < scrollSize - 1;

  if (previous && previous.before === before && previous.after === after) {
    return;
  }

  previous = {after, before};

  if (frame !== null) {
    cancelAnimationFrame(frame);
  }

  frame = requestAnimationFrame(() => {
    frame = null;

    if (vertical) {
      if (before && after) {
        element.dataset["topBottomScroll"] = "true";
        delete element.dataset["topScroll"];
        delete element.dataset["bottomScroll"];
      } else {
        element.dataset["topScroll"] = String(before);
        element.dataset["bottomScroll"] = String(after);
        delete element.dataset["topBottomScroll"];
      }
    } else if (before && after) {
      element.dataset["leftRightScroll"] = "true";
      delete element.dataset["leftScroll"];
      delete element.dataset["rightScroll"];
    } else {
      element.dataset["leftScroll"] = String(before);
      element.dataset["rightScroll"] = String(after);
      delete element.dataset["leftRightScroll"];
    }
  });
}

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

onMounted(() => {
  const element = scrollerRef.value;

  if (!element) {
    return;
  }

  updateOverflow();
  element.addEventListener("scroll", updateOverflow, {passive: true});

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(element);
  }

  if (typeof MutationObserver !== "undefined") {
    mutationObserver = new MutationObserver(updateOverflow);
    mutationObserver.observe(element, {
      attributeFilter: ["class", "style"],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
});

onBeforeUnmount(() => {
  scrollerRef.value?.removeEventListener("scroll", updateOverflow);
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();

  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }

  previous = null;
});

function scrollBy(direction: 1 | -1) {
  const element = scrollerRef.value;

  if (!element) {
    return;
  }

  const vertical = isVertical.value;
  const size = vertical ? element.clientHeight : element.clientWidth;
  const scrollSize = vertical ? element.scrollHeight : element.scrollWidth;
  const maxScroll = Math.max(0, scrollSize - size);
  const isRtl = !vertical && getComputedStyle(element).direction === "rtl";
  const current = vertical ? element.scrollTop : element.scrollLeft;
  const delta = direction * size * 0.8 * (isRtl ? -1 : 1);
  const next = Math.min(isRtl ? 0 : maxScroll, Math.max(isRtl ? -maxScroll : 0, current + delta));

  if (next === current) {
    return;
  }

  element.scrollTo({
    behavior: "smooth",
    [vertical ? "top" : "left"]: next,
  });
}
</script>

<template>
  <div v-bind="forwarded" :class="containerClasses" :data-slot="'tabs-list-container'">
    <div
      ref="scrollerRef"
      :class="scrollerClasses"
      :data-orientation="root.orientation.value"
      :data-scroll-shadow-mode="'auto'"
      :data-scroll-shadow-size="64"
      :data-slot="'scroll-shadow'"
      :style="scrollerStyle"
    >
      <slot />
    </div>

    <button
      :aria-label="isVertical ? 'Scroll tabs up' : 'Scroll tabs left'"
      :class="slots.scrollPrev()"
      tabindex="-1"
      type="button"
      @click="scrollBy(-1)"
    >
      <ChevronUpIcon v-if="isVertical" />
      <ChevronLeftIcon v-else />
    </button>
    <button
      :aria-label="isVertical ? 'Scroll tabs down' : 'Scroll tabs right'"
      :class="slots.scrollNext()"
      tabindex="-1"
      type="button"
      @click="scrollBy(1)"
    >
      <ChevronDownIcon v-if="isVertical" />
      <ChevronRightIcon v-else />
    </button>
  </div>
</template>
