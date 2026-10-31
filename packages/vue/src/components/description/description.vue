<script setup lang="ts">
import {cx, descriptionVariants} from "@sail-ui/styles";
import {FieldDescription, injectFieldRootContext} from "reka-ui";
import {computed, inject, onBeforeUnmount, onMounted, useAttrs, useId} from "vue";

import {descriptionContextKey} from "../../shared/description-context";
import {fieldContextKey} from "../../shared/field-context";

defineOptions({name: "SailDescription", inheritAttrs: false});

const attrs = useAttrs();
const field = injectFieldRootContext(null);
const sailField = inject(fieldContextKey, null);
const descriptionContext = inject(descriptionContextKey, null);
const fallbackId = useId();
const classes = computed(() => cx(descriptionVariants(), attrs.class as string | undefined));
const resolvedId = computed(
  () =>
    (attrs.id as string | undefined) ??
    descriptionContext?.id ??
    (sailField ? fallbackId : undefined),
);

let unregister: (() => void) | undefined;

onMounted(() => {
  if (field || !sailField || !resolvedId.value) {
    return;
  }

  unregister = sailField.registerDescription(resolvedId.value);
});

onBeforeUnmount(() => unregister?.());
</script>

<template>
  <FieldDescription
    v-if="field"
    v-bind="$attrs"
    :id="resolvedId"
    as="span"
    :class="classes"
    :data-slot="'description'"
  >
    <slot />
  </FieldDescription>
  <span v-else v-bind="$attrs" :id="resolvedId" :class="classes" :data-slot="'description'">
    <slot />
  </span>
</template>
