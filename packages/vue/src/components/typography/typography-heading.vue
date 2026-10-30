<script setup lang="ts">
import {computed} from "vue";

import TypographyRoot from "./typography-root.vue";
import type {HeadingProps, TypographyType} from "./types";

defineOptions({name: "SailTypographyHeading", inheritAttrs: false});

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 1,
});

const type = computed(() => `h${props.level}` as TypographyType);
</script>

<template>
  <TypographyRoot v-bind="$attrs" :type="type">
    <slot />
  </TypographyRoot>
</template>
