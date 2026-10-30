<script setup lang="ts">
import {toggleButtonGroupVariants, cx} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {ToggleButtonGroupSeparatorProps} from "./types";

defineOptions({name: "SailToggleButtonGroupSeparator", inheritAttrs: false});

defineProps<ToggleButtonGroupSeparatorProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(toggleButtonGroupVariants().separator(), className.value));
</script>

<template>
  <span
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-slot="'toggle-button-group-separator'"
  />
</template>
