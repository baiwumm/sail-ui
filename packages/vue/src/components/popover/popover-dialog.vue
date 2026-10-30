<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {usePopoverContext} from "./context";
import type {PopoverDialogProps} from "./types";

defineOptions({name: "SailPopoverDialog", inheritAttrs: false});

const props = withDefaults(defineProps<PopoverDialogProps>(), {
  as: "div",
});

const {forwarded, className} = useForwardedAttrs();
const {slots} = usePopoverContext();

const classes = computed(() => cx(slots.value.dialog(), className.value));
</script>

<template>
  <component :is="props.as" v-bind="forwarded" :class="classes" :data-slot="'popover-dialog'">
    <slot />
  </component>
</template>
