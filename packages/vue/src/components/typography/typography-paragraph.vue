<script setup lang="ts">
import {computed} from "vue";

import TypographyRoot from "./typography-root.vue";
import type {ParagraphProps, TypographyType} from "./types";

defineOptions({name: "SailTypographyParagraph", inheritAttrs: false});

const props = withDefaults(defineProps<ParagraphProps>(), {
  size: "base",
});

const type = computed(
  () => (props.size === "base" ? "body" : `body-${props.size}`) as TypographyType,
);
</script>

<template>
  <TypographyRoot v-bind="$attrs" :type="type">
    <slot />
  </TypographyRoot>
</template>
