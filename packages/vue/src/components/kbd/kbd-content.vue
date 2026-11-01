<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {kbdContextKey} from "./context";
import type {KbdContentProps} from "./types";

defineOptions({name: "SailKbdContent", inheritAttrs: false});

withDefaults(defineProps<KbdContentProps>(), {
  as: "span",
});

const {className, forwarded} = useForwardedAttrs();
const slots = inject(kbdContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.content(), className.value));
</script>

<template>
  <Primitive v-bind="forwarded" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
