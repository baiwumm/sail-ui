<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {alertContextKey} from "./context";
import type {AlertContentProps} from "./types";

defineOptions({name: "SailAlertContent", inheritAttrs: false});

withDefaults(defineProps<AlertContentProps>(), {
  as: "div",
});

const attrs = useAttrs();
const slots = inject(alertContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.content(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-content'"
  >
    <slot />
  </Primitive>
</template>
