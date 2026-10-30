<script setup lang="ts">
import {alertVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide, useAttrs} from "vue";

import {surfaceContextKey} from "../surface/context";
import {alertContextKey} from "./context";
import type {AlertRootProps} from "./types";

defineOptions({name: "SailAlert", inheritAttrs: false});

const props = withDefaults(defineProps<AlertRootProps>(), {
  as: "div"
});

const attrs = useAttrs();
const slots = computed(() => alertVariants({status: props.status}));
const classes = computed(() => cx(slots.value.base(), attrs.class as string | undefined));

provide(alertContextKey, {
  slots,
  status: computed(() => props.status)
});
provide(
  surfaceContextKey,
  computed(() => "default" as const)
);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-root'"
  >
    <slot />
  </Primitive>
</template>
