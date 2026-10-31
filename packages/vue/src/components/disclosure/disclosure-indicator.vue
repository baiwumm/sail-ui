<script setup lang="ts">
import {disclosureVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {ChevronDownIcon} from "../../shared/icons";
import {useForwardedAttrs} from "../../shared/attrs";
import {useDisclosureContext} from "./context";

defineOptions({name: "SailDisclosureIndicator", inheritAttrs: false});

const disclosure = useDisclosureContext();
const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(disclosureVariants().indicator(), className.value));
</script>

<template>
  <ChevronDownIcon
    v-bind="forwarded"
    :class="classes"
    :data-expanded="disclosure.isExpanded.value ? 'true' : undefined"
    :data-slot="'disclosure-indicator'"
  />
</template>
