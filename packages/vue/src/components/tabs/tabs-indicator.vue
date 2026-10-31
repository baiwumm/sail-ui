<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

import {useTabsContext, useTabItemContext} from "./context";

defineOptions({name: "SailTabIndicator", inheritAttrs: false});

const root = useTabsContext();
const tab = useTabItemContext();

const indicatorRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const element = indicatorRef.value;

  if (!element) {
    return;
  }

  root.currentIndicatorEl.value = element;

  const snapshot = root.consumeIndicatorSnapshot();

  if (!snapshot || !root.isIndicatorReady.value) {
    return;
  }

  const rect = element.getBoundingClientRect();

  element.style.width = `${snapshot.width}px`;
  element.style.height = `${snapshot.height}px`;
  element.style.translate = `${snapshot.left - rect.left}px ${snapshot.top - rect.top}px`;
  void element.offsetWidth;

  requestAnimationFrame(() => {
    element.style.width = "";
    element.style.height = "";
    element.style.translate = "";
  });
});

onBeforeUnmount(() => {
  if (root.currentIndicatorEl.value === indicatorRef.value) {
    root.currentIndicatorEl.value = null;
  }
});
</script>

<template>
  <div
    v-if="tab.isSelected.value"
    ref="indicatorRef"
    class="tabs__indicator"
    :data-animation-ready="root.isIndicatorReady.value ? 'true' : 'false'"
    :data-slot="'tabs-indicator'"
  />
</template>
