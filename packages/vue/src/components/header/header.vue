<script setup lang="ts">
import {cx, headerVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {HeaderRootProps} from "./types";

defineOptions({name: "SailHeader", inheritAttrs: false});

withDefaults(defineProps<HeaderRootProps>(), {
  as: "header",
});

const attrs = useAttrs();
const classes = computed(() => cx(headerVariants(), attrs.class as string | undefined));
</script>

<template>
  <Primitive v-bind="$attrs" :as="as" :as-child="asChild" :class="classes" :data-slot="'header'">
    <slot />
  </Primitive>
</template>
