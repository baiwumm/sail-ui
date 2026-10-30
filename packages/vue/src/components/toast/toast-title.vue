<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, onBeforeUnmount, onMounted} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useToastItemContext, useToastProviderContext} from "./context";

defineOptions({name: "SailToastTitle", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const item = useToastItemContext();
const classes = computed(() => cx(provider.slots.value.title(), className.value));

onMounted(() => item.setHasTitle(true));
onBeforeUnmount(() => item.setHasTitle(false));
</script>

<template>
  <span
    v-bind="{...forwarded, id: item.titleId, slot: 'title'}"
    :class="classes"
    data-slot="toast-title"
  >
    <slot />
  </span>
</template>
