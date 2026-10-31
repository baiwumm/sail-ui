<script setup lang="ts">
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {computed} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import type {DateInputGroupPrefixProps} from "./types";

defineOptions({name: "SailDateInputGroupPrefix", inheritAttrs: false});

defineProps<DateInputGroupPrefixProps>();

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() => cx(dateInputGroupVariants().prefix(), className.value));
</script>

<template>
  <div v-bind="forwarded" :class="classes" :data-slot="'date-input-group-prefix'">
    <slot />
  </div>
</template>
