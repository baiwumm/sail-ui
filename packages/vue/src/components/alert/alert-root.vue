<script setup lang="ts">
import {alertVariants, cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, provide} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {surfaceContextKey} from "../surface/context";
import {alertContextKey} from "./context";
import type {AlertRootProps} from "./types";

defineOptions({name: "SailAlert", inheritAttrs: false});

const props = withDefaults(defineProps<AlertRootProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => alertVariants({status: props.status}));
const classes = computed(() => cx(slots.value.base(), className.value));

provide(alertContextKey, {
  slots,
  status: computed(() => props.status),
});
provide(
  surfaceContextKey,
  computed(() => "default" as const),
);
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-root'"
  >
    <slot />
  </Primitive>
</template>
