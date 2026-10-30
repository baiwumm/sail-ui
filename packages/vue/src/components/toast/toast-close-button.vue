<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import CloseButton from "../close-button/close-button-root.vue";
import {useToastItemContext, useToastProviderContext} from "./context";

defineOptions({name: "SailToastCloseButton", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const provider = useToastProviderContext();
const item = useToastItemContext();
const classes = computed(() => cx(provider.slots.value.close(), className.value));

function close() {
  provider.queue.close(item.toast.key);
}
</script>

<template>
  <CloseButton
    v-bind="{...forwarded, slot: 'close'}"
    :class="classes"
    data-slot="toast-close"
    @click="close"
  />
</template>
