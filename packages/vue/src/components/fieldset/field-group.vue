<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {fieldsetContextKey} from "./context";
import type {FieldGroupProps} from "./types";

defineOptions({name: "SailFieldGroup", inheritAttrs: false});

withDefaults(defineProps<FieldGroupProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(fieldsetContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.fieldGroup(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'fieldset-field-group'"
  >
    <slot />
  </Primitive>
</template>
