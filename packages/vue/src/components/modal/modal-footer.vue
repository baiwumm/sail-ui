<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useModalContext} from "./context";

defineOptions({name: "SailModalFooter", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useModalContext();

const classes = computed(() => cx(slots.value.footer(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'modal-footer'">
    <slot />
  </div>
</template>
