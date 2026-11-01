<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogTitle} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";

defineOptions({name: "SailSheetHeading", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useSheetContext();

const classes = computed(() => cx(slots.value.heading(), className.value));
</script>

<template>
  <DialogTitle v-bind="{...forwarded, slot: 'title'}" :class="classes" :data-slot="'sheet-heading'">
    <slot />
  </DialogTitle>
</template>
