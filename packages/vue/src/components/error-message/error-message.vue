<script setup lang="ts">
import {cx, errorMessageVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {ErrorMessageRootProps} from "./types";

defineOptions({name: "SailErrorMessage", inheritAttrs: false});

withDefaults(defineProps<ErrorMessageRootProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const classes = computed(() => cx(errorMessageVariants(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'error-message'"
  >
    <slot />
  </Primitive>
</template>
