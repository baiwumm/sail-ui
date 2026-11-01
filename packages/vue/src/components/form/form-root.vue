<script setup lang="ts">
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {FormRootProps} from "./types";

defineOptions({name: "SailForm", inheritAttrs: false});

withDefaults(defineProps<FormRootProps>(), {
  noValidate: false,
});

const emit = defineEmits<{
  submit: [event: SubmitEvent];
  invalid: [event: Event];
}>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => className.value);

function handleSubmit(event: SubmitEvent) {
  emit("submit", event);
}

/**
 * The browser fires `invalid` on the control that failed validation. The
 * event does not bubble, so the form listens in the capture phase.
 */
function handleInvalid(event: Event) {
  emit("invalid", event);
}
</script>

<template>
  <form
    v-bind="forwarded"
    :action="action"
    :class="classes"
    :dir="dir"
    :method="method"
    :name="name"
    :novalidate="noValidate || undefined"
    @invalid.capture="handleInvalid"
    @submit="handleSubmit"
  >
    <slot />
  </form>
</template>
