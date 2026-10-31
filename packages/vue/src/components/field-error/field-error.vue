<script setup lang="ts">
import {fieldErrorVariants} from "@sail-ui/styles";
import {injectFieldRootContext} from "reka-ui";
import {computed, inject, onBeforeUnmount, onMounted, useId, useSlots, watch} from "vue";

import {fieldContextKey} from "../../shared/field-context";
import type {FieldErrorProps} from "./types";

defineOptions({name: "SailFieldError", inheritAttrs: true});

defineProps<FieldErrorProps>();

const field = injectFieldRootContext(null);
const sailField = inject(fieldContextKey, null);
const componentSlots = useSlots();
const errorId = useId();
const visible = computed(() => Boolean(field?.invalid.value ?? sailField?.invalid.value));
const errors = computed(() => field?.errors.value ?? sailField?.errors.value ?? []);
// Only check that a slot exists: invoking it here would happen outside the
// render function (mount/watch), which Vue warns about and cannot track.
const hasContent = computed(() => Boolean(componentSlots.default));
const show = computed(() => visible.value && (hasContent.value || errors.value.length > 0));
const classes = computed(() => fieldErrorVariants());

const registerDescription = (id: string) =>
  field?.registerDescription(id) ?? sailField?.registerDescription(id) ?? (() => {});

let unregister: (() => void) | undefined;

const syncDescription = () => {
  if (show.value && (field || sailField) && !unregister) {
    unregister = registerDescription(errorId);
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
  <span v-if="show" :id="errorId" :class="classes" :data-slot="'field-error'" data-visible="true">
    <slot :errors="errors">
      {{ errors.join(" ") }}
    </slot>
  </span>
</template>
