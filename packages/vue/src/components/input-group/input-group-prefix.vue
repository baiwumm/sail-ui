<script setup lang="ts">
import {cx, inputGroupVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {InputGroupPrefixProps} from "./types";

defineOptions({name: "SailInputGroupPrefix", inheritAttrs: false});

defineProps<InputGroupPrefixProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(inputGroupVariants().prefix(), className.value)
);
</script>

<template>
  <div
    v-bind="forwarded"
    :class="classes"
    :data-slot="'input-group-prefix'"
  >
    <slot />
  </div>
</template>
