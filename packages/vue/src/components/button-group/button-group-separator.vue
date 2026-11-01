<script setup lang="ts">
import {buttonGroupVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {ButtonGroupSeparatorProps} from "./types";

defineOptions({name: "SailButtonGroupSeparator", inheritAttrs: false});

defineProps<ButtonGroupSeparatorProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(buttonGroupVariants().separator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'button-group-separator'"
  />
</template>
