<script setup lang="ts">
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {isComposing} from "../../shared/composition";
import type {FormRootProps} from "./types";

defineOptions({name: "SailForm", inheritAttrs: false});

withDefaults(defineProps<FormRootProps>(), {
  noValidate: false
});

const emit = defineEmits<{
  submit: [event: SubmitEvent];
  invalid: [event: Event];
}>();

const {className, forwarded} = useForwardedAttrs();
const isComposingSubmit = ref(false);

const classes = computed(() => className.value);

function handleSubmit(event: SubmitEvent) {
  isComposingSubmit.value = false;
  emit("submit", event);
}

/**
 * The browser fires `invalid` on the control that failed validation. The
 * event does not bubble, so the form listens in the capture phase.
 */
function handleInvalid(event: Event) {
  emit("invalid", event);
}

/**
 * Enter confirms the IME candidate while a composition is active. The form
 * must not submit while the user is still typing.
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Enter" || !isComposing(event)) {
    isComposingSubmit.value = false;

    return;
  }

  isComposingSubmit.value = true;
  event.stopPropagation();
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
    @keydown="handleKeydown"
    @submit="handleSubmit"
  >
    <slot />
  </form>
</template>
