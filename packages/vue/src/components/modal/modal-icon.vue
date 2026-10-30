<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useModalContext} from "./context";

defineOptions({name: "SailModalIcon", inheritAttrs: false});

const attrs = useAttrs();
const {slots} = useModalContext();

const classes = computed(() =>
  cx(slots.value.icon(), attrs.class as string | undefined)
);
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classes"
    :data-slot="'modal-icon'"
  >
    <slot />
  </div>
</template>
