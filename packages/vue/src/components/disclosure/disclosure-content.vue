<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDisclosurePanel} from "../../shared/use-disclosure-panel";
import {useDisclosureContext} from "./context";

defineOptions({name: "SailDisclosureContent", inheritAttrs: false});

const disclosure = useDisclosureContext();
const {className, forwarded} = useForwardedAttrs();

const contentRef = ref<HTMLElement | null>(null);
const {initialHeight, initialHidden} = useDisclosurePanel({
  isExpanded: disclosure.isExpanded,
  panelRef: contentRef,
});

const classes = computed(() => cx(disclosureVariants().content(), className.value));
const style = {"--disclosure-panel-height": initialHeight};
</script>

<template>
  <div
    v-bind="forwarded"
    :id="disclosure.contentId"
    ref="contentRef"
    :aria-hidden="disclosure.isExpanded.value ? 'false' : 'true'"
    :aria-labelledby="disclosure.triggerId"
    :class="classes"
    :data-expanded="disclosure.isExpanded.value ? 'true' : undefined"
    :data-slot="'disclosure-content'"
    :hidden.attr="initialHidden"
    role="group"
    :style="style"
  >
    <slot />
  </div>
</template>
