<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useModalContext} from "./context";

defineOptions({name: "SailModalBody", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useModalContext();

const classes = computed(() =>
  cx(slots.value.body(), attrs.class as string | undefined)
);
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-slot="'modal-body'"
  >
    <slot />
  </div>
</template>
