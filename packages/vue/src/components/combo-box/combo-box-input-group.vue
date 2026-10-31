<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useComboBoxContext} from "./context";
import type {ComboBoxInputGroupProps} from "./types";

defineOptions({name: "SailComboBoxInputGroup", inheritAttrs: false});

defineProps<ComboBoxInputGroupProps>();

const context = useComboBoxContext();
const {className, forwarded} = useForwardedAttrs();
const groupRef = ref<HTMLElement | null>(null);

const classes = computed(() => cx(context.slots.value.inputGroup(), className.value));

onMounted(() => {
  context.anchorRef.value = groupRef.value;
});

onBeforeUnmount(() => {
  if (context.anchorRef.value === groupRef.value) {
    context.anchorRef.value = null;
  }
});
</script>

<template>
  <div ref="groupRef" v-bind="forwarded" :class="classes" :data-slot="'combo-box-input-group'">
    <slot />
  </div>
</template>
