<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogTitle} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAlertDialogContext} from "./context";

defineOptions({name: "SailAlertDialogHeading", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useAlertDialogContext();

const classes = computed(() => cx(slots.value.heading(), className.value));
</script>

<template>
  <DialogTitle v-bind="forwarded" :class="classes" :data-slot="'alert-dialog-heading'">
    <slot />
  </DialogTitle>
</template>
