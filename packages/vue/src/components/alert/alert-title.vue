<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {alertContextKey} from "./context";
import type {AlertTitleProps} from "./types";

defineOptions({name: "SailAlertTitle", inheritAttrs: false});

withDefaults(defineProps<AlertTitleProps>(), {
  as: "p",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(alertContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.title(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-title'"
  >
    <slot />
  </Primitive>
</template>
