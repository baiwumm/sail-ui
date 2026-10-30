<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useToastProviderContext} from "./context";

defineOptions({name: "SailToastContent", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const classes = computed(() => cx(provider.slots.value.content(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" data-slot="toast-content">
    <slot />
  </div>
</template>
