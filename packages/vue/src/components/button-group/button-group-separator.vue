<script setup lang="ts">
import {buttonGroupVariants, cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import type {ButtonGroupSeparatorProps} from "./types";

defineOptions({name: "SailButtonGroupSeparator", inheritAttrs: false});

defineProps<ButtonGroupSeparatorProps>();

const attrs = useAttrs();

const classes = computed(() =>
  cx(buttonGroupVariants().separator(), attrs.class as string | undefined),
);
</script>

<template>
  <span v-bind="$attrs" aria-hidden="true" :class="classes" :data-slot="'button-group-separator'" />
</template>
