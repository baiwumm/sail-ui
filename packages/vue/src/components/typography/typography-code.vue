<script setup lang="ts">
import TypographyRoot from "./typography-root.vue";
import type {CodeProps} from "./types";

defineOptions({name: "SailTypographyCode", inheritAttrs: false});

defineProps<CodeProps>();
</script>

<template>
  <TypographyRoot v-bind="$attrs" type="code">
    <slot />
  </TypographyRoot>
</template>
