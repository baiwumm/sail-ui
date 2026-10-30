<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {alertContextKey} from "./context";
import type {AlertDescriptionProps} from "./types";

defineOptions({name: "SailAlertDescription", inheritAttrs: false});

withDefaults(defineProps<AlertDescriptionProps>(), {
  as: "span",
});

const attrs = useAttrs();
const slots = inject(alertContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.description(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-description'"
  >
    <slot />
  </Primitive>
</template>
