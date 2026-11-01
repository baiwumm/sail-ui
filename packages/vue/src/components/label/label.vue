<script setup lang="ts">
import {cx, labelVariants} from "@sail-ui/styles";
import {FieldLabel, injectFieldRootContext} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import type {LabelRootProps} from "./types";

defineOptions({name: "SailLabel", inheritAttrs: false});

const props = defineProps<LabelRootProps>();

const {attrs, className, forwarded} = useForwardedAttrs();
const field = injectFieldRootContext(null);
const sailField = inject(fieldContextKey, null);
const labelContext = inject(labelContextKey, null);

const classes = computed(() =>
  cx(
    labelVariants({
      isDisabled: props.isDisabled || field?.disabled.value || sailField?.disabled.value || false,
      isInvalid: props.isInvalid || field?.invalid.value || sailField?.invalid.value || false,
      isRequired: props.isRequired || field?.required.value || sailField?.required.value || false,
    }),
    className.value,
  ),
);

const resolvedId = computed(() => (attrs.id as string | undefined) ?? labelContext?.id);
const renderAsSpan = computed(() => labelContext?.elementType === "span");
</script>

<template>
  <span
    v-if="renderAsSpan"
    v-bind="forwarded"
    :id="resolvedId"
    :class="classes"
    :data-slot="'label'"
  >
    <slot />
  </span>
  <FieldLabel v-else-if="field" v-bind="forwarded" :class="classes" :data-slot="'label'">
    <slot />
  </FieldLabel>
  <label
    v-else
    v-bind="forwarded"
    :id="resolvedId"
    :for="labelContext?.htmlFor"
    :class="classes"
    :data-slot="'label'"
  >
    <slot />
  </label>
</template>
