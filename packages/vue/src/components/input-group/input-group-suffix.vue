<script setup lang="ts">
import {cx, inputGroupVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {InputGroupSuffixProps} from "./types";

defineOptions({name: "SailInputGroupSuffix", inheritAttrs: false});

defineProps<InputGroupSuffixProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(inputGroupVariants().suffix(), className.value)
);
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-slot="'input-group-suffix'"
  >
    <slot />
  </div>
</template>
