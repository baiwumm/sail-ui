<script setup lang="ts">
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import TypographyRoot from "./typography-root.vue";
import type {ParagraphProps, TypographyType} from "./types";

defineOptions({name: "SailTypographyParagraph", inheritAttrs: false});

const props = withDefaults(defineProps<ParagraphProps>(), {
  size: "base",
});

const {className, forwarded} = useForwardedAttrs();
const type = computed(
  () => (props.size === "base" ? "body" : `body-${props.size}`) as TypographyType,
);
</script>

<template>
  <TypographyRoot v-bind="forwarded" :class="className" :type="type">
    <slot />
  </TypographyRoot>
</template>
