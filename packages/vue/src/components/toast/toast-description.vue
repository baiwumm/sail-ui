<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, onBeforeUnmount, onMounted} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useToastItemContext, useToastProviderContext} from "./context";

defineOptions({name: "SailToastDescription", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const item = useToastItemContext();
const classes = computed(() => cx(provider.slots.value.description(), className.value));

onMounted(() => item.setHasDescription(true));
onBeforeUnmount(() => item.setHasDescription(false));
</script>

<template>
  <span
    v-bind="{...forwarded, id: item.descriptionId, slot: 'description'}"
    :class="classes"
    data-slot="toast-description"
  >
    <slot />
  </span>
</template>
