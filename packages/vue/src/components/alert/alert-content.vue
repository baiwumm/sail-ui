<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {alertContextKey} from "./context";
import type {AlertContentProps} from "./types";

defineOptions({name: "SailAlertContent", inheritAttrs: false});

withDefaults(defineProps<AlertContentProps>(), {
  as: "div",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(alertContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.content(), className.value));
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-slot="'alert-content'"
  >
    <slot />
  </Primitive>
</template>
