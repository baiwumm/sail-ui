<script setup lang="ts">
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import TypographyRoot from "./typography-root.vue";
import type {HeadingProps, TypographyType} from "./types";

defineOptions({name: "SailTypographyHeading", inheritAttrs: false});

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 1,
});

const {className, forwarded} = useForwardedAttrs();
const type = computed(() => `h${props.level}` as TypographyType);
</script>

<template>
  <TypographyRoot v-bind="forwarded" :class="className" :type="type">
    <slot />
  </TypographyRoot>
</template>
