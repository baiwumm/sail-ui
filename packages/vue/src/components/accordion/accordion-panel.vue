<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisclosurePanel} from "../../shared/use-disclosure-panel";
import {useAccordionContext, useAccordionItemContext} from "./context";

defineOptions({name: "SailAccordionPanel", inheritAttrs: false});

const root = useAccordionContext();
const item = useAccordionItemContext();
const {className, forwarded} = useForwardedAttrs();

const panelRef = ref<HTMLElement | null>(null);
const {initialHeight, initialHidden} = useDisclosurePanel({
  isExpanded: item.isExpanded,
  panelRef,
});

const classes = computed(() => cx(root.slots.value.panel(), className.value));
const style = {"--disclosure-panel-height": initialHeight};
</script>

<template>
  <div
    v-bind="forwarded"
    :id="item.panelId"
    ref="panelRef"
    :aria-hidden="item.isExpanded.value ? 'false' : 'true'"
    :aria-labelledby="item.triggerId"
    :class="classes"
    :data-expanded="item.isExpanded.value ? 'true' : undefined"
    :data-slot="'accordion-panel'"
    :hidden.attr="initialHidden"
    role="group"
    :style="style"
  >
    <slot />
  </div>
</template>
