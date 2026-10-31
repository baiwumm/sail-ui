<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useTabsContext} from "./context";

defineOptions({name: "SailTabSeparator", inheritAttrs: false});

const root = useTabsContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.value.separator(), className.value));
</script>

<template>
  <span v-bind="forwarded" aria-hidden="true" :class="classes" :data-slot="'tabs-separator'" />
</template>
