<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useModalContext} from "./context";

defineOptions({name: "SailModalBody", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const {slots} = useModalContext();

const classes = computed(() => cx(slots.value.body(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'modal-body'">
    <slot />
  </div>
</template>
