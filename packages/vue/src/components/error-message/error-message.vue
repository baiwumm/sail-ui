<script setup lang="ts">
import {cx, errorMessageVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {ErrorMessageRootProps} from "./types";

defineOptions({name: "SailErrorMessage", inheritAttrs: false});

withDefaults(defineProps<ErrorMessageRootProps>(), {
  as: "span",
});

const attrs = useAttrs();
const classes = computed(() => cx(errorMessageVariants(), attrs.class as string | undefined));
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'error-message'"
  >
    <slot />
  </Primitive>
</template>
