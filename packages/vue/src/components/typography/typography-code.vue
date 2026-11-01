<script setup lang="ts">
import {useForwardedAttrs} from "../../shared/attrs";
import TypographyRoot from "./typography-root.vue";
import type {CodeProps} from "./types";

defineOptions({name: "SailTypographyCode", inheritAttrs: false});

defineProps<CodeProps>();

const {className, forwarded} = useForwardedAttrs();
</script>

<template>
  <TypographyRoot v-bind="forwarded" :class="className" type="code">
    <slot />
  </TypographyRoot>
</template>
