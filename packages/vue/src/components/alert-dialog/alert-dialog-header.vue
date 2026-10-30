<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAlertDialogContext} from "./context";

defineOptions({name: "SailAlertDialogHeader", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useAlertDialogContext();

const classes = computed(() => cx(slots.value.header(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'alert-dialog-header'">
    <slot />
  </div>
</template>
