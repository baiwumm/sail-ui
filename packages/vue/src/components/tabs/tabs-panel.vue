<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {TabsContent as TabsContentPrimitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useTabsContext} from "./context";
import type {TabsPanelProps} from "./types";

defineOptions({name: "SailTabPanel", inheritAttrs: false});

const props = withDefaults(defineProps<TabsPanelProps>(), {forceMount: false});

const root = useTabsContext();
const {className, forwarded} = useForwardedAttrs();

const isSelected = computed(() => root.selectedKey.value === props.value);
const classes = computed(() => cx(root.slots.value.tabPanel(), className.value));
</script>

<template>
  <TabsContentPrimitive as-child :force-mount="forceMount" :value="value">
    <div
      v-bind="forwarded"
      :id="root.contentId(value)"
      :aria-labelledby="root.triggerId(value)"
      :class="classes"
      :data-inert="!isSelected ? 'true' : undefined"
      :data-orientation="undefined"
      :data-selected="isSelected ? 'true' : undefined"
      :data-state="undefined"
      :data-slot="'tabs-panel'"
      :inert="!isSelected || undefined"
    >
      <slot />
    </div>
  </TabsContentPrimitive>
</template>
