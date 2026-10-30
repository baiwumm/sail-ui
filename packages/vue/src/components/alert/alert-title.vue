<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {alertContextKey} from "./context";
import type {AlertTitleProps} from "./types";

defineOptions({name: "SailAlertTitle", inheritAttrs: false});

withDefaults(defineProps<AlertTitleProps>(), {
  as: "p",
});

const attrs = useAttrs();
const slots = inject(alertContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.title(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-title'"
  >
    <slot />
  </Primitive>
</template>
