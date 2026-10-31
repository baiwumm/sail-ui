<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {ChevronDownIcon} from "../../shared/icons";
import {useForwardedAttrs} from "../../shared/attrs";
import {useAccordionContext, useAccordionItemContext} from "./context";

defineOptions({name: "SailAccordionIndicator", inheritAttrs: false});

const root = useAccordionContext();
const item = useAccordionItemContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(root.slots.value.indicator(), className.value));
</script>

<template>
  <ChevronDownIcon
    v-bind="forwarded"
    :class="classes"
    :data-expanded="item.isExpanded.value ? 'true' : undefined"
    :data-slot="'accordion-indicator'"
  />
</template>
