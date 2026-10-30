<script setup lang="ts">
import {fieldErrorVariants} from "@sail-ui/styles";
import {injectFieldRootContext} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, useId, useSlots, watch, type Slots} from "vue";

import {hasSlotContent} from "../../shared/vnode";
import type {FieldErrorProps} from "./types";

defineOptions({name: "SailFieldError", inheritAttrs: true});

defineProps<FieldErrorProps>();

const field = injectFieldRootContext(null);
const componentSlots = useSlots() as Slots;
const errorId = useId();
const visible = computed(() => Boolean(field?.invalid.value));
const errors = computed(() => field?.errors.value ?? []);
const hasContent = computed(() => hasSlotContent(componentSlots.default));
const show = computed(() => visible.value && (hasContent.value || errors.value.length > 0));
const classes = computed(() => fieldErrorVariants());

let unregister: (() => void) | undefined;

const syncDescription = () => {
  if (show.value && field && !unregister) {
    unregister = field.registerDescription(errorId);
  } else if (!show.value && unregister) {
    unregister();
    unregister = undefined;
  }
};

onMounted(syncDescription);
watch(show, syncDescription);
onBeforeUnmount(() => unregister?.());
</script>

<template>
  <span
    v-if="show"
    :id="errorId"
    :class="classes"
    :data-slot="'field-error'"
    data-visible="true"
  >
    <slot :errors="errors">
      {{ errors.join(" ") }}
    </slot>
  </span>
</template>
