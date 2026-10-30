<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, useAttrs} from "vue";

import {kbdContextKey} from "./context";
import type {KbdContentProps} from "./types";

defineOptions({name: "SailKbdContent", inheritAttrs: false});

withDefaults(defineProps<KbdContentProps>(), {
  as: "span",
});

const attrs = useAttrs();
const slots = inject(kbdContextKey, null)?.slots;
const classes = computed(() => cx(slots?.value.content(), attrs.class as string | undefined));
</script>

<template>
  <Primitive v-bind="$attrs" :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
