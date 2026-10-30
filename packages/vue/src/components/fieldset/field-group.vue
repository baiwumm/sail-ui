<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {fieldsetContextKey} from "./context";
import type {FieldGroupProps} from "./types";

defineOptions({name: "SailFieldGroup", inheritAttrs: false});

withDefaults(defineProps<FieldGroupProps>(), {
  as: "div",
});

const attrs = useAttrs();
const slots = inject(fieldsetContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.fieldGroup(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'fieldset-field-group'"
  >
    <slot />
  </Primitive>
</template>
