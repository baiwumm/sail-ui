<script setup lang="ts">
import {cx, descriptionVariants} from "@sail-ui/styles";
import {FieldDescription, injectFieldRootContext} from "reka-ui";
import {computed, inject, onBeforeUnmount, onMounted, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {descriptionContextKey} from "../../shared/description-context";
import {fieldContextKey} from "../../shared/field-context";

defineOptions({name: "SailDescription", inheritAttrs: false});

const {attrs, className, forwarded} = useForwardedAttrs();
const field = injectFieldRootContext(null);
const sailField = inject(fieldContextKey, null);
const descriptionContext = inject(descriptionContextKey, null);
const fallbackId = useId();
const classes = computed(() => cx(descriptionVariants(), className.value));
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
    v-bind="forwarded"
    :id="resolvedId"
    as="span"
    :class="classes"
    :data-slot="'description'"
  >
    <slot />
  </FieldDescription>
  <span v-else v-bind="forwarded" :id="resolvedId" :class="classes" :data-slot="'description'">
    <slot />
  </span>
</template>
