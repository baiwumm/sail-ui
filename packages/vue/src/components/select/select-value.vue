<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {injectSelectRootContext, SelectValue as SelectValuePrimitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSelectContext} from "./context";
import type {SelectValueProps} from "./types";
import {valuesEqual} from "./utils";

defineOptions({name: "SailSelectValue", inheritAttrs: false});

const props = defineProps<SelectValueProps>();

const {className, forwarded} = useForwardedAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();

const placeholder = computed(() => props.placeholder ?? context.placeholder.value ?? "");

// Reka only registers option labels after mount, so a server-rendered value has no
// label to show. Tying the placeholder state to the rendered labels keeps the text
// and `data-placeholder` consistent through SSR and hydration.
const hasVisibleLabel = computed(() => {
  const current = rootContext.modelValue.value;
  const values = Array.isArray(current) ? current : [current];

  if (values.length === 0) {
    return false;
  }

  const options = Array.from(rootContext.optionsSet.value);

  return values.some(
    (value) =>
      value !== undefined &&
      options.some((option) => valuesEqual(value, option.value, rootContext.by)),
  );
});

// Option labels come from rendered text, which can carry template whitespace.
const joinLabels = (labels: string[]) =>
  labels
    .map((label) => label.trim())
    .filter(Boolean)
    .join(", ");

const classes = computed(() => cx(context.slots.value.value(), className.value));
</script>

<template>
  <SelectValuePrimitive v-slot="{selectedLabel}" as-child :placeholder="placeholder">
    <span
      v-bind="forwarded"
      :class="classes"
      :data-placeholder="hasVisibleLabel ? undefined : 'true'"
      :data-slot="'select-value'"
    >
      <slot>
        {{ selectedLabel.length ? joinLabels(selectedLabel) : placeholder }}
      </slot>
    </span>
  </SelectValuePrimitive>
</template>
