<script setup lang="ts">
import {fieldErrorVariants} from "@sail-ui/styles";
import {injectFieldRootContext} from "reka-ui";
import {computed, onBeforeUnmount, useId, watch} from "vue";

defineOptions({name: "SailFieldError", inheritAttrs: true});

const field = injectFieldRootContext();
const errorId = useId();
const visible = computed(() => field.invalid.value && !field.disabled.value);
const errors = computed(() => field.errors.value);
const classes = computed(() => fieldErrorVariants());

let unregister: (() => void) | undefined;

const syncDescription = () => {
  if (visible.value && !unregister) {
    unregister = field.registerDescription(errorId);
  } else if (!visible.value && unregister) {
    unregister();
    unregister = undefined;
  }
};

watch(visible, syncDescription, {immediate: true});
onBeforeUnmount(() => unregister?.());
</script>

<template>
  <div
    :id="errorId"
    :class="classes"
    :data-slot="'field-error'"
    :data-state="visible ? 'open' : 'closed'"
    :data-visible="visible ? true : undefined"
  >
    <slot :errors="errors">
      <ul v-if="errors.length > 1">
        <li
          v-for="message in errors"
          :key="message"
        >
          {{ message }}
        </li>
      </ul>
      <template v-else>
        {{ errors[0] }}
      </template>
    </slot>
  </div>
</template>
