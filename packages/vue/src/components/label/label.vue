<script setup lang="ts">
import {cx, labelVariants} from "@sail-ui/styles";
import {FieldLabel, injectFieldRootContext} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {labelContextKey} from "../../shared/label-context";
import type {LabelRootProps} from "./types";

defineOptions({name: "SailLabel", inheritAttrs: false});

const props = defineProps<LabelRootProps>();

const attrs = useAttrs();
const field = injectFieldRootContext(null);
const labelContext = inject(labelContextKey, null);

const classes = computed(() =>
  cx(
    labelVariants({
      isDisabled: props.isDisabled || field?.disabled.value || false,
      isInvalid: props.isInvalid || field?.invalid.value || false,
      isRequired: props.isRequired || field?.required.value || false,
    }),
    attrs.class as string | undefined,
  ),
);

const resolvedId = computed(() => (attrs.id as string | undefined) ?? labelContext?.id);
const renderAsSpan = computed(() => !field && labelContext?.elementType === "span");
</script>

<template>
  <FieldLabel v-if="field" v-bind="$attrs" :class="classes" :data-slot="'label'">
    <slot />
  </FieldLabel>
  <span
    v-else-if="renderAsSpan"
    v-bind="$attrs"
    :id="resolvedId"
    :class="classes"
    :data-slot="'label'"
  >
    <slot />
  </span>
  <label v-else v-bind="$attrs" :id="resolvedId" :class="classes" :data-slot="'label'">
    <slot />
  </label>
</template>
