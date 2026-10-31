<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {TabsList as TabsListPrimitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useTabsContext} from "./context";

defineOptions({name: "SailTabList", inheritAttrs: false});

const root = useTabsContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.value.tabList(), className.value));
</script>

<template>
  <TabsListPrimitive
    v-bind="forwarded"
    :class="classes"
    :data-orientation="root.orientation.value"
    :data-slot="'tabs-list'"
  >
    <slot />
  </TabsListPrimitive>
</template>
