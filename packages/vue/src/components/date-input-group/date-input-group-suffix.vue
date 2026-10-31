<script setup lang="ts">
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {DateInputGroupSuffixProps} from "./types";

defineOptions({name: "SailDateInputGroupSuffix", inheritAttrs: false});

defineProps<DateInputGroupSuffixProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(dateInputGroupVariants().suffix(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'date-input-group-suffix'">
    <slot />
  </div>
</template>
