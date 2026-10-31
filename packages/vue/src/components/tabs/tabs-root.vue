<script setup lang="ts">
import {tabsVariants, cx} from "@sail-ui/styles";
import {TabsRoot as TabsRootPrimitive} from "reka-ui";
import {computed, onMounted, provide, ref, useId, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {tabsContextKey} from "./context";
import type {TabsIndicatorSnapshot, TabsKey, TabsRootEmits, TabsRootProps} from "./types";

defineOptions({name: "SailTabs", inheritAttrs: false});

const props = withDefaults(defineProps<TabsRootProps>(), {
  activationMode: "automatic",
  align: "center",
  defaultSelectedKey: undefined,
  isDisabled: false,
  orientation: "horizontal",
  variant: "primary",
});

const emit = defineEmits<TabsRootEmits>();
const model = defineModel<TabsKey>();
const {className, forwarded} = useForwardedAttrs();

const slots = computed(() => tabsVariants({align: props.align, variant: props.variant}));
const classes = computed(() => cx(slots.value.base(), className.value));
const selectedKey = computed<TabsKey | undefined>(() => model.value ?? props.defaultSelectedKey);
const isDisabled = computed(() => props.isDisabled);
const orientation = computed(() => props.orientation);

const baseId = useId();
const triggerId = (value: TabsKey) => `${baseId}-trigger-${value}`;
const contentId = (value: TabsKey) => `${baseId}-content-${value}`;

const isIndicatorReady = ref(false);
const currentIndicatorEl = ref<HTMLElement | null>(null);
let indicatorSnapshot: TabsIndicatorSnapshot | null = null;

function consumeIndicatorSnapshot() {
  const snapshot = indicatorSnapshot;

  indicatorSnapshot = null;

  return snapshot;
}

function select(value: TabsKey) {
  if (isDisabled.value || value === selectedKey.value) {
    return;
  }

  model.value = value;
  emit("selection-change", value);
}

watch(
  selectedKey,
  () => {
    const element = currentIndicatorEl.value;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      return;
    }

    indicatorSnapshot = {
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    };
  },
  {flush: "pre"},
);

onMounted(() => {
  requestAnimationFrame(() => {
    isIndicatorReady.value = true;
  });
});

provide(tabsContextKey, {
  consumeIndicatorSnapshot,
  contentId,
  currentIndicatorEl,
  isDisabled,
  isIndicatorReady,
  orientation,
  selectedKey,
  select,
  slots,
  triggerId,
});
</script>

<template>
  <TabsRootPrimitive
    v-bind="forwarded"
    :activation-mode="activationMode"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-slot="'tabs'"
    :model-value="selectedKey"
    :orientation="orientation"
    @update:model-value="(value: TabsKey | undefined) => value !== undefined && select(value)"
  >
    <slot />
  </TabsRootPrimitive>
</template>
