<script setup lang="ts">
import {cx, typographyVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, useAttrs} from "vue";

import type {TypographyRootProps, TypographyType} from "./types";

const defaultElementByType: Record<TypographyType, string> = {
  body: "p",
  "body-sm": "p",
  "body-xs": "p",
  code: "code",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

defineOptions({name: "SailTypography", inheritAttrs: false});

const props = withDefaults(defineProps<TypographyRootProps>(), {
  align: "start",
  color: "default",
  type: "body",
});

const attrs = useAttrs();
const classes = computed(() =>
  cx(
    typographyVariants({
      align: props.align,
      color: props.color,
      truncate: props.truncate,
      type: props.type,
      weight: props.weight,
    }).base(),
    attrs.class as string | undefined,
  ),
);
const element = computed(() => props.as ?? defaultElementByType[props.type]);
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :as="element"
    :as-child="asChild"
    :class="classes"
    :data-slot="'typography'"
    :data-type="type"
  >
    <slot />
  </Primitive>
</template>
