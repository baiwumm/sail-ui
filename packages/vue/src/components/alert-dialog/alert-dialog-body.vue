<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useAlertDialogContext} from "./context";

defineOptions({name: "SailAlertDialogBody", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useAlertDialogContext();

const classes = computed(() => cx(slots.value.body(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'alert-dialog-body'">
    <slot />
  </div>
</template>
