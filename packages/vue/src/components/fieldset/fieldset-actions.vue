<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {fieldsetContextKey} from "./context";
import type {FieldsetActionsProps} from "./types";

defineOptions({name: "SailFieldsetActions", inheritAttrs: false});

withDefaults(defineProps<FieldsetActionsProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(fieldsetContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.actions(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'fieldset-actions'"
  >
    <slot />
  </Primitive>
</template>
