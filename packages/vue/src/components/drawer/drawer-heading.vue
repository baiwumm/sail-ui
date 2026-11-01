<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogTitle} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDrawerContext} from "./context";

defineOptions({name: "SailDrawerHeading", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useDrawerContext();

const classes = computed(() => cx(slots.value.heading(), className.value));
</script>

<template>
  <DialogTitle
    v-bind="{...forwarded, slot: 'title'}"
    :class="classes"
    :data-slot="'drawer-heading'"
  >
    <slot />
  </DialogTitle>
</template>
