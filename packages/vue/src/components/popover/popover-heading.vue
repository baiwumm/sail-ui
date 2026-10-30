<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePopoverContext} from "./context";
import type {PopoverHeadingProps} from "./types";

defineOptions({name: "SailPopoverHeading", inheritAttrs: false});

const props = withDefaults(defineProps<PopoverHeadingProps>(), {
  as: "h2",
});

const {forwarded, className} = useForwardedAttrs();
const {slots} = usePopoverContext();

const classes = computed(() => cx(slots.value.heading(), className.value));
// The `slot` attribute is a literal in the contract; binding an attribute
// named `slot` keeps it on the DOM instead of routing it to a Vue slot.
const headingAttrs = computed(() => ({...forwarded.value, slot: "title"}));
</script>

<template>
  <component :is="props.as" v-bind="headingAttrs" :class="classes">
    <slot />
  </component>
</template>
