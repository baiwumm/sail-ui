<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {injectSelectRootContext, SelectValue as SelectValuePrimitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import {useSelectContext} from "./context";
import type {SelectValueProps} from "./types";

defineOptions({name: "SailSelectValue", inheritAttrs: false});

const props = defineProps<SelectValueProps>();

const attrs = useAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();

const placeholder = computed(() => props.placeholder ?? context.placeholder.value ?? "");
const isEmpty = computed(() => rootContext.isEmptyModelValue.value);

const classes = computed(() =>
  cx(context.slots.value.value(), attrs.class as string | undefined)
);
</script>

<template>
  <SelectValuePrimitive
    v-slot="{ selectedLabel }"
    as-child
    :placeholder="placeholder"
  >
    <span
      v-bind="$attrs"
      :class="classes"
      :data-placeholder="isEmpty ? 'true' : undefined"
      :data-slot="'select-value'"
    >
      <slot>
        {{ selectedLabel.length ? selectedLabel.join(", ") : placeholder }}
      </slot>
    </span>
  </SelectValuePrimitive>
</template>
